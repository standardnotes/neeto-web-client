import { WebApplication } from '@/Application/WebApplication'
import { usePrevious } from '@/Components/ContentListView/Calendar/usePrevious'
import { ElementIds } from '@/Constants/ElementIDs'
import { log, LoggingDomain } from '@/Logging'
import { Disposer } from '@/Types/Disposer'
import { EditorEventSource } from '@/Types/EditorEventSource'
import { classNames } from '@standardnotes/utils'
import { useResponsiveEditorFontSize } from '@/Utils/getPlaintextFontSize'
import {
  ApplicationEvent,
  EditorFontSize,
  EditorLineHeight,
  isPayloadSourceRetrieved,
  WebAppEvent,
  PrefDefaults,
  LocalPrefKey,
} from '@standardnotes/snjs'
import { isIOS, TAB_COMMAND } from '@standardnotes/ui-services'
import {
  ChangeEventHandler,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  FocusEvent,
} from 'react'
import { NoteViewController } from '../Controller/NoteViewController'

type Props = {
  application: WebApplication
  spellcheck: boolean
  controller: NoteViewController
  locked: boolean
  onFocus: () => void
  onBlur: (event: FocusEvent) => void
}

export type PlainEditorInterface = {
  focus: () => void
}

export const PlainEditor = forwardRef<PlainEditorInterface, Props>(
  ({ application, spellcheck, controller, locked, onFocus, onBlur }, ref) => {
    const [editorText, setEditorText] = useState<string | undefined>()
    const [textareaUnloading, setTextareaUnloading] = useState(false)
    const [lineHeight, setLineHeight] = useState<EditorLineHeight | undefined>()
    const [fontSize, setFontSize] = useState<EditorFontSize | undefined>()
    const responsiveFontSize = useResponsiveEditorFontSize(fontSize || EditorFontSize.Normal)
    const previousSpellcheck = usePrevious(spellcheck)

    const lastEditorFocusEventSource = useRef<EditorEventSource | undefined>()
    const needsAdjustMobileCursor = useRef(false)
    const isAdjustingMobileCursor = useRef(false)
    const note = useRef(controller.item)

    const [isPendingLocalPropagation, setIsPendingLocalPropagation] = useState(false)

    const tabObserverDisposer = useRef<Disposer>()
    const mutationObserver = useRef<MutationObserver | null>(null)

    useImperativeHandle(ref, () => ({
      focus() {
        focusEditor()
      },
    }))

    useEffect(() => {
      return () => {
        mutationObserver.current?.disconnect()
        tabObserverDisposer.current?.()
        tabObserverDisposer.current = undefined
        mutationObserver.current = null
      }
    }, [])

    useEffect(() => {
      const disposer = controller.addNoteInnerValueChangeObserver((updatedNote, source) => {
        if (updatedNote.uuid !== note.current.uuid) {
          throw Error('Editor received changes for non-current note')
        }

        if (!isPendingLocalPropagation) {
          if (
            isPayloadSourceRetrieved(source) ||
            editorText == undefined ||
            updatedNote.editorIdentifier !== note.current.editorIdentifier ||
            updatedNote.noteType !== note.current.noteType
          ) {
            setEditorText(updatedNote.text)
          }
        }

        note.current = updatedNote
      })

      return disposer
    }, [
      controller,
      editorText,
      controller.item.uuid,
      controller.item.editorIdentifier,
      controller.item.noteType,
      isPendingLocalPropagation,
    ])

    const onTextAreaChange: ChangeEventHandler<HTMLTextAreaElement> = ({ currentTarget }) => {
      const text = currentTarget.value

      setEditorText(text)

      setIsPendingLocalPropagation(true)

      void controller.saveAndAwaitLocalPropagation({ text: text, isUserModified: true }).then(() => {
        setIsPendingLocalPropagation(false)
      })
    }

    const onContentFocus = useCallback(() => {
      if (!isAdjustingMobileCursor.current) {
        needsAdjustMobileCursor.current = true
      }

      application.notifyWebEvent(WebAppEvent.EditorDidFocus, { eventSource: lastEditorFocusEventSource.current })

      lastEditorFocusEventSource.current = undefined

      onFocus()
    }, [application, isAdjustingMobileCursor, lastEditorFocusEventSource, onFocus])

    const onContentBlur = useCallback(
      (event: FocusEvent) => {
        lastEditorFocusEventSource.current = undefined

        onBlur(event)
      },
      [lastEditorFocusEventSource, onBlur],
    )

    const scrollMobileCursorIntoViewAfterWebviewResize = useCallback(() => {
      if (needsAdjustMobileCursor.current) {
        needsAdjustMobileCursor.current = false
        isAdjustingMobileCursor.current = true
        document.getElementById('note-text-editor')?.blur()
        document.getElementById('note-text-editor')?.focus()
        isAdjustingMobileCursor.current = false
      }
    }, [needsAdjustMobileCursor])

    useEffect(() => {
      const disposer = application.addWebEventObserver((event) => {
        if (event === WebAppEvent.MobileKeyboardWillChangeFrame) {
          scrollMobileCursorIntoViewAfterWebviewResize()
        }
      })
      return disposer
    }, [application, scrollMobileCursorIntoViewAfterWebviewResize])

    const focusEditor = useCallback(() => {
      const element = document.getElementById(ElementIds.NoteTextEditor)
      if (element) {
        lastEditorFocusEventSource.current = EditorEventSource.Script
        element.focus()
      }
    }, [])

    useEffect(() => {
      const shouldFocus = controller.isTemplateNote && controller.templateNoteOptions?.autofocusBehavior === 'editor'

      if (shouldFocus) {
        focusEditor()
      }
    }, [controller, focusEditor])

    const reloadPreferences = useCallback(() => {
      const lineHeight = application.preferences.getLocalValue(
        LocalPrefKey.EditorLineHeight,
        PrefDefaults[LocalPrefKey.EditorLineHeight],
      )
      const fontSize = application.preferences.getLocalValue(
        LocalPrefKey.EditorFontSize,
        PrefDefaults[LocalPrefKey.EditorFontSize],
      )

      setLineHeight(lineHeight)
      setFontSize(fontSize)
    }, [application])

    useEffect(() => {
      reloadPreferences()

      return application.addSingleEventObserver(ApplicationEvent.PreferencesChanged, async () => {
        reloadPreferences()
      })
    }, [reloadPreferences, application])

    useEffect(() => {
      if (previousSpellcheck === undefined) {
        return
      }

      if (spellcheck !== previousSpellcheck) {
        setTextareaUnloading(true)
        setTimeout(() => {
          setTextareaUnloading(false)
        }, 0)
      }
    }, [spellcheck, previousSpellcheck])

    const onRef = useCallback(
      (ref: HTMLTextAreaElement | null) => {
        if (tabObserverDisposer.current || !ref) {
          return
        }

        log(LoggingDomain.NoteView, 'On system editor ref')

        /**
         * Insert 4 spaces when a tab key is pressed, only used when inside of the text editor.
         * If the shift key is pressed first, this event is not fired.
         */
        const editor = document.getElementById(ElementIds.NoteTextEditor) as HTMLInputElement

        if (!editor) {
          console.error('Editor is not yet mounted; unable to add tab observer.')
          return
        }

        tabObserverDisposer.current = application.keyboardService.addCommandHandler({
          element: editor,
          command: TAB_COMMAND,
          onKeyDown: (event) => {
            if (document.hidden || note.current.locked || event.shiftKey) {
              return
            }
            event.preventDefault()
            /** Using document.execCommand gives us undo support */
            const insertSuccessful = document.execCommand('insertText', false, '\t')
            if (!insertSuccessful) {
              /** document.execCommand works great on Chrome/Safari but not Firefox */
              const start = editor.selectionStart || 0
              const end = editor.selectionEnd || 0
              const spaces = '    '
              /** Insert 4 spaces */
              editor.value = editor.value.substring(0, start) + spaces + editor.value.substring(end)
              /** Place cursor 4 spaces away from where the tab key was pressed */
              editor.selectionStart = editor.selectionEnd = start + 4
            }

            setEditorText(editor.value)

            void controller.saveAndAwaitLocalPropagation({
              text: editor.value,
              bypassDebouncer: true,
              isUserModified: true,
            })
          },
        })

        const observer = new MutationObserver((records) => {
          for (const record of records) {
            record.removedNodes.forEach((node) => {
              if (node.isEqualNode(editor)) {
                tabObserverDisposer.current?.()
                tabObserverDisposer.current = undefined
                observer.disconnect()
              }
            })
          }
        })

        observer.observe(editor.parentElement as HTMLElement, { childList: true })

        mutationObserver.current = observer
      },
      [application.keyboardService, controller],
    )

    if (textareaUnloading) {
      return null
    }

    return (
      <textarea
        autoComplete="off"
        dir="auto"
        id={ElementIds.NoteTextEditor}
        onChange={onTextAreaChange}
        onFocus={onContentFocus}
        onBlur={onContentBlur}
        readOnly={locked}
        ref={onRef}
        spellCheck={spellcheck}
        value={editorText}
        className={classNames(
          'editable font-editor flex-grow',
          lineHeight && `leading-${lineHeight.toLowerCase()}`,
          responsiveFontSize,
          // Extra bottom padding is added on iOS so that text
          // doesn't get hidden by the floating "Close keyboard" button
          isIOS() && '!pb-12',
        )}
      ></textarea>
    )
  },
)
