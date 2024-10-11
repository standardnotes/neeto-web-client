import { DecoratorBlockNode, SerializedDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode'
import { parseAndCreateZippableFileName } from '@standardnotes/utils'
import { DOMExportOutput, Spread } from 'lexical'

type SerializedFileExportNode = Spread<
  {
    version: 1
    type: 'file-export'
    name: string
    mimeType: string
  },
  SerializedDecoratorBlockNode
>

export class FileExportNode extends DecoratorBlockNode {
  __name: string
  __mimeType: string

  static getType(): string {
    return 'file-export'
  }

  constructor(name: string, mimeType: string) {
    super()
    this.__name = name
    this.__mimeType = mimeType
  }

  static clone(node: FileExportNode): FileExportNode {
    return new FileExportNode(node.__name, node.__mimeType)
  }

  static importJSON(serializedNode: SerializedFileExportNode): FileExportNode {
    const node = new FileExportNode(serializedNode.name, serializedNode.mimeType)
    return node
  }

  exportJSON(): SerializedFileExportNode {
    return {
      ...super.exportJSON(),
      name: this.__name,
      mimeType: this.__mimeType,
      version: 1,
      type: 'file-export',
    }
  }

  getZippableFileName(): string {
    return parseAndCreateZippableFileName(this.__name)
  }

  getTextContent(): string {
    return `${this.__mimeType.startsWith('image/') ? '!' : ''}[${this.__name}](./${this.getZippableFileName()})`
  }

  exportDOM(): DOMExportOutput {
    const src = `./${this.getZippableFileName()}`
    if (this.__mimeType.startsWith('image/')) {
      const img = document.createElement('img')
      img.setAttribute('src', src)
      return { element: img }
    } else if (this.__mimeType.startsWith('audio')) {
      const audio = document.createElement('audio')
      audio.setAttribute('controls', '')
      const source = document.createElement('source')
      source.setAttribute('src', src)
      source.setAttribute('type', this.__mimeType)
      audio.appendChild(source)
      return { element: audio }
    } else if (this.__mimeType.startsWith('video')) {
      const video = document.createElement('video')
      video.setAttribute('controls', '')
      const source = document.createElement('source')
      source.setAttribute('src', src)
      source.setAttribute('type', this.__mimeType)
      video.appendChild(source)
      return { element: video }
    }
    const object = document.createElement('object')
    object.setAttribute('data', src)
    object.setAttribute('type', this.__mimeType)
    return { element: object }
  }

  decorate(): JSX.Element {
    // Doesn't need to actually render anything since this is only used for export
    return <></>
  }
}

export function $createFileExportNode(name: string, mimeType: string): FileExportNode {
  return new FileExportNode(name, mimeType)
}
