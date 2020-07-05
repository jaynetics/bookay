/** @jsx h */
import { h } from 'preact'
import { useContext } from 'preact/hooks'
import { AppContext } from '../app/index'
import { Loader, client, useAPI } from '../shared'
import { Item } from './item'

export const SearchResult = () => {
  const { search: q } = useContext(AppContext)
  const { data } = useAPI(client.getAll({ filter: { q } }), [q])

  return <section className='folder-content scroll-section'>
    <h2 className='headline'>
      {data ? `${data.length} results for ${q}` : 'Searching…'}
    </h2>
    <Content items={data} />
  </section>
}

const Content = ({ items }) => {
  if (!items) return <Loader /> // no loader on query change to reduce flicker
  return <Item.List items={Item.sort(items)} showMenuButton={true} />
}
