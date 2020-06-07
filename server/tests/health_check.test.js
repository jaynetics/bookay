const app = require('../app')
const request = require('supertest')
const { Item } = require('../models')

describe('GET /api/health_check', () => {
  it('streams a JSONL of url response codes', async () => {
    await Item.create({ url: 'http://httpstat.us/200', type: 'url', name: 'ok', userId })
    await Item.create({ url: 'http://httpstat.us/500', type: 'url', name: 'bad', userId })

    const res = await request(app).get('/api/health_check').set(auth).parse(parseJsonl)
    expect(res.status).toBe(200)

    const [[status1, item1], [status2, item2]] = res.body.sort()
    expect(status1).toBe(200)
    expect(item1).toBe(null) // details are only included for broken links
    expect(status2).toBe(500)
    expect(item2).toMatchObject({ name: 'bad' })
  })
})

const parseJsonl = (res, callback) => {
  res.setEncoding('utf-8')
  res.body = []
  res.on('data', (chunk) => res.body.push(JSON.parse(chunk)))
  res.on('end', () => callback(null, res.body))
}
