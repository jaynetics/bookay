import { useEffect, useState } from 'preact/hooks'
import { ApiClient } from '@bookay/client'
import { currentSearch, route } from '../lib'

export const client = new ApiClient({
  onAuthRequired: () => route(`/login?returnTo=${returnTo()}`),
  serviceURL: window.location.origin.replace(':3001', ':3000'), // for dev env
})

export const useAPI = (call, deps = []) => {
  const [{ data, error, loading }, setState] =
    useState({ data: null, error: null, loading: true })

  useEffect(() => {
    setState({ data, error, loading: true })
    call
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error) => {
        console.warn(error)
        setState({ data: null, error, loading: false })
      })
    // dependency checking can't trace back through caller
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, error, loading }
}

const returnTo = () => {
  let path = window.location.hash.slice(1)
  if (/login|logout/.test(path)) path = currentSearch().get('returnTo') || ''
  return encodeURIComponent(path)
}
