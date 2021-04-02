import { useContext } from 'preact/hooks'
import { AppContext } from '../app/index'
import { Loader, client, useAPI } from '../shared'
import { Item } from './item'

export const SearchResult = () => {
  const { search: q } = useContext(AppContext)
  const { data } = useAPI(client.getAll({ filter: { q } }), [q])

  return <section className='folder-content scoll-section w-full h-full'>
    <h2 className='headline overflow-hidden'>
      {data ? `${data.length} results for ${q}` : 'Searching…'}
    </h2>
    <Content items={data} />
  </section>
}

const Content = ({ items }) => {
  if (!items) return <Loader /> // no loader on query change to reduce flicker
  return <Item.List items={Item.sort(items)} showMenuButton={true} />
}
