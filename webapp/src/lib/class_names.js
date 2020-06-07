export const classNames = ({ ...obj }) =>
  Object.entries(obj).reduce((a, [k, v]) => v ? [...a, k] : a, []).join(' ')
