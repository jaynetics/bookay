import { browser } from './browser.js'

export class Configuration {
  static fields = [
    { id: 'serviceURL', type: 'text', title: 'Service URL (required)', required: true, defaultValue: 'https://', pattern: '^https?://.+$' },
    { id: 'suggestSize', type: 'number', title: 'How many recent folders to show', required: true, defaultValue: 3, min: 0, max: 20 },
    { id: 'suggestRoot', type: 'checkbox', title: 'Show "Add to root" suggestion', defaultValue: true },
    { id: 'showKeyboardHints', type: 'checkbox', title: 'Show hints for keyboard navigation', defaultValue: false },
    { id: 'historySize', type: 'number', title: 'How many recent bookmarks to show', required: true, defaultValue: 3, min: 0, max: 20 },
    { id: 'timeoutSeconds', type: 'number', title: 'Timeout in seconds', required: true, defaultValue: 20 },
    { id: 'checkOnVisit', type: 'checkbox', title: 'Check if a site is bookmarked when visiting', defaultValue: false },
    { id: 'keepAliveMinutes', type: 'number', title: 'Keep service alive by pinging every N minutes (0 to disable)', required: true, defaultValue: 0, min: 0 },
  ]

  static load() {
    return new Promise((resolve, _reject) =>
      this.storage.get(this.fields.map((f) => f.id), (result) =>
        resolve((result.constructor === Array ? result[0] : result) || {})
      )
    )
  }

  static save(values) {
    this.storage.set(values)
  }

  static get storage() {
    return browser.storage.sync
  }
}
