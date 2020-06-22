const { crud } = require('express-sequelize-crud')
const { searchFields } = require('express-sequelize-crud/lib/getList/searchList')
const { Op } = require('sequelize')
const { sequelize: { options: { dialect } } } = require('../models')
const { Item } = require('../models')

const searchOp = dialect === 'sqlite' ? Op.like : Op.iLike
const search = searchFields(Item, ['name', 'url'], searchOp)

module.exports = () => (req, res, next) => {
  crud('/api/items', Item, {
    search: (q, limit) => search(q, limit, { userId: req.user.id }),
    create: (body) => Item.create({ ...body, userId: req.user.id }),
  })(req, res, next)
}
