const app = require('../app')
const request = require('supertest')
const { User } = require('../models')

describe('POST /api/users', () => {
  it('should return 401 without logged in user', async () => {
    const response = await request(app).post('/api/users')
      .send({ username: 'new user', password: 'xy', ownPassword: 'pw' })
    expect(response.status).toBe(401)
    expect(await User.count({ where: { username: 'new user' } })).toBe(0)
  })

  it('should return 403 without the correct pw', async () => {
    const response = await request(app).post('/api/users').set(auth)
      .send({ username: 'new user', password: 'xy', ownPassword: 'BAD' })
    expect(response.status).toBe(403)
    expect(await User.count({ where: { username: 'new user' } })).toBe(0)
  })

  it('should return 201 and create a new user ', async () => {
    const response = await request(app).post('/api/users').set(auth)
      .send({ username: 'new user', password: 'xy', ownPassword: 'pw' })
    expect(response.status).toBe(201)
    expect(await User.count({ where: { username: 'new user' } })).toBe(1)
  })
})
