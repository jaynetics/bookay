export const initFetchMocks = (fm, client) => {
  fixtures.forEach(item => {
    fm.get(
      client.itemURL({ id: item.id }),
      { status: 200, body: item }
    )
    fm.put(
      client.itemURL({ id: item.id }),
      { status: 200, body: {} }
    )
    if (item.type === 'folder') {
      fm.get(
        client.itemsURL({ filter: { folderId: item.id } }),
        { status: 200, body: fixtures.filter(f => f.folderId === item.id) }
      )
      fm.post(
        client.dissolveURL({ id: item.id }),
        { status: 201, body: {} }
      )
    }
    else {
      fm.get(
        client.checkURL({ urlToCheck: item.url, historySize: 0, suggestSize: 0 }),
        { status: 200, body: { bookmark: { id: item.id }, suggestedFolders: folders }, }
      )
    }
  })
  fm.get(
    client.itemsURL({ filter: null }),
    { status: 200, body: fixtures }
  )
  fm.get(
    client.itemsURL({ filter: { folderId: null } }),
    { status: 200, body: fixtures.filter(f => !f.folderId) }
  )
  fm.get(
    client.itemsURL({ filter: { type: 'folder' } }),
    { status: 200, body: fixtures.filter(f => f.type === 'folder') }
  )
  fm.get(
    client.itemsURL({ filter: { q: 'a' } }),
    { status: 200, body: fixtures.filter(f => `${f.name}${f.url}`.includes('a')) }
  )
  fm.get(
    client.itemsURL({ filter: { q: 'ar' } }),
    { status: 200, body: fixtures.filter(f => `${f.name}${f.url}`.includes('ar')) }
  )
  fm.post(
    client.createItemURL(),
    { status: 201, body: {} }
  )
  fm.post(
    client.createImportURL({ folderId: '' }),
    { status: 201, body: { message: 'Added 23 items!' } }
  )
  fm.get(
    client.exportURL({ folderId: '' }),
    { status: 200, body: {} }
  )
  fm.get(
    client.checkURL({ urlToCheck: 'ping', historySize: 0, suggestSize: 0 }),
    { status: 200, body: {} }
  )
}

const fixtures = [
  { id: 11, name: 'Foo', type: 'folder' },
  { id: 22, name: 'Bar', type: 'folder', folderId: 11 },
  { id: 33, name: 'Baz', type: 'url', url: 'http://baz.baz' },
  { id: 44, name: 'Qux', type: 'url', url: 'http://qux.qux', folderId: 11 },
  { id: 55, name: 'This one has a really long name', type: 'folder' },
]

const folders = fixtures.filter(f => f.type === 'folder')
