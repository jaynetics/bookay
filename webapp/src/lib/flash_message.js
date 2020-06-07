import { createRef } from 'preact'
import { useState, useEffect } from 'preact/hooks'

export const FlashMessage = ({ children, duration = 3000 }) => {
  const [content, setContent] = useState(null)
  const scrollRef = createRef()

  useEffect(() => {
    const listener = ({ data, origin, source }) => {
      if (data.id !== ID || origin !== ORIGIN || source !== SOURCE) return
      setContent(data.content)
      setTimeout(() => setContent(null), duration)
      scrollRef.current && scrollRef.current.scrollIntoView()
    }
    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }, [duration, scrollRef])

  return children({ content, scrollRef, setContent })
}

const ID = `FlashMessage-${Math.random()}`
const ORIGIN = window.location.origin
const SOURCE = window

export const flash = (content) =>
  window.postMessage({ id: ID, content }, ORIGIN)
