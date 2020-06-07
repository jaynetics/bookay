const app = require('../app')
const request = require('supertest')
const { Item } = require('../models')

describe('GET /api/export', () => {
  it('returns a Netscape bookmarks HTML of the items', async () => {
    const folder = await Item.create({ name: 'Folder 1', type: 'folder', userId })
    await Item.create({ name: 'Empty folder in folder', type: 'folder', folderId: folder.id, userId })
    await Item.create({ name: 'URL at Root', type: 'url', url: 'http://u1.com', userId })
    await Item.create({ name: 'URL in Folder', type: 'url', url: 'http://u2.com', folderId: folder.id, userId })

    const res = await request(app).get('/api/export').set(auth)
    expect(res.status).toBe(200)
    expect('' + res.body.toString()).toMatch(new RegExp(
      heredoc(`
        <!DOCTYPE NETSCAPE-Bookmark-file-1>
        (<!--[^>]*-->)*
        <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
        <Title>Bookmarks</Title>
        <H1>Bookmarks</H1>
        <DL><p>
        <DT><H3 ADD_DATE="\\d+" LAST_MODIFIED="\\d+">Folder 1</H3>
        <DL><p>
        <DT><H3 ADD_DATE="\\d+" LAST_MODIFIED="\\d+">Empty folder in folder</H3>
        <DL><p>
        </DL><p>
        <DT><A HREF="http://u2.com" ADD_DATE="\\d+">URL in Folder</A>
        </DL><p>
        <DT><A HREF="http://u1.com" ADD_DATE="\\d+">URL at Root</A>
        </DL><p>
      `)
    ))
  })

  it('can be limited to a specific folder', async () => {
    const folder = await Item.create({ name: 'Folder 1', type: 'folder', userId })
    await Item.create({ name: 'Empty folder in folder', type: 'folder', folderId: folder.id, userId })
    await Item.create({ name: 'URL at Root', type: 'url', url: 'http://u1.com', userId })
    await Item.create({ name: 'URL in Folder', type: 'url', url: 'http://u2.com', folderId: folder.id, userId })

    const res = await request(app).get('/api/export').set(auth).query({ folderId: folder.id })
    expect(res.status).toBe(200)
    expect('' + res.body.toString()).toMatch(new RegExp(
      heredoc(`
        <!DOCTYPE NETSCAPE-Bookmark-file-1>
        (<!--[^>]*-->)*
        <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
        <Title>Bookmarks</Title>
        <H1>Bookmarks</H1>
        <DL><p>
        <DT><H3 ADD_DATE="\\d+" LAST_MODIFIED="\\d+">Empty folder in folder</H3>
        <DL><p>
        </DL><p>
        <DT><A HREF="http://u2.com" ADD_DATE="\\d+">URL in Folder</A>
        </DL><p>
      `)
    ))
  })

  it('cannot export items owned by another user', async () => {
    const userId = otherUser.id
    await Item.create({ name: 'URL at Root', type: 'url', url: 'http://u1.com', userId })

    const res = await request(app).get('/api/export').set(auth).query()
    expect(res.status).toBe(200)
    expect('' + res.body.toString()).toMatch(new RegExp(
      heredoc(`
        <!DOCTYPE NETSCAPE-Bookmark-file-1>
        (<!--[^>]*-->)*
        <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
        <Title>Bookmarks</Title>
        <H1>Bookmarks</H1>
        <DL><p>
        </DL><p>
      `)
    ))
  })
})

const heredoc = (string) => {
  const indentation = string.match(/ *(?=\S)/) || ''
  return string.trim().replace(new RegExp(`^${indentation}`, 'gm'), '')
}
