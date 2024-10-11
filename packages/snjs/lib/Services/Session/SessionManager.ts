import {
  AlertService,
  AbstractService,
  InternalEventBusInterface,
  StorageKey,
  ChallengePrompt,
  ChallengeValidation,
  ChallengeKeyboardType,
  ChallengeReason,
  ChallengePromptTitle,
  EncryptionService,
  SessionsClientInterface,
  SessionManagerResponse,
  SessionStrings,
  SignInStrings,
  INVALID_PASSWORD_COST,
  API_MESSAGE_FALLBACK_LOGIN_FAIL,
  API_MESSAGE_GENERIC_SYNC_FAIL,
  EXPIRED_PROTOCOL_VERSION,
  StrictSignInFailed,
  UNSUPPORTED_KEY_DERIVATION,
  UNSUPPORTED_PROTOCOL_VERSION,
  Challenge,
  InternalEventHandlerInterface,
  InternalEventInterface,
  ApiServiceEvent,
  SessionRefreshedData,
  SessionEvent,
  UserKeyPairChangedEventData,
  InternalFeatureService,
  InternalFeature,
  ApplicationEvent,
  ApplicationStageChangedEventPayload,
  ApplicationStage,
  GetKeyPairs,
  IsApplicationUsingThirdPartyHost,
  WebSocketsService,
} from '@standardnotes/services'
import { Base64String, PureCryptoInterface } from '@standardnotes/sncrypto-common'
import {
  SessionBody,
  ErrorTag,
  HttpResponse,
  isErrorResponse,
  SessionListEntry,
  User,
  KeyParamsResponse,
  SignInResponse,
  ChangeCredentialsResponse,
  SessionListResponse,
  HttpSuccessResponse,
  getErrorFromErrorResponse,
} from '@standardnotes/responses'
import { CopyPayloadWithContentOverride, RootKeyWithKeyPairsInterface } from '@standardnotes/models'
import { LegacySession, MapperInterface, Result, Session, SessionToken } from '@standardnotes/domain-core'
import { KeyParamsFromApiResponse, SNRootKeyParams, SNRootKey } from '@standardnotes/encryption'
import * as Common from '@standardnotes/common'

import { RawStorageValue } from './Sessions/Types'
import { ShareToken } from './ShareToken'
import { LegacyApiService } from '../Api/ApiService'
import { DiskStorageService } from '../Storage/DiskStorageService'
import { Strings } from '@Lib/Strings'
import { UuidString } from '@Lib/Types/UuidString'
import { ChallengeResponse, ChallengeService } from '../Challenge'
import {
  ApiCallError,
  ErrorMessage,
  HttpServiceInterface,
  UserApiServiceInterface,
  UserRegistrationResponseBody,
} from '@standardnotes/api'
import { cleanedEmailString } from './cleanedEmailString'

export const MINIMUM_PASSWORD_LENGTH = 8
export const MissingAccountParams = 'missing-params'
const ThirtyMinutes = 30 * 60 * 1000

/**
 * The session manager is responsible for loading initial user state, and any relevant
 * server credentials, such as the session token. It also exposes methods for registering
 * for a new account, signing into an existing one, or changing an account password.
 */
export class SessionManager
  extends AbstractService<SessionEvent>
  implements SessionsClientInterface, InternalEventHandlerInterface
{
  private user?: User
  private isSessionRenewChallengePresented = false
  private session?: Session | LegacySession

  constructor(
    private storage: DiskStorageService,
    private apiService: LegacyApiService,
    private userApiService: UserApiServiceInterface,
    private alertService: AlertService,
    private encryptionService: EncryptionService,
    private crypto: PureCryptoInterface,
    private challengeService: ChallengeService,
    private webSocketsService: WebSocketsService,
    private httpService: HttpServiceInterface,
    private sessionStorageMapper: MapperInterface<Session, Record<string, unknown>>,
    private legacySessionStorageMapper: MapperInterface<LegacySession, Record<string, unknown>>,
    private workspaceIdentifier: string,
    private _getKeyPairs: GetKeyPairs,
    private isApplicationUsingThirdPartyHostUseCase: IsApplicationUsingThirdPartyHost,
    protected override internalEventBus: InternalEventBusInterface,
  ) {
    super(internalEventBus)
    apiService.setInvalidSessionObserver((revoked) => {
      if (revoked) {
        void this.notifyEvent(SessionEvent.Revoked)
      } else {
        void this.reauthenticateInvalidSession()
      }
    })
  }

  async handleEvent(event: InternalEventInterface): Promise<void> {
    switch (event.type) {
      case ApiServiceEvent.SessionRefreshed:
        this.httpService.setSession((event.payload as SessionRefreshedData).session)
        break

      case ApplicationEvent.ApplicationStageChanged: {
        const stage = (event.payload as ApplicationStageChangedEventPayload).stage
        if (stage === ApplicationStage.StorageDecrypted_09) {
          await this.initializeFromDisk()
        }
      }
    }
  }

  override deinit(): void {
    ;(this.encryptionService as unknown) = undefined
    ;(this.storage as unknown) = undefined
    ;(this.apiService as unknown) = undefined
    ;(this.alertService as unknown) = undefined
    ;(this.challengeService as unknown) = undefined
    ;(this.webSocketsService as unknown) = undefined
    this.user = undefined
    super.deinit()
  }

  public getWorkspaceDisplayIdentifier(): string {
    if (this.user) {
      return this.user.email
    } else {
      return this.workspaceIdentifier
    }
  }

  private memoizeUser(user?: User) {
    this.user = user

    this.apiService.setUser(user)
  }

  private async initializeFromDisk(): Promise<void> {
    this.memoizeUser(this.storage.getValue(StorageKey.User))

    if (!this.user) {
      const legacyUuidLookup = this.storage.getValue<string>(StorageKey.LegacyUuid)
      if (legacyUuidLookup) {
        this.memoizeUser({ uuid: legacyUuidLookup, email: legacyUuidLookup })
      }
    }

    const serverHost = this.storage.getValue<string | undefined>(StorageKey.ServerHost)
    if (serverHost) {
      void this.apiService.setHost(serverHost)
      this.httpService.setHost(serverHost)
    }

    const rawSession = this.storage.getValue<RawStorageValue>(StorageKey.Session)
    if (rawSession) {
      try {
        const session =
          'jwt' in rawSession
            ? this.legacySessionStorageMapper.toDomain(rawSession)
            : this.sessionStorageMapper.toDomain(rawSession)

        this.setSession(session, false)
      } catch (error) {
        console.error(`Could not deserialize session from storage: ${(error as Error).message}`)
      }
    }
  }

  private setSession(session: Session | LegacySession, persist = true): void {
    this.session = session

    this.httpService.setSession(session)

    this.apiService.setSession(session, persist)

    if (this.isSignedIntoFirstPartyServer()) {
      void this.webSocketsService.startWebSocketConnection()
    }
  }

  public online() {
    return !this.offline()
  }

  public offline() {
    return this.apiService.getSession() == undefined
  }

  public getUser(): User | undefined {
    return this.user
  }

  public getSureUser(): User {
    return this.user as User
  }

  isUserMissingKeyPair(): boolean {
    try {
      return this.getPublicKey() == undefined
    } catch (error) {
      return true
    }
  }

  public getPublicKey(): string {
    const keys = this._getKeyPairs.execute()

    return keys.getValue().encryption.publicKey
  }

  public getSigningPublicKey(): string {
    const keys = this._getKeyPairs.execute()

    return keys.getValue().signing.publicKey
  }

  public get userUuid(): string {
    const user = this.getUser()

    if (!user) {
      throw Error('Attempting to access userUuid when user is undefined')
    }

    return user.uuid
  }

  isCurrentSessionReadOnly(): boolean | undefined {
    if (this.session === undefined) {
      return undefined
    }

    if (this.session instanceof LegacySession) {
      return false
    }

    return this.session.isReadOnly()
  }

  public getSession() {
    return this.apiService.getSession()
  }

  public async signOut() {
    this.memoizeUser(undefined)

    const session = this.apiService.getSession()
    if (session && session instanceof Session) {
      await this.apiService.signOut()
      this.webSocketsService.closeWebSocketConnection()
    }
  }

  /** Unlike EncryptionService.hasAccount, isSignedIn can only be read once the application is unlocked */
  public isSignedIn(): boolean {
    return this.getUser() != undefined
  }

  public isSignedOut(): boolean {
    return !this.isSignedIn()
  }

  public isSignedIntoFirstPartyServer(): boolean {
    const isThirdPartyHostUsedOrError = this.isApplicationUsingThirdPartyHostUseCase.execute()
    if (isThirdPartyHostUsedOrError.isFailed()) {
      return false
    }
    const isThirdPartyHostUsed = isThirdPartyHostUsedOrError.getValue()

    return this.isSignedIn() && !isThirdPartyHostUsed
  }

  public async reauthenticateInvalidSession(
    cancelable = true,
    onResponse?: (response: HttpResponse) => void,
  ): Promise<void> {
    if (this.isSessionRenewChallengePresented) {
      return
    }
    this.isSessionRenewChallengePresented = true
    const challenge = new Challenge(
      [
        new ChallengePrompt(ChallengeValidation.None, undefined, SessionStrings.EmailInputPlaceholder, false),
        new ChallengePrompt(ChallengeValidation.None, undefined, SessionStrings.PasswordInputPlaceholder),
      ],
      ChallengeReason.Custom,
      cancelable,
      SessionStrings.EnterEmailAndPassword,
      SessionStrings.RecoverSession(this.getUser()?.email),
    )
    return new Promise((resolve) => {
      this.challengeService.addChallengeObserver(challenge, {
        onCancel: () => {
          this.isSessionRenewChallengePresented = false
        },
        onComplete: () => {
          this.isSessionRenewChallengePresented = false
        },
        onNonvalidatedSubmit: async (challengeResponse) => {
          const email = challengeResponse.values[0].value as string
          const password = challengeResponse.values[1].value as string
          const currentKeyParams = this.encryptionService.getAccountKeyParams()
          const { response } = await this.signIn(
            email,
            password,
            false,
            this.storage.isEphemeralSession(),
            currentKeyParams?.version,
          )
          if (isErrorResponse(response)) {
            this.challengeService.setValidationStatusForChallenge(
              challenge,
              (challengeResponse as ChallengeResponse).values[1],
              false,
            )
            onResponse?.(response)
          } else {
            resolve()
            this.challengeService.completeChallenge(challenge)
            void this.notifyEvent(SessionEvent.Restored)
            void this.alertService.alert(SessionStrings.SessionRestored)
          }
        },
      })
      void this.challengeService.promptForChallengeResponse(challenge)
    })
  }

  private async promptForU2FVerification(username: string): Promise<Record<string, unknown> | undefined> {
    const challenge = new Challenge(
      [
        new ChallengePrompt(
          ChallengeValidation.Authenticator,
          ChallengePromptTitle.U2F,
          undefined,
          false,
          undefined,
          undefined,
          {
            username,
          },
        ),
      ],
      ChallengeReason.Custom,
      true,
      SessionStrings.InputU2FDevice,
    )

    const response = await this.challengeService.promptForChallengeResponse(challenge)

    if (!response) {
      return undefined
    }

    return response.values[0].value as Record<string, unknown>
  }

  private async promptForMfaValue(): Promise<string | undefined> {
    const challenge = new Challenge(
      [
        new ChallengePrompt(
          ChallengeValidation.None,
          ChallengePromptTitle.Mfa,
          SessionStrings.MfaInputPlaceholder,
          false,
          ChallengeKeyboardType.Numeric,
        ),
      ],
      ChallengeReason.Custom,
      true,
      SessionStrings.EnterMfa,
    )

    const response = await this.challengeService.promptForChallengeResponse(challenge)

    if (response) {
      this.challengeService.completeChallenge(challenge)
      return response.values[0].value as string
    }

    return undefined
  }

  async register(
    email: string,
    password: string,
    hvmToken: string,
    ephemeral: boolean,
  ): Promise<UserRegistrationResponseBody> {
    if (password.length < MINIMUM_PASSWORD_LENGTH) {
      throw new ApiCallError(
        ErrorMessage.InsufficientPasswordMessage.replace('%LENGTH%', MINIMUM_PASSWORD_LENGTH.toString()),
      )
    }

    const { wrappingKey, canceled } = await this.challengeService.getWrappingKeyIfApplicable()
    if (canceled) {
      throw new ApiCallError(ErrorMessage.PasscodeRequired)
    }

    email = cleanedEmailString(email)

    const rootKey = await this.encryptionService.createRootKey<RootKeyWithKeyPairsInterface>(
      email,
      password,
      Common.KeyParamsOrigination.Registration,
    )
    const serverPassword = rootKey.serverPassword as string
    const keyParams = rootKey.keyParams

    const registerResponse = await this.userApiService.register({
      email,
      serverPassword,
      hvmToken,
      keyParams,
      ephemeral,
    })

    if (isErrorResponse(registerResponse)) {
      throw new ApiCallError(getErrorFromErrorResponse(registerResponse).message)
    }

    await this.handleAuthentication({
      rootKey,
      wrappingKey,
      session: registerResponse.data.session,
      user: registerResponse.data.user,
    })

    return registerResponse.data
  }

  private async retrieveKeyParams(dto: {
    email: string
    mfaCode?: string
    authenticatorResponse?: Record<string, unknown>
  }): Promise<{
    keyParams?: SNRootKeyParams
    response: HttpResponse<KeyParamsResponse>
    mfaCode?: string
  }> {
    const response = await this.apiService.getAccountKeyParams(dto)

    if (isErrorResponse(response) || !response.data) {
      if (dto.mfaCode) {
        await this.alertService.alert(SignInStrings.IncorrectMfa)
      }

      const error = isErrorResponse(response) ? response.data.error : undefined

      if (response.data && [ErrorTag.U2FRequired, ErrorTag.MfaRequired].includes(error?.tag as ErrorTag)) {
        const isU2FRequired = error?.tag === ErrorTag.U2FRequired
        const result = isU2FRequired ? await this.promptForU2FVerification(dto.email) : await this.promptForMfaValue()
        if (!result) {
          return {
            response: this.apiService.createErrorResponse(
              SignInStrings.SignInCanceledMissingMfa,
              undefined,
              ErrorTag.ClientCanceledMfa,
            ),
          }
        }

        return this.retrieveKeyParams({
          email: dto.email,
          mfaCode: isU2FRequired ? undefined : (result as string),
          authenticatorResponse: isU2FRequired ? (result as Record<string, unknown>) : undefined,
        })
      } else {
        return { response }
      }
    }
    /** Make sure to use client value for identifier/email */
    const keyParams = KeyParamsFromApiResponse(response.data, dto.email)
    if (!keyParams || !keyParams.version) {
      return {
        response: this.apiService.createErrorResponse(API_MESSAGE_FALLBACK_LOGIN_FAIL),
      }
    }
    return { keyParams, response, mfaCode: dto.mfaCode }
  }

  public async signIn(
    email: string,
    password: string,
    strict = false,
    ephemeral = false,
    minAllowedVersion?: Common.ProtocolVersion,
    hvmToken?: string,
  ): Promise<SessionManagerResponse> {
    const result = await this.performSignIn(email, password, strict, ephemeral, minAllowedVersion, hvmToken)
    if (
      isErrorResponse(result.response) &&
      getErrorFromErrorResponse(result.response).tag !== ErrorTag.ClientValidationError &&
      getErrorFromErrorResponse(result.response).tag !== ErrorTag.ClientCanceledMfa
    ) {
      const cleanedEmail = cleanedEmailString(email)
      if (cleanedEmail !== email) {
        /**
         * Try signing in with trimmed + lowercase version of email
         */
        return this.performSignIn(cleanedEmail, password, strict, ephemeral, minAllowedVersion, hvmToken)
      } else {
        return result
      }
    } else {
      return result
    }
  }

  private async performSignIn(
    email: string,
    password: string,
    strict = false,
    ephemeral = false,
    minAllowedVersion?: Common.ProtocolVersion,
    hvmToken?: string,
  ): Promise<SessionManagerResponse> {
    const paramsResult = await this.retrieveKeyParams({
      email,
    })
    if (isErrorResponse(paramsResult.response)) {
      return {
        response: paramsResult.response,
      }
    }
    const keyParams = paramsResult.keyParams as SNRootKeyParams
    if (!this.encryptionService.supportedVersions().includes(keyParams.version)) {
      if (this.encryptionService.isVersionNewerThanLibraryVersion(keyParams.version)) {
        return {
          response: this.apiService.createErrorResponse(UNSUPPORTED_PROTOCOL_VERSION),
        }
      } else {
        return {
          response: this.apiService.createErrorResponse(EXPIRED_PROTOCOL_VERSION),
        }
      }
    }

    if (Common.isProtocolVersionExpired(keyParams.version)) {
      /* Cost minimums only apply to now outdated versions (001 and 002) */
      const minimum = this.encryptionService.costMinimumForVersion(keyParams.version)
      if (keyParams.content002.pw_cost < minimum) {
        return {
          response: this.apiService.createErrorResponse(INVALID_PASSWORD_COST),
        }
      }

      const expiredMessages = Strings.Confirm.ProtocolVersionExpired(keyParams.version)
      const confirmed = await this.alertService.confirm(
        expiredMessages.Message,
        expiredMessages.Title,
        expiredMessages.ConfirmButton,
      )

      if (!confirmed) {
        return {
          response: this.apiService.createErrorResponse(API_MESSAGE_FALLBACK_LOGIN_FAIL),
        }
      }
    }

    if (!this.encryptionService.platformSupportsKeyDerivation(keyParams)) {
      return {
        response: this.apiService.createErrorResponse(UNSUPPORTED_KEY_DERIVATION),
      }
    }

    if (strict) {
      minAllowedVersion = this.encryptionService.getLatestVersion()
    }

    if (minAllowedVersion != undefined) {
      if (!Common.leftVersionGreaterThanOrEqualToRight(keyParams.version, minAllowedVersion)) {
        return {
          response: this.apiService.createErrorResponse(StrictSignInFailed(keyParams.version, minAllowedVersion)),
        }
      }
    }
    const rootKey = await this.encryptionService.computeRootKey(password, keyParams)
    const signInResponse = await this.bypassChecksAndSignInWithRootKey(email, rootKey, ephemeral, hvmToken)

    return {
      response: signInResponse,
    }
  }

  public async bypassChecksAndSignInWithRootKey(
    email: string,
    rootKey: SNRootKey,
    ephemeral = false,
    hvmToken?: string,
  ): Promise<HttpResponse<SignInResponse>> {
    const { wrappingKey, canceled } = await this.challengeService.getWrappingKeyIfApplicable()

    if (canceled) {
      return this.apiService.createErrorResponse(
        SignInStrings.PasscodeRequired,
        undefined,
        ErrorTag.ClientValidationError,
      )
    }

    const signInResponse = await this.apiService.signIn({
      email,
      serverPassword: rootKey.serverPassword as string,
      ephemeral,
      hvmToken,
    })

    if (!signInResponse.data || isErrorResponse(signInResponse)) {
      return signInResponse
    }

    const updatedKeyParams = signInResponse.data.key_params
    const expandedRootKey = new SNRootKey(
      CopyPayloadWithContentOverride(rootKey.payload, {
        keyParams: updatedKeyParams || rootKey.keyParams.getPortableValue(),
      }),
    )

    await this.handleSuccessAuthResponse(signInResponse, expandedRootKey, wrappingKey)

    return signInResponse
  }

  public async changeCredentials(parameters: {
    currentServerPassword: string
    newRootKey: RootKeyWithKeyPairsInterface
    wrappingKey?: SNRootKey
    newEmail?: string
  }): Promise<SessionManagerResponse> {
    const userUuid = this.getSureUser().uuid
    const rawResponse = await this.apiService.changeCredentials({
      userUuid,
      currentServerPassword: parameters.currentServerPassword,
      newServerPassword: parameters.newRootKey.serverPassword as string,
      newKeyParams: parameters.newRootKey.keyParams,
      newEmail: parameters.newEmail ? cleanedEmailString(parameters.newEmail) : undefined,
    })

    const oldKeys = this._getKeyPairs.execute()

    const processedResponse = await this.processChangeCredentialsResponse(
      rawResponse,
      parameters.newRootKey,
      parameters.wrappingKey,
    )

    if (!isErrorResponse(rawResponse)) {
      if (InternalFeatureService.get().isFeatureEnabled(InternalFeature.Vaults)) {
        const eventData: UserKeyPairChangedEventData = {
          previous: !oldKeys.isFailed()
            ? {
                encryption: oldKeys.getValue().encryption,
                signing: oldKeys.getValue().signing,
              }
            : undefined,
          current: {
            encryption: parameters.newRootKey.encryptionKeyPair,
            signing: parameters.newRootKey.signingKeyPair,
          },
        }

        void this.notifyEvent(SessionEvent.UserKeyPairChanged, eventData)
      }
    }

    return processedResponse
  }

  public async getSessionsList(): Promise<HttpResponse<SessionListEntry[]>> {
    const response = await this.apiService.getSessionsList()

    if (isErrorResponse(response)) {
      return response
    }

    response.data = response.data.sort((s1: SessionListEntry, s2: SessionListEntry) => {
      return new Date(s1.updated_at) < new Date(s2.updated_at) ? 1 : -1
    })

    return response
  }

  public async revokeSession(sessionId: UuidString): Promise<HttpResponse<SessionListResponse>> {
    return this.apiService.deleteSession(sessionId)
  }

  public async revokeAllOtherSessions(): Promise<void> {
    const response = await this.getSessionsList()
    if (isErrorResponse(response) || !response.data) {
      const error = isErrorResponse(response) ? response.data?.error : undefined
      throw new Error(error?.message ?? API_MESSAGE_GENERIC_SYNC_FAIL)
    }

    const otherSessions = response.data.filter((session) => !session.current)
    await Promise.all(otherSessions.map((session) => this.revokeSession(session.uuid)))
  }

  private async processChangeCredentialsResponse(
    response: HttpResponse<ChangeCredentialsResponse>,
    newRootKey: SNRootKey,
    wrappingKey?: SNRootKey,
  ): Promise<SessionManagerResponse> {
    if (isErrorResponse(response)) {
      return {
        response: response,
      }
    }

    await this.handleSuccessAuthResponse(response, newRootKey, wrappingKey)

    return {
      response: response,
      keyParams: response.data?.key_params,
    }
  }

  private decodeDemoShareToken(token: Base64String): ShareToken {
    const jsonString = this.crypto.base64Decode(token)
    return JSON.parse(jsonString)
  }

  public async populateSessionFromDemoShareToken(token: Base64String): Promise<void> {
    const sharePayload = this.decodeDemoShareToken(token)

    await this.signIn(sharePayload.email, sharePayload.password, false, true)
  }

  private async populateSession(
    rootKey: SNRootKey,
    user: User,
    session: Session | LegacySession,
    host: string,
    wrappingKey?: SNRootKey,
  ) {
    await this.encryptionService.setRootKey(rootKey, wrappingKey)

    this.memoizeUser(user)
    this.storage.setValue(StorageKey.User, user)

    void this.apiService.setHost(host)
    this.httpService.setHost(host)

    this.setSession(session)
  }

  async handleAuthentication(dto: {
    session: SessionBody
    user: {
      uuid: string
      email: string
    }
    rootKey: SNRootKey
    wrappingKey?: SNRootKey
  }): Promise<void> {
    const sessionOrError = this.createSession(
      dto.session.access_token,
      dto.session.access_expiration,
      dto.session.refresh_token,
      dto.session.refresh_expiration,
      dto.session.readonly_access,
    )
    if (sessionOrError.isFailed()) {
      console.error(sessionOrError.getError())

      return
    }

    await this.populateSession(
      dto.rootKey,
      dto.user,
      sessionOrError.getValue(),
      this.apiService.getHost(),
      dto.wrappingKey,
    )
  }

  /**
   * @deprecated use handleAuthentication instead
   */
  private async handleSuccessAuthResponse(
    response: HttpSuccessResponse<SignInResponse | ChangeCredentialsResponse>,
    rootKey: SNRootKey,
    wrappingKey?: SNRootKey,
  ) {
    const { data } = response
    const user = data.user

    const isLegacyJwtResponse = data.token != undefined
    if (isLegacyJwtResponse) {
      const sessionOrError = LegacySession.create(data.token as string)
      if (!sessionOrError.isFailed() && user) {
        await this.populateSession(rootKey, user, sessionOrError.getValue(), this.apiService.getHost(), wrappingKey)
      }
    } else if (data.session) {
      const sessionOrError = this.createSession(
        data.session.access_token,
        data.session.access_expiration,
        data.session.refresh_token,
        data.session.refresh_expiration,
        data.session.readonly_access,
      )
      if (sessionOrError.isFailed()) {
        console.error(sessionOrError.getError())

        return
      }
      if (!user) {
        console.error('No user in response')

        return
      }

      await this.populateSession(rootKey, user, sessionOrError.getValue(), this.apiService.getHost(), wrappingKey)
    }
  }

  private createSession(
    accessTokenValue: string,
    accessExpiration: number,
    refreshTokenValue: string,
    refreshExpiration: number,
    readonlyAccess: boolean,
  ): Result<Session> {
    const accessTokenOrError = SessionToken.create(accessTokenValue, accessExpiration)
    if (accessTokenOrError.isFailed()) {
      return Result.fail(`Could not create session: ${accessTokenOrError.getError()}`)
    }
    const accessToken = accessTokenOrError.getValue()

    const refreshTokenOrError = SessionToken.create(refreshTokenValue, refreshExpiration)
    if (refreshTokenOrError.isFailed()) {
      return Result.fail(`Could not create session: ${refreshTokenOrError.getError()}`)
    }
    const refreshToken = refreshTokenOrError.getValue()

    const sessionOrError = Session.create(accessToken, refreshToken, readonlyAccess)
    if (sessionOrError.isFailed()) {
      return Result.fail(`Could not create session: ${sessionOrError.getError()}`)
    }

    return Result.ok(sessionOrError.getValue())
  }

  async refreshSessionIfExpiringSoon(): Promise<boolean> {
    const session = this.getSession()

    if (!session) {
      return false
    }
    if (session instanceof LegacySession) {
      return false
    }

    const accessTokenExpiration = new Date(session.accessToken.expiresAt)
    const refreshTokenExpiration = new Date(session.refreshToken.expiresAt)

    const willAccessTokenExpireSoon = accessTokenExpiration.getTime() - Date.now() < ThirtyMinutes
    const willRefreshTokenExpireSoon = refreshTokenExpiration.getTime() - Date.now() < ThirtyMinutes

    if (willAccessTokenExpireSoon || willRefreshTokenExpireSoon) {
      const refreshSessionResultOrError = await this.httpService.refreshSession()
      if (refreshSessionResultOrError.isFailed()) {
        return false
      }

      const refreshSessionResult = refreshSessionResultOrError.getValue()

      return isErrorResponse(refreshSessionResult)
    }

    return false
  }
}
