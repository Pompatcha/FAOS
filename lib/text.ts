const truncateText = (
  text: string,
  limit: number = 50,
  suffix: string = '...',
): string => {
  if (!text) return ''

  if (text.length <= limit) return text

  return text.slice(0, limit).trim() + suffix
}

export { truncateText }
