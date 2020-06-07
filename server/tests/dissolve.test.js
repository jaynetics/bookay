const app = require('../app')
const request = require('supertest')
const { Item } = require('../models')

describe('POST /api/items/:id/dissolve', () => {
  it('moves the item contents to the next higher folder', async () => {
    const folder1 = await Item.create({ name: 'Folder 1', type: 'folder', userId })
    const folder2 = await Item.create({ name: 'Folder 2', type: 'folder', folderId: folder1.id, userId })
    const url1 = await Item.create({ name: 'URL 1', type: 'url', url: 'http://u1.com', folderId: folder2.id, userId })
    const url2 = await Item.create({ name: 'URL 2', type: 'url', url: 'http://u2.com', folderId: folder2.id, userId })

    // dissolve folder2, items should end up in folder1
    const res = await request(app).post(`/api/items/${folder2.id}/dissolve`).set(auth)
    expect(res.status).toBe(201)
    expect((await url1.reload()).folderId).toBe(folder1.id)
    expect((await url2.reload()).folderId).toBe(folder1.id)
    // folder2 should now be deleted
    expect(await Item.findAll({ attributes: ['id'], where: { type: 'folder' } }))
      .toMatchObject([{ id: folder1.id }])

    // dissolve folder1, items should end up in root
    const res2 = await request(app).post(`/api/items/${folder1.id}/dissolve`).set(auth)
    expect(res2.status).toBe(201)
    expect((await url1.reload()).folderId).toBe(null)
    expect((await url2.reload()).folderId).toBe(null)
    // folder1 should now be deleted, too
    expect(await Item.findAll({ attributes: ['id'], where: { type: 'folder' } }))
      .toMatchObject([])
  })
})
