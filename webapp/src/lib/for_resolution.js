/** @jsx h */
import { h, Fragment } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'

export const ForResolution = ({ above = 0, upto = Infinity, children }) => {
  const [show, setShow] = useState(false)

  const checkWidth = useCallback(() => setShow(
    window.innerWidth > above && window.innerWidth <= upto
  ), [above, upto])

  useEffect(() => {
    checkWidth()
    window.addEventListener('resize', checkWidth)
    return () => window.removeEventListener('resize', checkWidth)
  }, [checkWidth])

  return show ? <Fragment>{children}</Fragment> : null
}
