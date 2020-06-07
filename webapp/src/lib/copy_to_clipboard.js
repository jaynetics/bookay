export const copyToClipboard = (value) => {
  const tempEl = document.createElement('textarea')
  tempEl.value = value
  document.body.appendChild(tempEl)
  tempEl.select()
  const success = document.execCommand('copy')
  document.body.removeChild(tempEl)
  return success
}
