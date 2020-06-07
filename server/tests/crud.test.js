// Item CRUD actions should be sufficiently tested in `express-sequelize-crud`.
// Testing just one action here to make sure the module works.

const app = require('../app')
const request = require('supertest')
const { Item, User } = require('../models')

describe('POST /api/items/create', () => {
  it('works', async () => {
    const res = await request(app).post('/api/items')
      .send({ type: 'url', name: 'Great new thing', url: 'http://thing.com' })
      .set(auth)
    expect(res.status).toBe(201)
    const item = await Item.findOne({ name: 'Great new thing' })
    expect(item.url).toBe('http://thing.com')
    expect(item.userId).toBe(user.id)
  })
})

describe('GET /api/items/:id', () => {
  it('cannot access items of another user', async () => {
    const userId = otherUser.id
    const item = await Item.create({ type: 'url', name: 'foo', url: 'http://foo.com', userId })
    const res = await request(app).get(`/api/items/${item.id}`).set(auth)
    expect(res.status).toBe(404)
  })
})
