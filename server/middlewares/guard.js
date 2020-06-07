const { Item, User } = require('../models')

module.exports = () => async (req, res, next) => {
  const user = await currentUser(req)
  if (!user) return res.status(401).send({})

  req.user = user
  Item.addScope('defaultScope', { where: { userId: user.id } }, { override: true })
  next()
}

const currentUser = async (req) => {
  const sessionId = req.headers['x-session-id']
  if (sessionId) {
    return await User.findOne({ where: { sessionId } })
  }
}

module.exports.currentUser = currentUser
