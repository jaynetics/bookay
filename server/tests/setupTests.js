const { Item, User } = require('../models')

beforeAll(async () => {
  await User.destroy({ where: {}, truncate: true })
  global['user'] = await User.create({
    username: 'Sonia', password: 'pw', sessionId: 'SoSafe'
  })
  global['userId'] = global['user'].id
  global['auth'] = { 'x-session-id': 'SoSafe' }
  global['otherUser'] = await User.create({
    username: 'other', password: 'pw'
  })
})

beforeEach(async () => {
  await Item.destroy({ where: {}, truncate: true })
})
