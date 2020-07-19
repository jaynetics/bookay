/** @jsx h */
import { h } from 'preact'
import { route } from '../lib'
import { FolderSelect } from '../shared'

export const MobileFolderSelect = ({ activeId }) =>
  <FolderSelect
    name='activeId'
    rootLabel={activeId ? 'Back to root' : 'Quickly jump to a folder'}
    setValue={(_, id) => route(id ? `/folders/${id}` : '/')}
    showBrowser={false}
    values={{ activeId }}
  />
