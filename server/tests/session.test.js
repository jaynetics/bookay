const app = require('../app')
const request = require('supertest')

describe('POST /api/login', () => {
  it('should return the new sessionId', async () => {
    const response = await request(app).post('/api/login')
      .send({ username: otherUser.username, password: 'pw' })
    expect(response.status).toBe(201)
    expect(response.body.sessionId).toBeDefined()
    expect(response.body.sessionId.length).toBeGreaterThan(1)
  })

  it('should return 401 for bad username', async () => {
    const response = await request(app).post('/api/login')
      .send({ username: 'BAD', password: 'pw' })
    expect(response.status).toBe(401)
  })

  it('should return 401 for bad pw', async () => {
    const response = await request(app).post('/api/login')
      .send({ username: otherUser.username, password: 'BAD' })
    expect(response.status).toBe(401)
  })
})

describe('DELETE /api/logout', () => {
  it('should destroy the user session', async () => {
    await otherUser.update({ sessionId: 'foo' })

    const response = await request(app).delete('/api/logout').send({ sessionId: 'foo' })
    expect(response.status).toBe(200)
    await otherUser.reload()
    expect(otherUser.sessionId).toBeNull()
  })

  it('ignores inexistent sessions', async () => {
    const response = await request(app).delete('/api/logout').send({ sessionId: 'dunno' })
    expect(response.status).toBe(200)
  })
})
