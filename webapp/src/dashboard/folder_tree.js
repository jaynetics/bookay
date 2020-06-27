/** @jsx h */
import { h } from 'preact'
import { route } from 'preact-router'
import { arrayToTree } from 'performant-array-to-tree'
import { client, useAPI } from '../shared'
import { Item } from '../items'
import { useMemo } from 'preact/hooks'

export const FolderTree = ({ activeId }) => {
  const { data } = useAPI(client.getAllFolders())
  const tree = useMemo(() => data && treeify(data), [data])

  return <section className='folder-tree scroll-section'>
    <h2 className='headline' onClick={() => route('/')}>Folders</h2>
    <Content activeId={activeId} tree={tree} />
  </section>
}

const treeify = (items) =>
  arrayToTree(Item.sort(items), { dataField: null, parentId: 'folderId' })

const Content = ({ activeId, tree }) => {
  if (!tree) return null
  if (!tree.length) return <a href='/items/create?type=folder'>Create a folder</a>
  return <Item.List activeId={activeId} items={tree} expandable={true} />
}
