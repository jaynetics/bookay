/** @jsx h */
import { h } from 'preact'
import { useEffect, useCallback, useState } from 'preact/hooks'
import { Link as WouterLink, Router, useRoute } from 'wouter-preact'

export const HashRouter = ({ children }) =>
  <Router children={children} hook={useHashLocation} />

// this hook is mostly copied from wouter's README,
// but with added support for search params
const useHashLocation = () => {
  const [loc, setLoc] = useState(currentLocation())

  useEffect(() => {
    // this function is called whenever the hash changes
    const handler = () => setLoc(currentLocation())

    // subscribe to hash changes
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  // remember to wrap your function with `useCallback` hook
  // a tiny but important optimization
  const navigate = useCallback((to) => window.location.hash = to, [])

  return [loc, navigate]
}

// returns the current hash location in a normalized form
// (excluding the leading '#' symbol AND any pseudo-search)
export const currentLocation = () =>
  (window.location.hash.replace(/^#/, '') || '/').replace(/\?.*$/, '')

// get the pseudo-search params from the hash, e.g. "/foo#bar?baz=qux"
export const currentSearch = () =>
  new URLSearchParams((window.location.hash || '').split('?')[1])

export const route = (to) => {
  window.location.hash = to
  return true
}

export const Link = ({ className = null, children, to }) => {
  const [active] = useRoute(to)
  const classNames = [active && 'active', className].filter(e => e)

  return <WouterLink href={`#${to}`}>
    {/* linter doesn't understand that wouter injects an href attribute */}
    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
    <a className={classNames.join(' ')}>{children}</a>
  </WouterLink >
}
