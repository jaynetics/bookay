const app = require('../app')
const request = require('supertest')
const { Item } = require('../models')

describe('GET /api/stats', () => {
  it('returns stats', async () => {
    await Item.create({ name: 'URL', type: 'url', url: 'http://u1.com', userId })
    await Item.create({ name: 'Duplicate', type: 'url', url: 'http://u1.com', userId })
    await Item.create({ name: 'Other', type: 'url', url: 'http://u2.com', userId })

    const folder = await Item.create({ name: 'Nonempty', type: 'folder', userId })
    await Item.create({ name: 'Empty', type: 'folder', folderId: folder.id, userId })

    const res = await request(app).get('/api/stats').set(auth)
    expect(res.status).toBe(200)
    expect(res.body.duplicates.map(e => e.name).sort()).toMatchObject(['Duplicate', 'URL'])
    expect(res.body.emptyFolders.map(e => e.name).sort()).toMatchObject(['Empty'])
    expect(res.body.typeCounts).toMatchObject({ folder: 2, url: 3 })
  })
})
