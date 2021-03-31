// parses entries of https://github.com/sindresorhus/awesome
// and builds a netscape-compatible bookmarks HTML from them

const https = require('https')
const { writeFile } = require('fs')

https.request({
  host: 'raw.githubusercontent.com',
  path: '/sindresorhus/awesome/main/readme.md'
}, (response) => {
  let stringBuffer = ''
  response.on('data', (chunk) => stringBuffer += chunk)
  response.on('end', () => process(stringBuffer))
}).end()

const process = (markdown) => {
  const tree = parse(markdown)
  const html = bookmarksHtml(tree)
  writeFile(`${__dirname}/bookmarks_awesome.html`, html, (err) => {
    err && console.warn(err)
  })
}

const parse = (markdown) => {
  const tree = new Node({ name: 'bookmarks' })

  const sections = markdown.match(/##+ ((?!##).)+/gs)
  sections.filter((e) => /https?:/.test(e)).forEach((section) => {
    const sectionNode = new Node({ name: section.match(/^## (.+)$/m)[1] })
    tree.children.push(sectionNode)
    let currentEntryNode
    section.match(/^[ \t]*[\-\*] .*$/gm).forEach((entry) => {
      const [_, padding, name, url, description] =
        entry.match(/^([ \t]*)[\-\*] \[([^\]]+)\]\(([^\)]+)\)(?: - (.+))?/)
      const entryNode = new Node({ description, name, url })
      if (!padding) {
        sectionNode.children.push(entryNode)
        currentEntryNode = entryNode
      }
      else {
        currentEntryNode.children.push(entryNode)
      }
    })
  })

  return tree
}

class Node {
  constructor({ children = [], description = null, name, url = null }) {
    this.children = children
    this.description = description
    this.name = name
    this.url = url
  }

  get fullName() {
    return `${this.name}${this.description ? ` - ${this.description}` : ''}`
  }
}

const bookmarksHtml = (tree) => {
  const lines = []

  const traverse = (node) => {
    if (node.children.length) {
      lines.push(`<DT><H3>${node.name}</H3><DL>`)
      if (node.url) lines.push(`<DT><A HREF="${node.url}">Awesome List</A></DT>`)
      node.children.forEach(traverse)
      lines.push(`</DL></DT>`)
    }
    else {
      lines.push(`<DT><A HREF="${node.url}">${node.fullName}</A></DT>`)
    }
  }

  tree.children.forEach(traverse) // omit root level bookmarks dir

  return `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<Title>Awesome Lists - from https://github.com/sindresorhus/awesome</Title>
<H1>Awesome Lists - from https://github.com/sindresorhus/awesome</H1>
<DL>
${lines.join("\n")}
</DL>
`
}
