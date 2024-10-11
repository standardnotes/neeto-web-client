import { DOMConversionMap, DOMExportOutput, EditorConfig, ElementFormatType, LexicalEditor, NodeKey } from 'lexical'
import { DecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode'
import { $createFileNode, convertToFileElement } from './FileUtils'
import FileComponent from './FileComponent'
import { SerializedFileNode } from './SerializedFileNode'
import { ItemNodeInterface } from '../../ItemNodeInterface'

export class FileNode extends DecoratorBlockNode implements ItemNodeInterface {
  __id: string
  __zoomLevel: number

  static getType(): string {
    return 'snfile'
  }

  static clone(node: FileNode): FileNode {
    return new FileNode(node.__id, node.__format, node.__key, node.__zoomLevel)
  }

  static importJSON(serializedNode: SerializedFileNode): FileNode {
    const node = $createFileNode(serializedNode.fileUuid)
    node.setFormat(serializedNode.format)
    node.setZoomLevel(serializedNode.zoomLevel)
    return node
  }

  exportJSON(): SerializedFileNode {
    return {
      ...super.exportJSON(),
      fileUuid: this.getId(),
      version: 1,
      type: 'snfile',
      zoomLevel: this.__zoomLevel,
    }
  }

  static importDOM(): DOMConversionMap<HTMLDivElement> | null {
    return {
      div: (domNode: HTMLDivElement) => {
        if (!domNode.hasAttribute('data-lexical-file-uuid')) {
          return null
        }
        return {
          conversion: convertToFileElement,
          priority: 2,
        }
      },
    }
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('span')
    element.setAttribute('data-lexical-file-uuid', this.__id)
    const text = document.createTextNode(this.getTextContent())
    element.append(text)
    return { element }
  }

  constructor(id: string, format?: ElementFormatType, key?: NodeKey, zoomLevel?: number) {
    super(format, key)
    this.__id = id
    this.__zoomLevel = zoomLevel || 100
  }

  getId(): string {
    return this.__id
  }

  getTextContent(_includeInert?: boolean | undefined, _includeDirectionless?: false | undefined): string {
    return `[File: ${this.__id}]`
  }

  setZoomLevel(zoomLevel: number): void {
    const writable = this.getWritable()
    writable.__zoomLevel = zoomLevel
  }

  decorate(_editor: LexicalEditor, config: EditorConfig): JSX.Element {
    const embedBlockTheme = config.theme.embedBlock || {}
    const className = {
      base: embedBlockTheme.base || '',
      focus: embedBlockTheme.focus || '',
    }

    return (
      <FileComponent
        className={className}
        format={this.__format}
        nodeKey={this.getKey()}
        fileUuid={this.__id}
        zoomLevel={this.__zoomLevel}
        setZoomLevel={this.setZoomLevel.bind(this)}
      />
    )
  }
}
