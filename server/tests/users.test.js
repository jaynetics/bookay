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

describe('GET /api/user', () => {
  it('should return 401 without logged in user', async () => {
    const response = await request(app).get('/api/user')
    expect(response.status).toBe(401)
  })

  it('should return the username and settings', async () => {
    const response = await request(app).get('/api/user').set(auth)
    expect(response.status).toBe(200)
    expect(response.body.username).toBe('Sonia')
    expect(response.body.settings).toMatchObject({})
  })
})

describe('PUT /api/user', () => {
  it('should return 401 without logged in user', async () => {
    const response = await request(app).put('/api/user')
      .send({ settings: { foo: 'bar' } })
    expect(response.status).toBe(401)
  })

  it('allows updating settings', async () => {
    const response = await request(app).put('/api/user')
      .send({ settings: { foo: 'bar' } }).set(auth)
    expect(response.status).toBe(200)
    await user.reload()
    expect(user.settings).toMatchObject({ foo: 'bar' })
  })

  it('should return 403 when trying to set new pw without old pw', async () => {
    const response = await request(app).put('/api/user')
      .send({ newPassword: 'foo' }).set(auth)
    expect(response.status).toBe(403)
  })
})

describe('DELETE /api/user', () => {
  it('should return 401 without logged in user', async () => {
    const response = await request(app).put('/api/user')
      .send({ settings: { foo: 'bar' } })
    expect(response.status).toBe(401)
  })
})
