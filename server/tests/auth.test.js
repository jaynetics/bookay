const app = require('../app')
const request = require('supertest')

describe('any protected route', () => {
  it('should return 401 by default', async () => {
    const response = await request(app).get('/api/items/0')
    expect(response.status).toBe(401)
  })

  it('should go through with correct auth header', async () => {
    const response = await request(app).get('/api/items/0').set(auth)
    expect(response.status).toBe(404)
  })
})
