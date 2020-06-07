const { Item } = require('../models')
const htmlEscape = require('escape-html')

module.exports = class Export {
  constructor({ sourceFolderId }) {
    this.sourceFolderId = sourceFolderId || null
  }

  // ugly but fast. could be even faster by building item tree upfront :)
  async call() {
    const lines = []

    lines.push('<!DOCTYPE NETSCAPE-Bookmark-file-1>')
    lines.push('<!-- this file can be imported into a browser or bookmarks service')
    lines.push('     or parsed, e.g. with https://npmjs.com/package/bookmarks-parser -->')
    lines.push('<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">')
    lines.push('<Title>Bookmarks</Title>')
    lines.push('<H1>Bookmarks</H1>')

    await this.addFolderHTML({ folderId: this.sourceFolderId, toArray: lines })

    return lines.join("\n")
  }

  async addFolderHTML({ folderId, toArray }) {
    toArray.push(`<DL><p>`)

    const children = await Item.findAll({ where: { folderId } })

    for (let i = 0; i < children.length; i++) {
      const item = children[i]
      const name = htmlEscape(item.name)
      const url = htmlEscape(item.url)
      const created = dateToUnixTs(item.createdAt)
      const updated = dateToUnixTs(item.updatedAt)

      if (item.type === 'folder') {
        toArray.push(`<DT><H3 ADD_DATE="${created}" LAST_MODIFIED="${updated}">${name}</H3>`)
        await this.addFolderHTML({ folderId: item.id, toArray })
      }
      else {
        toArray.push(`<DT><A HREF="${url}" ADD_DATE="${created}">${name}</A>`)
      }
    }

    toArray.push('</DL><p>')
  }
}

const dateToUnixTs = (date) =>
  Math.round(date.getTime() / 1000)
