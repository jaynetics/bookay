import { browser } from './browser.js'

export class Badge {
  static show = ({ stateId, tabId }) => {
    const state = Object.values(Badge.State).find(({ id }) => id === stateId)
    const { color, icon: text, title } = state

    browser.browserAction.setBadgeBackgroundColor({ color, tabId })
    browser.browserAction.setBadgeText({ text, tabId })
    // Screen readers can see the title
    browser.browserAction.setTitle({ title, tabId })
  }
}

Badge.State = {
  NOT_BOOKMARKED: { id: 0, icon: '', color: [0, 0, 0, 0], title: 'Not bookmarked' },
  BOOKMARK_EXISTS: { id: 1, icon: '✓', color: 'RoyalBlue', title: 'Existing Bookmark' },
  BOOKMARK_ADDED: { id: 2, icon: '✓', color: 'SeaGreen', title: 'Bookmark added' },
  BOOKMARK_REMOVED: { id: 3, icon: '✕', color: 'FireBrick', title: 'Bookmark removed' },
}
