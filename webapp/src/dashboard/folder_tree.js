import { arrayToTree } from 'performant-array-to-tree'
import { Link, route } from '../lib'
import { client, useAPI } from '../shared'
import { Item, dropTargetBehavior } from '../items'
import { useMemo } from 'preact/hooks'

export const FolderTree = ({ activeId }) => {
  const { data } = useAPI(client.getAllFolders())
  const tree = useMemo(() => data && treeify(data), [data])

  return <section
    className='folder-tree scoll-section w-full h-full'
    {...dropTargetBehavior({ item: { name: 'root folder', id: null } })}
  >
    <h2 className='headline overflow-hidden' onClick={() => route('/')}>Folders</h2>
    <Content activeId={activeId} tree={tree} />
  </section>
}

const treeify = (items) =>
  arrayToTree(Item.sort(items), { dataField: null, parentId: 'folderId' })

const Content = ({ activeId, tree }) => {
  if (!tree) return null
  if (!tree.length) return <Link to='/items/create?type=folder'>Create a folder</Link>
  return <Item.List activeId={activeId} items={tree} expandable={true} />
}
