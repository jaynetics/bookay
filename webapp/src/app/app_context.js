import { createContext } from 'preact'

export const AppContext = createContext({
  changesById: {},
  broadcastChange: (_) => undefined,

  idsToCut: [],
  setIdsToCut: (_) => undefined,

  selectedIds: [],
  setSelectedIds: (_) => undefined,
})
