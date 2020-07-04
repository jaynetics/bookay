/** @jsx h */
import { h } from 'preact'
import { useMemo } from 'preact/hooks'
import { route } from 'preact-router'
import { Form, truncate } from '../lib'
import { client, useAPI } from './client'
import { Item } from '../items'

export const FolderSelect = ({
  rootLabel = 'none (root)',
  name = 'folderId',
  label = null,
  routing = null,
  ...form
}) => {
  const defaultOption = [rootLabel, '']
  const { data } = useAPI(client.getAllFolders())
  const options = useMemo(
    () => data && Item.sort(data).map((f) => [f.name, f.id]), [data]
  ) || []

  return <div style={options.length === 0 && { visibility: 'hidden' }}>
    {routing && routing.path.includes('/in/:folderId') && data ?
      <FolderSelectBrowser
        folders={data}
        onSelect={(folderId) => form.setValues({ ...form.values, folderId })}
        routing={routing}
      /> : null}
    <Form.Select
      options={[defaultOption, ...options]}
      name={name}
      label={label}
      {...form}
    />
    {routing && <div>
      <a href={`${routing.url}/in/`}>Browse folders</a>
    </div>}
  </div>
}

export const FolderSelectBrowser = ({
  folders,
  onSelect,
  routing: { matches, url },
}) => {
  const folderId = parseInt(matches.folderId) || null
  const activeFolder = folders.find((f) => f.id === folderId)
  const subfolders = folders.filter((f) => f.folderId === folderId)
  const exit = () => route(url.replace(/\/in(\/\d*)?$/, ''))

  return <section className='folder-content scroll-section folder-browser'>
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
      route(url.replace(/\/in(\/\d*)?$/, `/in/${item.id}`))
      return true
    }} />
  </section>
}
