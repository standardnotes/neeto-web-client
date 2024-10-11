import { joinPaths } from '@standardnotes/utils'
import {
  AbstractService,
  LegacyApiServiceInterface,
  InternalEventBusInterface,
  IntegrityApiInterface,
  ItemsServerInterface,
  StorageKey,
  ApiServiceEvent,
  KeyValueStoreInterface,
  API_MESSAGE_GENERIC_SYNC_FAIL,
  API_MESSAGE_GENERIC_TOKEN_REFRESH_FAIL,
  API_MESSAGE_CHANGE_CREDENTIALS_IN_PROGRESS,
  API_MESSAGE_FAILED_ACCESS_PURCHASE,
  API_MESSAGE_FAILED_CREATE_FILE_TOKEN,
  API_MESSAGE_FAILED_GET_SETTINGS,
  API_MESSAGE_FAILED_LISTED_REGISTRATION,
  API_MESSAGE_FAILED_OFFLINE_ACTIVATION,
  API_MESSAGE_FAILED_OFFLINE_FEATURES,
  API_MESSAGE_FAILED_UPDATE_SETTINGS,
  API_MESSAGE_GENERIC_CHANGE_CREDENTIALS_FAIL,
  API_MESSAGE_GENERIC_INTEGRITY_CHECK_FAIL,
  API_MESSAGE_GENERIC_INVALID_LOGIN,
  API_MESSAGE_GENERIC_SINGLE_ITEM_SYNC_FAIL,
  API_MESSAGE_INVALID_SESSION,
  API_MESSAGE_LOGIN_IN_PROGRESS,
  API_MESSAGE_TOKEN_REFRESH_IN_PROGRESS,
  ApiServiceEventData,
} from '@standardnotes/services'
import { DownloadFileParams, FileOwnershipType, FilesApiInterface } from '@standardnotes/files'
import { ServerSyncPushContextualPayload, SNFeatureRepo } from '@standardnotes/models'
import {
  User,
  HttpStatusCode,
  KeyParamsResponse,
  SignInResponse,
  SignOutResponse,
  ChangeCredentialsResponse,
  RawSyncResponse,
  SessionRenewalResponse,
  SessionListResponse,
  ListSettingsResponse,
  UpdateSettingResponse,
  GetSettingResponse,
  DeleteSettingResponse,
  PostSubscriptionTokensResponse,
  GetOfflineFeaturesResponse,
  ListedRegistrationResponse,
  CreateValetTokenResponse,
  StartUploadSessionResponse,
  UploadFileChunkResponse,
  CloseUploadSessionResponse,
  DownloadFileChunkResponse,
  IntegrityPayload,
  CheckIntegrityResponse,
  GetSingleItemResponse,
  HttpResponse,
  HttpResponseMeta,
  ErrorTag,
  HttpRequestParams,
  HttpRequest,
  HttpVerb,
  ApiEndpointParam,
  ClientDisplayableError,
  CreateValetTokenPayload,
  HttpErrorResponse,
  HttpSuccessResponse,
  isErrorResponse,
  MoveFileResponse,
  ValetTokenOperation,
  MetaEndpointResponse,
} from '@standardnotes/responses'
import { LegacySession, MapperInterface, Session, SessionToken } from '@standardnotes/domain-core'
import { HttpServiceInterface } from '@standardnotes/api'
import { SNRootKeyParams } from '@standardnotes/encryption'
import { PureCryptoInterface } from '@standardnotes/sncrypto-common'
import { Paths } from './Paths'
import { DiskStorageService } from '../Storage/DiskStorageService'
import { UuidString } from '../../Types/UuidString'
import { SettingsServerInterface } from '../Settings/SettingsServerInterface'
import { Strings } from '@Lib/Strings'
import { AnyFeatureDescription } from '@standardnotes/features'

/** Legacy api version field to be specified in params when calling v0 APIs. */
const V0_API_VERSION = '20240226'

type InvalidSessionObserver = (revoked: boolean) => void

export class LegacyApiService
  extends AbstractService<ApiServiceEvent, ApiServiceEventData>
  implements
    LegacyApiServiceInterface,
    FilesApiInterface,
    IntegrityApiInterface,
    ItemsServerInterface,
    SettingsServerInterface
{
  private session: Session | LegacySession | null
  public user?: User
  private authenticating = false
  private changing = false
  private refreshingSession = false
  private invalidSessionObserver?: InvalidSessionObserver
  private filesHost?: string

  constructor(
    private httpService: HttpServiceInterface,
    private storageService: DiskStorageService,
    private host: string,
    private inMemoryStore: KeyValueStoreInterface<string>,
    private crypto: PureCryptoInterface,
    private sessionStorageMapper: MapperInterface<Session, Record<string, unknown>>,
    private legacySessionStorageMapper: MapperInterface<LegacySession, Record<string, unknown>>,
    protected override internalEventBus: InternalEventBusInterface,
  ) {
    super(internalEventBus)

    this.session = null
  }

  override deinit(): void {
    ;(this.httpService as unknown) = undefined
    ;(this.storageService as unknown) = undefined
    this.invalidSessionObserver = undefined
    this.session = null
    super.deinit()
  }

  public setUser(user?: User): void {
    this.user = user
  }

  /**
   * When a we receive a 401 error from the server, we'll notify the observer.
   * Note that this applies only to sessions that are totally invalid. Sessions that
   * are expired but can be renewed are still considered to be valid. In those cases,
   * the server response is 498.
   * If the session has been revoked, then the observer will have its first
   * argument set to true.
   */
  public setInvalidSessionObserver(observer: InvalidSessionObserver): void {
    this.invalidSessionObserver = observer
  }

  public loadHost(): string {
    const storedValue = this.storageService.getValue<string | undefined>(StorageKey.ServerHost)
    this.host = storedValue || this.host
    return this.host
  }

  public async setHost(host: string): Promise<void> {
    this.host = host
    this.storageService.setValue(StorageKey.ServerHost, host)
  }

  public getHost(): string {
    return this.host
  }

  public getFilesHost(): string {
    if (!this.filesHost) {
      throw Error('Attempting to access undefined filesHost')
    }
    return this.filesHost
  }

  public setSession(session: Session | LegacySession, persist = true): void {
    this.session = session
    if (persist) {
      let sessionProjection: Record<string, unknown>
      if (session instanceof Session) {
        sessionProjection = this.sessionStorageMapper.toProjection(session)
      } else {
        sessionProjection = this.legacySessionStorageMapper.toProjection(session)
      }

      this.storageService.setValue(StorageKey.Session, sessionProjection)
    }
  }

  public getSession(): Session | LegacySession | null {
    return this.session
  }

  public get apiVersion() {
    return V0_API_VERSION
  }

  private params(inParams: Record<string | number | symbol, unknown>): HttpRequestParams {
    const params = {
      ...inParams,
      ...{
        [ApiEndpointParam.ApiVersion]: this.apiVersion,
      },
    }
    return params
  }

  public createErrorResponse(message: string, status?: HttpStatusCode, tag?: ErrorTag): HttpErrorResponse {
    return { data: { error: { message, tag } }, status: status ?? HttpStatusCode.BadRequest }
  }

  private errorResponseWithFallbackMessage(response: HttpErrorResponse, message: string): HttpErrorResponse {
    if (response.data.error && !response.data.error.message) {
      response.data.error.message = message
    }

    return response
  }

  public processMetaObject(meta: HttpResponseMeta) {
    if (meta.auth && meta.auth.userUuid && meta.auth.roles) {
      void this.notifyEvent(ApiServiceEvent.MetaReceived, {
        userUuid: meta.auth.userUuid,
        userRoles: meta.auth.roles,
      })
    }

    if (meta.server?.filesServerUrl) {
      this.filesHost = meta.server?.filesServerUrl
    }
  }

  private processSuccessResponseForMetaBody<T>(response: HttpSuccessResponse<T>) {
    if (response.meta) {
      this.processMetaObject(response.meta)
    }
  }

  private async request<T>(params: {
    verb: HttpVerb
    url: string
    fallbackErrorMessage: string
    params?: HttpRequestParams
    rawBytes?: Uint8Array
    authentication?: string
    customHeaders?: Record<string, string>[]
    responseType?: XMLHttpRequestResponseType
    external?: boolean
  }): Promise<HttpResponse<T>> {
    try {
      const response = await this.httpService.runHttp<T>(params)
      if (isErrorResponse(response)) {
        return this.errorResponseWithFallbackMessage(response, params.fallbackErrorMessage)
      } else {
        this.processSuccessResponseForMetaBody(response)
        return response
      }
    } catch (errorResponse) {
      return this.errorResponseWithFallbackMessage(errorResponse as HttpErrorResponse, params.fallbackErrorMessage)
    }
  }

  /**
   * @param mfaCode     The mfa challenge response value.
   */
  async getAccountKeyParams(dto: {
    email: string
    mfaCode?: string
    authenticatorResponse?: Record<string, unknown>
  }): Promise<HttpResponse<KeyParamsResponse>> {
    const codeVerifier = this.crypto.generateRandomKey(256)
    this.inMemoryStore.setValue(StorageKey.CodeVerifier, codeVerifier)

    const codeChallenge = this.crypto.base64URLEncode(await this.crypto.sha256(codeVerifier))

    const params = this.params({
      email: dto.email,
      code_challenge: codeChallenge,
    }) as Record<string, unknown>

    if (dto.mfaCode !== undefined) {
      params['mfa_code'] = dto.mfaCode
    }

    if (dto.authenticatorResponse) {
      params.authenticator_response = dto.authenticatorResponse
    }

    return this.request({
      verb: HttpVerb.Post,
      url: joinPaths(this.host, Paths.v2.keyParams),
      fallbackErrorMessage: API_MESSAGE_GENERIC_INVALID_LOGIN,
      params,
      /** A session is optional here, if valid, endpoint bypasses 2FA and returns additional params */
      authentication: this.getSessionAccessToken(),
    })
  }

  async signIn(dto: {
    email: string
    serverPassword: string
    ephemeral: boolean
    hvmToken?: string
  }): Promise<HttpResponse<SignInResponse>> {
    if (this.authenticating) {
      return this.createErrorResponse(API_MESSAGE_LOGIN_IN_PROGRESS, HttpStatusCode.BadRequest)
    }
    this.authenticating = true
    const url = joinPaths(this.host, Paths.v2.signIn)
    const params = this.params({
      email: dto.email,
      password: dto.serverPassword,
      ephemeral: dto.ephemeral,
      code_verifier: this.inMemoryStore.getValue(StorageKey.CodeVerifier) as string,
      hvm_token: dto.hvmToken,
    })

    const response = await this.request<SignInResponse>({
      verb: HttpVerb.Post,
      url,
      params,
      fallbackErrorMessage: API_MESSAGE_GENERIC_INVALID_LOGIN,
    })

    this.authenticating = false

    this.inMemoryStore.removeValue(StorageKey.CodeVerifier)

    return response
  }

  signOut(): Promise<HttpResponse<SignOutResponse>> {
    return this.httpService.post<SignOutResponse>(Paths.v1.signOut, undefined, {
      authentication: this.getSessionAccessToken(),
    })
  }

  async changeCredentials(parameters: {
    userUuid: UuidString
    currentServerPassword: string
    newServerPassword: string
    newKeyParams: SNRootKeyParams
    newEmail?: string
  }): Promise<HttpResponse<ChangeCredentialsResponse>> {
    if (this.changing) {
      return this.createErrorResponse(API_MESSAGE_CHANGE_CREDENTIALS_IN_PROGRESS, HttpStatusCode.BadRequest)
    }
    const preprocessingError = this.preprocessingError()
    if (preprocessingError) {
      return preprocessingError
    }
    this.changing = true
    const path = Paths.v1.changeCredentials(parameters.userUuid)
    const params = this.params({
      current_password: parameters.currentServerPassword,
      new_password: parameters.newServerPassword,
      new_email: parameters.newEmail,
      ...parameters.newKeyParams.getPortableValue(),
    })

    const response = await this.httpService.put<ChangeCredentialsResponse>(path, params, {
      authentication: this.getSessionAccessToken(),
    })

    this.changing = false

    if (isErrorResponse(response)) {
      return this.errorResponseWithFallbackMessage(response, API_MESSAGE_GENERIC_CHANGE_CREDENTIALS_FAIL)
    }

    this.processSuccessResponseForMetaBody(response)

    return response
  }

  async sync(
    payloads: ServerSyncPushContextualPayload[],
    lastSyncToken: string | undefined,
    paginationToken: string | undefined,
    limit: number,
    sharedVaultUuids?: string[],
  ): Promise<HttpResponse<RawSyncResponse>> {
    const preprocessingError = this.preprocessingError()
    if (preprocessingError) {
      return preprocessingError
    }
    const request = this.getSyncHttpRequest(payloads, lastSyncToken, paginationToken, limit, sharedVaultUuids)
    const response = await this.httpService.runHttp<RawSyncResponse>(request)

    if (isErrorResponse(response)) {
      this.preprocessAuthenticatedErrorResponse(response)
      return this.errorResponseWithFallbackMessage(response, API_MESSAGE_GENERIC_SYNC_FAIL)
    }

    this.processSuccessResponseForMetaBody(response)

    return response
  }

  getSyncHttpRequest(
    payloads: ServerSyncPushContextualPayload[],
    lastSyncToken: string | undefined,
    paginationToken: string | undefined,
    limit: number,
    sharedVaultUuids?: string[] | undefined,
  ): HttpRequest {
    const path = Paths.v1.sync
    const params = this.params({
      [ApiEndpointParam.SyncPayloads]: payloads,
      [ApiEndpointParam.LastSyncToken]: lastSyncToken,
      [ApiEndpointParam.PaginationToken]: paginationToken,
      [ApiEndpointParam.SyncDlLimit]: limit,
      [ApiEndpointParam.SharedVaultUuids]: sharedVaultUuids,
    })
    return {
      url: joinPaths(this.host, path),
      params,
      verb: HttpVerb.Post,
      authentication: this.getSessionAccessToken(),
    }
  }

  /**
   * @deprecated
   *
   * This function should be replaced with @standardnotes/api's `HttpService::refreshSession` function.
   */
  async deprecatedRefreshSessionOnlyUsedInE2eTests(): Promise<HttpResponse<SessionRenewalResponse>> {
    const preprocessingError = this.preprocessingError()
    if (preprocessingError) {
      return preprocessingError
    }

    this.refreshingSession = true

    const session = this.session as Session
    const params = this.params({
      access_token: session.accessToken.value,
      refresh_token: session.refreshToken.value,
    })

    const response = await this.httpService
      .post<SessionRenewalResponse>(Paths.v1.refreshSession, params)
      .then(async (response) => {
        if (isErrorResponse(response) || !response.data.session) {
          return response
        }

        const accessTokenOrError = SessionToken.create(
          response.data.session.access_token,
          response.data.session.access_expiration,
        )
        if (accessTokenOrError.isFailed()) {
          return null
        }
        const accessToken = accessTokenOrError.getValue()

        const refreshTokenOrError = SessionToken.create(
          response.data.session.refresh_token,
          response.data.session.refresh_expiration,
        )
        if (refreshTokenOrError.isFailed()) {
          return null
        }
        const refreshToken = refreshTokenOrError.getValue()

        const sessionOrError = Session.create(accessToken, refreshToken, response.data.session.readonly_access)
        if (sessionOrError.isFailed()) {
          return null
        }
        const session = sessionOrError.getValue()

        this.session = session

        this.setSession(session)
        this.processSuccessResponseForMetaBody(response)

        await this.notifyEventSync(ApiServiceEvent.SessionRefreshed, {
          session,
        })

        return response
      })

    this.refreshingSession = false

    if (response === null) {
      return this.createErrorResponse(API_MESSAGE_INVALID_SESSION, HttpStatusCode.BadRequest)
    }

    if (isErrorResponse(response)) {
      this.preprocessAuthenticatedErrorResponse(response)
      return this.errorResponseWithFallbackMessage(response, API_MESSAGE_GENERIC_TOKEN_REFRESH_FAIL)
    }

    return response
  }

  async getSessionsList(): Promise<HttpResponse<SessionListResponse>> {
    const preprocessingError = this.preprocessingError()
    if (preprocessingError) {
      return preprocessingError
    }
    const path = Paths.v1.sessions
    const response = await this.httpService.get<SessionListResponse>(
      path,
      {},
      { authentication: this.getSessionAccessToken() },
    )

    if (isErrorResponse(response)) {
      this.preprocessAuthenticatedErrorResponse(response)
      return this.errorResponseWithFallbackMessage(response, API_MESSAGE_GENERIC_SYNC_FAIL)
    }

    this.processSuccessResponseForMetaBody(response)

    return response
  }

  async deleteSession(sessionId: UuidString): Promise<HttpResponse<SessionListResponse>> {
    const preprocessingError = this.preprocessingError()
    if (preprocessingError) {
      return preprocessingError
    }
    const path = Paths.v1.session(sessionId)
    const response = await this.httpService.delete<SessionListResponse>(
      path,
      { uuid: sessionId },
      { authentication: this.getSessionAccessToken() },
    )

    if (isErrorResponse(response)) {
      this.preprocessAuthenticatedErrorResponse(response)
      return this.errorResponseWithFallbackMessage(response, API_MESSAGE_GENERIC_SYNC_FAIL)
    }

    this.processSuccessResponseForMetaBody(response)
    return response
  }

  private async tokenRefreshableRequest<T>(
    params: HttpRequest & { fallbackErrorMessage: string },
  ): Promise<HttpResponse<T>> {
    const preprocessingError = this.preprocessingError()
    if (preprocessingError) {
      return preprocessingError
    }

    const response = await this.httpService.runHttp<T>(params)

    if (isErrorResponse(response)) {
      this.preprocessAuthenticatedErrorResponse(response)
      return this.errorResponseWithFallbackMessage(response, params.fallbackErrorMessage)
    }

    this.processSuccessResponseForMetaBody(response)
    return response
  }

  async listSettings(userUuid: UuidString): Promise<HttpResponse<ListSettingsResponse>> {
    return await this.tokenRefreshableRequest<ListSettingsResponse>({
      verb: HttpVerb.Get,
      url: joinPaths(this.host, Paths.v1.settings(userUuid)),
      fallbackErrorMessage: API_MESSAGE_FAILED_GET_SETTINGS,
      authentication: this.getSessionAccessToken(),
    })
  }

  async updateSetting(
    userUuid: UuidString,
    settingName: string,
    settingValue: string | null,
    sensitive: boolean,
  ): Promise<HttpResponse<UpdateSettingResponse>> {
    const params = {
      name: settingName,
      value: settingValue,
      sensitive: sensitive,
    }
    return this.tokenRefreshableRequest<UpdateSettingResponse>({
      verb: HttpVerb.Put,
      url: joinPaths(this.host, Paths.v1.settings(userUuid)),
      authentication: this.getSessionAccessToken(),
      fallbackErrorMessage: API_MESSAGE_FAILED_UPDATE_SETTINGS,
      params,
    })
  }

  async getSetting(userUuid: UuidString, settingName: string): Promise<HttpResponse<GetSettingResponse>> {
    return await this.tokenRefreshableRequest<GetSettingResponse>({
      verb: HttpVerb.Get,
      url: joinPaths(this.host, Paths.v1.setting(userUuid, settingName.toLowerCase())),
      authentication: this.getSessionAccessToken(),
      fallbackErrorMessage: API_MESSAGE_FAILED_GET_SETTINGS,
    })
  }

  async getSubscriptionSetting(userUuid: UuidString, settingName: string): Promise<HttpResponse<GetSettingResponse>> {
    return await this.tokenRefreshableRequest<GetSettingResponse>({
      verb: HttpVerb.Get,
      url: joinPaths(this.host, Paths.v1.subscriptionSetting(userUuid, settingName.toLowerCase())),
      authentication: this.getSessionAccessToken(),
      fallbackErrorMessage: API_MESSAGE_FAILED_GET_SETTINGS,
    })
  }

  async updateSubscriptionSetting(
    userUuid: UuidString,
    settingName: string,
    settingValue: string | null,
    sensitive: boolean,
  ): Promise<HttpResponse<UpdateSettingResponse>> {
    const params = {
      name: settingName,
      value: settingValue,
      sensitive: sensitive,
    }
    return this.tokenRefreshableRequest<UpdateSettingResponse>({
      verb: HttpVerb.Put,
      url: joinPaths(this.host, Paths.v1.subscriptionSettings(userUuid)),
      authentication: this.getSessionAccessToken(),
      fallbackErrorMessage: API_MESSAGE_FAILED_UPDATE_SETTINGS,
      params,
    })
  }

  async deleteSetting(userUuid: UuidString, settingName: string): Promise<HttpResponse<DeleteSettingResponse>> {
    return this.tokenRefreshableRequest<DeleteSettingResponse>({
      verb: HttpVerb.Delete,
      url: joinPaths(this.host, Paths.v1.setting(userUuid, settingName)),
      authentication: this.getSessionAccessToken(),
      fallbackErrorMessage: API_MESSAGE_FAILED_UPDATE_SETTINGS,
    })
  }

  public downloadFeatureUrl(url: string): Promise<HttpResponse> {
    return this.request({
      verb: HttpVerb.Get,
      url,
      external: true,
      fallbackErrorMessage: API_MESSAGE_GENERIC_INVALID_LOGIN,
    })
  }

  public async getNewSubscriptionToken(): Promise<string | undefined> {
    const url = joinPaths(this.host, Paths.v1.subscriptionTokens)
    const response = await this.request<PostSubscriptionTokensResponse>({
      verb: HttpVerb.Post,
      url,
      authentication: this.getSessionAccessToken(),
      fallbackErrorMessage: API_MESSAGE_FAILED_ACCESS_PURCHASE,
    })

    if (isErrorResponse(response)) {
      return undefined
    }

    return response.data.token
  }

  public async downloadOfflineFeaturesFromRepo(dto: {
    repo: SNFeatureRepo
  }): Promise<{ features: AnyFeatureDescription[]; roles: string[] } | ClientDisplayableError> {
    try {
      const featuresUrl = dto.repo.offlineFeaturesUrl
      const extensionKey = dto.repo.offlineKey
      if (!featuresUrl || !extensionKey) {
        throw Error('Cannot download offline repo without url and offlineKEy')
      }

      const TRUSTED_FEATURE_HOSTS = ['api.standardnotes.com', 'localhost']

      const { hostname } = new URL(featuresUrl)

      if (!TRUSTED_FEATURE_HOSTS.includes(hostname)) {
        return new ClientDisplayableError(`The offline features host ${hostname} is not in the trusted allowlist.`)
      }

      const response = await this.request<GetOfflineFeaturesResponse>({
        verb: HttpVerb.Get,
        url: featuresUrl,
        fallbackErrorMessage: API_MESSAGE_FAILED_OFFLINE_FEATURES,
        customHeaders: [{ key: 'x-offline-token', value: extensionKey }],
      })

      if (isErrorResponse(response)) {
        return ClientDisplayableError.FromNetworkError(response)
      }
      const data = response.data
      return {
        features: data?.features || [],
        roles: data?.roles || [],
      }
    } catch {
      return new ClientDisplayableError(API_MESSAGE_FAILED_OFFLINE_ACTIVATION)
    }
  }

  public async registerForListedAccount(): Promise<HttpResponse<ListedRegistrationResponse>> {
    if (!this.user) {
      throw Error('Cannot register for Listed without user account.')
    }
    return this.tokenRefreshableRequest<ListedRegistrationResponse>({
      verb: HttpVerb.Post,
      url: joinPaths(this.host, Paths.v1.listedRegistration(this.user.uuid)),
      fallbackErrorMessage: API_MESSAGE_FAILED_LISTED_REGISTRATION,
      authentication: this.getSessionAccessToken(),
    })
  }

  public async createUserFileValetToken(
    remoteIdentifier: string,
    operation: ValetTokenOperation,
    unencryptedFileSize?: number,
  ): Promise<string | ClientDisplayableError> {
    const url = joinPaths(this.host, Paths.v1.createUserFileValetToken)

    const params: CreateValetTokenPayload = {
      operation,
      resources: [{ remoteIdentifier, unencryptedFileSize: unencryptedFileSize || 0 }],
    }

    const response = await this.tokenRefreshableRequest<CreateValetTokenResponse>({
      verb: HttpVerb.Post,
      url: url,
      authentication: this.getSessionAccessToken(),
      fallbackErrorMessage: API_MESSAGE_FAILED_CREATE_FILE_TOKEN,
      params,
    })

    if (isErrorResponse(response)) {
      return new ClientDisplayableError(response.data?.error?.message as string)
    }

    if (!response.data?.success) {
      return new ClientDisplayableError(response.data?.reason as string, undefined, response.data?.reason as string)
    }

    return response.data?.valetToken
  }

  public async startUploadSession(
    valetToken: string,
    ownershipType: FileOwnershipType,
  ): Promise<HttpResponse<StartUploadSessionResponse>> {
    const url = joinPaths(
      this.getFilesHost(),
      ownershipType === 'user' ? Paths.v1.startUploadSession : Paths.v1.startSharedVaultUploadSession,
    )

    return this.tokenRefreshableRequest({
      verb: HttpVerb.Post,
      url,
      customHeaders: [{ key: 'x-valet-token', value: valetToken }],
      fallbackErrorMessage: Strings.Network.Files.FailedStartUploadSession,
    })
  }

  public async deleteFile(
    valetToken: string,
    ownershipType: FileOwnershipType,
  ): Promise<HttpResponse<StartUploadSessionResponse>> {
    const url = joinPaths(
      this.getFilesHost(),
      ownershipType === 'user' ? Paths.v1.deleteFile : Paths.v1.deleteSharedVaultFile,
    )

    return this.tokenRefreshableRequest({
      verb: HttpVerb.Delete,
      url,
      customHeaders: [{ key: 'x-valet-token', value: valetToken }],
      fallbackErrorMessage: Strings.Network.Files.FailedDeleteFile,
    })
  }

  public async uploadFileBytes(
    valetToken: string,
    ownershipType: FileOwnershipType,
    chunkId: number,
    encryptedBytes: Uint8Array,
  ): Promise<boolean> {
    if (chunkId === 0) {
      throw Error('chunkId must start with 1')
    }
    const url = joinPaths(
      this.getFilesHost(),
      ownershipType === 'user' ? Paths.v1.uploadFileChunk : Paths.v1.uploadSharedVaultFileChunk,
    )

    const response = await this.tokenRefreshableRequest<UploadFileChunkResponse>({
      verb: HttpVerb.Post,
      url,
      rawBytes: encryptedBytes,
      customHeaders: [
        { key: 'x-valet-token', value: valetToken },
        { key: 'x-chunk-id', value: chunkId.toString() },
        { key: 'Content-Type', value: 'application/octet-stream' },
      ],
      fallbackErrorMessage: Strings.Network.Files.FailedUploadFileChunk,
    })

    if (isErrorResponse(response)) {
      return false
    }

    return response.data.success
  }

  public async closeUploadSession(valetToken: string, ownershipType: FileOwnershipType): Promise<boolean> {
    const url = joinPaths(
      this.getFilesHost(),
      ownershipType === 'user' ? Paths.v1.closeUploadSession : Paths.v1.closeSharedVaultUploadSession,
    )

    const response = await this.tokenRefreshableRequest<CloseUploadSessionResponse>({
      verb: HttpVerb.Post,
      url,
      customHeaders: [{ key: 'x-valet-token', value: valetToken }],
      fallbackErrorMessage: Strings.Network.Files.FailedCloseUploadSession,
    })

    if (isErrorResponse(response)) {
      return false
    }

    return response.data.success
  }

  public async moveFile(valetToken: string): Promise<boolean> {
    const url = joinPaths(this.getFilesHost(), Paths.v1.moveFile)

    const response = await this.tokenRefreshableRequest<MoveFileResponse>({
      verb: HttpVerb.Post,
      url,
      customHeaders: [{ key: 'x-valet-token', value: valetToken }],
      fallbackErrorMessage: Strings.Network.Files.FailedCloseUploadSession,
    })

    if (isErrorResponse(response)) {
      return false
    }

    return response.data.success
  }

  public getFilesDownloadUrl(ownershipType: FileOwnershipType): string {
    if (ownershipType === 'user') {
      return joinPaths(this.getFilesHost(), Paths.v1.downloadFileChunk)
    } else if (ownershipType === 'shared-vault') {
      return joinPaths(this.getFilesHost(), Paths.v1.downloadSharedVaultFileChunk)
    } else {
      throw Error('Invalid download type')
    }
  }

  public async downloadFile({
    file,
    chunkIndex,
    valetToken,
    ownershipType,
    contentRangeStart,
    onBytesReceived,
  }: DownloadFileParams): Promise<ClientDisplayableError | undefined> {
    const url = this.getFilesDownloadUrl(ownershipType)
    const pullChunkSize = file.encryptedChunkSizes[chunkIndex]

    const request: HttpRequest = {
      verb: HttpVerb.Get,
      url,
      customHeaders: [
        { key: 'x-valet-token', value: valetToken },
        {
          key: 'x-chunk-size',
          value: pullChunkSize.toString(),
        },
        { key: 'range', value: `bytes=${contentRangeStart}-` },
      ],
      responseType: 'arraybuffer',
    }

    const response = await this.tokenRefreshableRequest<DownloadFileChunkResponse>({
      ...request,
      fallbackErrorMessage: Strings.Network.Files.FailedDownloadFileChunk,
    })

    if (isErrorResponse(response)) {
      return new ClientDisplayableError(response.data?.error?.message as string)
    }

    const contentRangeHeader = (<Map<string, string | null>>response.headers).get('content-range')
    if (!contentRangeHeader) {
      return new ClientDisplayableError('Could not obtain content-range header while downloading file chunk')
    }

    const matches = contentRangeHeader.match(/(^[a-zA-Z][\w]*)\s+(\d+)\s?-\s?(\d+)?\s?\/?\s?(\d+|\*)?/)
    if (!matches || matches.length !== 5) {
      return new ClientDisplayableError('Malformed content-range header in response when downloading file chunk')
    }

    const rangeStart = +matches[2]
    const rangeEnd = +matches[3]
    const totalSize = +matches[4]

    const bytesReceived = new Uint8Array(response.data)

    await onBytesReceived(bytesReceived)

    if (rangeEnd < totalSize - 1) {
      return this.downloadFile({
        file,
        chunkIndex: ++chunkIndex,
        valetToken,
        ownershipType,
        contentRangeStart: rangeStart + pullChunkSize,
        onBytesReceived,
      })
    }

    return undefined
  }

  async checkIntegrity(integrityPayloads: IntegrityPayload[]): Promise<HttpResponse<CheckIntegrityResponse>> {
    return this.tokenRefreshableRequest<CheckIntegrityResponse>({
      verb: HttpVerb.Post,
      url: joinPaths(this.host, Paths.v1.checkIntegrity),
      params: {
        integrityPayloads,
      },
      fallbackErrorMessage: API_MESSAGE_GENERIC_INTEGRITY_CHECK_FAIL,
      authentication: this.getSessionAccessToken(),
    })
  }

  async getSingleItem(itemUuid: string): Promise<HttpResponse<GetSingleItemResponse>> {
    return this.tokenRefreshableRequest<GetSingleItemResponse>({
      verb: HttpVerb.Get,
      url: joinPaths(this.host, Paths.v1.getSingleItem(itemUuid)),
      fallbackErrorMessage: API_MESSAGE_GENERIC_SINGLE_ITEM_SYNC_FAIL,
      authentication: this.getSessionAccessToken(),
    })
  }

  private preprocessingError() {
    if (this.refreshingSession) {
      return this.createErrorResponse(API_MESSAGE_TOKEN_REFRESH_IN_PROGRESS, HttpStatusCode.BadRequest)
    }

    if (!this.session) {
      return this.createErrorResponse(API_MESSAGE_INVALID_SESSION, HttpStatusCode.BadRequest)
    }

    return undefined
  }

  private preprocessAuthenticatedErrorResponse(response: HttpResponse) {
    if (!this.session) {
      return
    }

    /**
     * In most cases the ExpiredAccessToken erorr shouldn't reach this function, since if a 498 is caught, a refresh
     * will automatically take place. However there does appear to be rare cases where for some reason the 498 falls through,
     * perhaps because for example the server responds to a refresh request with a 498. In those cases, we'll just
     * fallback here to the invalid session observer so that the user can be reprompted for auth.
     */
    if (response.status === HttpStatusCode.Unauthorized || response.status === HttpStatusCode.ExpiredAccessToken) {
      this.invalidSessionObserver?.(response.data.error?.tag === ErrorTag.RevokedSession)
    }
  }

  private getSessionAccessToken(): string | undefined {
    if (!this.session) {
      return undefined
    }

    if (this.session instanceof Session) {
      return this.session.accessToken.value
    }

    return this.session.accessToken
  }

  public getCaptchaUrl() {
    const response = this.httpService.get<MetaEndpointResponse>(Paths.v1.meta)
    return response
  }
}
