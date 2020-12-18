const { crud, sequelizeSearchFields, sequelizeCrud } = require('express-sequelize-crud')
const { Op } = require('sequelize')
const { sequelize: { options: { dialect } } } = require('../models')
const { Item } = require('../models')

const searchOp = dialect === 'sqlite' ? Op.like : Op.iLike
const search = sequelizeSearchFields(Item, ['name', 'url'], searchOp)

module.exports = () => (req, res, next) => {
  crud('/api/items', {
    ...sequelizeCrud(Item),
    search: (q, limit) => search(q, limit, { userId: req.user.id }),
    create: (body) => Item.create({ ...body, userId: req.user.id }),
  })(req, res, next)
}
