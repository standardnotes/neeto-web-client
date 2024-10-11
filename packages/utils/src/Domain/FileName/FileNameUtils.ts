export function parseFileName(fileName: string): {
  name: string
  ext: string
} {
  const pattern = /(?:\.([^.]+))$/
  const extMatches = pattern.exec(fileName)
  const ext = extMatches?.[1] || ''
  const name = fileName.includes('.') ? fileName.substring(0, fileName.lastIndexOf('.')) : fileName

  return { name, ext }
}

export function sanitizeFileName(name: string): string {
  return name.trim().replace(/[.\\/:"?*|<>]/g, '_')
}

export function truncateFileName(name: string, maxLength: number): string {
  return name.length > maxLength ? name.slice(0, maxLength) : name
}

const MaxFileNameLength = 100

export function createZippableFileName(
  name: string,
  suffix = '',
  format = 'txt',
  maxLength = MaxFileNameLength,
): string {
  const sanitizedName = sanitizeFileName(name)
  const truncatedName = truncateFileName(sanitizedName, maxLength)
  const nameEnd = suffix + '.' + format
  return truncatedName + nameEnd
}

export function parseAndCreateZippableFileName(name: string, suffix = '') {
  const { name: parsedName, ext } = parseFileName(name)
  return createZippableFileName(parsedName, suffix, ext)
}
