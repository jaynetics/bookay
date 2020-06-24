/** @jsx h */
import { Fragment, createRef, h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { route } from 'preact-router'
import { classNames, flash, useDebouncedCallback } from '../lib'

export const Nav = () => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const close = () => setOpen(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [setOpen])

  return <nav>
    <a href='/' className='brand' onClick={() => route('/')}>bookay</a>
    <Search />
    <div className='nav-button' onClick={() => {
      const match = window.location.hash.match(/\/folders\/(\d+)/)
      const folderId = match && match[1]
      route(`/items/create${folderId ? `?folderId=${folderId}` : ''}`)
    }}>+</div>
    <div className='nav-button burger' onClick={(event) => {
      event.stopPropagation() // avoid re-closing via listener above
      setOpen(true)
    }}>☰</div>
    <div className={classNames({ menu: true, open })}>
      <a className='button' href='/recent'>Recent URLs</a>
      <a className='button' href='/imports/create'>Import</a>
      <a className='button' href='/exports/create'>Export</a>
      <a className='button' href='/health'>Stats &amp; health</a>
      <a className='button' href='/users/create'>Add user</a>
      <a className='button' href='/logout'>Logout</a>
      <a className='button' href='https://github.com/jaynetics/bookay'>About</a>
    </div>
  </nav>
}

const Search = () => {
  const inputRef = createRef()

  const [updateSearch] = useDebouncedCallback((value) => {
    const showingSearch = /\/search\//.test(window.location.href)
    if (value) {
      // keep only one search entry on the history stack
      route(`/search/${value}`, showingSearch)
    }
    else if (showingSearch) {
      window.history.back()
    }
  }, 200)

  useEffect(() => {
    const hotkeyListener = (event) => {
      const focused = inputRef.current === document.activeElement

      // focus on CMD/CTRL+f
      if ((event.metaKey || event.ctrlKey) && event.key === 'f' && !focused) {
        inputRef.current.focus()
        event.preventDefault()
        const modKey = /Mac/i.test(navigator.platform) ? 'CMD' : 'CTRL'
        flash(`Hit ${modKey}+f again to search the page`)
      }

      // close on ESC
      else if (event.keyCode === 27 && focused) {
        inputRef.current.blur()
        updateSearch('') // does not clear input. should it?
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
