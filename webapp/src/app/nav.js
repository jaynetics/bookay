/** @jsx h */
import { Fragment, createRef, h } from 'preact'
import { useEffect, useState, useContext } from 'preact/hooks'
import { Link, classNames, flash, route, useDebouncedCallback } from '../lib'
import { useRoute } from 'wouter-preact'
import { AppContext } from './app_context'

export const Nav = () => {
  const [open, setOpen] = useState(false)
  const [inFolder, params] = useRoute('/folders/:folderId')

  useEffect(() => {
    const close = () => setOpen(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [setOpen])

  return <nav>
    <Link className='brand' to='/'>bookay</Link>
    <Search />
    <div className='nav-button' onClick={() => {
      route(`/items/create${inFolder ? `?folderId=${params.folderId}` : ''}`)
    }}>+</div>
    <div className='nav-button burger' onClick={(event) => {
      event.stopPropagation() // avoid re-closing via listener above
      setOpen(true)
    }}>☰</div>
    <div className={classNames({ menu: true, open })}>
      <Link className='button' to='/recent'>Recent URLs</Link>
      <Link className='button' to='/imports/create'>Import</Link>
      <Link className='button' to='/exports/create'>Export</Link>
      <Link className='button' to='/health'>Stats &amp; health</Link>
      <Link className='button' to='/users/create'>Add user</Link>
      <Link className='button' to='/users/show'>My account</Link>
      <Link className='button' to='/logout'>Logout</Link>
      <a className='button' href='https://github.com/jaynetics/bookay'>About</a>
    </div>
  </nav>
}

const Search = () => {
  const { setSearch } = useContext(AppContext)
  const inputRef = createRef()

  const [updateSearch] = useDebouncedCallback((value) => {
    setSearch(value)
    const inSearch = /\/search/.test(window.location.href)
    // enter search view when user starts typing
    if (!inSearch && value) route('/search')
    // exit search view if value is cleared
    if (inSearch && !value) window.history.back()
  }, 200)

  useEffect(() => {
    const hotkeyListener = (event) => {
      const focused = inputRef.current === document.activeElement

      // focus search input on CMD/CTRL+f
      if ((event.metaKey || event.ctrlKey) && event.key === 'f' && !focused) {
        inputRef.current.focus()
        event.preventDefault()
        const modKey = /Mac/i.test(navigator.platform) ? 'CMD' : 'CTRL'
        flash(`Hit ${modKey}+f again to search the page`)
      }

      // close on ESC
      else if (event.keyCode === 27 && focused) {
        inputRef.current.blur()
        inputRef.current.value = ''
        updateSearch('')
      }
    }

    window.addEventListener('keydown', hotkeyListener)

    return () => window.removeEventListener('keydown', hotkeyListener)
  }, [inputRef, updateSearch])

  return <Fragment>
    <span className='search-icon' onClick={() => inputRef.current.focus()}>
      ⚲
    </span>
    <input
      className='search-input'
      onKeyUp={(e) => updateSearch(e.target.value)}
      ref={inputRef}
      type='text'
    />
  </Fragment>
}
