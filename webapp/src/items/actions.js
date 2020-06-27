/** @jsx h */
import { h } from 'preact'
import { route } from 'preact-router'
import { copyToClipboard, flash } from '../lib'
import { client } from '../shared'

// item action buttons

export const AddItem = ({ app, item }) =>
  <Button
    icon='+'
    text='Add item'
    func={() => route(`/items/create?folderId=${item.id}`)}
  />

export const Edit = ({ app, item }) =>
  <Button icon='✎' text='Edit' func={() => route(`/items/${item.id}`)} />

export const Select = ({ app: { selectedIds, setSelectedIds }, item }) => {
  const selected = selectedIds.includes(item.id)

  return <Button
    icon={selected ? '☐' : '☑'}
    text={selected ? 'Deselect' : 'Select'}
    func={() => toggleSelect({ item, selectedIds, setSelectedIds })}
  />
}

export const Cut = ({ app: { setIdsToCut }, item }) =>
  <Button icon='✂' text='Cut' func={() => setIdsToCut([item.id])} />

export const CutSelected = ({ app: { selectedIds, setIdsToCut }, item }) => {
  const ids = selectedIds.length && selectedIds

  return <Button
    disabled={!ids}
    icon='✂'
    text={`Cut selected${ids ? ` (${ids.length})` : ''}`}
    func={() => setIdsToCut(ids)}
  />
}

export const Paste = ({ app: { idsToCut }, item }) => {
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

export const Dissolve = ({ app, item }) =>
  <Button icon='🝢' text='Dissolve' func={() => showDissolveDialog({ item })} />

export const Delete = ({ app: { broadcastChange }, item }) =>
  <Button
    icon='✕'
    text='Delete'
    func={() => showDeleteDialog({ broadcastChange, item })}
  />

export const DeleteSelected = ({ app: { broadcastChange, selectedIds } }) => {
  const ids = selectedIds.length && selectedIds

  return <Button
    disabled={!ids}
    icon='✕'
    text={`Delete selected${ids.length ? ` (${ids.length})` : ''}`}
    func={() => showDeleteDialog({ broadcastChange, ids })}
  />
}

export const OpenURL = ({ app, item }) =>
  <Button icon='→' text='Open URL' func={() => openURL(item.url)} />

export const CopyURL = ({ app, item }) =>
  <Button icon='⧉' text='Copy URL' func={() => copyURL(item.url)} />

export const SeeArchiveOrg = ({ app, item }) => {
  const url = archivedURL({ item })

  return <Button
    icon='→'
    text='See on archive.org'
    func={() => openURL(url)}
  />
}

export const SetArchiveOrg = ({ app: { broadcastChange }, item }) => {
  const url = archivedURL({ item })

  return <Button
    icon='⇄'
    text='Set to archive.org'
    func={() => updateItem({ broadcastChange, item, url })}
  />
}

export const Divider = () =>
  <div className='button-divider'></div>

const Button = ({ icon, text, func, disabled = false }) =>
  <button disabled={disabled} onClick={(e) => !disabled && func(e)}>
    <span className='button-icon'>{icon}</span>
    {text}
  </button>

// item actions

export const openURL = (url) =>
  window.open(url)

export const move = async ({ ids, intoFolderId: folderId }) => {
  try {
    for (let i = 0; i < ids.length; i++) {
      await client.update({ id: ids[i], folderId })
    }
    setTimeout(() => window.location.reload(), 50)
  } catch (e) { flash(e) }
}

export const updateItem = ({ broadcastChange, item, ...args }) => {
  const { id } = item
  client.update({ id, ...args })
    .then(() => {
      broadcastChange({ id, ...args })
      flash('Item updated!')
    })
    .catch(() => flash('Error, please check your input!'))
}

export const showDeleteDialog = ({
  broadcastChange,
  ids = undefined,
  item = undefined,
}) => {
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

export const showDissolveDialog = ({ item: { id, name } }) => {
  const msg =
    `Are you sure you want to dissolve "${name}" ` +
    `and move all its contents to its parent folder?`
  if (!window.confirm(msg)) return

  client.dissolve({ id }).then(() => window.location.reload())
}

export const copyURL = (string) => {
  const success = copyToClipboard(string)
  flash(success ? 'Copied to clipboard!' : 'Unsupported :(')
}

export const toggleSelect = ({ item, selectedIds, setSelectedIds }) => {
  selectedIds.includes(item.id) ?
    setSelectedIds(selectedIds.filter((id) => id !== item.id)) :
    setSelectedIds([...selectedIds, item.id])
}

const archivedURL = ({ item: { url } }) => {
  const prefix = 'https://web.archive.org/web/*/'
  return url.indexOf(prefix) === 0 ? url : `${prefix}${url}`
}
