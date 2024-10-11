import { SuperConverterServiceInterface } from '@standardnotes/files'
import { parseFileName } from '@standardnotes/utils'
import { Converter } from '../Converter'
import { ConversionResult } from '../ConversionResult'

export class SuperConverter implements Converter {
  constructor(private converterService: SuperConverterServiceInterface) {}

  getImportType(): string {
    return 'super'
  }

  getSupportedFileTypes(): string[] {
    return ['application/json']
  }

  isContentValid(content: string): boolean {
    return this.converterService.isValidSuperString(content)
  }

  convert: Converter['convert'] = async (file, { insertNote, readFileAsText }) => {
    const content = await readFileAsText(file)

    const result: ConversionResult = {
      successful: [],
      errored: [],
    }

    if (!this.converterService.isValidSuperString(content)) {
      throw new Error('Content is not valid Super JSON')
    }

    const { name } = parseFileName(file.name)

    const createdAtDate = file.lastModified ? new Date(file.lastModified) : new Date()
    const updatedAtDate = file.lastModified ? new Date(file.lastModified) : new Date()

    const note = await insertNote({
      createdAt: createdAtDate,
      updatedAt: updatedAtDate,
      title: name,
      text: content,
      useSuperIfPossible: true,
    })

    result.successful.push(note)

    return result
  }
}
