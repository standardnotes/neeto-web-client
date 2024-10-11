import { WebApplication } from '@/Application/WebApplication'
import { getBase64FromBlob } from '@/Utils'
import { FileItem, classNames } from '@standardnotes/snjs'
import { FunctionComponent, useCallback, useEffect, useMemo, useRef } from 'react'
import Button from '../Button/Button'
import { createObjectURLWithRef } from './CreateObjectURLWithRef'
import ImagePreview from './ImagePreview'
import { ImageZoomLevelProps } from './ImageZoomLevelProps'
import { PreviewableTextFileTypes, RequiresNativeFilePreview } from './isFilePreviewable'
import TextPreview from './TextPreview'
import { parseFileName, sanitizeFileName } from '@standardnotes/utils'
import VideoPreview from './VideoPreview'

type Props = {
  application: WebApplication
  file: FileItem
  bytes: Uint8Array
  isEmbeddedInSuper: boolean
} & ImageZoomLevelProps

const PreviewComponent: FunctionComponent<Props> = ({
  application,
  file,
  bytes,
  isEmbeddedInSuper,
  imageZoomLevel,
  setImageZoomLevel,
}) => {
  const objectUrlRef = useRef<string>()

  const objectUrl = useMemo(() => {
    return createObjectURLWithRef(file.mimeType, bytes, objectUrlRef)
  }, [bytes, file.mimeType])

  useEffect(() => {
    const objectUrl = objectUrlRef.current

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
        objectUrlRef.current = ''
      }
    }
  }, [])

  const isNativeMobileWeb = application.isNativeMobileWeb()
  const requiresNativePreview = RequiresNativeFilePreview.includes(file.mimeType)

  const openNativeFilePreview = useCallback(async () => {
    if (!isNativeMobileWeb) {
      throw new Error('Native file preview cannot be used on non-native platform')
    }

    const fileBase64 = await getBase64FromBlob(
      new Blob([bytes], {
        type: file.mimeType,
      }),
    )

    const { name, ext } = parseFileName(file.name)
    const sanitizedName = sanitizeFileName(name)
    const filename = `${sanitizedName}.${ext}`

    void application.mobileDevice.previewFile(fileBase64, filename)
  }, [application, bytes, file.mimeType, file.name, isNativeMobileWeb])

  if (isNativeMobileWeb && requiresNativePreview) {
    return (
      <div className="flex flex-grow flex-col items-center justify-center">
        <div className="max-w-[30ch] text-center text-base font-bold">
          This file can only be previewed in an external app
        </div>
        <Button className="mt-3" primary onClick={openNativeFilePreview}>
          Open file preview
        </Button>
      </div>
    )
  }

  if (file.mimeType.startsWith('image/')) {
    return (
      <ImagePreview
        objectUrl={objectUrl}
        isEmbeddedInSuper={isEmbeddedInSuper}
        imageZoomLevel={imageZoomLevel}
        setImageZoomLevel={setImageZoomLevel}
      />
    )
  }

  if (file.mimeType.startsWith('video/')) {
    return (
      <VideoPreview
        file={file}
        filesController={application.filesController}
        objectUrl={objectUrl}
        isEmbeddedInSuper={isEmbeddedInSuper}
      />
    )
  }

  if (file.mimeType.startsWith('audio/')) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <audio src={objectUrl} controls />
      </div>
    )
  }

  if (PreviewableTextFileTypes.includes(file.mimeType)) {
    return <TextPreview bytes={bytes} />
  }

  const isPDF = file.mimeType === 'application/pdf'

  return (
    <object
      className={classNames('h-full w-full', isPDF && 'min-h-[65vh]')}
      data={isPDF ? objectUrl + '#view=FitV' : objectUrl}
    />
  )
}

export default PreviewComponent
