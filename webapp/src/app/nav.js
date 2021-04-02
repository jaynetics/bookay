import { Fragment, createRef } from 'preact'
import { useEffect, useState, useContext } from 'preact/hooks'
import { useRoute } from 'wouter-preact'
import { Link, flash, route, useDebouncedCallback } from '../lib'
import { AppContext } from './app_context'

export const Nav = () => {
  const [open, setOpen] = useState(false)
  const [inFolder, params] = useRoute('/folders/:folderId')

  useEffect(() => {
    const close = () => setOpen(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [setOpen])

  return <nav className='flex flex-shrink-0 items-center h-10 sm:h-12 z-40'>
    <Link className='px-5 font-bold' to='/'>bookay</Link>
    <Search />
    <div className='px-5 cursor-pointer w-5 ml-auto font-bold' onClick={(event) => {
      route(`/items/create${inFolder ? `?folderId=${params.folderId}` : ''}`)
    }}>+</div>
    <div className='px-5 cursor-pointer font-bold burger' onClick={(event) => {
      event.stopPropagation() // avoid re-closing via listener above
      setOpen(!open)
    }}>☰</div>
    <Menu open={open} />
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
    <span
      className='transform rotate-45 text-lg -mr-4 -ml-2 z-30 cursor-pointer'
      onClick={() => inputRef.current.focus()}
    >
      ⚲
    </span>
    <input
      className='w-6/12 max-w-xs pl-5 text-sm sm:text-base'
      onKeyUp={(e) => updateSearch(e.target.value)}
      ref={inputRef}
      type='text'
    />
  </Fragment>
}

const Menu = ({ open }) => {
  if (!open) return null

  const itemClass = 'block mt-1 bg-gray-50' // TODO: colors

  return <div className='fixed z-30 max-w-xs w-10/12 h-full top-0 right-0 pt-10 pr-2'>
    <Link className={itemClass} to='/recent'>Recent URLs</Link>
    <Link className={itemClass} to='/imports/create'>Import</Link>
    <Link className={itemClass} to='/exports/create'>Export</Link>
    <Link className={itemClass} to='/health'>Stats &amp; health</Link>
    <Link className={itemClass} to='/settings'>Settings</Link>
    <Link className={itemClass} to='/users/create'>Add user</Link>
    <Link className={itemClass} to='/logout'>Logout</Link>
    <a className={itemClass} href='https://github.com/jaynetics/bookay'>About</a>
  </div>
}
