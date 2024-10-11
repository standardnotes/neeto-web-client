import { INSERT_FILE_COMMAND, UPLOAD_AND_INSERT_FILE_COMMAND } from '../Commands'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import { useEffect, useState } from 'react'
import { FileNode } from './Nodes/FileNode'
import {
  $createParagraphNode,
  $insertNodes,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_NORMAL,
  PASTE_COMMAND,
  $isRootOrShadowRoot,
  createCommand,
} from 'lexical'
import { $createFileNode } from './Nodes/FileUtils'
import { mergeRegister, $wrapNodeInElement } from '@lexical/utils'
import { useFilesController } from '@/Controllers/FilesControllerProvider'
import { FilesControllerEvent } from '@/Controllers/FilesController'
import { useLinkingController } from '@/Controllers/LinkingControllerProvider'
import { useApplication } from '@/Components/ApplicationProvider'
import { SNNote } from '@standardnotes/snjs'
import Modal from '../../Lexical/UI/Modal'
import Button from '@/Components/Button/Button'
import { isMobileScreen } from '../../../../Utils'

export const OPEN_FILE_UPLOAD_MODAL_COMMAND = createCommand('OPEN_FILE_UPLOAD_MODAL_COMMAND')

function UploadFileDialog({ onClose }: { onClose: () => void }) {
  const [editor] = useLexicalComposerContext()

  const [file, setFile] = useState<File>()

  const onClick = () => {
    if (!file) {
      return
    }

    editor.dispatchCommand(UPLOAD_AND_INSERT_FILE_COMMAND, file)
    onClose()
  }

  return (
    <>
      <input
        type="file"
        onChange={(event) => {
          const filesList = event.target.files
          if (filesList && filesList.length === 1) {
            setFile(filesList[0])
          }
        }}
      />
      <div className="mt-1.5 flex justify-end">
        <Button onClick={onClick} disabled={!file} small={isMobileScreen()}>
          Upload
        </Button>
      </div>
    </>
  )
}

export default function FilePlugin({ currentNote }: { currentNote: SNNote }): JSX.Element | null {
  const application = useApplication()
  const [editor] = useLexicalComposerContext()
  const filesController = useFilesController()
  const linkingController = useLinkingController()

  const [showFileUploadModal, setShowFileUploadModal] = useState(false)

  useEffect(() => {
    if (!editor.hasNodes([FileNode])) {
      throw new Error('FilePlugin: FileNode not registered on editor')
    }

    const uploadFilesList = (files: FileList) => {
      Array.from(files).forEach(async (file) => {
        editor.dispatchCommand(UPLOAD_AND_INSERT_FILE_COMMAND, file)
      })
    }

    const insertFileNode = (uuid: string, onInsert?: (node: FileNode) => void) => {
      editor.update(() => {
        const fileNode = $createFileNode(uuid)
        $insertNodes([fileNode])
        if ($isRootOrShadowRoot(fileNode.getParentOrThrow())) {
          $wrapNodeInElement(fileNode, $createParagraphNode).selectEnd()
        }
        const newLineNode = $createParagraphNode()
        fileNode.getParentOrThrow().insertAfter(newLineNode)
        newLineNode.selectEnd()
        editor.focus()
        if (onInsert) {
          onInsert(fileNode)
        }
      })
    }

    return mergeRegister(
      editor.registerCommand<string>(
        INSERT_FILE_COMMAND,
        (payload) => {
          insertFileNode(payload)
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        UPLOAD_AND_INSERT_FILE_COMMAND,
        (file) => {
          const note = currentNote
          let fileNode: FileNode | undefined
          filesController
            .uploadNewFile(file, {
              showToast: false,
              onUploadStart(fileUuid) {
                insertFileNode(fileUuid, (node) => (fileNode = node))
              },
            })
            .then((uploadedFile) => {
              if (uploadedFile) {
                void linkingController.linkItems(note, uploadedFile)
                void application.changeAndSaveItem.execute(uploadedFile, (mutator) => {
                  mutator.protected = note.protected
                })
              } else {
                editor.update(() => fileNode?.remove())
              }
            })
            .catch(console.error)
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        OPEN_FILE_UPLOAD_MODAL_COMMAND,
        () => {
          setShowFileUploadModal(true)
          return true
        },
        COMMAND_PRIORITY_NORMAL,
      ),
      editor.registerCommand(
        PASTE_COMMAND,
        (payload) => {
          const files = payload instanceof ClipboardEvent ? payload.clipboardData?.files : null
          if (files?.length) {
            uploadFilesList(files)
            return true
          }
          return false
        },
        COMMAND_PRIORITY_NORMAL,
      ),
    )
  }, [application, currentNote, editor, filesController, linkingController])

  useEffect(() => {
    const disposer = filesController.addEventObserver((event, data) => {
      if (event === FilesControllerEvent.FileUploadedToNote && data[FilesControllerEvent.FileUploadedToNote]) {
        const fileUuid = data[FilesControllerEvent.FileUploadedToNote].uuid
        editor.dispatchCommand(INSERT_FILE_COMMAND, fileUuid)
      } else if (event === FilesControllerEvent.UploadAndInsertFile && data[FilesControllerEvent.UploadAndInsertFile]) {
        const { fileOrHandle } = data[FilesControllerEvent.UploadAndInsertFile]
        if (fileOrHandle instanceof FileSystemFileHandle) {
          fileOrHandle
            .getFile()
            .then((file) => {
              editor.dispatchCommand(UPLOAD_AND_INSERT_FILE_COMMAND, file)
            })
            .catch(console.error)
        } else {
          editor.dispatchCommand(UPLOAD_AND_INSERT_FILE_COMMAND, fileOrHandle)
        }
      }
    })

    return disposer
  }, [filesController, editor])

  if (showFileUploadModal) {
    return (
      <Modal onClose={() => setShowFileUploadModal(false)} title="Upload File">
        <UploadFileDialog onClose={() => setShowFileUploadModal(false)} />
      </Modal>
    )
  }

  return null
}
