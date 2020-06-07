/** @jsx h */
import { h } from 'preact'
import { useEffect } from 'preact/hooks'

export const ContextMenu = ({
  className = 'context-menu',
  children,
  coords,
  setCoords,
  zIndex = 10001,
}) => {
  useEffect(() => {
    const exit = () => setCoords(null)
    const exitOnEsc = ({ keyCode }) => keyCode === 27 && exit()

    document.body.addEventListener('click', exit)
    document.body.addEventListener('contextmenu', exit)
    document.body.addEventListener('keydown', exitOnEsc)
    window.addEventListener('hashchange', exit)

    return () => {
      document.body.removeEventListener('click', exit)
      document.body.removeEventListener('contextmenu', exit)
      document.body.removeEventListener('keydown', exitOnEsc)
      window.removeEventListener('hashchange', exit)
    }
  }, [setCoords])

  if (!coords) return null

  const [x, y] = coords
  let menuStyle = { position: 'fixed', zIndex }

  // extend from coords towards center of window
  if (x < window.innerWidth / 2) menuStyle.left = x
  else menuStyle.right = window.innerWidth - x
  if (y < window.innerHeight / 2) menuStyle.top = y
  else menuStyle.bottom = window.innerHeight - y

  return <div
    className={[className, CLASS_NAME].filter(e => e).join(' ')}
    style={menuStyle}
  >
    {children}
  </div>
}

const CLASS_NAME = `__context-menu-${Math.random().toString().substring(2)}`

ContextMenu['closeAll'] = () => {
  const anyOpen = document.querySelector(`.${CLASS_NAME}`)
  if (anyOpen) document.body.click()
  return anyOpen
}
