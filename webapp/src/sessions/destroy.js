import { flash, route } from '../lib'
import { client, useAPI } from '../shared'

export const DestroySession = () => {
  const { error, loading } = useAPI(client.logout())
  if (!error && !loading) flash('Logged out!') && route('/login')
  return null
}
