import { Loader, client, useAPI } from '../shared'
import { Item } from './item'

export const RecentItems = () => {
  const { data } = useAPI(
    client.getAll({ filter: { type: 'url' }, sort: ['createdAt', 'DESC'] })
  )

  return <section className='folder-content scoll-section w-full h-full'>
    <h2 className='headline overflow-hidden'>{data ? 'Recent bookmarks' : 'Loading…'}</h2>
    {data ? <Item.List items={data} showMenuButton={true} /> : <Loader />}
  </section>
}
