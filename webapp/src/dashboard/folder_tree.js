/** @jsx h */
import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import { route } from 'preact-router'
import { arrayToTree } from 'performant-array-to-tree'
import { client } from '../shared'
import { Item } from '../items'

export const FolderTree = ({ activeId }) => {
  const [tree, setTree] = useState(null)
  useEffect(() => {
    client.getAll({ filter: { type: 'folder' } }).then((result) => {
      const folders = Item.sort(result)
      const tree = arrayToTree(folders, { dataField: null, parentId: 'folderId' })
      setTree(tree)
    }).catch(console.warn)
  }, [setTree])

  return <section className='folder-tree scroll-section'>
    <h2 className='headline' onClick={() => route('/')}>Folders</h2>
    <Content activeId={activeId} tree={tree} />
  </section>
}

const Content = ({ activeId, tree }) => {
  if (!tree) return null
  if (!tree.length) return <a href='/items/create?type=folder'>Create a folder</a>
  return <Item.List activeId={activeId} items={tree} expandable={true} />
}
