import { getBase64FromBlob } from '@/Utils'
import { parseFileName, sanitizeFileName } from '@standardnotes/utils'
import { MobileDeviceInterface } from '@standardnotes/snjs'
import { addToast, ToastType, dismissToast } from '@standardnotes/toast'

export const downloadBlobOnAndroid = async (
  mobileDevice: MobileDeviceInterface,
  blob: Blob,
  filename: string,
  showToast = true,
) => {
  let loadingToastId: string | undefined
  if (showToast) {
    loadingToastId = addToast({
      type: ToastType.Loading,
      message: `Downloading ${filename}..`,
    })
  }
  const base64 = await getBase64FromBlob(blob)
  const { name, ext } = parseFileName(filename)
  const sanitizedName = sanitizeFileName(name)
  filename = `${sanitizedName}.${ext}`
  const downloaded = await mobileDevice.downloadBase64AsFile(base64, filename)
  if (loadingToastId) {
    dismissToast(loadingToastId)
  }
  if (!showToast) {
    return
  }
  if (downloaded) {
    addToast({
      type: ToastType.Success,
      message: `Downloaded ${filename}`,
    })
  } else {
    addToast({
      type: ToastType.Error,
      message: `Could not download ${filename}`,
    })
  }
}
