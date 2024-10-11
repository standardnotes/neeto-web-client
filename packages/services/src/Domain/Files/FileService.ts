import { MutatorClientInterface } from './../Mutator/MutatorClientInterface'
import {
  ClientDisplayableError,
  isClientDisplayableError,
  isErrorResponse,
  SharedVaultMoveType,
  ValetTokenOperation,
} from '@standardnotes/responses'
import {
  FileItem,
  FileProtocolV1Constants,
  FileMetadata,
  FileContentSpecialized,
  FillItemContentSpecialized,
  FileContent,
  EncryptedPayload,
  isEncryptedPayload,
  VaultListingInterface,
  SharedVaultListingInterface,
  DecryptedPayload,
  FillItemContent,
  PayloadVaultOverrides,
  PayloadTimestampDefaults,
  CreateItemFromPayload,
  DecryptedItemInterface,
} from '@standardnotes/models'
import { PureCryptoInterface } from '@standardnotes/sncrypto-common'
import { LoggerInterface, spaceSeparatedStrings, UuidGenerator } from '@standardnotes/utils'
import { SNItemsKey } from '@standardnotes/encryption'
import {
  DownloadAndDecryptFileOperation,
  EncryptAndUploadFileOperation,
  FileDecryptor,
  FileDownloadProgress,
  FilesClientInterface,
  readAndDecryptBackupFileUsingFileSystemAPI,
  FilesApiInterface,
  FileBackupsConstantsV1,
  FileBackupMetadataFile,
  FileSystemApi,
  FileHandleRead,
  FileSystemNoSelection,
  EncryptedBytes,
  DecryptedBytes,
  OrderedByteChunker,
  FileMemoryCache,
  readAndDecryptBackupFileUsingBackupService,
  BackupServiceInterface,
} from '@standardnotes/files'
import { AlertService, ButtonType } from '../Alert/AlertService'
import { ChallengeServiceInterface } from '../Challenge'
import { InternalEventBusInterface } from '../Internal/InternalEventBusInterface'
import { AbstractService } from '../Service/AbstractService'
import { SyncServiceInterface } from '../Sync/SyncServiceInterface'
import { DecryptItemsKeyWithUserFallback } from '../Encryption/Functions'
import { SharedVaultServer, SharedVaultServerInterface, HttpServiceInterface } from '@standardnotes/api'
import { ContentType } from '@standardnotes/domain-core'
import { EncryptionProviderInterface } from '../Encryption/EncryptionProviderInterface'

const OneHundredMb = 100 * 1_000_000

export class FileService extends AbstractService implements FilesClientInterface {
  private encryptedCache: FileMemoryCache = new FileMemoryCache(OneHundredMb)
  private sharedVault: SharedVaultServerInterface

  constructor(
    private api: FilesApiInterface,
    private mutator: MutatorClientInterface,
    private sync: SyncServiceInterface,
    private encryptor: EncryptionProviderInterface,
    private challengor: ChallengeServiceInterface,
    http: HttpServiceInterface,
    private alertService: AlertService,
    private crypto: PureCryptoInterface,
    protected override internalEventBus: InternalEventBusInterface,
    private logger: LoggerInterface,
    private backupsService?: BackupServiceInterface,
  ) {
    super(internalEventBus)
    this.sharedVault = new SharedVaultServer(http)
  }

  override deinit(): void {
    super.deinit()

    this.encryptedCache.clear()
    ;(this.encryptedCache as unknown) = undefined
    ;(this.api as unknown) = undefined
    ;(this.encryptor as unknown) = undefined
    ;(this.sync as unknown) = undefined
    ;(this.alertService as unknown) = undefined
    ;(this.challengor as unknown) = undefined
    ;(this.crypto as unknown) = undefined
  }

  public minimumChunkSize(): number {
    return 5_000_000
  }

  private async createUserValetToken(
    remoteIdentifier: string,
    operation: ValetTokenOperation,
    unencryptedFileSizeForUpload?: number | undefined,
  ): Promise<string | ClientDisplayableError> {
    return this.api.createUserFileValetToken(remoteIdentifier, operation, unencryptedFileSizeForUpload)
  }

  private async createSharedVaultValetToken(params: {
    sharedVaultUuid: string
    remoteIdentifier: string
    operation: ValetTokenOperation
    fileUuidRequiredForExistingFiles?: string
    unencryptedFileSizeForUpload?: number | undefined
    moveOperationType?: SharedVaultMoveType
    sharedVaultToSharedVaultMoveTargetUuid?: string
    sharedVaultOwnerUuid?: string
  }): Promise<string | ClientDisplayableError> {
    if (params.operation !== ValetTokenOperation.Write && !params.fileUuidRequiredForExistingFiles) {
      throw new Error('File UUID is required for for non-write operations')
    }

    const valetTokenResponse = await this.sharedVault.createSharedVaultFileValetToken({
      sharedVaultUuid: params.sharedVaultUuid,
      sharedVaultOwnerUuid: params.sharedVaultOwnerUuid,
      fileUuid: params.fileUuidRequiredForExistingFiles,
      remoteIdentifier: params.remoteIdentifier,
      operation: params.operation,
      unencryptedFileSize: params.unencryptedFileSizeForUpload,
      moveOperationType: params.moveOperationType,
      sharedVaultToSharedVaultMoveTargetUuid: params.sharedVaultToSharedVaultMoveTargetUuid,
    })

    if (isErrorResponse(valetTokenResponse)) {
      return new ClientDisplayableError('Could not create valet token')
    }

    return valetTokenResponse.data.valetToken
  }

  public async moveFileToSharedVault(
    file: FileItem,
    sharedVault: SharedVaultListingInterface,
  ): Promise<void | ClientDisplayableError> {
    const valetTokenResult = await this.createSharedVaultValetToken({
      sharedVaultUuid: file.shared_vault_uuid ? file.shared_vault_uuid : sharedVault.sharing.sharedVaultUuid,
      sharedVaultOwnerUuid: sharedVault.sharing.ownerUserUuid,
      remoteIdentifier: file.remoteIdentifier,
      operation: ValetTokenOperation.Move,
      fileUuidRequiredForExistingFiles: file.uuid,
      moveOperationType: file.shared_vault_uuid ? 'shared-vault-to-shared-vault' : 'user-to-shared-vault',
      sharedVaultToSharedVaultMoveTargetUuid: file.shared_vault_uuid ? sharedVault.sharing.sharedVaultUuid : undefined,
    })

    if (isClientDisplayableError(valetTokenResult)) {
      return valetTokenResult
    }

    const moveResult = await this.api.moveFile(valetTokenResult)

    if (!moveResult) {
      return new ClientDisplayableError('Could not move file')
    }
  }

  public async moveFileOutOfSharedVault(file: FileItem): Promise<void | ClientDisplayableError> {
    if (!file.shared_vault_uuid) {
      return new ClientDisplayableError('File is not in a shared vault')
    }

    const valetTokenResult = await this.createSharedVaultValetToken({
      sharedVaultUuid: file.shared_vault_uuid,
      remoteIdentifier: file.remoteIdentifier,
      operation: ValetTokenOperation.Move,
      fileUuidRequiredForExistingFiles: file.uuid,
      moveOperationType: 'shared-vault-to-user',
    })

    if (isClientDisplayableError(valetTokenResult)) {
      return valetTokenResult
    }

    const moveResult = await this.api.moveFile(valetTokenResult)

    if (!moveResult) {
      return new ClientDisplayableError('Could not move file')
    }
  }

  public async beginNewFileUpload(
    sizeInBytes: number,
    vault?: VaultListingInterface,
  ): Promise<EncryptAndUploadFileOperation | ClientDisplayableError> {
    const remoteIdentifier = UuidGenerator.GenerateUuid()
    const valetTokenResult =
      vault && vault.isSharedVaultListing()
        ? await this.createSharedVaultValetToken({
            sharedVaultUuid: vault.sharing.sharedVaultUuid,
            sharedVaultOwnerUuid: vault.sharing.ownerUserUuid,
            remoteIdentifier,
            operation: ValetTokenOperation.Write,
            unencryptedFileSizeForUpload: sizeInBytes,
          })
        : await this.createUserValetToken(remoteIdentifier, ValetTokenOperation.Write, sizeInBytes)

    if (valetTokenResult instanceof ClientDisplayableError) {
      return valetTokenResult
    }

    const key = this.crypto.generateRandomKey(FileProtocolV1Constants.KeySize)

    const fileParams = {
      key,
      remoteIdentifier,
      decryptedSize: sizeInBytes,
    }

    const uploadOperation = new EncryptAndUploadFileOperation(
      fileParams,
      valetTokenResult,
      this.crypto,
      this.api,
      vault,
    )

    const uploadSessionStarted = await this.api.startUploadSession(
      valetTokenResult,
      vault && vault.isSharedVaultListing() ? 'shared-vault' : 'user',
    )

    if (isErrorResponse(uploadSessionStarted) || !uploadSessionStarted.data.uploadId) {
      return new ClientDisplayableError('Could not start upload session')
    }

    return uploadOperation
  }

  public async pushBytesForUpload(
    operation: EncryptAndUploadFileOperation,
    bytes: Uint8Array,
    chunkId: number,
    isFinalChunk: boolean,
  ): Promise<ClientDisplayableError | undefined> {
    const success = await operation.pushBytes(bytes, chunkId, isFinalChunk)

    if (!success) {
      return new ClientDisplayableError('Failed to push file bytes to server')
    }

    return undefined
  }

  public async finishUpload(
    operation: EncryptAndUploadFileOperation,
    fileMetadata: FileMetadata,
    uuid: string,
  ): Promise<FileItem | ClientDisplayableError> {
    const uploadSessionClosed = await this.api.closeUploadSession(
      operation.getValetToken(),
      operation.vault && operation.vault.isSharedVaultListing() ? 'shared-vault' : 'user',
    )

    if (!uploadSessionClosed) {
      return new ClientDisplayableError('Could not close upload session')
    }

    const result = operation.getResult()

    const fileContent: FileContentSpecialized = {
      decryptedSize: result.finalDecryptedSize,
      encryptedChunkSizes: operation.encryptedChunkSizes,
      encryptionHeader: result.encryptionHeader,
      key: result.key,
      mimeType: fileMetadata.mimeType,
      name: fileMetadata.name,
      remoteIdentifier: result.remoteIdentifier,
    }

    const filePayload = new DecryptedPayload<FileContent>({
      uuid,
      content_type: ContentType.TYPES.File,
      content: FillItemContent<FileContent>(FillItemContentSpecialized(fileContent)),
      dirty: true,
      ...PayloadVaultOverrides(operation.vault),
      ...PayloadTimestampDefaults(),
    })

    const fileItem = CreateItemFromPayload(filePayload) as DecryptedItemInterface<FileContent>

    const insertedItem = await this.mutator.insertItem<FileItem>(fileItem)

    await this.sync.sync()

    return insertedItem
  }

  private async decryptCachedEntry(file: FileItem, entry: EncryptedBytes): Promise<DecryptedBytes> {
    const decryptOperation = new FileDecryptor(file, this.crypto)

    let decryptedAggregate = new Uint8Array()

    const orderedChunker = new OrderedByteChunker(file.encryptedChunkSizes, 'memcache', async (chunk) => {
      const decryptedBytes = decryptOperation.decryptBytes(chunk.data)

      if (decryptedBytes) {
        decryptedAggregate = new Uint8Array([...decryptedAggregate, ...decryptedBytes.decryptedBytes])
      }
    })

    await orderedChunker.addBytes(entry.encryptedBytes)

    return { decryptedBytes: decryptedAggregate }
  }

  public async downloadFile(
    file: FileItem,
    onDecryptedBytes: (decryptedBytes: Uint8Array, progress: FileDownloadProgress) => Promise<void>,
  ): Promise<ClientDisplayableError | undefined> {
    const cachedBytes = this.encryptedCache.get(file.uuid)

    if (cachedBytes) {
      const decryptedBytes = await this.decryptCachedEntry(file, cachedBytes)

      await onDecryptedBytes(decryptedBytes.decryptedBytes, {
        encryptedFileSize: cachedBytes.encryptedBytes.length,
        encryptedBytesDownloaded: cachedBytes.encryptedBytes.length,
        encryptedBytesRemaining: 0,
        percentComplete: 100,
        source: 'memcache',
      })

      return undefined
    }

    const fileBackup = await this.backupsService?.getFileBackupInfo(file)

    if (this.backupsService && fileBackup) {
      this.logger.info('Downloading file from backup', fileBackup)

      await readAndDecryptBackupFileUsingBackupService(file, this.backupsService, this.crypto, async (chunk) => {
        this.logger.info('Got local file chunk', chunk.progress)

        return onDecryptedBytes(chunk.data, chunk.progress)
      })

      this.logger.info('Finished downloading file from backup')

      return undefined
    } else {
      this.logger.info('Downloading file from network')

      const addToCache = file.encryptedSize < this.encryptedCache.maxSize

      let cacheEntryAggregate = new Uint8Array()

      const tokenResult = file.shared_vault_uuid
        ? await this.createSharedVaultValetToken({
            sharedVaultUuid: file.shared_vault_uuid,
            remoteIdentifier: file.remoteIdentifier,
            operation: ValetTokenOperation.Read,
            fileUuidRequiredForExistingFiles: file.uuid,
          })
        : await this.createUserValetToken(file.remoteIdentifier, ValetTokenOperation.Read)

      if (tokenResult instanceof ClientDisplayableError) {
        return tokenResult
      }

      const operation = new DownloadAndDecryptFileOperation(file, this.crypto, this.api, tokenResult)

      const result = await operation.run(async ({ decrypted, encrypted, progress }): Promise<void> => {
        if (addToCache) {
          cacheEntryAggregate = new Uint8Array([...cacheEntryAggregate, ...encrypted.encryptedBytes])
        }
        return onDecryptedBytes(decrypted.decryptedBytes, progress)
      })

      if (addToCache && cacheEntryAggregate.byteLength > 0) {
        this.encryptedCache.add(file.uuid, { encryptedBytes: cacheEntryAggregate })
      }

      return result.error
    }
  }

  public async deleteFile(file: FileItem): Promise<ClientDisplayableError | undefined> {
    this.encryptedCache.remove(file.uuid)

    const tokenResult = file.shared_vault_uuid
      ? await this.createSharedVaultValetToken({
          sharedVaultUuid: file.shared_vault_uuid,
          remoteIdentifier: file.remoteIdentifier,
          operation: ValetTokenOperation.Delete,
          fileUuidRequiredForExistingFiles: file.uuid,
        })
      : await this.createUserValetToken(file.remoteIdentifier, ValetTokenOperation.Delete)

    if (tokenResult instanceof ClientDisplayableError) {
      return tokenResult
    }

    const result = await this.api.deleteFile(tokenResult, file.shared_vault_uuid ? 'shared-vault' : 'user')

    if (isErrorResponse(result)) {
      const deleteAnyway = await this.alertService.confirm(
        spaceSeparatedStrings(
          'This file could not be deleted from the server, possibly because you are attempting to delete a file item',
          'that was imported from another account. Would you like to remove this file item from your account anyway?',
          "If you're sure the file is yours and still exists on the server, do not choose this option,",
          'and instead try to delete it again.',
        ),
        'Unable to Delete',
        'Delete Anyway',
        ButtonType.Danger,
      )

      if (!deleteAnyway) {
        return ClientDisplayableError.FromNetworkError(result)
      }
    }

    await this.mutator.setItemToBeDeleted(file)
    await this.sync.sync()

    return undefined
  }

  public isFileNameFileBackupRelated(name: string): 'metadata' | 'binary' | false {
    if (name === FileBackupsConstantsV1.MetadataFileName) {
      return 'metadata'
    } else if (name === FileBackupsConstantsV1.BinaryFileName) {
      return 'binary'
    }

    return false
  }

  public async decryptBackupMetadataFile(metdataFile: FileBackupMetadataFile): Promise<FileItem | undefined> {
    const encryptedItemsKey = new EncryptedPayload({
      ...metdataFile.itemsKey,
      waitingForKey: false,
      errorDecrypting: false,
    })

    const decryptedItemsKeyResult = await DecryptItemsKeyWithUserFallback(
      encryptedItemsKey,
      this.encryptor,
      this.challengor,
    )

    if (decryptedItemsKeyResult === 'failed' || decryptedItemsKeyResult === 'aborted') {
      return undefined
    }

    const encryptedFile = new EncryptedPayload({ ...metdataFile.file, waitingForKey: false, errorDecrypting: false })

    const itemsKey = new SNItemsKey(decryptedItemsKeyResult)

    const decryptedFile = await this.encryptor.decryptSplitSingle<FileContent>({
      usesItemsKey: {
        items: [encryptedFile],
        key: itemsKey,
      },
    })

    if (isEncryptedPayload(decryptedFile)) {
      return undefined
    }

    return new FileItem(decryptedFile)
  }

  public async selectFile(fileSystem: FileSystemApi): Promise<FileHandleRead | FileSystemNoSelection> {
    const result = await fileSystem.selectFile()

    return result
  }

  public async readBackupFileAndSaveDecrypted(
    fileHandle: FileHandleRead,
    file: FileItem,
    fileSystem: FileSystemApi,
  ): Promise<'success' | 'aborted' | 'failed'> {
    const destinationDirectoryHandle = await fileSystem.selectDirectory()

    if (destinationDirectoryHandle === 'aborted' || destinationDirectoryHandle === 'failed') {
      return destinationDirectoryHandle
    }

    const destinationFileHandle = await fileSystem.createFile(destinationDirectoryHandle, file.name)

    if (destinationFileHandle === 'aborted' || destinationFileHandle === 'failed') {
      return destinationFileHandle
    }

    const result = await readAndDecryptBackupFileUsingFileSystemAPI(
      fileHandle,
      file,
      fileSystem,
      this.crypto,
      async (decryptedBytes) => {
        await fileSystem.saveBytes(destinationFileHandle, decryptedBytes)
      },
    )

    await fileSystem.closeFileWriteStream(destinationFileHandle)

    return result
  }

  public async readBackupFileBytesDecrypted(
    fileHandle: FileHandleRead,
    file: FileItem,
    fileSystem: FileSystemApi,
  ): Promise<Uint8Array> {
    let bytes = new Uint8Array()

    await readAndDecryptBackupFileUsingFileSystemAPI(
      fileHandle,
      file,
      fileSystem,
      this.crypto,
      async (decryptedBytes) => {
        bytes = new Uint8Array([...bytes, ...decryptedBytes])
      },
    )

    return bytes
  }
}
