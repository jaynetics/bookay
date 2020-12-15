import { ApiClient } from '../node_modules/@bookay/client/index.js'
import { browser, getCurrentTab, Badge, Configuration } from '../shared/index.js'

let badgeStateIdByURL = {}

// called from popup - keep track of correct badge for each url
const updateBadge = ({ url, badgeState }) => {
  badgeStateIdByURL[url] = badgeState.id
  updateActiveTab()
}

window['updateBadge'] = updateBadge

// show correct badge for currently active tab
const updateActiveTab = async () => {
  const currentTab = await getCurrentTab()
  if (!currentTab) return

  // if bookmarked state has already been checked, re-use last result
  const known = Object.entries(badgeStateIdByURL).some(([url, stateId]) => {
    if (url === currentTab.url) {
      Badge.show({ stateId, tabId: currentTab.id })
      return true
    }
  })

  // If it has not yet been checked, only check it on visit if the setting
  // has been turned on (disabled by default b/c it is somewhat wasteful).
  // Otherwise the status is only checked when the user opens the popup.
  if (!known) {
    const config = await Configuration.load()
    if (config.checkOnVisit) {
      const client = new ApiClient(config)
      client.check({ url: currentTab.url })
        .then(({ bookmark }) => bookmark && updateBadge({
          url: currentTab.url, badgeState: Badge.State.BOOKMARK_EXISTS
        }))
        .catch(console.error)
    }
  }
}

// listen to tab URL changes
browser.tabs.onUpdated.addListener(updateActiveTab)

// listen to tab switching
browser.tabs.onActivated.addListener(updateActiveTab)

// listen for window switching
browser.windows.onFocusChanged.addListener(updateActiveTab)

// keep-alive loop, e.g. to run with Heroku free dyno
const keepServiceAlive = async () => {
  const config = await Configuration.load()
  const minutes = Number(config.keepAliveMinutes)
  if (minutes > 0) {
    const client = new ApiClient(config)
    client.ping()
      .then(() => console.log(`Keep-alive ping success @${new Date()}`))
      .catch((e) => console.warn(`Keep-alive ping fail: ${e} @${new Date()}`))
    setTimeout(keepServiceAlive, minutes * 60 * 1000)
  }
}

keepServiceAlive()
