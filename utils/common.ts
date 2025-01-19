export function makeCamelCase(stat: string, reverse: boolean = false): string {
  if (reverse) {
    return stat
      .split(' ')
      .map((word, index) =>
        index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
      )
      .join('')
  }

  return stat
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}
