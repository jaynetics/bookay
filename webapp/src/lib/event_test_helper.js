/** @jsx h */
import { h } from 'preact'
import { useMemo } from 'preact/hooks'

// this allows testing events that are not fully supported in cypress
// and/or cypress' browsers.
// TODO: get rid of this once there is better support,
// c.f. https://github.com/cypress-io/cypress/issues/5504

export const EventTestHelper = ({ target, ...handlers }) =>
  /^(?:localhost|127)/.test(window.location.host) ?
    <MessageListener target={target} handlers={handlers} /> :
    null

const MessageListener = ({ target, handlers }) => {
  useMemo(() => {
    const listener = ({ data }) =>
      data.target === target &&
      handlers[data.testEvent] && handlers[data.testEvent]()
    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }, [target, handlers])

  return null
}
