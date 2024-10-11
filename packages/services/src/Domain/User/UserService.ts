import { Base64String } from '@standardnotes/sncrypto-common'
import { SNRootKey, SNRootKeyParams } from '@standardnotes/encryption'
import {
  HttpResponse,
  SignInResponse,
  User,
  getErrorFromErrorResponse,
  isErrorResponse,
} from '@standardnotes/responses'
import { KeyParamsOrigination, UserRequestType } from '@standardnotes/common'
import { UuidGenerator } from '@standardnotes/utils'
import { UserApiServiceInterface, UserRegistrationResponseBody } from '@standardnotes/api'
import * as Messages from '../Strings/Messages'
import { InfoStrings } from '../Strings/InfoStrings'
import { SyncServiceInterface } from '../Sync/SyncServiceInterface'
import { StorageServiceInterface } from '../Storage/StorageServiceInterface'
import { ItemManagerInterface } from '../Item/ItemManagerInterface'
import { AlertService } from '../Alert/AlertService'
import {
  Challenge,
  ChallengePrompt,
  ChallengeReason,
  ChallengeServiceInterface,
  ChallengeValidation,
} from '../Challenge'
import { InternalEventBusInterface } from '../Internal/InternalEventBusInterface'
import { AbstractService } from '../Service/AbstractService'
import { UserServiceInterface } from './UserServiceInterface'
import { DeinitSource } from '../Application/DeinitSource'
import { StoragePersistencePolicies } from '../Storage/StorageTypes'
import { SessionsClientInterface } from '../Session/SessionsClientInterface'
import { ProtectionsClientInterface } from '../Protection/ProtectionClientInterface'
import { InternalEventHandlerInterface } from '../Internal/InternalEventHandlerInterface'
import { InternalEventInterface } from '../Internal/InternalEventInterface'
import { AccountEventData } from './AccountEventData'
import { AccountEvent } from './AccountEvent'
import { SignedInOrRegisteredEventPayload } from './SignedInOrRegisteredEventPayload'
import { CredentialsChangeFunctionResponse } from './CredentialsChangeFunctionResponse'
import { EncryptionProviderInterface } from '../Encryption/EncryptionProviderInterface'
import { ReencryptTypeAItems } from '../Encryption/UseCase/TypeA/ReencryptTypeAItems'
import { DecryptErroredPayloads } from '../Encryption/UseCase/DecryptErroredPayloads'

const cleanedEmailString = (email: string) => {
  return email.trim().toLowerCase()
}

export class UserService
  extends AbstractService<AccountEvent, AccountEventData>
  implements UserServiceInterface, InternalEventHandlerInterface
{
  private signingIn = false
  private registering = false

  private readonly MINIMUM_PASSCODE_LENGTH = 1
  private readonly MINIMUM_PASSWORD_LENGTH = 8

  constructor(
    private sessions: SessionsClientInterface,
    private sync: SyncServiceInterface,
    private storage: StorageServiceInterface,
    private items: ItemManagerInterface,
    private encryption: EncryptionProviderInterface,
    private alerts: AlertService,
    private challenges: ChallengeServiceInterface,
    private protections: ProtectionsClientInterface,
    private userApi: UserApiServiceInterface,
    private _reencryptTypeAItems: ReencryptTypeAItems,
    private _decryptErroredPayloads: DecryptErroredPayloads,
    protected override internalEventBus: InternalEventBusInterface,
  ) {
    super(internalEventBus)
  }

  public override deinit(): void {
    super.deinit()
    ;(this.sessions as unknown) = undefined
    ;(this.sync as unknown) = undefined
    ;(this.storage as unknown) = undefined
    ;(this.items as unknown) = undefined
    ;(this.encryption as unknown) = undefined
    ;(this.alerts as unknown) = undefined
    ;(this.challenges as unknown) = undefined
    ;(this.protections as unknown) = undefined
    ;(this.userApi as unknown) = undefined
    ;(this._reencryptTypeAItems as unknown) = undefined
    ;(this._decryptErroredPayloads as unknown) = undefined
  }

  async handleEvent(event: InternalEventInterface): Promise<void> {
    if (event.type === AccountEvent.SignedInOrRegistered) {
      const payload = (event.payload as AccountEventData).payload as SignedInOrRegisteredEventPayload
      this.sync.resetSyncState()

      await this.storage.setPersistencePolicy(
        payload.ephemeral ? StoragePersistencePolicies.Ephemeral : StoragePersistencePolicies.Default,
      )

      if (payload.mergeLocal) {
        await this.sync.markAllItemsAsNeedingSyncAndPersist()
      } else {
        void this.items.removeAllItemsFromMemory()
        await this.clearDatabase()
      }

      this.unlockSyncing()

      const syncPromise = this.sync
        .downloadFirstSync(1_000, {
          checkIntegrity: payload.checkIntegrity,
          awaitAll: payload.awaitSync,
        })
        .then(() => {
          if (!payload.awaitSync) {
            void this._decryptErroredPayloads.execute()
          }
        })

      if (payload.awaitSync) {
        await syncPromise

        await this._decryptErroredPayloads.execute()
      }
    }
  }

  get user(): User | undefined {
    return this.sessions.getUser()
  }

  get sureUser(): User {
    return this.sessions.getSureUser()
  }

  getUserUuid(): string {
    return this.sessions.userUuid
  }

  isSignedIn(): boolean {
    return this.sessions.isSignedIn()
  }

  /**
   *  @param mergeLocal  Whether to merge existing offline data into account. If false,
   *                     any pre-existing data will be fully deleted upon success.
   */
  public async register(
    email: string,
    password: string,
    hvmToken: string,
    ephemeral = false,
    mergeLocal = true,
  ): Promise<UserRegistrationResponseBody> {
    if (this.encryption.hasAccount()) {
      throw Error('Tried to register when an account already exists.')
    }

    if (this.registering) {
      throw Error('Already registering.')
    }

    this.registering = true

    try {
      this.lockSyncing()
      const response = await this.sessions.register(email, password, hvmToken, ephemeral)

      await this.notifyEventSync(AccountEvent.SignedInOrRegistered, {
        payload: {
          ephemeral,
          mergeLocal,
          awaitSync: true,
          checkIntegrity: false,
        },
      })

      this.registering = false

      return response
    } catch (error) {
      this.unlockSyncing()
      this.registering = false

      throw error
    }
  }

  /**
   * @param mergeLocal  Whether to merge existing offline data into account.
   * If false, any pre-existing data will be fully deleted upon success.
   */
  public async signIn(
    email: string,
    password: string,
    strict = false,
    ephemeral = false,
    mergeLocal = true,
    awaitSync = false,
    hvmToken?: string,
  ): Promise<HttpResponse<SignInResponse>> {
    if (this.encryption.hasAccount()) {
      throw Error('Tried to sign in when an account already exists.')
    }

    if (this.signingIn) {
      throw Error('Already signing in.')
    }

    this.signingIn = true

    try {
      /** Prevent a timed sync from occuring while signing in. */
      this.lockSyncing()

      const { response } = await this.sessions.signIn(email, password, strict, ephemeral, undefined, hvmToken)

      if (!isErrorResponse(response)) {
        const notifyingFunction = awaitSync ? this.notifyEventSync.bind(this) : this.notifyEvent.bind(this)
        await notifyingFunction(AccountEvent.SignedInOrRegistered, {
          payload: {
            mergeLocal,
            awaitSync,
            ephemeral,
            checkIntegrity: true,
          },
        })
      } else {
        this.unlockSyncing()
      }

      return response
    } finally {
      this.signingIn = false
    }
  }

  public async deleteAccount(): Promise<{
    error: boolean
    message?: string
  }> {
    if (
      !(await this.protections.authorizeAction(ChallengeReason.DeleteAccount, {
        fallBackToAccountPassword: true,
        requireAccountPassword: true,
        forcePrompt: false,
      }))
    ) {
      return {
        error: true,
        message: Messages.INVALID_PASSWORD,
      }
    }

    const uuid = this.sessions.getSureUser().uuid
    const response = await this.userApi.deleteAccount(uuid)
    if (isErrorResponse(response)) {
      return {
        error: true,
        message: getErrorFromErrorResponse(response).message,
      }
    }

    await this.signOut(true)

    if (this.alerts) {
      void this.alerts.alert(InfoStrings.AccountDeleted)
    }

    return {
      error: false,
    }
  }

  async submitUserRequest(requestType: UserRequestType): Promise<boolean> {
    const userUuid = this.sessions.getSureUser().uuid
    try {
      const result = await this.userApi.submitUserRequest({
        userUuid,
        requestType,
      })

      if (isErrorResponse(result)) {
        return false
      }

      return result.data.success
    } catch (error) {
      return false
    }
  }

  /**
   * A sign in request that occurs while the user was previously signed in, to correct
   * for missing keys or storage values. Unlike regular sign in, this doesn't worry about
   * performing one of marking all items as needing sync or deleting all local data.
   */
  public async correctiveSignIn(rootKey: SNRootKey): Promise<HttpResponse<SignInResponse>> {
    this.lockSyncing()

    const response = await this.sessions.bypassChecksAndSignInWithRootKey(rootKey.keyParams.identifier, rootKey, false)

    if (!isErrorResponse(response)) {
      await this.notifyEvent(AccountEvent.SignedInOrRegistered, {
        payload: {
          mergeLocal: true,
          awaitSync: true,
          ephemeral: false,
          checkIntegrity: true,
        },
      })
    }

    this.unlockSyncing()

    return response
  }

  /**
   * @param passcode - Changing the account password or email requires the local
   * passcode if configured (to rewrap the account key with passcode). If the passcode
   * is not passed in, the user will be prompted for the passcode. However if the consumer
   * already has reference to the passcode, they can pass it in here so that the user
   * is not prompted again.
   */
  public async changeCredentials(parameters: {
    currentPassword: string
    origination: KeyParamsOrigination
    validateNewPasswordStrength: boolean
    newEmail?: string
    newPassword?: string
    passcode?: string
  }): Promise<CredentialsChangeFunctionResponse> {
    const result = await this.performCredentialsChange(parameters)
    if (result.error) {
      void this.alerts.alert(result.error.message)
    }
    return result
  }

  public async signOut(force = false, source = DeinitSource.SignOut): Promise<void> {
    const performSignOut = async () => {
      await this.sessions.signOut()
      await this.encryption.deleteWorkspaceSpecificKeyStateFromDevice()
      await this.storage.clearAllData()
      await this.notifyEvent(AccountEvent.SignedOut, { payload: { source } })
    }

    if (force) {
      await performSignOut()

      return
    }

    const dirtyItems = this.items.getDirtyItems()
    if (dirtyItems.length > 0) {
      const singular = dirtyItems.length === 1
      const didConfirm = await this.alerts.confirm(
        `There ${singular ? 'is' : 'are'} ${dirtyItems.length} ${
          singular ? 'item' : 'items'
        } with unsynced changes. If you sign out, these changes will be lost forever. Are you sure you want to sign out?`,
      )
      if (didConfirm) {
        await performSignOut()
      }
    } else {
      await performSignOut()
    }
  }

  async updateAccountWithFirstTimeKeyPair(): Promise<{
    success?: true
    canceled?: true
    error?: { message: string }
  }> {
    if (!this.sessions.isUserMissingKeyPair()) {
      throw Error('Cannot update account with first time keypair if user already has a keypair')
    }

    const result = await this.performProtocolUpgrade()

    return result
  }

  public async performProtocolUpgrade(): Promise<{
    success?: true
    canceled?: true
    error?: { message: string }
  }> {
    const hasPasscode = this.encryption.hasPasscode()
    const hasAccount = this.encryption.hasAccount()
    const prompts = []
    if (hasPasscode) {
      prompts.push(
        new ChallengePrompt(
          ChallengeValidation.LocalPasscode,
          undefined,
          Messages.ChallengeStrings.LocalPasscodePlaceholder,
        ),
      )
    }
    if (hasAccount) {
      prompts.push(
        new ChallengePrompt(
          ChallengeValidation.AccountPassword,
          undefined,
          Messages.ChallengeStrings.AccountPasswordPlaceholder,
        ),
      )
    }
    const challenge = new Challenge(prompts, ChallengeReason.ProtocolUpgrade, true)
    const response = await this.challenges.promptForChallengeResponse(challenge)
    if (!response) {
      return { canceled: true }
    }
    const dismissBlockingDialog = await this.alerts.blockingDialog(
      Messages.DO_NOT_CLOSE_APPLICATION,
      Messages.UPGRADING_ENCRYPTION,
    )
    try {
      let passcode: string | undefined
      if (hasPasscode) {
        /* Upgrade passcode version */
        const value = response.getValueForType(ChallengeValidation.LocalPasscode)
        passcode = value.value as string
      }
      if (hasAccount) {
        /* Upgrade account version */
        const value = response.getValueForType(ChallengeValidation.AccountPassword)
        const password = value.value as string
        const changeResponse = await this.changeCredentials({
          currentPassword: password,
          newPassword: password,
          passcode,
          origination: KeyParamsOrigination.ProtocolUpgrade,
          validateNewPasswordStrength: false,
        })
        if (changeResponse?.error) {
          return { error: changeResponse.error }
        }
      }
      if (hasPasscode) {
        /* Upgrade passcode version */
        await this.removePasscodeWithoutWarning()
        await this.setPasscodeWithoutWarning(passcode as string, KeyParamsOrigination.ProtocolUpgrade)
      }
      return { success: true }
    } catch (error) {
      return { error: error as Error }
    } finally {
      dismissBlockingDialog()
    }
  }

  public async addPasscode(passcode: string): Promise<boolean> {
    if (passcode.length < this.MINIMUM_PASSCODE_LENGTH) {
      return false
    }
    if (!(await this.protections.authorizeAddingPasscode())) {
      return false
    }

    const dismissBlockingDialog = await this.alerts.blockingDialog(
      Messages.DO_NOT_CLOSE_APPLICATION,
      Messages.SETTING_PASSCODE,
    )
    try {
      await this.setPasscodeWithoutWarning(passcode, KeyParamsOrigination.PasscodeCreate)
      return true
    } finally {
      dismissBlockingDialog()
    }
  }

  public async removePasscode(): Promise<boolean> {
    if (!(await this.protections.authorizeRemovingPasscode())) {
      return false
    }

    const dismissBlockingDialog = await this.alerts.blockingDialog(
      Messages.DO_NOT_CLOSE_APPLICATION,
      Messages.REMOVING_PASSCODE,
    )
    try {
      await this.removePasscodeWithoutWarning()
      return true
    } finally {
      dismissBlockingDialog()
    }
  }

  /**
   * @returns whether the passcode was successfuly changed or not
   */
  public async changePasscode(
    newPasscode: string,
    origination = KeyParamsOrigination.PasscodeChange,
  ): Promise<boolean> {
    if (newPasscode.length < this.MINIMUM_PASSCODE_LENGTH) {
      return false
    }
    if (!(await this.protections.authorizeChangingPasscode())) {
      return false
    }

    const dismissBlockingDialog = await this.alerts.blockingDialog(
      Messages.DO_NOT_CLOSE_APPLICATION,
      origination === KeyParamsOrigination.ProtocolUpgrade
        ? Messages.ProtocolUpgradeStrings.UpgradingPasscode
        : Messages.CHANGING_PASSCODE,
    )
    try {
      await this.removePasscodeWithoutWarning()
      await this.setPasscodeWithoutWarning(newPasscode, origination)
      return true
    } finally {
      dismissBlockingDialog()
    }
  }

  public async populateSessionFromDemoShareToken(token: Base64String): Promise<void> {
    await this.sessions.populateSessionFromDemoShareToken(token)
    await this.notifyEvent(AccountEvent.SignedInOrRegistered, {
      payload: {
        ephemeral: false,
        mergeLocal: false,
        checkIntegrity: false,
        awaitSync: true,
      },
    })
  }

  private async setPasscodeWithoutWarning(passcode: string, origination: KeyParamsOrigination) {
    const identifier = UuidGenerator.GenerateUuid()
    const key = await this.encryption.createRootKey(identifier, passcode, origination)
    await this.encryption.setNewRootKeyWrapper(key)
    await this.rewriteItemsKeys()
    await this.sync.sync()
  }

  private async removePasscodeWithoutWarning() {
    await this.encryption.removePasscode()
    await this.rewriteItemsKeys()
  }

  /**
   * Allows items keys to be rewritten to local db on local credential status change,
   * such as if passcode is added, changed, or removed.
   * This allows IndexedDB unencrypted logs to be deleted
   * `deletePayloads` will remove data from backing store,
   * but not from working memory See:
   * https://github.com/standardnotes/desktop/issues/131
   */
  private async rewriteItemsKeys(): Promise<void> {
    const itemsKeys = this.items.getDisplayableItemsKeys()
    const payloads = itemsKeys.map((key) => key.payloadRepresentation())
    await this.storage.deletePayloads(payloads)
    await this.sync.persistPayloads(payloads)
  }

  private lockSyncing(): void {
    this.sync.lockSyncing()
  }

  private unlockSyncing(): void {
    this.sync.unlockSyncing()
  }

  private clearDatabase(): Promise<void> {
    return this.storage.clearAllPayloads()
  }

  private async performCredentialsChange(parameters: {
    currentPassword: string
    origination: KeyParamsOrigination
    validateNewPasswordStrength: boolean
    newEmail?: string
    newPassword?: string
    passcode?: string
  }): Promise<CredentialsChangeFunctionResponse> {
    const { wrappingKey, canceled } = await this.challenges.getWrappingKeyIfApplicable(parameters.passcode)

    if (canceled) {
      return { error: Error(Messages.CredentialsChangeStrings.PasscodeRequired) }
    }

    if (parameters.newPassword !== undefined && parameters.validateNewPasswordStrength) {
      if (parameters.newPassword.length < this.MINIMUM_PASSWORD_LENGTH) {
        return {
          error: Error(Messages.InsufficientPasswordMessage(this.MINIMUM_PASSWORD_LENGTH)),
        }
      }
    }

    const accountPasswordValidation = await this.encryption.validateAccountPassword(parameters.currentPassword)
    if (!accountPasswordValidation.valid) {
      return {
        error: Error(Messages.INVALID_PASSWORD),
      }
    }

    const newEmail = parameters.newEmail ? cleanedEmailString(parameters.newEmail) : undefined

    const user = this.sessions.getUser() as User
    const currentEmail = user.email
    const { currentRootKey, newRootKey } = await this.recomputeRootKeysForCredentialChange({
      currentPassword: parameters.currentPassword,
      currentEmail,
      origination: parameters.origination,
      newEmail: newEmail,
      newPassword: parameters.newPassword,
    })

    this.lockSyncing()

    const { response } = await this.sessions.changeCredentials({
      currentServerPassword: currentRootKey.serverPassword as string,
      newRootKey: newRootKey,
      wrappingKey,
      newEmail: newEmail,
    })

    this.unlockSyncing()

    if (isErrorResponse(response)) {
      return { error: Error(response.data.error?.message) }
    }

    const rollback = await this.encryption.createNewItemsKeyWithRollback()
    await this._reencryptTypeAItems.execute()
    await this.sync.sync({ awaitAll: true })

    const defaultItemsKey = this.encryption.getSureDefaultItemsKey()
    const itemsKeyWasSynced = !defaultItemsKey.neverSynced

    if (!itemsKeyWasSynced) {
      await this.sessions.changeCredentials({
        currentServerPassword: newRootKey.serverPassword as string,
        newRootKey: currentRootKey,
        wrappingKey,
      })
      await this._reencryptTypeAItems.execute()
      await rollback()
      await this.sync.sync({ awaitAll: true })

      return { error: Error(Messages.CredentialsChangeStrings.Failed) }
    }

    return {}
  }

  private async recomputeRootKeysForCredentialChange(parameters: {
    currentPassword: string
    currentEmail: string
    origination: KeyParamsOrigination
    newEmail?: string
    newPassword?: string
  }): Promise<{ currentRootKey: SNRootKey; newRootKey: SNRootKey }> {
    const currentRootKey = await this.encryption.computeRootKey(
      parameters.currentPassword,
      this.encryption.getRootKeyParams() as SNRootKeyParams,
    )
    const newRootKey = await this.encryption.createRootKey(
      parameters.newEmail ?? parameters.currentEmail,
      parameters.newPassword ?? parameters.currentPassword,
      parameters.origination,
    )

    return {
      currentRootKey,
      newRootKey,
    }
  }
}
