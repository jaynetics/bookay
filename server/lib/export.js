const { Item } = require('../models')
const htmlEscape = require('escape-html')

module.exports = class Export {
  constructor({ sourceFolderId }) {
    this.sourceFolderId = sourceFolderId || null
    this.format = 'html'
  }

  async call() {
    return {
      data: await this.buildData(),
      filename: await this.filename(),
    }
  }

  buildData() {
    if (this.format === 'html') return this.buildHTML()
    else {
      throw new Error(`unknown format "${this.format}"`)
    }
  }

  // ugly but fast. could be even faster by building item tree upfront :)
  async buildHTML() {
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

  async filename() {
    let title = 'bookmarks'
    if (this.sourceFolderId) {
      const folder = await Item.findByPk(this.sourceFolderId)
      title += `_${folder.name.toLowerCase().replace(/[^a-z0-9\-_]+/g, '-')}`
    }
    const dateString = (new Date()).toISOString().split('T')[0]
    return `${title}_${dateString}.${this.format}`
  }
}

const dateToUnixTs = (date) =>
  Math.round(date.getTime() / 1000)
