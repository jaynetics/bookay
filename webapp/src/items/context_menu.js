import { useContext } from 'preact/hooks'
import { ContextMenu } from '../lib'
import { AppContext } from '../app/index'
import * as Button from './actions'

export const ItemContextMenu = (props) =>
  props.coords ? <ItemContexMenuComponent {...props} /> : null

const ItemContexMenuComponent = ({ coords, item, setCoords }) => {
  const app = useContext(AppContext)

  return <ContextMenu coords={coords} setCoords={setCoords}>
    {entries({ item }).map((Comp) => <Comp app={app} item={item} />)}
  </ContextMenu>
}

const entries = ({ item }) => {
  if (item.customMenu === 'brokenURLMenu') return BROKEN_URL_MENU
  else if (item.customMenu === 'discardMenu') return DISCARD_MENU
  else if (item.type === 'folder') return FOLDER_MENU
  else if (item.type === 'url') return URL_MENU
}

const FOLDER_MENU = [
  Button.AddItem,
  Button.Edit,
  Button.Divider,
  Button.Select,
  Button.Cut,
  Button.CutSelected,
  Button.Paste,
  Button.Dissolve,
  Button.Delete,
  Button.DeleteSelected,
]

const URL_MENU = [
  Button.OpenURL,
  Button.CopyURL,
  Button.Edit,
  Button.Divider,
  Button.Select,
  Button.Cut,
  Button.CutSelected,
  Button.Delete,
  Button.DeleteSelected,
]

const BROKEN_URL_MENU = [
  Button.OpenURL,
  Button.SeeArchiveOrg,
  Button.SetArchiveOrg,
  Button.Edit,
  Button.Delete,
]

const DISCARD_MENU = [
  Button.Edit,
  Button.Delete,
]
