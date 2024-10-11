import { formatSizeToReadableString } from './utils'
import { parseFileName } from '@standardnotes/utils'

describe('utils', () => {
  describe('parseFileName', () => {
    it('should parse regular filenames', () => {
      const fileName = 'test.txt'

      const { name, ext } = parseFileName(fileName)

      expect(name).toBe('test')
      expect(ext).toBe('txt')
    })

    it('should parse filenames with multiple dots', () => {
      const fileName = 'Screen Shot 2022-03-06 at 12.13.32 PM.png'

      const { name, ext } = parseFileName(fileName)

      expect(name).toBe('Screen Shot 2022-03-06 at 12.13.32 PM')
      expect(ext).toBe('png')
    })

    it('should parse filenames without extensions', () => {
      const fileName = 'extensionless'

      const { name, ext } = parseFileName(fileName)

      expect(name).toBe('extensionless')
      expect(ext).toBe('')
    })
  })

  describe('formatSizeToReadableString', () => {
    it('should show as bytes if less than 1KB', () => {
      const size = 1_023

      const formattedSize = formatSizeToReadableString(size)

      expect(formattedSize).toBe('1023 B')
    })

    it('should format as KB', () => {
      const size = 1_024

      const formattedSize = formatSizeToReadableString(size)

      expect(formattedSize).toBe('1 KB')
    })

    it('should format as MB', () => {
      const size = 1_048_576

      const formattedSize = formatSizeToReadableString(size)

      expect(formattedSize).toBe('1 MB')
    })

    it('should format as GB', () => {
      const size = 1_073_741_824

      const formattedSize = formatSizeToReadableString(size)

      expect(formattedSize).toBe('1 GB')
    })

    it('should only show fixed-point notation if calculated size is not an integer', () => {
      const size1 = 1_048_576
      const size2 = 1_572_864

      const formattedSize1 = formatSizeToReadableString(size1)
      const formattedSize2 = formatSizeToReadableString(size2)

      expect(formattedSize1).toBe('1 MB')
      expect(formattedSize2).toBe('1.50 MB')
    })
  })
})
