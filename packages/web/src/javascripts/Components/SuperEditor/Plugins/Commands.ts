import { createCommand, LexicalCommand } from 'lexical'

export const INSERT_FILE_COMMAND: LexicalCommand<string> = createCommand('INSERT_FILE_COMMAND')
export const UPLOAD_AND_INSERT_FILE_COMMAND: LexicalCommand<File> = createCommand('UPLOAD_AND_INSERT_FILE_COMMAND')
export const INSERT_BUBBLE_COMMAND: LexicalCommand<string> = createCommand('INSERT_BUBBLE_COMMAND')
export const INSERT_DATETIME_COMMAND: LexicalCommand<'date' | 'time' | 'datetime'> =
  createCommand('INSERT_DATETIME_COMMAND')
export const INSERT_PASSWORD_COMMAND: LexicalCommand<string> = createCommand('INSERT_PASSWORD_COMMAND')
export const INSERT_REMOTE_IMAGE_COMMAND: LexicalCommand<string> = createCommand('INSERT_REMOTE_IMAGE_COMMAND')
