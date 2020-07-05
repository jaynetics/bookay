/** @jsx h */
import { h } from 'preact'
import { useState } from 'preact/hooks'
import { AppContext, GlobalFlashMessage, Nav, RouteSwitch } from './app/index'
import { HashRouter } from './lib'

const App = () => {
  const [changesById, setChangesById] = useState({})
  const [idsToCut, setIdsToCut] = useState([])
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState([])

  const broadcastChange = ({ id, ...change }) => {
    const prevChange = changesById[id]
    setChangesById({ ...changesById, [id]: { ...change, ...prevChange } })
  }

  return <AppContext.Provider value={{
    changesById, broadcastChange,
    idsToCut, setIdsToCut,
    search, setSearch,
    selectedIds, setSelectedIds,
  }}>
    <HashRouter>
      <Nav />
      <main>
        <RouteSwitch />
      </main>
      <GlobalFlashMessage />
    </HashRouter>
  </AppContext.Provider>
}

export default App

