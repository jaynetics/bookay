export default (window) => window['browser'] = {
  extension: mockExtension(),
  storage: mockPluginStorage(),
  tabs: mockPluginTabs(window),
}

const mockExtension = () => ({
  getBackgroundPage: () => ({
    updateBadge: () => true,
  })
})

const mockPluginStorage = () => {
  const values = {
    historySize: 3,
    secret: 'SoSafe',
    serviceURL: 'http://localhost:3033',
    suggestRoot: true,
    suggestSize: 3,
    timeoutSeconds: 3,
  }

  return {
    sync: {
      get: (_, callback) => callback(values),
      set: (newValues) => Object.assign(values, newValues),
    }
  }
}

const mockPluginTabs = (window) => ({
  create: ({ url }) => window.location.href = url,
  query: (_, callback) => callback(
    [
      {
        url: 'http://example.com',
        title: 'Example.com',
      }
    ]
  ),
})
