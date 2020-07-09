const { Item, User } = require('../models')
const { NODE_ENV } = process.env

const create = async (_req, res) => {
  if (NODE_ENV !== 'test') throw new Error(`impossible in NODE_ENV=${NODE_ENV}`)

  await User.destroy({ where: {}, truncate: true })
  await User.create({
    username: 'Sonia',
    password: 'pw',
    sessionId: 'SoSafe',
    settings: { faviconSource: 'disabled' },
  })

  res.status(201).send({})
}

module.exports = { create }
