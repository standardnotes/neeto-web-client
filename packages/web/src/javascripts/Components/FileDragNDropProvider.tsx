import { WebApplication } from '@/Application/WebApplication'
import { usePremiumModal } from '@/Hooks/usePremiumModal'
import { classNames } from '@standardnotes/utils'
import { isHandlingFileDrag } from '@/Utils/DragTypeCheck'
import { StreamingFileReader } from '@standardnotes/filepicker'
import { FileItem, SNNote } from '@standardnotes/snjs'
import { useMemo, useState, createContext, ReactNode, useRef, useCallback, useEffect, useContext, memo } from 'react'
import Portal from './Portal/Portal'
import { ElementIds } from '@/Constants/ElementIDs'

type FileDragTargetCommonData = {
  tooltipText: string
  note?: SNNote
}

type FileDragTargetCallbacks =
  | {
      callback: (files: FileItem) => void
      handleFileUpload?: never
    }
  | {
      handleFileUpload: (fileOrHandle: File | FileSystemFileHandle) => void
      callback?: never
    }
type FileDragTargetData = FileDragTargetCommonData & FileDragTargetCallbacks

type FileDnDContextData = {
  isDraggingFiles: boolean
  addDragTarget: (target: HTMLElement, data: FileDragTargetData) => void
  removeDragTarget: (target: HTMLElement) => void
}

export const FileDnDContext = createContext<FileDnDContextData | null>(null)

export const useFileDragNDrop = () => {
  const value = useContext(FileDnDContext)

  if (!value) {
    throw new Error('Current component must be a child of <FileDragNDropProvider />')
  }

  return value
}

type Props = {
  application: WebApplication
  children: ReactNode
}

const FileDragOverlayClassName =
  'overlay pointer-events-none absolute top-0 left-0 z-footer-bar h-full w-full border-2 border-info before:block before:h-full before:w-full before:bg-info before:opacity-20'

const MemoizedChildren = memo(({ children }: { children: ReactNode }) => {
  return <>{children}</>
})

const FileDragNDropProvider = ({ application, children }: Props) => {
  const premiumModal = usePremiumModal()
  const [isDraggingFiles, setIsDraggingFiles] = useState(false)
  const [tooltipText, setTooltipText] = useState('')

  const fileDragOverlayRef = useRef<HTMLDivElement>(null)

  const addOverlayToElement = useCallback((target: Element) => {
    if (fileDragOverlayRef.current) {
      const targetBoundingRect = target.getBoundingClientRect()
      fileDragOverlayRef.current.style.width = `${targetBoundingRect.width}px`
      fileDragOverlayRef.current.style.height = `${targetBoundingRect.height}px`
      fileDragOverlayRef.current.style.transform = `translate(${targetBoundingRect.x}px, ${targetBoundingRect.y}px)`
    }
  }, [])

  const removeOverlayFromElement = useCallback(() => {
    if (fileDragOverlayRef.current) {
      fileDragOverlayRef.current.style.width = ''
      fileDragOverlayRef.current.style.height = ''
      fileDragOverlayRef.current.style.transform = ''
    }
  }, [])

  const dragTargets = useRef<Map<Element, FileDragTargetData>>(new Map())

  const addDragTarget = useCallback((target: HTMLElement, data: FileDragTargetData) => {
    target.setAttribute('data-file-drag-target', '')
    dragTargets.current.set(target, data)
  }, [])

  const removeDragTarget = useCallback((target: HTMLElement) => {
    target.removeAttribute('data-file-drag-target')
    dragTargets.current.delete(target)
  }, [])

  const dragCounter = useRef(0)

  const resetState = useCallback(() => {
    setIsDraggingFiles(false)
    setTooltipText('')
    removeOverlayFromElement()
  }, [removeOverlayFromElement])

  const handleDrag = useCallback(
    (event: DragEvent) => {
      if (isHandlingFileDrag(event, application)) {
        event.preventDefault()
        event.stopPropagation()
      }
    },
    [application],
  )

  const handleDragStart = useCallback(
    (event: DragEvent) => {
      if (isHandlingFileDrag(event, application)) {
        event.preventDefault()
        event.stopPropagation()

        if (event.dataTransfer) {
          event.dataTransfer.clearData()
        }
      }
    },
    [application],
  )

  const handleDragIn = useCallback(
    (event: DragEvent) => {
      if (!isHandlingFileDrag(event, application)) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      removeOverlayFromElement()

      let closestDragTarget: Element | null = null

      if (event.target instanceof HTMLElement) {
        closestDragTarget = event.target.closest('[data-file-drag-target]')
      }

      dragCounter.current = dragCounter.current + 1

      if (event.dataTransfer?.items.length) {
        setIsDraggingFiles(true)
        if (closestDragTarget) {
          addOverlayToElement(closestDragTarget)
          const tooltipText = dragTargets.current.get(closestDragTarget)?.tooltipText
          if (tooltipText) {
            setTooltipText(tooltipText)
          }
        } else {
          setTooltipText('')
          removeOverlayFromElement()
        }
      }
    },
    [addOverlayToElement, application, removeOverlayFromElement],
  )

  const handleDragOut = useCallback(
    (event: DragEvent) => {
      if (!isHandlingFileDrag(event, application)) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      dragCounter.current = dragCounter.current - 1

      if (dragCounter.current > 0) {
        return
      }

      resetState()
    },
    [application, resetState],
  )

  const handleDrop = useCallback(
    (event: DragEvent) => {
      if (!isHandlingFileDrag(event, application)) {
        resetState()
        return
      }

      event.preventDefault()
      event.stopPropagation()

      let closestDragTarget: Element | null = null

      if (event.target instanceof HTMLElement) {
        closestDragTarget = event.target.closest('[data-file-drag-target]')
      }

      resetState()

      if (!application.featuresController.entitledToFiles) {
        premiumModal.activate('Files')
        return
      }

      if (event.dataTransfer?.items.length) {
        Array.from(event.dataTransfer.items).forEach(async (item) => {
          const fileOrHandle = StreamingFileReader.available()
            ? ((await item.getAsFileSystemHandle()) as FileSystemFileHandle)
            : item.getAsFile()

          if (!fileOrHandle) {
            return
          }

          const dragTarget = closestDragTarget ? dragTargets.current.get(closestDragTarget) : undefined

          if (dragTarget?.handleFileUpload) {
            dragTarget.handleFileUpload(fileOrHandle)
            return
          }

          const uploadedFile = await application.filesController.uploadNewFile(fileOrHandle, {
            note: dragTarget?.note,
          })

          if (!uploadedFile) {
            return
          }

          if (dragTarget?.callback) {
            dragTarget.callback(uploadedFile)
          }
        })

        dragCounter.current = 0
      }
    },
    [application, premiumModal, resetState],
  )

  useEffect(() => {
    const appGroupRoot = document.getElementById(ElementIds.RootId)

    if (!appGroupRoot) {
      return
    }

    appGroupRoot.addEventListener('dragstart', handleDragStart)
    appGroupRoot.addEventListener('dragenter', handleDragIn)
    appGroupRoot.addEventListener('dragleave', handleDragOut)
    appGroupRoot.addEventListener('dragover', handleDrag)
    appGroupRoot.addEventListener('drop', handleDrop)

    return () => {
      appGroupRoot.removeEventListener('dragstart', handleDragStart)
      appGroupRoot.removeEventListener('dragenter', handleDragIn)
      appGroupRoot.removeEventListener('dragleave', handleDragOut)
      appGroupRoot.removeEventListener('dragover', handleDrag)
      appGroupRoot.removeEventListener('drop', handleDrop)
    }
  }, [handleDragIn, handleDrop, handleDrag, handleDragOut, handleDragStart])

  const contextValue = useMemo(() => {
    return {
      isDraggingFiles,
      addDragTarget,
      removeDragTarget,
    }
  }, [addDragTarget, isDraggingFiles, removeDragTarget])

  return (
    <FileDnDContext.Provider value={contextValue}>
      <MemoizedChildren children={children} />
      {isDraggingFiles ? (
        <>
          <div className="pointer-events-none absolute bottom-8 left-1/2 z-dropdown-menu -translate-x-1/2 rounded border-2 border-info bg-default px-5 py-3 shadow-main">
            {tooltipText.length ? tooltipText : 'Drop your files to upload them'}
          </div>
        </>
      ) : null}
      <Portal>
        <div
          className={classNames(FileDragOverlayClassName, isDraggingFiles ? 'visible' : 'invisible')}
          ref={fileDragOverlayRef}
        />
      </Portal>
    </FileDnDContext.Provider>
  )
}

export default FileDragNDropProvider
