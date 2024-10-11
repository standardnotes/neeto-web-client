import * as Utils from './Utils.js'

export async function uploadFile(fileService, buffer, name, ext, chunkSize, vault, options = {}) {
  const byteLength = options.byteLengthOverwrite || buffer.byteLength
  const operation = await fileService.beginNewFileUpload(byteLength, vault)
  if (isClientDisplayableError(operation)) {
    return operation
  }

  let chunkId = 1
  for (let i = 0; i < buffer.length; i += chunkSize) {
    const readUntil = i + chunkSize > buffer.length ? buffer.length : i + chunkSize
    const chunk = buffer.slice(i, readUntil)
    const isFinalChunk = readUntil === buffer.length

    const error = await fileService.pushBytesForUpload(operation, chunk, chunkId++, isFinalChunk)
    if (error) {
      throw new Error('Could not upload file chunk')
    }
  }

  const uuid = Utils.generateUuid()

  const file = await fileService.finishUpload(operation, { name, mimeType: ext }, uuid)

  return file
}

export async function downloadFile(fileService, file) {
  let receivedBytes = new Uint8Array()

  const error = await fileService.downloadFile(file, (decryptedBytes) => {
    receivedBytes = new Uint8Array([...receivedBytes, ...decryptedBytes])
  })

  if (error) {
    throw new Error('Could not download file', error.text)
  }

  return receivedBytes
}
