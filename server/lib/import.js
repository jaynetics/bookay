const parseBookmarks = require('bookmarks-parser')
const { Item } = require('../models')

module.exports = class Import {
  constructor({ data, targetFolderId, user }) {
    this.count = 0
    this.data = data
    this.targetFolderId = targetFolderId || null
    this.userId = user.id
  }

  async call() {
    let [bookmarks, parseError] = await this.parse()
    if (parseError) return [415, parseError]

    if (bookmarks.length === 1 && bookmarks[0].ns_root === 'menu') {
      bookmarks = bookmarks[0].children
    }

    let addError = await this.addParsedBookmark(
      { children: bookmarks, type: 'root' }, this.targetFolderId
    )
    return addError ? [415, addError] : [201, `Added ${this.count} items!`]
  }

  parse() {
    return new Promise((resolve, _) => {
      parseBookmarks(this.data, (error, result) => {
        if (error) resolve([[], error.toString()])
        else resolve([result.bookmarks, null])
      })
    })
  }

  // recursively adds items from bookmarks-parser result
  async addParsedBookmark(bookmark, folderId = null) {
    const { type, children, url, title, add_date, last_modified } = bookmark

    if (type !== 'bookmark' && !children) {
      return `unknown bookmark type: "${type}", aborting`
    }

    let item

    if (type === 'root') {
      item = { id: folderId }
    }
    else {
      item = await Item.create({
        createdAt: unixTsToDate(add_date),
        folderId,
        name: title,
        type: type === 'bookmark' ? 'url' : 'folder',
        updatedAt: unixTsToDate(last_modified),
        url,
        userId: this.userId,
      }, { hooks: false, silent: true })

      this.count += 1
    }

    for (let i = 0; i < (children || []).length; i++) {
      const addError = await this.addParsedBookmark(children[i], item.id)
      if (addError) return addError
    }

    return null
  }
}

const unixTsToDate = (ts) =>
  Number(ts) ? new Date(Number(ts) * 1000) : new Date()
