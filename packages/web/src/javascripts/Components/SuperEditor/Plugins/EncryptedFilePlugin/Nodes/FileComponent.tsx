import { BlockWithAlignableContents } from '@lexical/react/LexicalBlockWithAlignableContents'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { $getNodeByKey, CLICK_COMMAND, COMMAND_PRIORITY_LOW, ElementFormatType, NodeKey } from 'lexical'
import { useApplication } from '@/Components/ApplicationProvider'
import FilePreview from '@/Components/FilePreview/FilePreview'
import { FileItem } from '@standardnotes/snjs'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { observer } from 'mobx-react-lite'
import Spinner from '@/Components/Spinner/Spinner'
import { FilesControllerEvent } from '@/Controllers/FilesController'

export type FileComponentProps = Readonly<{
  className: Readonly<{
    base: string
    focus: string
  }>
  format: ElementFormatType | null
  nodeKey: NodeKey
  fileUuid: string
  zoomLevel: number
  setZoomLevel: (zoomLevel: number) => void
}>

function FileComponent({ className, format, nodeKey, fileUuid, zoomLevel, setZoomLevel }: FileComponentProps) {
  const application = useApplication()
  const [editor] = useLexicalComposerContext()
  const [file, setFile] = useState(() => application.items.findItem<FileItem>(fileUuid))
  const uploadProgress = application.filesController.uploadProgressMap.get(fileUuid)

  const [canLoad, setCanLoad] = useState(false)

  const blockWrapperRef = useRef<HTMLDivElement>(null)
  const blockObserver = useMemo(
    () =>
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setCanLoad(true)
            }
          })
        },
        {
          threshold: 0.25,
        },
      ),
    [],
  )

  useEffect(() => {
    const wrapper = blockWrapperRef.current

    if (!wrapper) {
      return
    }

    blockObserver.observe(wrapper)

    return () => {
      blockObserver.unobserve(wrapper)
    }
  }, [blockObserver])

  const setImageZoomLevel = useCallback(
    (zoomLevel: number) => {
      editor.update(() => {
        setZoomLevel(zoomLevel)
      })
    },
    [editor, setZoomLevel],
  )

  const [isSelected, setSelected] = useLexicalNodeSelection(nodeKey)

  useEffect(() => {
    return editor.registerCommand<MouseEvent>(
      CLICK_COMMAND,
      (event) => {
        if (blockWrapperRef.current?.contains(event.target as Node)) {
          event.preventDefault()

          $getNodeByKey(nodeKey)?.selectEnd()

          setTimeout(() => {
            setSelected(!isSelected)
          })
          return true
        }

        return false
      },
      COMMAND_PRIORITY_LOW,
    )
  }, [editor, isSelected, nodeKey, setSelected])

  useEffect(() => {
    return application.filesController.addEventObserver((event, data) => {
      if (event === FilesControllerEvent.FileUploadFinished && data[FilesControllerEvent.FileUploadFinished]) {
        const { uploadedFile } = data[FilesControllerEvent.FileUploadFinished]
        if (uploadedFile.uuid === fileUuid) {
          setFile(uploadedFile)
        }
      }
    })
  }, [application.filesController, fileUuid])

  if (uploadProgress && (uploadProgress.progress < 100 || !file)) {
    const progress = uploadProgress.progress
    return (
      <BlockWithAlignableContents className={className} format={format} nodeKey={nodeKey}>
        <div className="flex flex-col items-center justify-center gap-2 p-4 text-center" ref={blockWrapperRef}>
          <div className="flex items-center gap-2">
            <Spinner className="h-4 w-4" />
            Uploading file "{uploadProgress.file.name}"... ({progress}%)
          </div>
          <div className="w-full max-w-[50%] overflow-hidden rounded bg-contrast">
            <div
              className="h-2 rounded rounded-tl-none bg-info transition-[width] duration-100"
              role="progressbar"
              style={{
                width: `${progress}%`,
              }}
              aria-valuenow={progress}
            />
          </div>
        </div>
      </BlockWithAlignableContents>
    )
  }

  if (!file) {
    return (
      <BlockWithAlignableContents className={className} format={format} nodeKey={nodeKey}>
        <div>Unable to find file {fileUuid}</div>
      </BlockWithAlignableContents>
    )
  }

  return (
    <BlockWithAlignableContents className={className} format={format} nodeKey={nodeKey}>
      <div ref={blockWrapperRef}>
        {canLoad && (
          <FilePreview
            isEmbeddedInSuper={true}
            file={file}
            application={application}
            imageZoomLevel={zoomLevel}
            setImageZoomLevel={setImageZoomLevel}
          />
        )}
      </div>
    </BlockWithAlignableContents>
  )
}

export default observer(FileComponent)
