import { browser } from './browser.js'

export const getCurrentTab = () =>
  new Promise((resolve, _reject) =>
    browser.tabs.query({ active: true, currentWindow: true }, (r) => resolve(r[0]))
  )
