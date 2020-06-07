/** @jsx h */
import { h } from 'preact'
import { useContext } from 'preact/hooks'
import { route } from 'preact-router'
import { ContextMenu, copyToClipboard, flash } from '../lib'
import { client } from '../shared'
import { AppContext } from '../app/index'

export const ItemContextMenu = (props) =>
  props.coords ? <ItemContexMenuComponent {...props} /> : null

const ItemContexMenuComponent = ({ coords, item, setCoords }) => {
  const app = useContext(AppContext)

  return <ContextMenu coords={coords} setCoords={setCoords}>
    {entries({ item }).map((Comp) => <Comp app={app} item={item} />)}
  </ContextMenu>
}

const entries = ({ item }) => {
  if (item.customMenu === 'brokenURLMenu') {
    return [OpenURL, SeeArchiveOrg, SetArchiveOrg, Edit, Delete]
  }
  else if (item.customMenu === 'discardableMenu') {
    return [Edit, Delete]
  }
  else if (item.type === 'folder') {
    return [AddItem, Edit, Divider, Select, Cut, CutSelected, Paste, Dissolve, Delete, DeleteSelected]
  }
  else if (item.type === 'url') {
    return [OpenURL, CopyURL, Edit, Divider, Select, Cut, CutSelected, Delete, DeleteSelected]
  }
}

// buttons

const AddItem = ({ app, item }) =>
  <Button icon='+' text='Add item' func={() => route(`/items/create?folderId=${item.id}`)} />

const Edit = ({ app, item }) =>
  <Button icon='✎' text='Edit' func={() => route(`/items/${item.id}`)} />

const Select = ({ app: { selectedIds, setSelectedIds }, item }) => {
  const selected = selectedIds.includes(item.id)
  const toggle = selected ?
    () => setSelectedIds(selectedIds.filter(e => e !== item.id)) :
    () => setSelectedIds([...selectedIds, item.id])

  return <Button
    icon={selected ? '☐' : '☑'}
    text={selected ? 'Deselect' : 'Select'}
    func={() => toggle()}
  />
}

const Cut = ({ app: { setIdsToCut }, item }) =>
  <Button icon='✂' text='Cut' func={() => setIdsToCut([item.id])} />

const CutSelected = ({ app: { selectedIds, setIdsToCut }, item }) => {
  const ids = selectedIds.length && selectedIds

  return <Button
    disabled={!ids}
    icon='✂'
    text={`Cut selected${ids ? ` (${ids.length})` : ''}`}
    func={() => setIdsToCut(ids)}
  />
}

const Paste = ({ app: { idsToCut }, item }) => {
  const canPaste = idsToCut.length &&
    !idsToCut.includes(item.id) &&
    !idsToCut.includes(item.folderId)

  return <Button
    disabled={!canPaste}
    icon='⎘'
    text={`Paste${idsToCut.length > 1 ? ` (${idsToCut.length})` : ''}`}
    func={() => move({ ids: idsToCut, intoFolderId: item.id })}
  />
}

const Dissolve = ({ app, item }) =>
  <Button icon='🝢' text='Dissolve' func={() => showDissolveDialog({ item })} />

const Delete = ({ app: { broadcastChange }, item }) =>
  <Button icon='✕' text='Delete' func={() => showDeleteDialog({ broadcastChange, item })} />

const DeleteSelected = ({ app: { broadcastChange, selectedIds }, item }) => {
  const ids = selectedIds.length && selectedIds

  return <Button
    disabled={!ids}
    icon='✕'
    text={`Delete selected${ids.length ? ` (${ids.length})` : ''}`}
    func={() => showDeleteDialog({ broadcastChange, ids })}
  />
}

const OpenURL = ({ app, item }) =>
  <Button icon='↗️' text='Open URL' func={() => open(item.url)} />

const CopyURL = ({ app, item }) =>
  <Button icon='⧉' text='Copy URL' func={() => copy(item.url)} />

const SeeArchiveOrg = ({ app, item }) => {
  const url = archivedURL({ item })

  return <Button
    icon='↗️'
    text='See on archive.org'
    func={() => open(url)}
  />
}

const SetArchiveOrg = ({ app: { broadcastChange }, item }) => {
  const url = archivedURL({ item })

  return <Button
    icon='⇄'
    text='Set to archive.org'
    func={() => update({ broadcastChange, item, url })}
  />
}

const Button = ({ icon, text, func, disabled = false }) =>
  <button disabled={disabled} onClick={(e) => !disabled && func(e)}>
    <span className='button-icon'>{icon}</span>
    {text}
  </button>

const Divider = () =>
  <div className='button-divider'></div>

// button actions

const open = (url) =>
  window.open(url)

const move = async ({ ids, intoFolderId: folderId }) => {
  for (let i = 0; i < ids.length; i++) {
    await client.update({ id: ids[i], folderId })
  }
  window.location.reload()
}

const update = ({ broadcastChange, item, ...args }) => {
  const { id } = item
  client.update({ id, ...args })
    .then(() => {
      broadcastChange({ id, ...args })
      flash('Item updated!')
    })
    .catch(() => flash('Error, please check your input!'))
}

const showDeleteDialog = ({ broadcastChange, ids = undefined, item = undefined }) => {
  let msg
  if (item) {
    msg =
      `Are you sure you want to delete "${item.name}"` +
      `${item.type === 'folder' ? ' along with all contents?' : '?'}`
  }
  else if (ids) {
    msg = `Are you sure you want to delete ${ids.length} items?`
  }
  if (!window.confirm(msg)) return

  (ids || [item.id]).forEach((id) =>
    client.remove({ id }).then(() => {
      broadcastChange({ id, removed: true })
      flash('Item deleted!')
    })
  )
}

const showDissolveDialog = ({ item: { id, name } }) => {
  const msg =
    `Are you sure you want to dissolve "${name}" ` +
    `and move all its contents to its parent folder?`
  if (!window.confirm(msg)) return

  client.dissolve({ id }).then(() => window.location.reload())
}

const copy = (string) => {
  const success = copyToClipboard(string)
  flash(success ? 'Copied to clipboard!' : 'Unsupported :(')
}

const archivedURL = ({ item: { url } }) => {
  const prefix = 'https://web.archive.org/web/*/'
  return url.indexOf(prefix) === 0 ? url : `${prefix}${url}`
}
