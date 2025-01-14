import {
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  ElementTransformer,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
  TextMatchTransformer,
  $convertToMarkdownString,
  $convertFromMarkdownString,
  MULTILINE_ELEMENT_TRANSFORMERS,
} from '@lexical/markdown'
import {
  $createTableCellNode,
  $createTableNode,
  $createTableRowNode,
  $isTableCellNode,
  $isTableNode,
  $isTableRowNode,
  TableCellHeaderStates,
  TableCellNode,
  TableNode,
  TableRowNode,
} from '@lexical/table'
import {
  HorizontalRuleNode,
  $createHorizontalRuleNode,
  $isHorizontalRuleNode,
} from '@lexical/react/LexicalHorizontalRuleNode'
import { $isParagraphNode, $isTextNode, LexicalNode, $createTextNode } from 'lexical'
import {
  $createRemoteImageNode,
  $isRemoteImageNode,
  RemoteImageNode,
} from './Plugins/RemoteImagePlugin/RemoteImageNode'
import { $createInlineFileNode, $isInlineFileNode, InlineFileNode } from './Plugins/InlineFilePlugin/InlineFileNode'

const HorizontalRule: ElementTransformer = {
  dependencies: [HorizontalRuleNode],
  export: (node: LexicalNode) => {
    return $isHorizontalRuleNode(node) ? '***' : null
  },
  regExp: /^(---|\*\*\*|___)\s?$/,
  replace: (parentNode, _1, _2, isImport) => {
    const line = $createHorizontalRuleNode()

    if (isImport || parentNode.getNextSibling() != null) {
      parentNode.replace(line)
    } else {
      parentNode.insertBefore(line)
    }

    line.selectNext()
  },
  type: 'element',
}

const IMAGE: TextMatchTransformer = {
  dependencies: [RemoteImageNode],
  export: (node) => {
    if (!$isRemoteImageNode(node)) {
      return null
    }

    return `![${node.__alt ? node.__alt : 'image'}](${node.__src})`
  },
  importRegExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))/,
  regExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))$/,
  replace: (textNode, match) => {
    const [, alt, src] = match
    const imageNode = $createRemoteImageNode(src, alt)
    textNode.replace(imageNode)
  },
  trigger: ')',
  type: 'text-match',
}

export const ARROW_DOUBLE: TextMatchTransformer = {
  dependencies: [],
  export: () => null,
  importRegExp: /<-> /,
  regExp: /<-> $/,
  replace: (textNode) => {
    textNode.replace($createTextNode('↔ '))
  },
  trigger: ' ',
  type: 'text-match',
}

export const ARROW_RIGHT: TextMatchTransformer = {
  dependencies: [],
  export: () => null,
  importRegExp: /-> /,
  regExp: /-> $/,
  replace: (textNode) => {
    textNode.replace($createTextNode('→ '))
  },
  trigger: ' ',
  type: 'text-match',
}

export const ARROW_LEFT: TextMatchTransformer = {
  dependencies: [],
  export: () => null,
  importRegExp: /<- /,
  regExp: /<- $/,
  replace: (textNode) => {
    textNode.replace($createTextNode('← '))
  },
  trigger: ' ',
  type: 'text-match',
}

const INLINE_FILE: TextMatchTransformer = {
  dependencies: [InlineFileNode],
  export: (node) => {
    if (!$isInlineFileNode(node)) {
      return null
    }

    return node.getTextContent()
  },
  importRegExp: /(?:\[([^[]*)\])(?:\((data:(.*);[^(]+)\))/,
  regExp: /(?:\[([^[]*)\])(?:\((data:(.*);[^(]+)\))$/,
  replace: (textNode, match) => {
    const [, name, src, mimeType] = match
    const inlineFileNode = $createInlineFileNode(src, mimeType, name)
    textNode.replace(inlineFileNode)
  },
  trigger: ')',
  type: 'text-match',
}

// Table transformer, taken from Lexical Playground
const TABLE_ROW_REG_EXP = /^(?:\|)(.+)(?:\|)\s?$/
const TABLE_ROW_DIVIDER_REG_EXP = /^(\| ?:?-*:? ?)+\|\s?$/

function getTableColumnsSize(table: TableNode) {
  const row = table.getFirstChild()
  return $isTableRowNode(row) ? row.getChildrenSize() : 0
}

function createTableCell(textContent: string): TableCellNode {
  textContent = textContent.replace(/\\n/g, '\n')
  const cell = $createTableCellNode(TableCellHeaderStates.NO_STATUS)
  $convertFromMarkdownString(textContent, MarkdownTransformers, cell)
  return cell
}

function mapToTableCells(textContent: string): Array<TableCellNode> | null {
  const match = textContent.match(TABLE_ROW_REG_EXP)
  if (!match || !match[1]) {
    return null
  }
  return match[1].split('|').map((text) => createTableCell(text))
}

export const TABLE: ElementTransformer = {
  dependencies: [TableNode, TableRowNode, TableCellNode],
  export: (node: LexicalNode) => {
    if (!$isTableNode(node)) {
      return null
    }

    const output: string[] = []

    for (const row of node.getChildren()) {
      const rowOutput = []
      if (!$isTableRowNode(row)) {
        continue
      }

      let isHeaderRow = false
      for (const cell of row.getChildren()) {
        // It's TableCellNode so it's just to make flow happy
        if ($isTableCellNode(cell)) {
          rowOutput.push($convertToMarkdownString(MarkdownTransformers, cell).replace(/\n/g, '\\n'))
          if (cell.__headerState === TableCellHeaderStates.ROW) {
            isHeaderRow = true
          }
        }
      }

      output.push(`| ${rowOutput.join(' | ')} |`)
      if (isHeaderRow) {
        output.push(`| ${rowOutput.map((_) => '---').join(' | ')} |`)
      }
    }

    return output.join('\n')
  },
  regExp: TABLE_ROW_REG_EXP,
  replace: (parentNode, _1, match) => {
    // Header row
    if (TABLE_ROW_DIVIDER_REG_EXP.test(match[0])) {
      const table = parentNode.getPreviousSibling()
      if (!table || !$isTableNode(table)) {
        return
      }

      const rows = table.getChildren()
      const lastRow = rows[rows.length - 1]
      if (!lastRow || !$isTableRowNode(lastRow)) {
        return
      }

      // Add header state to row cells
      lastRow.getChildren().forEach((cell) => {
        if (!$isTableCellNode(cell)) {
          return
        }
        cell.toggleHeaderStyle(TableCellHeaderStates.ROW)
      })

      // Remove line
      parentNode.remove()
      return
    }

    const matchCells = mapToTableCells(match[0])

    if (matchCells == null) {
      return
    }

    const rows = [matchCells]
    let sibling = parentNode.getPreviousSibling()
    let maxCells = matchCells.length

    while (sibling) {
      if (!$isParagraphNode(sibling)) {
        break
      }

      if (sibling.getChildrenSize() !== 1) {
        break
      }

      const firstChild = sibling.getFirstChild()

      if (!$isTextNode(firstChild)) {
        break
      }

      const cells = mapToTableCells(firstChild.getTextContent())

      if (cells == null) {
        break
      }

      maxCells = Math.max(maxCells, cells.length)
      rows.unshift(cells)
      const previousSibling = sibling.getPreviousSibling()
      sibling.remove()
      sibling = previousSibling
    }

    const table = $createTableNode()

    for (const cells of rows) {
      const tableRow = $createTableRowNode()
      table.append(tableRow)

      for (let i = 0; i < maxCells; i++) {
        tableRow.append(i < cells.length ? cells[i] : createTableCell(''))
      }
    }

    const previousSibling = parentNode.getPreviousSibling()
    if ($isTableNode(previousSibling) && getTableColumnsSize(previousSibling) === maxCells) {
      previousSibling.append(...table.getChildren())
      parentNode.remove()
    } else {
      parentNode.replace(table)
    }

    table.selectEnd()
  },
  type: 'element',
}

export const MarkdownTransformers = [
  TABLE,
  CHECK_LIST,
  IMAGE,
  INLINE_FILE,
  ARROW_DOUBLE,
  ARROW_RIGHT,
  ARROW_LEFT,
  ...ELEMENT_TRANSFORMERS,
  ...MULTILINE_ELEMENT_TRANSFORMERS,
  ...TEXT_FORMAT_TRANSFORMERS,
  ...TEXT_MATCH_TRANSFORMERS,
  HorizontalRule,
]
