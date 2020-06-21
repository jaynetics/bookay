import { route } from 'preact-router'
import { flash } from '../lib'
import { client, useAPI } from '../shared'

export const DestroySession = ({ path }) => {
  const { error, loading } = useAPI(client.logout())
  if (!error && !loading) flash('Logged out!') && route('/login')
  return null
}
