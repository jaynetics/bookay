const path = require('path')

module.exports = async (_browser, launchOptions) => {
  const extensionPath = path.resolve(__dirname, '../../../plugin')
  launchOptions.extensions.push(extensionPath)
  return launchOptions
}
