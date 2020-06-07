import Menu from './menu.js'
import {
  ApiClient,
  Badge,
  Configuration,
  browser,
  getCurrentTab,
} from '../shared/index.js'

document.addEventListener('DOMContentLoaded', async () => {
  const popup = new Popup()
  popup.init()
})

class Popup {
  init = async () => {
    this.config = await Configuration.load()
    if (!this.validateServiceURLSet()) return

    this.client = new ApiClient({
      ...this.config, onAuthRequired: () => Menu.showLogin(this.client)
    })
    this.checkCurrentURL()
    Menu.setupHotkeys()
  }

  validateServiceURLSet = () => {
    if (/^https?:\/\/.+$/.test(this.config.serviceURL)) return true

    alert('Please set a service URL in the options first.')
    browser.runtime.openOptionsPage()
    return false
  }

  checkCurrentURL = async () => {
    Menu.showLoader()

    const currentTab = await getCurrentTab()
    if (!currentTab) return Menu.showError('No active tab found')

    this.siteURL = currentTab.url
    this.siteName = currentTab.title || this.siteURL
    this.client.check({ url: this.siteURL })
      .then(this.update)
      .catch(Menu.showError)
  }

  update = ({ bookmark, recentBookmarks, suggestedFolders }) => {
    Menu.clear()

    if (bookmark) {
      Menu.addDivider({ text: 'This page is bookmarked' })
      this.showBookmarkActions({ id: bookmark.id })
      this.updateBadge(Badge.State.BOOKMARK_EXISTS)
    }
    else {
      Menu.addDivider({ text: 'Add this page to:' })
      this.showBookmarkingActions({ suggestedFolders })
      this.updateBadge(Badge.State.NOT_BOOKMARKED)
    }

    Menu.addDivider({
      text: recentBookmarks.length ? 'Recent bookmarks' : 'Other bookmarks'
    })

    this.showRecentBookmarks({ recentBookmarks })

    Menu.addItem({
      icon: '↗️',
      text: 'Manage bookmarks…',
      func: () => browser.tabs.create({ url: this.client.dashboardURL() }),
    })
  }

  showBookmarkActions = ({ id }) => {
    Menu.addItem({
      icon: '✎',
      text: 'Edit bookmark',
      func: () => browser.tabs.create({ url: this.client.editItemURL({ id }) }),
    })

    Menu.addItem({
      icon: '✕',
      text: 'Remove bookmark',
      func: () => {
        Menu.showLoader()
        this.client.remove({ id }).then(this.onUnbookmark)
      },
    })
  }

  showBookmarkingActions = ({ suggestedFolders }) => {
    if (this.config.suggestRoot) suggestedFolders = [
      { id: null, name: 'Root folder' }, ...suggestedFolders
    ]

    suggestedFolders.forEach(({ name, id: folderId }, i) =>
      Menu.addItem({
        icon: '✩',
        text: `${i + 1} ${name}`,
        func: () => {
          Menu.showLoader()
          this.client.create({ type: 'url', url: this.siteURL, name: this.siteName, folderId })
            .then(this.onBookmark)
            .catch(alert)
        },
      })
    )

    Menu.addItem({
      icon: '↗️',
      text: suggestedFolders.length ? 'Another folder…' : 'Bookmarks…',
      func: () => browser.tabs.create({
        url: this.client.newItemURL({ url: this.siteURL, name: this.siteName })
      }),
    })
  }

  onBookmark = () => {
    this.updateBadge(Badge.State.BOOKMARK_ADDED)
    this.close()
  }

  onUnbookmark = () => {
    this.updateBadge(Badge.State.BOOKMARK_REMOVED)
    this.close()
  }

  showRecentBookmarks = ({ recentBookmarks }) => {
    recentBookmarks.forEach((bookmark) => {
      Menu.addItem({
        icon: '★',
        text: bookmark.name,
        func: () => browser.tabs.create({ url: bookmark.url }),
      })
    })
  }

  updateBadge = (badgeState) => {
    const background = browser.extension.getBackgroundPage()
    background.updateBadge({ url: this.siteURL, badgeState })
  }

  close = () =>
    window.close()
}
