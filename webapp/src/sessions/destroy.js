import { useEffect } from 'preact/hooks'
import { flash } from '../lib'
import { client } from '../shared'
import { route } from 'preact-router'

export const DestroySession = ({ path }) => {
  useEffect(() => {
    client.logout().then(() => {
      flash('Logged out!')
      route('/login')
    })
  }, [path])
  return null
}
