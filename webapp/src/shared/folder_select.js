import { useMemo, useState } from 'preact/hooks'
import { useRoute } from 'wouter-preact'
import { Form, Link, currentLocation, route, truncate, useDidUpdateRoute } from '../lib'
import { client, useAPI } from './client'
import { Item } from '../items'

export const FolderSelect = ({
  blockedIds = [],
  rootLabel = 'none (root)',
  name = 'folderId',
  label = null,
  showBrowser = true,
  ...form
}) => {
  const defaultOption = [rootLabel, null]

  const { data, loading } = useAPI(client.getAllFolders())
  const validFolders = useMemo(() => {
    if (!data) return []
    if (blockedIds.length) return data.filter((f) => !blockedIds.includes(f.id))
    return data
  }, [blockedIds, data])
  const options = useMemo(() => {
    return Item.sort(validFolders).map((f) => [f.name, f.id])
  }, [validFolders])

  // Prevent layout shift for default case (there are folders),
  // but give up the space if there are none.
  let style = {}
  if (loading) style = { visibility: 'hidden' }
  else if (options.length === 0) style = { display: 'none' }

  return <div style={style}>
    <Form.Select
      options={[defaultOption, ...options]}
      name={name}
      label={label}
      {...form}
    />
    {showBrowser && <div>
      <Link to={`${currentLocation()}/in-folder/`}>Browse folders</Link>
    </div>}
    <FolderBrowserModal
      folders={validFolders}
      onSelect={(folderId) => form.setValue('folderId', folderId)}
    />
  </div>
}

export const FolderBrowserModal = ({ folders, onSelect }) => {
  const [active, params] = useRoute('/:baseRoute+/in-folder/:folderId?')
  const [addFolder, setAddFolder] = useState(false)
  if (!active || !folders) return null

  const folderId = parseInt(params.folderId) || null
  const activeFolder = folders.find((f) => f.id === folderId)
  const subfolders = folders.filter((f) => f.folderId === folderId)
  const exit = () => route(`/${params.baseRoute}`)

  return <section className='folder-content scroll-section modal overflow-y-auto w-full h-full'>
    <h3 className='headline overflow-hidden'>
      Folder: {activeFolder ? truncate(activeFolder.name, 30) : 'root'}
    </h3>

    <button type='button' onClick={() => {
      onSelect(folderId)
      exit()
    }}>
      Choose
    </button>
    {' '}
    <button type='button' onClick={() => setAddFolder(!addFolder)}>
      New folder
    </button>
    {' '}
    <button type='button' onClick={exit}>Cancel</button>

    {addFolder && <InlineNewFolderForm
      close={() => setAddFolder(false)}
      folderId={folderId}
    />}

    <Item.List items={Item.sort(subfolders)} onClick={(_event, item) => {
      route(`/${params.baseRoute}/in-folder/${item.id}`)
      return true
    }} />
  </section>
}

// This can't be an actual form tag as it needs to be nestable in other forms.
// An alternative would be to use a modal/portal lib to render this stuff.
const InlineNewFolderForm = ({ close, folderId }) => {
  const [name, setName] = useState('')

  // self-hide on any routing action
  useDidUpdateRoute(close)

  return <div>
    <input
      form='none' // avoids submitting outer form on enter keypress
      name='name'
      onKeyUp={(e) => setName(e.target.value)}
      type='text'
      value={name}
    />
    {' '}
    <button
      disabled={!name}
      onClick={
        () =>
          client.create({ folderId, name, type: 'folder' })
            .then(() => setTimeout(() => window.location.reload(), 50))
            .catch(console.error)
      }
      type='button'
    >
      Add
    </button>
  </div>
}
