const { Item } = require('../models')

const create = async (req, res) => {
  const item = await Item.findOne({ where: { id: req.params.id } })
  if (!item) return res.status(500).send({})

  await Item.update({ folderId: item.folderId }, { where: { folderId: item.id } })
  await item.destroy()
  res.status(201).send({})
}

module.exports = { create }
