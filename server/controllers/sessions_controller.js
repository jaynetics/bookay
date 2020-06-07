const crypto = require('crypto')
const { User } = require('../models')

const create = async (req, res) => {
  const { username, password } = req.body
  const user = username && await User.findOne({ where: { username } })

  if (user && password && user.validPassword(password)) {
    // re-use sessionId to allow sharing between plugin, webapp
    if (!user.sessionId) {
      const sessionId = crypto.randomBytes(64).toString('base64')
      await user.update({ sessionId })
    }
    res.status(201).send({ sessionId: user.sessionId })
  }
  else {
    res.status(401).send({})
  }
}

const destroy = async (req, res) => {
  const { sessionId = null } = req.body
  await User.update({ sessionId: null }, { where: { sessionId } })
  res.send({})
}

module.exports = { create, destroy }
