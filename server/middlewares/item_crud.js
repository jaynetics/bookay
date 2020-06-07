const { crud } = require('express-sequelize-crud')
const { Op: { like, iLike } } = require('sequelize')
const { sequelize: { options: { dialect } } } = require('../models')
const { searchFields } = require('../lib/search_list')
const { Item } = require('../models')

const searchMethod = dialect === 'sqlite' ? like : iLike

module.exports = () => (req, res, next) => {
  crud('/api/items', Item, {
    search: searchFields(Item, ['name', 'url'], searchMethod),
    create: (body) => Item.create({ ...body, userId: req.user.id }),
  })(req, res, next)
}
