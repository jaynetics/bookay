import { useCallback, useRef } from 'preact/hooks'

export const useDebouncedCallback = (callback, delay) => {
  const timeout = useRef(null)
  const debouncedFunction = useRef(callback)

  const cancel = useCallback(() => {
    clearTimeout(timeout.current)
    timeout.current = null
  }, [])

  const debouncedCallback = useCallback(
    (...args) => {
      clearTimeout(timeout.current)
      timeout.current = setTimeout(() => {
        cancel()
        debouncedFunction.current(...args)
      }, delay)
    },
    [delay, cancel]
  )

  return [debouncedCallback, cancel]
}
