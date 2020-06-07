const sequelize = require('sequelize')
const { Item } = require('../models')

const show = async (_req, res) => {
  const duplicates = await getDuplicateBookmarks()
  const emptyFolders = await getEmptyFolders()
  const typeCounts = await getTypeCounts()

  res.send({ duplicates, emptyFolders, typeCounts })
}

const getDuplicateBookmarks = async () => {
  const duplicateURLs = await Item.findAll({
    attributes: ['url', [sequelize.fn('count', sequelize.col('url')), 'cnt']],
    where: { type: 'url' },
    group: ['url'],
    // this is ridiculous, but having: { cnt: ... } does not work with all dbs
    having: sequelize.where(sequelize.fn('count', sequelize.col('url')), {
      [sequelize.Op.gt]: 1
    }),
  })

  const items = await Item.findAll({
    where: { url: duplicateURLs.map(e => e.url) },
    include: [{
      model: Item,
      as: 'parent',
      attributes: ['name'],
      required: false,
    }],
    order: [['url', 'ASC']],
  })
  items.forEach(e => e.info = `@ ${e.parent && e.parent.name || 'root'}`)

  return items
}

const getEmptyFolders = async () => {
  return await Item.findAll({
    include: [{ model: Item, as: 'children', required: false }],
    where: { type: 'folder', '$children.id$': null },
  })
}

const getTypeCounts = async () => {
  const result = await Item.findAll({
    attributes: ['type', [sequelize.fn('count', sequelize.col('type')), 'cnt']],
    group: ['type'],
  })
  return result.reduce((a, e) => ({ ...a, [e.type]: e.dataValues.cnt }), {})
}

module.exports = { show }
