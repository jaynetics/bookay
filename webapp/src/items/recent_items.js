/** @jsx h */
import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { client } from '../shared'
import { Item } from './item'

export const RecentItems = ({ path }) => {
  const [items, setItems] = useState([])
  useEffect(() => {
    client.getAll({ filter: { type: 'url' }, sort: ['createdAt', 'DESC'] })
      .then(setItems)
  }, [])

  return <section className='folder-content without-tree scroll-section'>
    <h2 className='headline'>
      Recent bookmarks
    </h2>
    <Item.List items={items} showMenuButton={true} />
  </section>
}
