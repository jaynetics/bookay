export const truncate = (string, n) =>
  `${string.substring(0, n)}${string.length > n ? '…' : ''}`
