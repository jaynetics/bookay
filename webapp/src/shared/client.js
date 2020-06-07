import { ApiClient } from './api_client'
import { route } from 'preact-router'
import { getHashParam } from '../lib'

export const client = new ApiClient({
  onAuthRequired: () => route(`/login?returnTo=${returnTo()}`),
  serviceURL: window.location.origin.replace(':3001', ':3000'), // for dev env
})

const returnTo = () => {
  let path = window.location.hash.slice(1)
  if (/login|logout/.test(path)) path = getHashParam('returnTo') || ''
  return encodeURIComponent(path)
}
