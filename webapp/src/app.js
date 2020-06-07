/** @jsx h */
import { h } from 'preact'
import { useState } from 'preact/hooks'
import { AppContext, GlobalFlashMessage, Nav, Router } from './app/index'

const App = () => {
  const [changesById, setChangesById] = useState({})
  const [idsToCut, setIdsToCut] = useState([])
  const [selectedIds, setSelectedIds] = useState([])

  const broadcastChange = ({ id, ...change }) => {
    const prevChange = changesById[id]
    setChangesById({ ...changesById, [id]: { ...change, ...prevChange } })
  }

  return <AppContext.Provider value={{
    changesById, broadcastChange,
    idsToCut, setIdsToCut,
    selectedIds, setSelectedIds,
  }}>
    <Nav />
    <main>
      <Router />
    </main>
    <GlobalFlashMessage />
  </AppContext.Provider>
}

export default App

