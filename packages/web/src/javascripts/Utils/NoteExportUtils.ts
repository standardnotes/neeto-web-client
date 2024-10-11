import { WebApplication } from '@/Application/WebApplication'
import { HeadlessSuperConverter } from '@/Components/SuperEditor/Tools/HeadlessSuperConverter'
import { NoteType, PrefKey, SNNote, PrefDefaults, FileItem, PrefValue } from '@standardnotes/snjs'
import { WebApplicationInterface } from '@standardnotes/ui-services'
import { type ZipDirectoryEntry } from '@zip.js/zip.js'
// @ts-expect-error Using inline loaders to load CSS as string
import superEditorCSS from '!css-loader?{"sourceMap":false}!sass-loader!../Components/SuperEditor/Lexical/Theme/editor.scss'
// @ts-expect-error Using inline loaders to load CSS as string
import snColorsCSS from '!css-loader?{"sourceMap":false}!sass-loader!@standardnotes/styles/src/Styles/_colors.scss'
// @ts-expect-error Using inline loaders to load CSS as string
import exportOverridesCSS from '!css-loader?{"sourceMap":false}!sass-loader!../Components/SuperEditor/Lexical/Theme/export-overrides.scss'
import { getBase64FromBlob } from './Utils'
import { parseFileName, parseAndCreateZippableFileName } from '@standardnotes/utils'

export const getNoteFormat = (application: WebApplicationInterface, note: SNNote) => {
  if (note.noteType === NoteType.Super) {
    const superNoteExportFormatPref = application.getPreference(
      PrefKey.SuperNoteExportFormat,
      PrefDefaults[PrefKey.SuperNoteExportFormat],
    )

    return superNoteExportFormatPref
  }

  const editor = application.componentManager.editorForNote(note)
  return editor.fileType
}

export const getNoteFileName = (application: WebApplicationInterface, note: SNNote): string => {
  const format = getNoteFormat(application, note)
  return `${note.title}.${format}`
}

const headlessSuperConverter = new HeadlessSuperConverter()

const superHTML = (note: SNNote, content: string) => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${note.title}</title>
    <style>
${snColorsCSS.toString()}
${superEditorCSS.toString()}
${exportOverridesCSS.toString()}
    </style>
  </head>
  <body style="--font-size: 1rem; --line-height: 1.5; font-size: var(--font-size); line-height: var(--line-height);">
    ${content}
  </body>
</html>
`

const superMarkdown = (note: SNNote, content: string) => `---
title: ${note.title}
created_at: ${note.created_at.toISOString()}
updated_at: ${note.serverUpdatedAt.toISOString()}
uuid: ${note.uuid}
---

${content}
`

export const getNoteBlob = async (
  application: WebApplication,
  note: SNNote,
  superEmbedBehavior: PrefValue[PrefKey.SuperNoteExportEmbedBehavior],
) => {
  const format = getNoteFormat(application, note)
  let type: string
  switch (format) {
    case 'html':
      type = 'text/html'
      break
    case 'json':
      type = 'application/json'
      break
    case 'md':
      type = 'text/markdown'
      break
    case 'pdf':
      type = 'application/pdf'
      break
    default:
      type = 'text/plain'
      break
  }
  if (note.noteType === NoteType.Super) {
    const content = await headlessSuperConverter.convertSuperStringToOtherFormat(note.text, format, {
      embedBehavior: superEmbedBehavior,
      getFileItem: (id) => application.items.findItem<FileItem>(id),
      getFileBase64: async (id) => {
        const fileItem = application.items.findItem<FileItem>(id)
        if (!fileItem) {
          return
        }
        const fileBlob = await application.filesController.getFileBlob(fileItem)
        if (!fileBlob) {
          return
        }
        return await getBase64FromBlob(fileBlob)
      },
      pdf: {
        pageSize: application.getPreference(
          PrefKey.SuperNoteExportPDFPageSize,
          PrefDefaults[PrefKey.SuperNoteExportPDFPageSize],
        ),
      },
    })
    const useMDFrontmatter =
      format === 'md' &&
      application.getPreference(
        PrefKey.SuperNoteExportUseMDFrontmatter,
        PrefDefaults[PrefKey.SuperNoteExportUseMDFrontmatter],
      )
    // result is a data url string if format is pdf
    const result =
      format === 'html' ? superHTML(note, content) : useMDFrontmatter ? superMarkdown(note, content) : content
    const blob =
      format === 'pdf'
        ? await fetch(result).then((res) => res.blob())
        : new Blob([result], {
            type,
          })
    return blob
  }
  const blob = new Blob([note.text], {
    type,
  })
  return blob
}

const isSuperNote = (note: SNNote) => {
  return note.noteType === NoteType.Super
}

export const noteHasEmbeddedFiles = (note: SNNote) => {
  return note.text.includes('"type":"snfile"')
}

const noteRequiresFolder = (
  note: SNNote,
  superExportFormat: PrefValue[PrefKey.SuperNoteExportFormat],
  superEmbedBehavior: PrefValue[PrefKey.SuperNoteExportEmbedBehavior],
) => {
  if (!isSuperNote(note)) {
    return false
  }
  if (superExportFormat === 'json' || superExportFormat === 'pdf') {
    return false
  }
  if (superEmbedBehavior !== 'separate') {
    return false
  }
  return noteHasEmbeddedFiles(note)
}

const addEmbeddedFilesToFolder = async (application: WebApplication, note: SNNote, folder: ZipDirectoryEntry) => {
  try {
    const filenameCounts: Record<string, number> = {}
    const embeddedFileIDs = headlessSuperConverter.getEmbeddedFileIDsFromSuperString(note.text)
    for (const embeddedFileID of embeddedFileIDs) {
      const fileItem = application.items.findItem<FileItem>(embeddedFileID)
      if (!fileItem) {
        continue
      }
      const embeddedFileBlob = await application.filesController.getFileBlob(fileItem)
      if (!embeddedFileBlob) {
        continue
      }
      filenameCounts[fileItem.title] =
        filenameCounts[fileItem.title] == undefined ? 0 : filenameCounts[fileItem.title] + 1
      let name = fileItem.title
      if (filenameCounts[fileItem.title] > 0) {
        const { name: _name, ext } = parseFileName(fileItem.title)
        name = `${_name}-${fileItem.uuid}.${ext}`
      }
      folder.addBlob(parseAndCreateZippableFileName(name), embeddedFileBlob)
    }
  } catch (error) {
    console.error(error)
  }
}

export const createNoteExport = async (
  application: WebApplication,
  notes: SNNote[],
): Promise<
  | {
      blob: Blob
      fileName: string
    }
  | undefined
> => {
  if (notes.length === 0) {
    return
  }

  const superExportFormatPref = application.getPreference(
    PrefKey.SuperNoteExportFormat,
    PrefDefaults[PrefKey.SuperNoteExportFormat],
  )
  const superEmbedBehaviorPref =
    superExportFormatPref === 'pdf'
      ? 'inline'
      : application.getPreference(
          PrefKey.SuperNoteExportEmbedBehavior,
          PrefDefaults[PrefKey.SuperNoteExportEmbedBehavior],
        )

  if (notes.length === 1 && !noteRequiresFolder(notes[0], superExportFormatPref, superEmbedBehaviorPref)) {
    const blob = await getNoteBlob(application, notes[0], superEmbedBehaviorPref)
    const fileName = getNoteFileName(application, notes[0])
    return {
      blob,
      fileName,
    }
  }

  const zip = await import('@zip.js/zip.js')
  const zipFS = new zip.fs.FS()
  const { root } = zipFS

  if (notes.length === 1 && noteRequiresFolder(notes[0], superExportFormatPref, superEmbedBehaviorPref)) {
    const blob = await getNoteBlob(application, notes[0], superEmbedBehaviorPref)
    const fileName = parseAndCreateZippableFileName(getNoteFileName(application, notes[0]))
    root.addBlob(fileName, blob)

    await addEmbeddedFilesToFolder(application, notes[0], root)

    const zippedBlob = await zipFS.exportBlob()
    return {
      blob: zippedBlob,
      fileName: fileName + '.zip',
    }
  }

  const filenameCounts: Record<string, number> = {}

  for (const note of notes) {
    const blob = await getNoteBlob(application, note, superEmbedBehaviorPref)
    const _name = parseAndCreateZippableFileName(getNoteFileName(application, note))

    filenameCounts[_name] = filenameCounts[_name] == undefined ? 0 : filenameCounts[_name] + 1

    const currentFileNameIndex = filenameCounts[_name]

    const fileName = parseAndCreateZippableFileName(_name, currentFileNameIndex > 0 ? ` - ${currentFileNameIndex}` : '')

    if (!noteRequiresFolder(note, superExportFormatPref, superEmbedBehaviorPref)) {
      root.addBlob(fileName, blob)
      continue
    }

    const { name } = parseFileName(fileName)
    const folder = root.addDirectory(name)
    folder.addBlob(fileName, blob)
    await addEmbeddedFilesToFolder(application, note, folder)
  }

  const zippedBlob = await zipFS.exportBlob()

  return {
    blob: zippedBlob,
    fileName: `Standard Notes Export - ${application.archiveService.formattedDateForExports()}.zip`,
  }
}
