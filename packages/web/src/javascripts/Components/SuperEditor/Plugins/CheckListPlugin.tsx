import { $isListItemNode, INSERT_CHECK_LIST_COMMAND, insertList, ListNode } from '@lexical/list'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { calculateZoomLevel, isHTMLElement, mergeRegister } from '@lexical/utils'
import {
  $getNearestNodeFromDOMNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  KEY_ENTER_COMMAND,
} from 'lexical'
import { useEffect } from 'react'
import { useApplication } from '../../ApplicationProvider'
import { getPrimaryModifier } from '@standardnotes/ui-services'

export function CheckListPlugin(): null {
  const application = useApplication()
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    const primaryModifier = getPrimaryModifier(application.platform)

    return mergeRegister(
      editor.registerCommand(
        INSERT_CHECK_LIST_COMMAND,
        () => {
          insertList(editor, 'check')
          return true
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerRootListener((rootElement, prevElement) => {
        function handleCheckItemEvent(event: PointerEvent, callback: () => void) {
          const target = event.target

          if (target === null || !isHTMLElement(target)) {
            return
          }

          // Ignore clicks on LI that have nested lists
          const firstChild = target.firstChild

          if (
            firstChild != null &&
            isHTMLElement(firstChild) &&
            (firstChild.tagName === 'UL' || firstChild.tagName === 'OL')
          ) {
            return
          }

          const parentNode = target.parentNode
          // @ts-expect-error internal field
          if (!parentNode || parentNode.__lexicalListType !== 'check') {
            return
          }

          editor.getRootElement()?.focus()

          const rect = target.getBoundingClientRect()

          const listItemElementStyles = getComputedStyle(target)
          const paddingLeft = parseFloat(listItemElementStyles.paddingLeft) || 0
          const paddingRight = parseFloat(listItemElementStyles.paddingRight) || 0
          const lineHeight = parseFloat(listItemElementStyles.lineHeight) || 0

          const checkStyles = getComputedStyle(target, ':before')
          const checkWidth = parseFloat(checkStyles.width) || 0

          const pageX = event.pageX / calculateZoomLevel(target)

          const isWithinHorizontalThreshold =
            target.dir === 'rtl'
              ? pageX < rect.right && pageX > rect.right - paddingRight
              : pageX > rect.left && pageX < rect.left + (checkWidth || paddingLeft)

          const isWithinVerticalThreshold = event.clientY > rect.top && event.clientY < rect.top + lineHeight

          if (isWithinHorizontalThreshold && isWithinVerticalThreshold) {
            callback()
          }
        }

        function handleClick(event: Event) {
          handleCheckItemEvent(event as PointerEvent, () => {
            if (!editor.isEditable()) {
              return
            }

            editor.update(() => {
              const domNode = event.target as HTMLElement

              if (!event.target) {
                return
              }

              const node = $getNearestNodeFromDOMNode(domNode)

              if (!$isListItemNode(node)) {
                return
              }

              node.toggleChecked()
            })
          })
        }

        function handlePointerDown(event: PointerEvent) {
          handleCheckItemEvent(event, () => {
            // Prevents caret moving when clicking on check mark
            event.preventDefault()
          })
        }

        if (rootElement !== null) {
          rootElement.addEventListener('click', handleClick)
          rootElement.addEventListener('pointerdown', handlePointerDown)
        }

        if (prevElement !== null) {
          prevElement.removeEventListener('click', handleClick)
          prevElement.removeEventListener('pointerdown', handlePointerDown)
        }
      }),
      editor.registerCommand(
        KEY_ENTER_COMMAND,
        () => {
          if (!application.keyboardService.activeModifiers.has(primaryModifier)) {
            return false
          }
          const selection = $getSelection()
          if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
            return false
          }
          const focusNode = selection.focus.getNode()
          const parent = focusNode.getParent()
          const node = $isListItemNode(parent) ? parent : focusNode
          if (!$isListItemNode(node) || node.getParent<ListNode>()?.getListType() !== 'check') {
            return false
          }
          node.toggleChecked()
          return true
        },
        COMMAND_PRIORITY_LOW,
      ),
      application.keyboardService.registerExternalKeyboardShortcutHelpItem({
        platform: application.platform,
        modifiers: [primaryModifier],
        key: 'Enter',
        category: 'Super notes',
        description: 'Toggle checklist item',
      }),
    )
  }, [application.keyboardService, application.platform, editor])

  return null
}
