import { createContext } from 'preact'

export const AppContext = createContext({
  changesById: {},
  broadcastChange: (_) => undefined,

  idsToCut: [],
  setIdsToCut: (_) => undefined,

  search: '',
  setSearch: (_) => undefined,

  selectedIds: [],
  setSelectedIds: (_) => undefined,

  user: null,
  loadUser: () => undefined,
})
