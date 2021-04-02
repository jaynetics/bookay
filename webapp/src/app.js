import { useState, useCallback, useEffect } from 'preact/hooks'
import { AppContext, GlobalFlashMessage, Nav, RouteSwitch } from './app/index'
import { HashRouter } from './lib'
import { client } from './shared'

import './css/tailwind.css'
// import './css/sakura.css'
// import './css/custom.css'

const App = () => {
  const [changesById, setChangesById] = useState({})
  const [idsToCut, setIdsToCut] = useState([])
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [user, setUser] = useState(null)

  const broadcastChange = ({ id, ...change }) => {
    const prevChange = changesById[id]
    setChangesById({ ...changesById, [id]: { ...change, ...prevChange } })
  }

  const loadUser = useCallback(() => {
    client.getUser().then(setUser).catch(() => 0)
  }, [setUser])

  useEffect(loadUser, [loadUser])

  return <AppContext.Provider value={{
    changesById, broadcastChange,
    idsToCut, setIdsToCut,
    search, setSearch,
    selectedIds, setSelectedIds,
    user, loadUser,
  }}>
    <HashRouter>
      <Nav />
      <main className='flex overflow-auto'>
        <RouteSwitch />
      </main>
      <GlobalFlashMessage />
    </HashRouter>
  </AppContext.Provider>
}

export default App
