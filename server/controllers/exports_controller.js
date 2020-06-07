const Export = require('../lib/export')

const show = async (req, res) => {
  const t = new Date()
  const name = `bookmarks_${t.getFullYear()}-${t.getMonth()}-${t.getDate()}.html`
  const exp = new Export({ sourceFolderId: req.query.folderId })
  const data = await exp.call()
  res.setHeader('Content-Disposition', `attachment; filename=${name}`)
  res.setHeader('Content-Transfer-Encoding', 'binary')
  res.setHeader('Content-Type', 'application/octet-stream')
  res.send(Buffer.from(data))
}

module.exports = { show }
