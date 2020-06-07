/** @jsx h */
import { h } from 'preact'
import { useState, useContext } from 'preact/hooks'
import { route } from 'preact-router'
import { ContextMenu, EventTestHelper, classNames } from '../lib'
import { AppContext } from '../app/index'
import { ItemContextMenu } from './context_menu'
import { client } from '../shared'

export const Item = ({
  activeId = null,
  expandable = false,
  item,
  showMenuButton = false,
}) => {
  const [open, setOpen] = useState(false)
  const [menuCoords, setMenuCoords] = useState(null)

  const app = useContext(AppContext)
  const changes = app.changesById[item.id]
  if (changes) Object.assign(item, changes)
  if (item.removed) return null

  return <Wrapper app={app} item={item}>
    <Body
      activeId={activeId}
      app={app}
      expandable={expandable}
      item={item}
      menuOpen={!!menuCoords}
      setMenuCoords={setMenuCoords}
    >
      <Icon
        expandable={expandable}
        item={item}
        open={open}
        setOpen={setOpen}
      />

      <Name item={item} />

      <Info item={item} />

      {showMenuButton && <ItemMenuButton
        active={!!menuCoords}
        setMenuCoords={setMenuCoords}
      />}
    </Body>

    {open && <Item.List
      activeId={activeId}
      expandable={expandable}
      items={item.children}
    />}

    {menuCoords && <ItemContextMenu
      coords={menuCoords}
      item={item}
      setCoords={setMenuCoords}
    />}
  </Wrapper >
}

const Wrapper = ({ app, children, item }) =>
  <div
    className={classNames({
      item: true,
      cut: app.idsToCut.includes(item.id),
      selected: app.selectedIds.includes(item.id)
    })}
    {...dragAndDropBehavior({ item, selectedIds: app.selectedIds })}
  >
    {children}
  </div>

const Body = ({ app, activeId, children, expandable, item, menuOpen, setMenuCoords }) => {
  const [touchEvent, setTouchEvent] = useState(false)
  const onTouchStart = () => setTouchEvent(true)

  const openItem = () => {
    if (ContextMenu.closeAll()) return false
    else if (item.type === 'folder') route(`/folders/${item.id}`)
    else if (item.type === 'url') window.open(item.url)
  }

  return <div
    className={classNames({
      'item-body': true,
      active: item.id === activeId || menuOpen,
    })}
    onClick={() => {
      if (expandable || touchEvent) {
        if (touchEvent) setTouchEvent(false)
        openItem()
      }
      else { // regular mouse click outside tree => toggle selection state
        const { selectedIds: ids, setSelectedIds: setIds } = app
        if (ids.includes(item.id)) setIds(ids.filter(e => e !== item.id))
        else setIds([...ids, item.id])
      }
    }}
    onContextMenu={(event) => {
      event.preventDefault()
      setMenuCoords([event.x, event.y])
    }}
    onDblClick={openItem}
    onTouchStart={onTouchStart}
  >
    {children}
    <EventTestHelper target={item.name} touchstart={onTouchStart} />
  </div>
}

const Icon = ({ expandable, item, open, setOpen, }) =>
  <div onClick={() => expandable && setOpen(!open)}>
    <span className='item-toggle' aria-disabled={!expandable}>
      {expandable && item.children.length ? (open ? '▼' : '▶') : null}
    </span>
    <span className='item-icon' role='img' aria-label='Icon'>
      {item.type === 'folder' ? <FolderIcon /> : '★'}
    </span>
  </div>

// replacement for U+1F5BF BLACK FOLDER, which is not available everywhere yet
const FolderIcon = () =>
  <svg fill='currentColor' viewBox='0 160 500 200'>
    <g>
      <path stroke='none' d='M 259.7344,369.5625 H 28.5469 V 196.0312 l 18.5625,-27.9843 h 57.5156 l 17.0156,27.9843 h 138.0938 z' />
    </g>
  </svg>

const Name = ({ item }) =>
  <div className='item-name'>{item.name}</div>

const Info = ({ item }) =>
  <div className='item-info'>{item.info || item.url}</div>

const ItemMenuButton = ({ active, setMenuCoords }) => {
  // can not use css hover, as it is not cleared in some cases on touch devices
  const [hover, setHover] = useState(false)

  return <span
    className={classNames({ 'item-menu-button': true, active: active || hover })}
    onClick={(event) => {
      ContextMenu.closeAll()
      setMenuCoords([event.x, event.y])
      setHover(false)
      event.stopPropagation() // do not select the item
    }}
    onMouseEnter={() => hover === null || setHover(true)}
    onMouseLeave={() => hover === null || setHover(false)}
    onTouchStart={(event) => {
      setHover(null)
      event.stopPropagation()
    }}
  >
    ⋮
  </span>
}

const dragAndDropBehavior = ({ item, selectedIds }) => {
  if (item.type === 'url') return draggableBehavior({ item, selectedIds })
  else if (item.type === 'folder') return {
    ...draggableBehavior({ item, selectedIds }),
    ...dropTargetBehavior({ item }),
  }
}

const draggableBehavior = ({ item, selectedIds }) => ({
  draggable: true,
  onDragStart: (e) => {
    // we are moving, not copying, but 'move' doesn't show a helpful cursor
    e.dataTransfer.effectAllowed = 'copy'

    // move the whole current selection iff the dragged item is part of it
    const ids = selectedIds.includes(item.id) ? selectedIds : [item.id]
    e.dataTransfer.setData('application/json', JSON.stringify(ids))
    // this allows dragging into, e.g., a browser's tab bar to open a new tab
    item.url && e.dataTransfer.setData('text/uri-list', item.url)

    // show a preview while dragging
    const text = ids.length === 1 ?
      `${item.name.substring(0, 20)}${item.name.length > 20 ? '…' : ''}` :
      `[${ids.length} items]`
    const view = buildDragPreview({ text })
    e.dataTransfer.setDragImage(view, 0, view.height)
  }
})

const buildDragPreview = ({ text }) => {
  const view = document.createElement('canvas')
  view.id = 'dragview'
  view.height = parseInt(prototypeStyle('.item', 'height'))
  view.width = 180
  const ctx = view.getContext('2d')
  ctx.fillStyle = prototypeStyle('body', 'background-color')
  ctx.fillRect(0, 0, view.width, view.height)
  ctx.fillStyle = prototypeStyle('.item-name', 'color')
  ctx.font = prototypeStyle('.item-name', 'font')
  ctx.fillText(text, 10, view.height / 1.5, view.width - 20)
  document.querySelectorAll(`#${view.id}`).forEach((e) => e.remove())
  document.body.append(view)

  return view
}

const dropTargetBehavior = ({ item }) => ({
  onDragEnter: (e) => e.dataTransfer.dropEffect = 'copy',
  onDragLeave: (e) => e.dataTransfer.dropEffect = 'none',
  onDragOver: (e) => e.preventDefault(), // needed. this WHATWG spec is weird.
  onDrop: async (e) => {
    const ids = JSON.parse(e.dataTransfer.getData('application/json'))
    if (!ids || ids.includes(item.id)) return // cant paste into self

    for (let i = 0; i < ids.length; i++) {
      await client.update({ id: ids[i], folderId: item.id })
    }
    setTimeout(() => window.location.reload(), 50)
  }
})

const prototypeStyle = (selector, attr) =>
  getComputedStyle(document.querySelector(selector)).getPropertyValue(attr)

Item.List = ({ items, ...itemProps }) =>
  <div className='item-list'>
    {items.map(item => <Item item={item} {...itemProps} />)}
  </div>

Item.sort = (items) =>
  items.sort((itemA, itemB) =>
    Intl.Collator().compare(
      `${itemA.type}${itemA.name}`, `${itemB.type}${itemB.name}`
    )
  )

Item.typeName = (type) => {
  if (type === 'url') return 'bookmark'
  if (type === 'folder') return 'folder'
  throw new Error(`unknown item type "${type}"`)
}
