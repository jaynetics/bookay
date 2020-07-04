const { Item } = require('../models')

describe('Item', () => {
  it('destroys children on deletion', async () => {
    const f1 = await Item.create({ name: 'Folder', type: 'folder', userId })
    await Item.create({ name: 'Nested Folder', type: 'folder', folderId: f1.id, userId })
    await Item.create({ name: 'Nested URL', type: 'url', folderId: f1.id, userId })
    await Item.create({ name: 'other URL', type: 'url', userId })

    await f1.destroy()
    const items = await Item.findAll()
    expect(items.map(i => i.name)).toMatchObject(['other URL'])
  })

  it('updates folders when stuff is added to mark them as recently used', async () => {
    const f1 = await Item.create({ name: 'Folder', type: 'folder', userId })
    const oldUpdatedAt = f1.updatedAt

    await Item.create({ name: 'Nested URL', type: 'url', folderId: f1.id, userId })
    await new Promise(resolve => setTimeout(resolve, 200)) // wait for afterCreate
    await f1.reload()

    expect(f1.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime())
  })

  it('prevents cyclic nesting', async () => {
    const f1 = await Item.create({ name: 'Folder 1', type: 'folder', userId })
    const f2 = await Item.create({ name: 'Folder 2', type: 'folder', userId, folderId: f1.id })
    const f3 = await Item.create({ name: 'Folder 3', type: 'folder', userId, folderId: f2.id })

    expect.assertions(1)
    return f1.update({ folderId: f3.id }).catch((e) => expect(e.message).toEqual(
      'Validation error: Cannot nest in a contained folder'
    ))
  })
})
