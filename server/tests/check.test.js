const app = require('../app')
const request = require('supertest')
const { Item } = require('../models')

describe('GET /api/check/:url', () => {
  it('returns a bookmark for the url if found', async () => {
    const res = await request(app).get('/api/check/url2check').set(auth)
    expect(res.status).toBe(200)
    expect(res.body.bookmark).toBe(null)

    const item = await Item.create({ name: 'u', url: 'url2check', type: 'url', userId })
    const res2 = await request(app).get('/api/check/url2check').set(auth)
    expect(res2.status).toBe(200)
    expect(res2.body.bookmark).toMatchObject({ id: item.id })
  })

  it('suggests recent folders if not bookmarked and ?suggestSize > 0', async () => {
    const f1 = await Item.create({ name: 'Folder f1', type: 'folder', userId })
    const f2 = await Item.create({ name: 'Folder f2', type: 'folder', userId })

    const res = await request(app).get('/api/check/no_bm').set(auth)
    expect(res.body.suggestedFolders.length).toBe(0)

    const res2 = await request(app).get('/api/check/no_bm').query({ suggestSize: 1 }).set(auth)
    expect(res2.body.suggestedFolders.length).toBe(1)

    const res3 = await request(app).get('/api/check/no_bm').query({ suggestSize: 5 }).set(auth)
    expect(res3.body.suggestedFolders.length).toBe(2)
    expect(res3.body.suggestedFolders.map(e => e.id).sort())
      .toMatchObject([f1.id, f2.id])
  })

  it('lists recent bookmarks if historySize > 0', async () => {
    const u1 = await Item.create({ name: 'URL u1', type: 'url', url: 'http://foo.com', userId })

    const res = await request(app).get('/api/check/bla').query({ historySize: 1 }).set(auth)
    expect(res.body.recentBookmarks.map(e => e.id)).toMatchObject([u1.id])
  })
})
