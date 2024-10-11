import { FocusEvent, FunctionComponent, useCallback, useState } from 'react'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { TablePlugin } from '@lexical/react/LexicalTablePlugin'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { EditorState, LexicalEditor } from 'lexical'
import HorizontalRulePlugin from './Plugins/HorizontalRulePlugin'
import TwitterPlugin from './Plugins/TwitterPlugin'
import YouTubePlugin from './Plugins/YouTubePlugin'
import AutoEmbedPlugin from './Plugins/AutoEmbedPlugin'
import CollapsiblePlugin from './Plugins/CollapsiblePlugin'
import DraggableBlockPlugin from './Plugins/DraggableBlockPlugin'
import CodeHighlightPlugin from './Plugins/CodeHighlightPlugin'
import { TabIndentationPlugin } from './Plugins/TabIndentationPlugin'
import { handleEditorChange } from './Utils'
import { SuperEditorContentId } from './Constants'
import { classNames } from '@standardnotes/utils'
import { MarkdownTransformers } from './MarkdownTransformers'
import { RemoveBrokenTablesPlugin } from './Plugins/TablePlugin'
import TableActionMenuPlugin from './Plugins/TableCellActionMenuPlugin'
import ToolbarPlugin from './Plugins/ToolbarPlugin/ToolbarPlugin'
import { useMediaQuery, MutuallyExclusiveMediaQueryBreakpoints } from '@/Hooks/useMediaQuery'
import RemoteImagePlugin from './Plugins/RemoteImagePlugin/RemoteImagePlugin'
import CodeOptionsPlugin from './Plugins/CodeOptionsPlugin/CodeOptions'
import { SuperSearchContextProvider } from './Plugins/SearchPlugin/Context'
import { SearchPlugin } from './Plugins/SearchPlugin/SearchPlugin'
import AutoLinkPlugin from './Plugins/AutoLinkPlugin/AutoLinkPlugin'
import DatetimePlugin from './Plugins/DateTimePlugin/DateTimePlugin'
import PasswordPlugin from './Plugins/PasswordPlugin/PasswordPlugin'
import { CheckListPlugin } from './Plugins/CheckListPlugin'

type BlocksEditorProps = {
  onChange?: (value: string, preview: string) => void
  className?: string
  children?: React.ReactNode
  previewLength?: number
  spellcheck?: boolean
  ignoreFirstChange?: boolean
  readonly?: boolean
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
}

export const BlocksEditor: FunctionComponent<BlocksEditorProps> = ({
  onChange,
  className,
  children,
  previewLength,
  spellcheck,
  ignoreFirstChange = false,
  readonly,
  onFocus,
  onBlur,
}) => {
  const [didIgnoreFirstChange, setDidIgnoreFirstChange] = useState(false)
  const handleChange = useCallback(
    (editorState: EditorState, _editor: LexicalEditor) => {
      if (ignoreFirstChange && !didIgnoreFirstChange) {
        setDidIgnoreFirstChange(true)
        return
      }

      editorState.read(() => {
        handleEditorChange(editorState, previewLength, onChange)
      })
    },
    [ignoreFirstChange, didIgnoreFirstChange, previewLength, onChange],
  )

  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null)

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  const isMobile = useMediaQuery(MutuallyExclusiveMediaQueryBreakpoints.sm)

  return (
    <>
      {!isMobile && <ToolbarPlugin />}
      <div className="relative min-h-0 flex-grow">
        <RichTextPlugin
          contentEditable={
            <div id="blocks-editor" className="editor-scroller h-full min-h-0">
              <div className="editor z-0 overflow-hidden" ref={onRef}>
                <ContentEditable
                  id={SuperEditorContentId}
                  className={classNames(
                    'ContentEditable__root relative overflow-y-auto p-4 text-[length:--font-size] leading-[--line-height] focus:shadow-none focus:outline-none',
                    className,
                  )}
                  spellCheck={spellcheck}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
                <div className="search-highlight-container pointer-events-none absolute left-0 top-0 h-full w-full" />
              </div>
            </div>
          }
          placeholder={
            <div className="pointer-events-none absolute left-4 top-4 text-[length:--font-size] text-passive-1">
              Type <span className="rounded bg-passive-4-opacity-variant p-0.5">/</span> for commands...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
      {isMobile && <ToolbarPlugin />}
      <ListPlugin />
      <MarkdownShortcutPlugin transformers={MarkdownTransformers} />
      <TablePlugin hasCellMerge />
      <OnChangePlugin onChange={handleChange} ignoreSelectionChange={true} />
      <HistoryPlugin />
      <HorizontalRulePlugin />
      <ClearEditorPlugin />
      <CheckListPlugin />
      <CodeHighlightPlugin />
      <LinkPlugin />
      <HashtagPlugin />
      <AutoEmbedPlugin />
      <TwitterPlugin />
      <YouTubePlugin />
      <CollapsiblePlugin />
      <TabIndentationPlugin />
      <RemoveBrokenTablesPlugin />
      <RemoteImagePlugin />
      <CodeOptionsPlugin />
      <SuperSearchContextProvider>
        <SearchPlugin />
      </SuperSearchContextProvider>
      <DatetimePlugin />
      <PasswordPlugin />
      <AutoLinkPlugin />
      {!readonly && floatingAnchorElem && (
        <>
          <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
          <TableActionMenuPlugin anchorElem={floatingAnchorElem} cellMerge />
        </>
      )}
      {children}
    </>
  )
}
