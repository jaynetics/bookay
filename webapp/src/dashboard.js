import { ForResolution } from './lib'
import { FolderContent, FolderTree, MobileFolderSelect } from './dashboard/index'

export const Dashboard = ({ params }) => {
  const activeId = parseInt(params.id) || null

  return <div className='dashboard'>
    <ForResolution above={684}>
      <FolderTree activeId={activeId} />
      <div className='folder-tree-border' />
    </ForResolution>
    <ForResolution upto={684}>
      <MobileFolderSelect activeId={activeId} />
    </ForResolution>
    <FolderContent id={activeId} />
  </div>
}
