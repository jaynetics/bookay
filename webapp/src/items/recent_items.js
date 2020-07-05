/** @jsx h */
import { h } from 'preact'
import { Loader, client, useAPI } from '../shared'
import { Item } from './item'

export const RecentItems = () => {
  const { data } = useAPI(
    client.getAll({ filter: { type: 'url' }, sort: ['createdAt', 'DESC'] })
  )

  return <section className='folder-content scroll-section'>
    <h2 className='headline'>{data ? 'Recent bookmarks' : 'Loading…'}</h2>
    {data ? <Item.List items={data} showMenuButton={true} /> : <Loader />}
  </section>
}
