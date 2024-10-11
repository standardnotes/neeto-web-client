import FakeWebCrypto from './fake_web_crypto.js'
import { AppContext } from './AppContext.js'
import { VaultsContext } from './VaultsContext.js'
import * as Applications from './Applications.js'
import * as Defaults from './Defaults.js'
import * as Utils from './Utils.js'
import { createItemParams, createNoteParams, createTagParams } from './Items.js'

export const TenSecondTimeout = 10_000
export const TwentySecondTimeout = 20_000
export const ThirtySecondTimeout = 30_000
export const SixtySecondTimeout = 60_000

export const syncOptions = {
  checkIntegrity: true,
  awaitAll: true,
}

export async function createAndInitSimpleAppContext(
  { registerUser, environment } = {
    registerUser: false,
    environment: Environment.Web,
  },
) {
  const application = await createInitAppWithFakeCrypto(environment)
  const email = UuidGenerator.GenerateUuid()
  const password = UuidGenerator.GenerateUuid()
  const newPassword = randomString()

  if (registerUser) {
    await registerUserToApplication({
      application,
      email,
      password,
    })
  }

  return {
    application,
    email,
    password,
    newPassword,
  }
}

export async function createAppContextWithFakeCrypto(identifier, email, password, syncCallsThresholdPerMinute) {
  return createAppContext({ identifier, crypto: new FakeWebCrypto(), email, password, syncCallsThresholdPerMinute })
}

export async function createAppContextWithRealCrypto(identifier) {
  return createAppContext({ identifier, crypto: new SNWebCrypto() })
}

export async function createAppContext({
  identifier,
  crypto,
  email,
  password,
  host,
  syncCallsThresholdPerMinute,
} = {}) {
  const context = new AppContext({ identifier, crypto, email, password, host, syncCallsThresholdPerMinute })
  await context.initialize()
  return context
}

export async function createVaultsContextWithRealCrypto(identifier) {
  return createVaultsContext({ identifier, crypto: new SNWebCrypto() })
}

export async function createVaultsContextWithFakeCrypto(identifier) {
  return createVaultsContext({ identifier, crypto: new FakeWebCrypto() })
}

export async function createVaultsContext({ identifier, crypto, email, password, host } = {}) {
  const context = new VaultsContext({ identifier, crypto, email, password, host })
  await context.initialize()
  return context
}

export function disableIntegrityAutoHeal(application) {
  application.sync.emitOutOfSyncRemotePayloads = () => {
    console.warn('Integrity self-healing is disabled for this test')
  }
}

export async function safeDeinit(application) {
  return Utils.safeDeinit(application)
}

export function getDefaultHost() {
  return Defaults.getDefaultHost()
}

export function createApplicationWithFakeCrypto(identifier, environment, platform, host) {
  return Applications.createApplicationWithFakeCrypto(identifier, environment, platform, host)
}

export function createApplicationWithRealCrypto(identifier, environment, platform, host) {
  return Applications.createApplicationWithRealCrypto(identifier, environment, platform, host)
}

export async function createAppWithRandNamespace(environment, platform) {
  return Applications.createAppWithRandNamespace(environment, platform)
}

export async function createInitAppWithFakeCrypto(environment, platform) {
  return Applications.createInitAppWithFakeCrypto(environment, platform)
}

export async function createInitAppWithFakeCryptoWithOptions({ environment, platform, identifier }) {
  const application = Applications.createApplicationWithOptions({ identifier, environment, platform })
  await Applications.initializeApplication(application)
  return application
}

export async function createInitAppWithRealCrypto(environment, platform) {
  return Applications.createInitAppWithRealCrypto(environment, platform)
}

export async function createAndInitializeApplication(namespace, environment, platform, host, crypto) {
  return Applications.createAndInitializeApplication(namespace, environment, platform, host, crypto)
}

export async function initializeApplication(application) {
  return Applications.initializeApplication(application)
}

export function registerUserToApplication({ application, email, password, ephemeral, mergeLocal = true }) {
  if (!email) email = Utils.generateUuid()
  if (!password) password = Utils.generateUuid()
  return application.register(email, password, null, ephemeral, mergeLocal)
}

export async function setOldVersionPasscode({ application, passcode, version }) {
  const identifier = await application.encryption.crypto.generateUUID()
  const operator = application.dependencies.get(TYPES.EncryptionOperators).operatorForVersion(version)
  const key = await operator.createRootKey(identifier, passcode, KeyParamsOrigination.PasscodeCreate)
  await application.encryption.setNewRootKeyWrapper(key)
  await application.user.rewriteItemsKeys()
  await application.sync.sync(syncOptions)
}

/**
 * Using application.register will always use latest version of protocol.
 * To use older version, use this method.
 */
export async function registerOldUser({ application, email, password, version }) {
  if (!email) email = Utils.generateUuid()
  if (!password) password = Utils.generateUuid()
  const operator = application.dependencies.get(TYPES.EncryptionOperators).operatorForVersion(version)
  const accountKey = await operator.createRootKey(email, password, KeyParamsOrigination.Registration)

  const response = await application.dependencies.get(TYPES.UserApiService).register({
    email: email,
    serverPassword: accountKey.serverPassword,
    keyParams: accountKey.keyParams,
  })

  /** Mark all existing items as dirty. */
  await application.mutator.changeItems(application.items.items, (m) => {
    m.dirty = true
  })
  await application.sessions.handleSuccessAuthResponse(response, accountKey)
  application.notifyEvent(ApplicationEvent.SignedIn)
  await application.sync.sync({
    mode: SyncMode.DownloadFirst,
    ...syncOptions,
  })

  await application.dependencies.get(TYPES.DecryptErroredPayloads).execute()
}

export function createStorageItemPayload(contentType) {
  return new DecryptedPayload(createItemParams(contentType))
}

export function createNotePayload(title, text = undefined, dirty = true) {
  return new DecryptedPayload(createNoteParams({ title, text, dirty }))
}

export function createNote(title, text = undefined, dirty = true) {
  return new SNNote(new DecryptedPayload(createNoteParams({ title, text, dirty })))
}

export function createStorageItemTagPayload(tagParams = {}) {
  return new DecryptedPayload(createTagParams(tagParams))
}

export function itemToStoragePayload(item) {
  return new DecryptedPayload(item)
}

export function createMappedNote(application, title, text, dirty = true) {
  const payload = createNotePayload(title, text, dirty)
  return application.mutator.emitItemFromPayload(payload, PayloadEmitSource.LocalChanged)
}

export async function createMappedTag(application, tagParams = {}) {
  const payload = createStorageItemTagPayload(tagParams)
  return application.mutator.emitItemFromPayload(payload, PayloadEmitSource.LocalChanged)
}

export async function createSyncedNote(application, title, text) {
  const payload = createNotePayload(title, text)
  const item = await application.mutator.emitItemFromPayload(payload, PayloadEmitSource.LocalChanged)
  await application.mutator.setItemDirty(item)
  await application.sync.sync(syncOptions)
  const note = application.items.findItem(payload.uuid)
  return note
}

export async function getStoragePayloadsOfType(application, type) {
  const rawPayloads = await application.storage.getAllRawPayloads()
  return rawPayloads
    .filter((rp) => rp.content_type === type)
    .map((rp) => {
      return new CreatePayload(rp)
    })
}

export async function createManyMappedNotes(application, count) {
  const createdNotes = []
  for (let i = 0; i < count; i++) {
    const note = await createMappedNote(application)
    await application.mutator.setItemDirty(note)
    createdNotes.push(note)
  }
  return createdNotes
}

export async function loginToApplication({
  application,
  email,
  password,
  ephemeral,
  strict = false,
  mergeLocal = true,
  awaitSync = true,
}) {
  return application.signIn(email, password, strict, ephemeral, mergeLocal, awaitSync)
}

export async function awaitFunctionInvokation(object, functionName) {
  return new Promise((resolve) => {
    const original = object[functionName]
    object[functionName] = async function () {
      const result = original.apply(this, arguments)
      resolve(result)
      return result
    }
  })
}

/**
 * Signing out of an application deinits it.
 * A new one must be created.
 */
export async function signOutApplicationAndReturnNew(application) {
  if (!application) {
    throw Error('[signOutApplicationAndReturnNew] Application is undefined')
  }
  if (!application.options.crypto) {
    throw Error('[signOutApplicationAndReturnNew] Application.options.crypto is undefined')
  }

  const isRealCrypto = application.options.crypto instanceof SNWebCrypto
  await application.user.signOut()
  if (isRealCrypto) {
    return createInitAppWithRealCrypto()
  } else {
    return createInitAppWithFakeCrypto()
  }
}

export async function signOutAndBackIn(application, email, password) {
  const isRealCrypto = application.options.crypto instanceof SNWebCrypto
  await application.user.signOut()
  const newApplication = isRealCrypto ? await createInitAppWithRealCrypto() : await createInitAppWithFakeCrypto()
  await this.loginToApplication({
    application: newApplication,
    email,
    password,
  })
  return newApplication
}

export async function restartApplication(application) {
  const id = application.identifier
  await safeDeinit(application)
  const newApplication = await createAndInitializeApplication(id)
  return newApplication
}

export async function storagePayloadCount(application) {
  const payloads = await application.storage.getAllRawPayloads()
  return payloads.length
}

/**
 * The number of seconds between changes before a server creates a new revision.
 * Controlled via docker/syncing-server-js.env
 */
export const ServerRevisionFrequency = 2.1
export const ServerRevisionCreationDelay = 1.5

export function yesterday() {
  return new Date(new Date().setDate(new Date().getDate() - 1))
}

export function dateToMicroseconds(date) {
  return date.getTime() * 1_000
}

export function tomorrow() {
  return new Date(new Date().setDate(new Date().getDate() + 1))
}

export async function sleep(seconds, reason, dontLog = false) {
  if (!dontLog) {
    console.log('[Factory] Sleeping for reason', reason)
  }
  return Utils.sleep(seconds)
}

export function shuffleArray(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function randomString(length = 10) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function generateUuidish() {
  return this.randomString(32)
}

export function randomArrayValue(array) {
  return array[Math.floor(Math.random() * array.length)]
}

export async function expectThrowsAsync(method, errorMessage) {
  let error = null
  try {
    await method()
  } catch (err) {
    error = err
  }
  const expect = chai.expect
  expect(error).to.be.an('Error')
  if (errorMessage) {
    expect(error.message)
      .to.be.a('string')
      .and.satisfy((msg) => msg.startsWith(errorMessage))
  }
}

export function ignoreChallenges(application) {
  application.setLaunchCallback({
    receiveChallenge() {
      /** no-op */
    },
  })
}

export function handlePasswordChallenges(application, password) {
  application.setLaunchCallback({
    receiveChallenge: (challenge) => {
      const values = challenge.prompts.map((prompt) =>
        CreateChallengeValue(
          prompt,
          prompt.validation === ChallengeValidation.ProtectionSessionDuration
            ? UnprotectedAccessSecondsDuration.OneMinute
            : password,
        ),
      )
      application.submitValuesForChallenge(challenge, values)
    },
  })
}

export async function createTags(application, hierarchy, parent = undefined, resultAccumulator = undefined) {
  const result = resultAccumulator || {}

  const promises = Object.entries(hierarchy).map(async ([key, value]) => {
    let tag = await application.mutator.findOrCreateTag(key)

    result[key] = tag

    if (parent) {
      await application.mutator.setTagParent(parent, tag)
    }

    if (value === true) {
      return
    }

    await createTags(application, value, tag, result)
  })

  await Promise.all(promises)

  return result
}

export function pinNote(application, note) {
  return application.mutator.changeItem(note, (mutator) => {
    mutator.pinned = true
  })
}

export async function insertItemWithOverride(application, contentType, content, needsSync = false, errorDecrypting) {
  const item = await application.mutator.createItem(contentType, content, needsSync)

  if (errorDecrypting) {
    const encrypted = new EncryptedPayload({
      ...item.payload.ejected(),
      content: '004:...',
      errorDecrypting,
    })

    await application.payloads.emitPayload(encrypted)
  } else {
    const decrypted = new DecryptedPayload({
      ...item.payload.ejected(),
    })
    await application.payloads.emitPayload(decrypted)
  }

  return application.items.findAnyItem(item.uuid)
}

export async function alternateUuidForItem(application, uuid) {
  const item = application.items.findItem(uuid)
  const payload = new DecryptedPayload(item)
  const results = await PayloadsByAlternatingUuid(payload, application.payloads.getMasterCollection())
  await application.payloads.emitPayloads(results, PayloadEmitSource.LocalChanged)
  await application.sync.persistPayloads(results)
  return application.items.findItem(results[0].uuid)
}

export async function markDirtyAndSyncItem(application, itemToLookupUuidFor) {
  const item = application.items.findItem(itemToLookupUuidFor.uuid)
  if (!item) {
    throw Error('Attempting to save non-inserted item')
  }
  if (!item.dirty) {
    await application.mutator.changeItem(item, undefined, MutationType.NoUpdateUserTimestamps)
  }
  await application.sync.sync()
}

export async function changePayloadTimeStampAndSync(application, payload, timestamp, contentOverride, syncOptions) {
  await changePayloadTimeStamp(application, payload, timestamp, contentOverride)

  await application.sync.sync(syncOptions)

  return application.items.findAnyItem(payload.uuid)
}

export async function changePayloadTimeStamp(application, payload, timestamp, contentOverride) {
  payload = application.payloads.collection.find(payload.uuid)
  const changedPayload = new DecryptedPayload({
    ...payload,
    dirty: true,
    dirtyIndex: getIncrementedDirtyIndex(),
    content: {
      ...payload.content,
      ...contentOverride,
    },
    updated_at_timestamp: timestamp,
  })

  await application.mutator.emitItemFromPayload(changedPayload)

  return application.items.findAnyItem(payload.uuid)
}

export async function changePayloadUpdatedAt(application, payload, updatedAt) {
  const latestPayload = application.payloads.collection.find(payload.uuid)

  const changedPayload = new DecryptedPayload({
    ...latestPayload.ejected(),
    dirty: true,
    dirtyIndex: getIncrementedDirtyIndex(),
    updated_at: updatedAt,
  })

  return application.mutator.emitItemFromPayload(changedPayload)
}

export async function changePayloadTimeStampDeleteAndSync(application, payload, timestamp, syncOptions) {
  payload = application.payloads.collection.find(payload.uuid)
  const changedPayload = new DeletedPayload({
    ...payload,
    content: undefined,
    dirty: true,
    dirtyIndex: getIncrementedDirtyIndex(),
    deleted: true,
    updated_at_timestamp: timestamp,
  })

  await application.payloads.emitPayload(changedPayload)
  await application.sync.sync(syncOptions)
}
