const Import = require('../lib/import')

const create = async (req, res) => {
  const base64Data = req.body.file.base64.replace(/[^,]*,/, '')
  const data = Buffer.from(base64Data, 'base64').toString()
  const imp = new Import({ data, targetFolderId: req.query.folderId, user: req.user })
  const [status, message] = await imp.call()
  res.status(status).send({ message })
}

module.exports = { create }
