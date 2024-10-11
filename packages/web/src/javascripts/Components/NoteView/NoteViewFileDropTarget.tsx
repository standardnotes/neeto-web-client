import { FilesController } from '@/Controllers/FilesController'
import { LinkingController } from '@/Controllers/LinkingController'
import { NoteType, SNNote } from '@standardnotes/snjs'
import { useEffect } from 'react'
import { useApplication } from '../ApplicationProvider'
import { useFileDragNDrop } from '../FileDragNDropProvider'

type Props = {
  note: SNNote
  linkingController: LinkingController
  filesController: FilesController
  noteViewElement: HTMLElement | null
}

const NoteViewFileDropTarget = ({ note, linkingController, noteViewElement, filesController }: Props) => {
  const application = useApplication()
  const { isDraggingFiles, addDragTarget, removeDragTarget } = useFileDragNDrop()

  useEffect(() => {
    const target = noteViewElement

    if (target) {
      const tooltipText = 'Drop your files to upload and link them to the current note'
      if (note.noteType === NoteType.Super) {
        addDragTarget(target, {
          tooltipText,
          handleFileUpload: (fileOrHandle) => {
            filesController.uploadAndInsertFileToCurrentNote(fileOrHandle)
          },
          note,
        })
      } else {
        addDragTarget(target, {
          tooltipText,
          callback: async (uploadedFile) => {
            await linkingController.linkItems(note, uploadedFile)
            void application.changeAndSaveItem.execute(uploadedFile, (mutator) => {
              mutator.protected = note.protected
            })
            filesController.notifyObserversOfUploadedFileLinkingToCurrentNote(uploadedFile.uuid)
          },
          note,
        })
      }
    }

    return () => {
      if (target) {
        removeDragTarget(target)
      }
    }
  }, [addDragTarget, linkingController, note, noteViewElement, removeDragTarget, filesController, application])

  return isDraggingFiles ? (
    // Required to block drag events to editor iframe
    <div id="file-drag-iframe-overlay" className="absolute left-0 top-0 z-dropdown-menu h-full w-full" />
  ) : null
}

export default NoteViewFileDropTarget
