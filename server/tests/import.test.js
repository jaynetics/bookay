const path = require('path')
const fs = require('fs').promises
const app = require('../app')
const request = require('supertest')
const { Item } = require('../models')

describe('POST /api/imports', () => {
  it('allows uploading a Netscape bookmarks HTML', async () => {
    const file = path.resolve(__dirname, '../../shared/fixtures/bookmarks.html')
    const data = await fs.readFile(file, 'binary')
    const base64 = Buffer.from(data).toString('base64')

    const res = await request(app).post('/api/imports').set(auth)
      .send({ file: { base64 } })
    expect(res.status).toBe(201)
    expect(await Item.count()).toBe(4)
    expect(res.body.message).toMatch('Added 4 items!')

    const folder1 = await Item.findOne({ where: { name: 'Good reads' } })
    const folder2 = await Item.findOne({ where: { name: 'Empty folder in good reads' } })
    const url1 = await Item.findOne({ where: { name: 'URL at Root' } })
    const url2 = await Item.findOne({ where: { name: 'Flossing' } })
    expect(folder1.folderId).toBe(null)
    expect(folder2.folderId).toBe(folder1.id)
    expect(url1.folderId).toBe(null)
    expect(url1.url).toBe('https://example.com')
    expect(url2.folderId).toBe(folder1.id)
    expect(url2.url).toBe('https://everything2.com/title/Flossing+your+nasal+cavity+with+a+piece+of+spaghetti')
  })

  it('allows importing into an existing folder', async () => {
    const file = path.resolve(__dirname, '../../shared/fixtures/bookmarks.html')
    const data = await fs.readFile(file, 'binary')
    const base64 = Buffer.from(data).toString('base64')

    const existingFolder = await Item.create({ name: 'Folder 1', type: 'folder', userId })

    const res = await request(app).post('/api/imports').set(auth)
      .send({ file: { base64 } }).query({ folderId: existingFolder.id })
    expect(res.status).toBe(201)
    expect(await Item.count()).toBe(5)
    expect(res.body.message).toMatch('Added 4 items!')

    const children = await existingFolder.getChildren()
    expect(children.map(c => c.name).sort()).toMatchObject([
      'Good reads',
      'URL at Root',
    ])
  })
})
