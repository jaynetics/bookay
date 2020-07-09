const { User } = require('../models')
const { currentUser } = require('../middlewares/guard')

const create = async (req, res) => {
  const { username, password, ownPassword } = req.body

  // verify password of adding user, except for initial user
  if ((await User.count()) > 0) {
    const user = await currentUser(req)
    if (!user) return res.status(401).send({})
    if (!user.validPassword(ownPassword || '')) return res.status(403).send({})
  }

  User.create({ username, password })
    .then(() => res.status(201).send({}))
    .catch(() => res.status(400).send({}))
}

const show = async (req, res) => {
  const { settings, username } = req.user

  res.status(200).send({ settings, username })
}

const update = async (req, res) => {
  const { body: { newPassword, oldPassword, settings }, user } = req

  if (newPassword) {
    if (!user.validPassword(oldPassword || '')) {
      return res.status(403).send({})
    }
    await user.update({ password: newPassword })
  }

  if (settings) {
    await user.update({ settings })
  }

  res.status(200).send({})
}

const destroy = async (req, res) => {
  await req.user.destroy()
  res.status(200).send({})
}

module.exports = { create, destroy, show, update }
