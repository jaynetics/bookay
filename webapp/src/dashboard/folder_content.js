/** @jsx h */
import { h } from 'preact'
import { useEffect, useState, useContext } from 'preact/hooks'
import { client } from '../shared'
import { Item } from '../items'
import { AppContext } from '../app/index'

export const FolderContent = ({ activeId }) => {
  const { setSelectedIds } = useContext(AppContext)
  const [name, setName] = useState(null)
  const [items, setItems] = useState(null)

  useEffect(() => {
    // new folder opened, clear previous selections
    // NOTE: this makes cross-folder selections impossible on mobile
    setSelectedIds([])

    // fetch folder content
    client.getAll({ filter: { folderId: activeId } })
      .then((result) => setItems(Item.sort(result)))
      .catch(console.warn)
  }, [activeId, setItems, setSelectedIds])

  useEffect(() => {
    if (!activeId) {
      setName('Bookmarks')
      return
    }
    client.get({ id: activeId })
      .then(({ name }) => setName(name))
      .catch((e) => /404/.test(e) ? setName('[Deleted]') : console.warn(e))
  }, [activeId, setName])

  let content
  if (items === null) content = null // TODO: loader?
  else if (!activeId && items.length === 0) content = <ImportBookmarksHint />
  else content = items.map((item) => <Item item={item} showMenuButton={true} />)

  return <section className='folder-content scroll-section'>
    <h2 className='headline'>{name}</h2>
    {content}
  </section>
}

const ImportBookmarksHint = () =>
  <div>
    <p>Welcome!</p>
    <p>You have no bookmarks yet.</p>
    <p>Would you like to <a href='/imports/create'>import your existing bookmarks</a>?</p>
  </div>
