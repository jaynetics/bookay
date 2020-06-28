const Export = require('../lib/export')

const show = async (req, res) => {
  const exp = new Export({ sourceFolderId: req.query.folderId })
  const { data, filename } = await exp.call()

  res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition')
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`)
  res.setHeader('Content-Transfer-Encoding', 'binary')
  res.setHeader('Content-Type', 'application/octet-stream')
  res.send(Buffer.from(data))
}

module.exports = { show }
