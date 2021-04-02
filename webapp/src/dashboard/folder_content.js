import { useEffect, useContext, useState } from 'preact/hooks'
import { Link } from '../lib'
import { Loader, client, useAPI } from '../shared'
import { Item } from '../items'
import { AppContext } from '../app/index'

export const FolderContent = ({ id }) => {
  const { setSelectedIds } = useContext(AppContext)

  // new folder opened => clear previous selections
  // NOTE: this makes cross-folder selections impossible on mobile
  useEffect(() => { setSelectedIds([]) }, [id, setSelectedIds])

  const name = useFolderName({ id })
  const { data, loading } =
    useAPI(client.getAll({ filter: { folderId: id } }), [id])

  // const [sorting, setSorting] = useState('TODO')

  return <section className='folder-content scroll-section with-tree overflow-y-auto w-full h-full'>
    <div className='flex'>
      <h2 className='headline overflow-hidden'>{name}</h2>
      A-Z
    </div>
    <Content atRoot={!id} items={data} loading={loading} />
  </section>
}

const useFolderName = ({ id }) => {
  const [name, setName] = useState('Loading…')

  useEffect(() => {
    if (!id) setName('Bookmarks')
    else {
      client.get({ id })
        .then(({ name }) => setName(name))
        .catch(() => setName('[Deleted]'))
    }
  }, [id])

  return name
}

const Content = ({ atRoot, items, loading }) => {
  if (!items) return <Loader /> // no loader on query change to reduce flicker
  else if (atRoot && !loading && !items.length) return <ImportBookmarksHint />
  else return <Item.List items={Item.sort(items)} showMenuButton={true} />
}

const ImportBookmarksHint = () =>
  <div>
    <p>Welcome!</p>
    <p>You have no bookmarks yet.</p>
    <p>Would you like to <Link to='/imports/create'>import your existing bookmarks</Link>?</p>
  </div>
