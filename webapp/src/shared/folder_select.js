/** @jsx h */
import { h } from 'preact'
import { useMemo } from 'preact/hooks'
import { useRoute } from 'wouter-preact'
import { Form, Link, currentLocation, route, truncate } from '../lib'
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
  const defaultOption = [rootLabel, '']
  const { data } = useAPI(client.getAllFolders())
  const validFolders = useMemo(() => {
    if (!data) return []
    if (blockedIds.length) return data.filter((f) => !blockedIds.includes(f.id))
    return data
  }, [blockedIds, data])
  const options = useMemo(() => {
    return Item.sort(validFolders).map((f) => [f.name, f.id])
  }, [validFolders])

  return <div style={options.length === 0 && { visibility: 'hidden' }}>
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
      onSelect={(folderId) => form.setValues({ ...form.values, folderId })}
    />
  </div>
}

export const FolderBrowserModal = ({ folders, onSelect }) => {
  const [active, params] = useRoute('/:baseRoute+/in-folder/:folderId?')
  if (!active || !folders) return null

  const folderId = parseInt(params.folderId) || null
  const activeFolder = folders.find((f) => f.id === folderId)
  const subfolders = folders.filter((f) => f.folderId === folderId)
  const exit = () => route(`/${params.baseRoute}`)

  return <section className='folder-content scroll-section modal'>
    <h3 className='headline'>
      Folder: {activeFolder ? truncate(activeFolder.name, 30) : 'root'}
    </h3>

    <button type='button' onClick={() => {
      onSelect(folderId)
      exit()
    }}>
      Choose this folder
    </button>
    {' '}
    <button type='button' onClick={exit}>Cancel</button>

    <Item.List items={Item.sort(subfolders)} onClick={(_event, item) => {
      route(`/${params.baseRoute}/in-folder/${item.id}`)
      return true
    }} />
  </section>
}
