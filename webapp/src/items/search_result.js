/** @jsx h */
import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { client } from '../shared'
import { Item } from './item'

export const SearchResult = (props) => {
  const { q } = props.matches
  const [items, setItems] = useState(null)
  useEffect(() => {
    client.getAll({ filter: { q } }).then((res) => setItems(Item.sort(res)))
  }, [q])

  return <section className='folder-content without-tree scroll-section'>
    <h2 className='headline'>
      {items === null ? 'Searching ...' : `${items.length} results for ${q}`}
    </h2>
    <Item.List items={items || []} showMenuButton={true} />
  </section>
}
