/** @jsx h */
import { h } from 'preact'
import { route } from 'preact-router'
import { FolderSelect } from '../shared'

export const MobileFolderSelect = ({ activeId }) =>
  <FolderSelect
    name='activeId'
    rootLabel={activeId ? 'Back to root' : 'Quickly jump to a folder'}
    onChange={({ target: { value: id } }) => route(id ? `/folders/${id}` : '/')}
    values={{ activeId }}
  />
