import Icon from '@/Components/Icon/Icon'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import useModal from '../../Lexical/Hooks/useModal'
import { InsertTableDialog } from '../TablePlugin'
import { getSelectedNode } from '../../Lexical/Utils/getSelectedNode'
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_NORMAL,
  FORMAT_TEXT_COMMAND,
  KEY_MODIFIER_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  createCommand,
  $isRootOrShadowRoot,
  ElementFormatType,
  $isElementNode,
  COMMAND_PRIORITY_LOW,
  $createParagraphNode,
  $isTextNode,
  $getNodeByKey,
  TextNode,
} from 'lexical'
import {
  mergeRegister,
  $findMatchingParent,
  $getNearestNodeOfType,
  $getNearestBlockElementAncestorOrThrow,
} from '@lexical/utils'
import { $isLinkNode, TOGGLE_LINK_COMMAND, LinkNode } from '@lexical/link'
import { $isListNode, ListNode } from '@lexical/list'
import { $isHeadingNode, $isQuoteNode } from '@lexical/rich-text'
import {
  ComponentPropsWithoutRef,
  ForwardedRef,
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { CenterAlignBlock, JustifyAlignBlock, LeftAlignBlock, RightAlignBlock } from '../Blocks/Alignment'
import { BulletedListBlock, ChecklistBlock, NumberedListBlock } from '../Blocks/List'
import { CodeBlock } from '../Blocks/Code'
import { CollapsibleBlock } from '../Blocks/Collapsible'
import { DividerBlock } from '../Blocks/Divider'
import { H1Block, H2Block, H3Block } from '../Blocks/Headings'
import { IndentBlock, OutdentBlock } from '../Blocks/IndentOutdent'
import { ParagraphBlock } from '../Blocks/Paragraph'
import { QuoteBlock } from '../Blocks/Quote'
import { MutuallyExclusiveMediaQueryBreakpoints, useMediaQuery } from '@/Hooks/useMediaQuery'
import { PrefKey, classNames } from '@standardnotes/snjs'
import { SUPER_TOGGLE_SEARCH, SUPER_TOGGLE_TOOLBAR } from '@standardnotes/ui-services'
import { useApplication } from '@/Components/ApplicationProvider'
import { InsertRemoteImageDialog } from '../RemoteImagePlugin/RemoteImagePlugin'
import StyledTooltip from '@/Components/StyledTooltip/StyledTooltip'
import { Toolbar, ToolbarItem, useToolbarStore } from '@ariakit/react'
import { PasswordBlock } from '../Blocks/Password'
import { URL_REGEX } from '@/Constants/Constants'
import Popover from '@/Components/Popover/Popover'
import LexicalTableOfContents from '@lexical/react/LexicalTableOfContents'
import Menu from '@/Components/Menu/Menu'
import MenuItem, { MenuItemProps } from '@/Components/Menu/MenuItem'
import { debounce, remToPx } from '@/Utils'
import LinkEditor, { $isLinkTextNode } from './LinkEditor'
import MenuItemSeparator from '@/Components/Menu/MenuItemSeparator'
import { useStateRef } from '@/Hooks/useStateRef'
import { getDOMRangeRect } from '../../Lexical/Utils/getDOMRangeRect'
import { getPositionedPopoverStyles } from '@/Components/Popover/GetPositionedPopoverStyles'
import usePreference from '@/Hooks/usePreference'
import { ElementIds } from '@/Constants/ElementIDs'
import { $isDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode'
import LinkViewer from './LinkViewer'
import { OPEN_FILE_UPLOAD_MODAL_COMMAND } from '../EncryptedFilePlugin/FilePlugin'

const TOGGLE_LINK_AND_EDIT_COMMAND = createCommand<string | null>('TOGGLE_LINK_AND_EDIT_COMMAND')

const blockTypeToBlockName = {
  bullet: 'Bulleted List',
  check: 'Check List',
  code: 'Code Block',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
}

const blockTypeToIconName = {
  bullet: 'list-bulleted',
  check: 'list-check',
  code: 'code',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  number: 'list-numbered',
  paragraph: 'paragraph',
  quote: 'quote',
}

interface ToolbarButtonProps extends ComponentPropsWithoutRef<'button'> {
  name: string
  active?: boolean
  iconName?: string
  children?: ReactNode
  onSelect: () => void
}

const ToolbarButton = forwardRef(
  (
    { name, active, iconName, children, onSelect, disabled, className, ...props }: ToolbarButtonProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    const [editor] = useLexicalComposerContext()

    const isMobile = useMediaQuery(MutuallyExclusiveMediaQueryBreakpoints.sm)
    const parentElement = editor.getRootElement()?.parentElement ?? document.body

    return (
      <StyledTooltip
        showOnMobile
        showOnHover
        label={name}
        side="top"
        portal={false}
        portalElement={isMobile ? parentElement : undefined}
        documentElement={parentElement}
      >
        <ToolbarItem
          className={classNames(
            'flex select-none items-center justify-center rounded p-0.5 focus:shadow-none focus:outline-none enabled:hover:bg-default enabled:focus-visible:bg-default disabled:opacity-50 md:border md:border-transparent enabled:hover:md:translucent-ui:border-[--popover-border-color]',
            className,
          )}
          onClick={() => {
            onSelect()
          }}
          onMouseDown={(event) => {
            event.preventDefault()
          }}
          onContextMenu={(event) => {
            editor.focus()
            event.preventDefault()
          }}
          disabled={disabled}
          ref={ref}
          {...props}
        >
          <div
            className={classNames(
              'flex items-center justify-center rounded p-2 transition-colors duration-75',
              active && 'bg-info text-info-contrast',
            )}
          >
            {children ? (
              children
            ) : iconName ? (
              <Icon
                type={iconName}
                size="custom"
                className="h-4 w-4 !text-current md:h-3.5 md:w-3.5 [&>path]:!text-current"
              />
            ) : null}
          </div>
        </ToolbarItem>
      </StyledTooltip>
    )
  },
)

interface ToolbarMenuItemProps extends Omit<MenuItemProps, 'children'> {
  name: string
  iconName: string
  active?: boolean
}

const ToolbarMenuItem = ({ name, iconName, active, onClick, ...props }: ToolbarMenuItemProps) => {
  return (
    <MenuItem
      className={classNames('overflow-hidden md:py-2', active ? '!bg-info !text-info-contrast' : 'hover:bg-contrast')}
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
      {...props}
    >
      <Icon type={iconName} className="-mt-px mr-2.5 flex-shrink-0" />
      <span className="overflow-hidden text-ellipsis whitespace-nowrap">{name}</span>
      {active && <Icon type="check" className="ml-auto" />}
    </MenuItem>
  )
}

const ToolbarPlugin = () => {
  const application = useApplication()
  const isMobile = useMediaQuery(MutuallyExclusiveMediaQueryBreakpoints.sm)

  const [modal, showModal] = useModal()

  const [editor] = useLexicalComposerContext()
  const [activeEditor, setActiveEditor] = useState(editor)
  const [isEditable, setIsEditable] = useState(() => editor.isEditable())

  const [blockType, setBlockType] = useState<keyof typeof blockTypeToBlockName>('paragraph')
  const [elementFormat, setElementFormat] = useState<ElementFormatType>('left')

  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [isSubscript, setIsSubscript] = useState(false)
  const [isSuperscript, setIsSuperscript] = useState(false)
  const [isCode, setIsCode] = useState(false)
  const [isHighlight, setIsHighlight] = useState(false)

  const [linkNode, setLinkNode] = useState<LinkNode | null>(null)
  const [linkTextNode, setLinkTextNode] = useState<TextNode | null>(null)
  const [isEditingLink, setIsEditingLink] = useState(false)

  const [isTOCOpen, setIsTOCOpen] = useState(false)
  const tocAnchorRef = useRef<HTMLButtonElement>(null)

  const [isTextFormatMenuOpen, setIsTextFormatMenuOpen] = useState(false)
  const textFormatAnchorRef = useRef<HTMLButtonElement>(null)

  const [isTextStyleMenuOpen, setIsTextStyleMenuOpen] = useState(false)
  const textStyleAnchorRef = useRef<HTMLButtonElement>(null)

  const [isAlignmentMenuOpen, setIsAlignmentMenuOpen] = useState(false)
  const alignmentAnchorRef = useRef<HTMLButtonElement>(null)

  const [isInsertMenuOpen, setIsInsertMenuOpen] = useState(false)
  const insertAnchorRef = useRef<HTMLButtonElement>(null)

  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  const alwaysShowToolbar = usePreference(PrefKey.AlwaysShowSuperToolbar)

  const [isToolbarFixedToTop, setIsToolbarFixedToTop] = useState(alwaysShowToolbar)
  const isToolbarFixedRef = useStateRef(isToolbarFixedToTop)

  const updateToolbarFloatingPosition = useCallback(() => {
    const selection = $getSelection()
    if (!$isRangeSelection(selection)) {
      return
    }

    if (isMobile) {
      return
    }

    if (isToolbarFixedRef.current) {
      return
    }

    const containerElement = containerRef.current

    if (!containerElement) {
      return
    }

    if (selection.getTextContent() === '') {
      containerElement.style.removeProperty('display')
      return
    }

    const nativeSelection = window.getSelection()
    const rootElement = activeEditor.getRootElement()

    if (nativeSelection !== null && rootElement !== null && rootElement.contains(nativeSelection.anchorNode)) {
      const rangeRect = getDOMRangeRect(nativeSelection, rootElement)
      const containerRect = containerElement.getBoundingClientRect()
      const rootRect = rootElement.getBoundingClientRect()

      const calculatedStyles = getPositionedPopoverStyles({
        align: 'start',
        side: 'top',
        anchorRect: rangeRect,
        popoverRect: containerRect,
        documentRect: rootRect,
        offset: 8,
        maxHeightFunction: () => 'none',
      })

      if (calculatedStyles) {
        Object.entries(calculatedStyles).forEach(([key, value]) => {
          if (key === 'transform') {
            return
          }
          containerElement.style.setProperty(key, value)
        })
        containerElement.style.setProperty('display', 'block')
      }
    }
  }, [activeEditor, isMobile, isToolbarFixedRef])

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if (!$isRangeSelection(selection)) {
      return
    }

    const anchorNode = selection.anchor.getNode()
    const focusNode = selection.focus.getNode()
    const isAnchorSameAsFocus = anchorNode === focusNode
    let element =
      anchorNode.getKey() === 'root'
        ? anchorNode
        : $findMatchingParent(anchorNode, (e) => {
            const parent = e.getParent()
            return parent !== null && $isRootOrShadowRoot(parent)
          })

    if (element === null) {
      element = anchorNode.getTopLevelElementOrThrow()
    }

    const elementKey = element.getKey()
    const elementDOM = activeEditor.getElementByKey(elementKey)

    // Update text format
    setIsBold(selection.hasFormat('bold'))
    setIsItalic(selection.hasFormat('italic'))
    setIsUnderline(selection.hasFormat('underline'))
    setIsStrikethrough(selection.hasFormat('strikethrough'))
    setIsSubscript(selection.hasFormat('subscript'))
    setIsSuperscript(selection.hasFormat('superscript'))
    setIsCode(selection.hasFormat('code'))
    setIsHighlight(selection.hasFormat('highlight'))

    // Update links
    const node = getSelectedNode(selection)
    const parent = node.getParent()
    setIsEditingLink(false)
    if ($isLinkNode(node) && isAnchorSameAsFocus) {
      setLinkNode(node)
    } else if ($isLinkNode(parent) && isAnchorSameAsFocus) {
      setLinkNode(parent)
    } else {
      setLinkNode(null)
    }
    if ($isLinkTextNode(node, selection)) {
      setLinkTextNode(node)
    } else {
      setLinkTextNode(null)
    }

    if (elementDOM !== null) {
      if ($isListNode(element)) {
        const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode)
        const type = parentList ? parentList.getListType() : element.getListType()
        setBlockType(type)
      } else {
        const type = $isHeadingNode(element) ? element.getTag() : element.getType()
        if (type in blockTypeToBlockName) {
          setBlockType(type as keyof typeof blockTypeToBlockName)
        }
      }
    }

    setElementFormat(($isElementNode(node) ? node.getFormatType() : parent?.getFormatType()) || 'left')

    updateToolbarFloatingPosition()
  }, [activeEditor, updateToolbarFloatingPosition])

  const clearContainerFloatingStyles = useCallback(() => {
    const containerElement = containerRef.current
    if (!containerElement) {
      return
    }
    containerElement.style.removeProperty('--translate-x')
    containerElement.style.removeProperty('--translate-y')
    containerElement.style.removeProperty('transform')
    containerElement.style.removeProperty('transform-origin')
    containerElement.style.removeProperty('opacity')
  }, [])

  const clearFormatting = useCallback(() => {
    activeEditor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const anchor = selection.anchor
        const focus = selection.focus
        const nodes = selection.getNodes()

        if (anchor.key === focus.key && anchor.offset === focus.offset) {
          return
        }

        nodes.forEach((node, idx) => {
          // We split the first and last node by the selection
          // So that we don't format unselected text inside those nodes
          if ($isTextNode(node)) {
            // Use a separate variable to ensure TS does not lose the refinement
            let textNode = node
            if (idx === 0 && anchor.offset !== 0) {
              textNode = textNode.splitText(anchor.offset)[1] || textNode
            }
            if (idx === nodes.length - 1) {
              textNode = textNode.splitText(focus.offset)[0] || textNode
            }

            if (textNode.__style !== '') {
              textNode.setStyle('')
            }
            if (textNode.__format !== 0) {
              textNode.setFormat(0)
              $getNearestBlockElementAncestorOrThrow(textNode).setFormat('')
            }
            node = textNode
          } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
            node.replace($createParagraphNode(), true)
          } else if ($isDecoratorBlockNode(node)) {
            node.setFormat('')
          }
        })
      }
    })
  }, [activeEditor])

  useEffect(() => {
    if (isMobile) {
      return
    }

    const scrollerElem = activeEditor.getRootElement()

    const update = () => {
      activeEditor.getEditorState().read(() => {
        updateToolbarFloatingPosition()
      })
    }
    const debouncedUpdate = debounce(update, 50)

    window.addEventListener('resize', debouncedUpdate)
    if (scrollerElem) {
      scrollerElem.addEventListener('scroll', debouncedUpdate)
    }

    return () => {
      window.removeEventListener('resize', debouncedUpdate)
      if (scrollerElem) {
        scrollerElem.removeEventListener('scroll', debouncedUpdate)
      }
    }
  }, [activeEditor, isMobile, updateToolbarFloatingPosition])

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable)
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          $updateToolbar()
          setActiveEditor(newEditor)
          return false
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    )
  }, [editor, $updateToolbar])

  useEffect(() => {
    return mergeRegister(
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar()
        })
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload)
          return false
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload)
          return false
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      activeEditor.registerCommand(
        TOGGLE_LINK_AND_EDIT_COMMAND,
        (payload) => {
          if (payload === null) {
            setIsEditingLink(false)
            return activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
          } else {
            setIsEditingLink(true)
            return true
          }
          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
    )
  }, [$updateToolbar, activeEditor])

  useEffect(() => {
    return activeEditor.registerCommand(
      KEY_MODIFIER_COMMAND,
      (payload) => {
        const event: KeyboardEvent = payload
        const { code, ctrlKey, metaKey, shiftKey } = event

        if (code === 'KeyK' && (ctrlKey || metaKey) && !shiftKey) {
          event.preventDefault()
          if ('readText' in navigator.clipboard) {
            navigator.clipboard
              .readText()
              .then((text) => {
                if (URL_REGEX.test(text)) {
                  activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, text)
                } else {
                  throw new Error('Not a valid URL')
                }
              })
              .catch((error) => {
                console.error(error)
                activeEditor.dispatchCommand(TOGGLE_LINK_AND_EDIT_COMMAND, '')
              })
          } else {
            activeEditor.dispatchCommand(TOGGLE_LINK_AND_EDIT_COMMAND, '')
          }
          return true
        }

        return false
      },
      COMMAND_PRIORITY_NORMAL,
    )
  }, [activeEditor])

  const dismissButtonRef = useRef<HTMLButtonElement>(null)

  const [isFocusInEditor, setIsFocusInEditor] = useState(false)
  const [isFocusInToolbar, setIsFocusInToolbar] = useState(false)
  const canShowToolbarOnMobile = isFocusInEditor || isFocusInToolbar
  const canShowAllItems = isMobile || isToolbarFixedToTop

  useEffect(() => {
    const container = containerRef.current
    const rootElement = editor.getRootElement()

    if (!rootElement) {
      return
    }

    const handleToolbarFocus = () => setIsFocusInToolbar(true)
    const handleToolbarBlur = () => setIsFocusInToolbar(false)

    const handleRootFocus = () => setIsFocusInEditor(true)
    const handleRootBlur = (event: FocusEvent) => {
      const elementToBeFocused = event.relatedTarget as Node
      const containerContainsElementToFocus = container?.contains(elementToBeFocused)
      const linkEditorContainsElementToFocus = document
        .getElementById(ElementIds.SuperEditor)
        ?.contains(elementToBeFocused)
      const willFocusDismissButton = dismissButtonRef.current === elementToBeFocused
      if ((containerContainsElementToFocus || linkEditorContainsElementToFocus) && !willFocusDismissButton) {
        return
      }
      setIsFocusInEditor(false)
    }

    rootElement.addEventListener('focus', handleRootFocus)
    rootElement.addEventListener('blur', handleRootBlur)

    if (container) {
      container.addEventListener('focus', handleToolbarFocus)
      container.addEventListener('blur', handleToolbarBlur)
    }

    return () => {
      rootElement.removeEventListener('focus', handleRootFocus)
      rootElement.removeEventListener('blur', handleRootBlur)
      container?.removeEventListener('focus', handleToolbarFocus)
      container?.removeEventListener('blur', handleToolbarBlur)
    }
  }, [editor])

  const toolbarRef = useRef<HTMLDivElement>(null)
  const toolbarStore = useToolbarStore()
  useEffect(() => {
    return application.keyboardService.addCommandHandler({
      command: SUPER_TOGGLE_TOOLBAR,
      category: 'Super notes',
      description: 'Toggle Super note toolbar',
      onKeyDown(event) {
        if (isMobile) {
          return
        }
        if (!alwaysShowToolbar) {
          return
        }

        event.preventDefault()

        if (!isToolbarFixedToTop) {
          setIsToolbarFixedToTop(true)
          clearContainerFloatingStyles()
          toolbarStore.move(toolbarStore.first())
          return
        } else {
          setIsToolbarFixedToTop(false)
          editor.focus()
        }
      },
    })
  }, [
    alwaysShowToolbar,
    application.keyboardService,
    clearContainerFloatingStyles,
    editor,
    isMobile,
    isToolbarFixedToTop,
    toolbarStore,
  ])

  const popoverDocumentElement =
    document.getElementById(ElementIds.SuperEditor) ?? editor.getRootElement()?.parentElement ?? document.body

  return (
    <>
      {modal}
      <div
        className={classNames(
          'bg-contrast',
          !isEditable ? 'hidden opacity-0' : '',
          isMobile && !canShowToolbarOnMobile ? 'hidden' : '',
          !isMobile && 'border-b border-border bg-default',
          !isMobile
            ? !isToolbarFixedToTop
              ? 'fixed left-0 top-0 z-tooltip hidden translate-x-[--translate-x] translate-y-[--translate-y] rounded border py-0.5 translucent-ui:border-[--popover-border-color] translucent-ui:bg-[--popover-background-color] translucent-ui:[backdrop-filter:var(--popover-backdrop-filter)]'
              : 'w-full px-1 py-1'
            : '',
        )}
        id="super-mobile-toolbar"
        ref={containerRef}
      >
        {linkNode && !isEditingLink && (
          <LinkViewer
            key={linkNode.__key}
            linkNode={linkNode}
            isMobile={isMobile}
            setIsEditingLink={setIsEditingLink}
            editor={activeEditor}
          />
        )}
        {isEditingLink && (
          <LinkEditor
            editor={activeEditor}
            setIsEditingLink={setIsEditingLink}
            isMobile={isMobile}
            linkNode={linkNode}
            linkTextNode={linkTextNode}
          />
        )}
        <div className="flex w-full flex-shrink-0 border-t border-border md:border-0">
          <Toolbar
            className="super-toolbar flex items-center gap-1 overflow-x-auto px-1 md:flex-wrap"
            ref={toolbarRef}
            store={toolbarStore}
          >
            {canShowAllItems && (
              <>
                <ToolbarButton
                  name="Table of Contents"
                  iconName="toc"
                  active={isTOCOpen}
                  onSelect={() => setIsTOCOpen(!isTOCOpen)}
                  ref={tocAnchorRef}
                />
                <ToolbarButton
                  name="Search"
                  iconName="search"
                  onSelect={() => application.keyboardService.triggerCommand(SUPER_TOGGLE_SEARCH)}
                />
                <ToolbarButton
                  name="Undo"
                  iconName="undo"
                  disabled={!canUndo}
                  onSelect={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
                />
                <ToolbarButton
                  name="Redo"
                  iconName="redo"
                  disabled={!canRedo}
                  onSelect={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
                />
              </>
            )}
            <ToolbarButton
              name="Formatting options"
              onSelect={() => {
                setIsTextStyleMenuOpen(!isTextStyleMenuOpen)
              }}
              ref={textStyleAnchorRef}
              className={isTextStyleMenuOpen ? 'md:bg-default' : ''}
            >
              <Icon type={blockTypeToIconName[blockType]} size="custom" className="h-4 w-4 md:h-3.5 md:w-3.5" />
              <Icon type="chevron-down" size="custom" className="ml-2 h-4 w-4 md:h-3.5 md:w-3.5" />
            </ToolbarButton>
            <ToolbarButton
              name="Bold"
              iconName="bold"
              active={isBold}
              onSelect={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
            />
            <ToolbarButton
              name="Italic"
              iconName="italic"
              active={isItalic}
              onSelect={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
            />
            <ToolbarButton
              name="Underline"
              iconName="underline"
              active={isUnderline}
              onSelect={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
            />
            <ToolbarButton
              name="Link"
              iconName="link"
              active={!!linkNode}
              onSelect={() => {
                editor.dispatchCommand(TOGGLE_LINK_AND_EDIT_COMMAND, '')
              }}
            />
            <ToolbarButton
              name="Inline Code"
              iconName="code-tags"
              active={isCode}
              onSelect={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
            />
            <ToolbarButton
              name="Text style"
              onSelect={() => {
                setIsTextFormatMenuOpen(!isTextFormatMenuOpen)
              }}
              ref={textFormatAnchorRef}
              className={isTextFormatMenuOpen ? 'md:bg-default' : ''}
            >
              <Icon type="text" size="custom" className="h-4 w-4 md:h-3.5 md:w-3.5" />
              <Icon type="chevron-down" size="custom" className="ml-1 h-4 w-4 md:h-3.5 md:w-3.5" />
            </ToolbarButton>
            <ToolbarButton
              name="Alignment"
              onSelect={() => {
                setIsAlignmentMenuOpen(!isAlignmentMenuOpen)
              }}
              ref={alignmentAnchorRef}
              className={isAlignmentMenuOpen ? 'md:bg-default' : ''}
            >
              <Icon type="align-left" size="custom" className="h-4 w-4 md:h-3.5 md:w-3.5" />
              <Icon type="chevron-down" size="custom" className="ml-2 h-4 w-4 md:h-3.5 md:w-3.5" />
            </ToolbarButton>
            <ToolbarButton
              name={IndentBlock.name}
              iconName={IndentBlock.iconName}
              onSelect={() => IndentBlock.onSelect(editor)}
            />
            <ToolbarButton
              name={OutdentBlock.name}
              iconName={OutdentBlock.iconName}
              onSelect={() => OutdentBlock.onSelect(editor)}
            />
            {canShowAllItems && (
              <ToolbarButton
                name="Insert"
                onSelect={() => {
                  setIsInsertMenuOpen(!isInsertMenuOpen)
                }}
                ref={insertAnchorRef}
                className={isInsertMenuOpen ? 'md:bg-default' : ''}
              >
                <Icon type="add" size="custom" className="h-4 w-4 md:h-3.5 md:w-3.5" />
                <Icon type="chevron-down" size="custom" className="ml-2 h-4 w-4 md:h-3.5 md:w-3.5" />
              </ToolbarButton>
            )}
          </Toolbar>
          {isMobile && (
            <button
              className="flex flex-shrink-0 items-center justify-center rounded border-l border-border px-3 py-3"
              aria-label="Dismiss keyboard"
              ref={dismissButtonRef}
            >
              <Icon type="keyboard-close" size="medium" />
            </button>
          )}
        </div>
      </div>
      <Popover
        title="Table of contents"
        anchorElement={tocAnchorRef}
        open={isTOCOpen}
        togglePopover={() => setIsTOCOpen(!isTOCOpen)}
        side={isMobile ? 'top' : 'bottom'}
        align="start"
        className="py-1"
        disableMobileFullscreenTakeover
        disableFlip
        disableApplyingMobileWidth
        portal={false}
        documentElement={popoverDocumentElement}
      >
        <div className="mb-1.5 mt-1 px-3 text-sm font-semibold uppercase text-text">Table of Contents</div>
        <LexicalTableOfContents>
          {(tableOfContents) => {
            if (!tableOfContents.length) {
              return <div className="py-2 text-center">No headings found</div>
            }

            return (
              <Menu a11yLabel="Table of contents" className="!px-0">
                {tableOfContents.map(([key, text, tag]) => {
                  const level = parseInt(tag.slice(1)) || 1
                  if (level > 3) {
                    return null
                  }
                  return (
                    <MenuItem
                      key={key}
                      className="overflow-hidden md:py-2"
                      onClick={() => {
                        setIsTOCOpen(false)
                        editor.update(() => {
                          const node = $getNodeByKey(key)
                          if (!node) {
                            return
                          }
                          node.selectEnd()
                          editor.focus()
                          const domElement = editor.getElementByKey(key)
                          if (!domElement) {
                            return
                          }
                          setTimeout(() => {
                            domElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          }, 1)
                        })
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                      style={{
                        paddingLeft: `${(level - 1) * remToPx(1) + remToPx(0.75)}px`,
                      }}
                    >
                      <Icon type={tag} className="-mt-px mr-2.5 flex-shrink-0" />
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap">{text}</span>
                    </MenuItem>
                  )
                })}
              </Menu>
            )
          }}
        </LexicalTableOfContents>
      </Popover>
      <Popover
        title="Text formatting options"
        anchorElement={textFormatAnchorRef}
        open={isTextFormatMenuOpen}
        togglePopover={() => setIsTextFormatMenuOpen(!isTextFormatMenuOpen)}
        side={isMobile ? 'top' : 'bottom'}
        align="start"
        className="py-1"
        disableMobileFullscreenTakeover
        disableFlip
        containerClassName="md:!min-w-60 md:!w-auto"
        portal={false}
        documentElement={popoverDocumentElement}
      >
        <Menu a11yLabel="Text formatting options" className="!px-0" onClick={() => setIsTextFormatMenuOpen(false)}>
          <ToolbarMenuItem
            name="Highlight"
            iconName="draw"
            active={isHighlight}
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'highlight')}
          />
          <ToolbarMenuItem
            name="Strikethrough"
            iconName="strikethrough"
            active={isStrikethrough}
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
          />
          <ToolbarMenuItem
            name="Subscript"
            iconName="subscript"
            active={isSubscript}
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript')}
          />
          <ToolbarMenuItem
            name="Superscript"
            iconName="superscript"
            active={isSuperscript}
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript')}
          />
          <ToolbarMenuItem name="Clear formatting" iconName="trash" onClick={clearFormatting} />
        </Menu>
      </Popover>
      <Popover
        title="Block style"
        anchorElement={textStyleAnchorRef}
        open={isTextStyleMenuOpen}
        togglePopover={() => setIsTextStyleMenuOpen(!isTextStyleMenuOpen)}
        side={isMobile ? 'top' : 'bottom'}
        align="start"
        className="py-1"
        disableMobileFullscreenTakeover
        disableFlip
        containerClassName="md:!min-w-60 md:!w-auto"
        portal={false}
        documentElement={popoverDocumentElement}
      >
        <Menu a11yLabel="Block style" className="!px-0" onClick={() => setIsTextStyleMenuOpen(false)}>
          <ToolbarMenuItem
            name="Normal"
            iconName="paragraph"
            active={blockType === 'paragraph'}
            onClick={() => ParagraphBlock.onSelect(editor)}
          />
          <ToolbarMenuItem
            name="Heading 1"
            iconName="h1"
            active={blockType === 'h1'}
            onClick={() => H1Block.onSelect(editor)}
          />
          <ToolbarMenuItem
            name="Heading 2"
            iconName="h2"
            active={blockType === 'h2'}
            onClick={() => H2Block.onSelect(editor)}
          />
          <ToolbarMenuItem
            name="Heading 3"
            iconName="h3"
            active={blockType === 'h3'}
            onClick={() => H3Block.onSelect(editor)}
          />
          <MenuItemSeparator />
          <ToolbarMenuItem
            name="Bulleted List"
            iconName="list-bulleted"
            active={blockType === 'bullet'}
            onClick={() => BulletedListBlock.onSelect(editor)}
          />
          <ToolbarMenuItem
            name="Numbered List"
            iconName="list-numbered"
            active={blockType === 'number'}
            onClick={() => NumberedListBlock.onSelect(editor)}
          />
          <ToolbarMenuItem
            name="Check List"
            iconName="list-check"
            active={blockType === 'check'}
            onClick={() => ChecklistBlock.onSelect(editor)}
          />
          <MenuItemSeparator />
          <ToolbarMenuItem
            name="Quote"
            iconName="quote"
            active={blockType === 'quote'}
            onClick={() => QuoteBlock.onSelect(editor)}
          />
          <ToolbarMenuItem
            name="Code Block"
            iconName="code"
            active={blockType === 'code'}
            onClick={() => CodeBlock.onSelect(editor)}
          />
        </Menu>
      </Popover>
      <Popover
        title="Alignment"
        anchorElement={alignmentAnchorRef}
        open={isAlignmentMenuOpen}
        togglePopover={() => setIsAlignmentMenuOpen(!isAlignmentMenuOpen)}
        side={isMobile ? 'top' : 'bottom'}
        align="start"
        className="py-1"
        disableMobileFullscreenTakeover
        disableFlip
        containerClassName="md:!min-w-60 md:!w-auto"
        portal={false}
        documentElement={popoverDocumentElement}
      >
        <Menu a11yLabel="Alignment" className="!px-0" onClick={() => setIsAlignmentMenuOpen(false)}>
          <ToolbarMenuItem
            name="Left align"
            iconName="align-left"
            active={elementFormat === 'left'}
            onClick={() => LeftAlignBlock.onSelect(editor)}
          />
          <ToolbarMenuItem
            name="Center align"
            iconName="align-center"
            active={elementFormat === 'center'}
            onClick={() => CenterAlignBlock.onSelect(editor)}
          />
          <ToolbarMenuItem
            name="Right align"
            iconName="align-right"
            active={elementFormat === 'right'}
            onClick={() => RightAlignBlock.onSelect(editor)}
          />
          <ToolbarMenuItem
            name="Justify"
            iconName="align-justify"
            active={elementFormat === 'justify'}
            onClick={() => JustifyAlignBlock.onSelect(editor)}
          />
        </Menu>
      </Popover>
      <Popover
        title="Insert"
        anchorElement={insertAnchorRef}
        open={isInsertMenuOpen}
        togglePopover={() => setIsInsertMenuOpen(!isInsertMenuOpen)}
        side={isMobile ? 'top' : 'bottom'}
        align="start"
        className="py-1"
        disableMobileFullscreenTakeover
        disableFlip
        containerClassName="md:!min-w-60 md:!w-auto"
        portal={false}
        documentElement={popoverDocumentElement}
      >
        <Menu a11yLabel="Insert" className="!px-0" onClick={() => setIsInsertMenuOpen(false)}>
          <ToolbarMenuItem
            name="Table"
            iconName="table"
            onClick={() =>
              showModal('Insert Table', (onClose) => <InsertTableDialog activeEditor={editor} onClose={onClose} />)
            }
          />
          <ToolbarMenuItem
            name="Upload file"
            iconName="file"
            onClick={() => activeEditor.dispatchCommand(OPEN_FILE_UPLOAD_MODAL_COMMAND, undefined)}
          />
          <ToolbarMenuItem
            name="Image from URL"
            iconName="image"
            onClick={() =>
              showModal('Insert image from URL', (onClose) => <InsertRemoteImageDialog onClose={onClose} />)
            }
          />
          <ToolbarMenuItem
            name={DividerBlock.name}
            iconName={DividerBlock.iconName}
            onClick={() => DividerBlock.onSelect(editor)}
          />
          <ToolbarMenuItem
            name={CollapsibleBlock.name}
            iconName={CollapsibleBlock.iconName}
            onClick={() => CollapsibleBlock.onSelect(editor)}
          />
          <ToolbarMenuItem
            name={PasswordBlock.name}
            iconName={PasswordBlock.iconName}
            onClick={() => PasswordBlock.onSelect(editor)}
          />
        </Menu>
      </Popover>
    </>
  )
}

export default ToolbarPlugin
