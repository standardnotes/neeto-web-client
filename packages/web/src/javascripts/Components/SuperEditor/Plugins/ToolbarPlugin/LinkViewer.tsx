import Icon from '@/Components/Icon/Icon'
import { getPositionedPopoverStyles } from '@/Components/Popover/GetPositionedPopoverStyles'
import { getAdjustedStylesForNonPortalPopover } from '@/Components/Popover/Utils/getAdjustedStylesForNonPortal'
import StyledTooltip from '@/Components/StyledTooltip/StyledTooltip'
import { useElementResize } from '@/Hooks/useElementRect'
import { $isAutoLinkNode, LinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { mergeRegister } from '@lexical/utils'
import { classNames } from '@standardnotes/snjs'
import { COMMAND_PRIORITY_LOW, LexicalEditor, SELECTION_CHANGE_COMMAND } from 'lexical'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { getDOMRangeRect } from '../../Lexical/Utils/getDOMRangeRect'
import { ElementIds } from '@/Constants/ElementIDs'
import { createPortal } from 'react-dom'

type Props = {
  linkNode: LinkNode
  editor: LexicalEditor
  isMobile: boolean
  setIsEditingLink: (isEditingLink: boolean) => void
}

const LinkViewer = ({ isMobile, editor, linkNode, setIsEditingLink }: Props) => {
  const linkViewerRef = useRef<HTMLDivElement>(null)

  const [linkUrl, isAutoLink] = useMemo(() => {
    let linkUrl = ''
    let isAutoLink = false
    editor.getEditorState().read(() => {
      linkUrl = linkNode.getURL()
      isAutoLink = $isAutoLinkNode(linkNode)
    })
    return [linkUrl, isAutoLink]
  }, [editor, linkNode])

  const linkNodeDOM = useMemo(() => {
    return editor.getElementByKey(linkNode.getKey())
  }, [editor, linkNode])

  const rangeRect = useRef<DOMRect>()
  const updateLinkEditorPosition = useCallback(() => {
    if (isMobile) {
      return
    }

    const nativeSelection = window.getSelection()
    const rootElement = editor.getRootElement()

    if (nativeSelection !== null && rootElement !== null) {
      if (rootElement.contains(nativeSelection.anchorNode)) {
        rangeRect.current = getDOMRangeRect(nativeSelection, rootElement)
      }
    }

    const linkEditorElement = linkViewerRef.current

    if (!linkEditorElement) {
      setTimeout(updateLinkEditorPosition)
      return
    }

    if (!rootElement) {
      return
    }

    if (!linkNodeDOM) {
      return
    }

    const linkEditorRect = linkEditorElement.getBoundingClientRect()
    const rootElementRect = rootElement.getBoundingClientRect()
    const linkNodeRect = linkNodeDOM.getBoundingClientRect()

    const calculatedStyles = getPositionedPopoverStyles({
      align: 'center',
      side: 'top',
      anchorRect: linkNodeRect,
      popoverRect: linkEditorRect,
      documentRect: rootElementRect,
      offset: 12,
      maxHeightFunction: () => 'none',
    })
    if (calculatedStyles) {
      const adjustedStyles = getAdjustedStylesForNonPortalPopover(linkEditorElement, calculatedStyles)
      Object.entries(adjustedStyles).forEach(([key, value]) => {
        linkEditorElement.style.setProperty(key, value)
      })
      linkEditorElement.style.opacity = '1'
    }
  }, [editor, isMobile, linkNodeDOM])

  useElementResize(linkViewerRef.current, updateLinkEditorPosition)

  useEffect(() => {
    updateLinkEditorPosition()

    return mergeRegister(
      editor.registerUpdateListener(() => {
        updateLinkEditorPosition()
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload) => {
          updateLinkEditorPosition()
          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
    )
  }, [editor, updateLinkEditorPosition])

  if (!linkUrl) {
    return null
  }

  return createPortal(
    <div
      className={classNames(
        'absolute z-dropdown-menu rounded-lg border border-border bg-contrast px-2 py-1 shadow-sm shadow-contrast',
        isMobile
          ? 'bottom-12 left-1/2 w-[calc(100%_-_1rem)] -translate-x-1/2'
          : 'left-0 top-0 w-auto translate-x-0 opacity-0 translucent-ui:border-[--popover-border-color] translucent-ui:bg-[--popover-background-color] translucent-ui:[backdrop-filter:var(--popover-backdrop-filter)]',
      )}
      ref={linkViewerRef}
    >
      <div className="flex items-center gap-1">
        <a
          className={classNames(
            'mr-1 flex flex-grow items-center gap-2 overflow-hidden whitespace-nowrap underline',
            isAutoLink && 'py-2.5',
          )}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon type="open-in" className="ml-1 flex-shrink-0" />
          <div className="max-w-[35ch] overflow-hidden text-ellipsis">{linkUrl}</div>
        </a>
        <StyledTooltip showOnMobile showOnHover label="Copy link">
          <button
            className="flex select-none items-center justify-center rounded p-2 enabled:hover:bg-default disabled:opacity-50 md:border md:border-transparent enabled:hover:md:translucent-ui:border-[--popover-border-color]"
            onClick={() => {
              navigator.clipboard.writeText(linkUrl).catch(console.error)
            }}
            onMouseDown={(event) => event.preventDefault()}
          >
            <Icon type="copy" size="medium" />
          </button>
        </StyledTooltip>
        {!isAutoLink && (
          <>
            <StyledTooltip showOnMobile showOnHover label="Edit link">
              <button
                className="flex select-none items-center justify-center rounded p-2 enabled:hover:bg-default disabled:opacity-50 md:border md:border-transparent enabled:hover:md:translucent-ui:border-[--popover-border-color]"
                onClick={() => {
                  setIsEditingLink(true)
                }}
                onMouseDown={(event) => event.preventDefault()}
              >
                <Icon type="pencil-filled" size="medium" />
              </button>
            </StyledTooltip>
            <StyledTooltip showOnMobile showOnHover label="Remove link">
              <button
                className="flex select-none items-center justify-center rounded p-2 enabled:hover:bg-default disabled:opacity-50 md:border md:border-transparent enabled:hover:md:translucent-ui:border-[--popover-border-color]"
                onClick={() => {
                  editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
                }}
                onMouseDown={(event) => event.preventDefault()}
              >
                <Icon type="trash-filled" size="medium" />
              </button>
            </StyledTooltip>
          </>
        )}
      </div>
    </div>,
    document.getElementById(ElementIds.SuperEditor) ?? document.body,
  )
}

export default LinkViewer
