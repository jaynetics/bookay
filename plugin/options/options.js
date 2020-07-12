import { ApiClient } from '../node_modules/@bookay/client/index.js'
import { Configuration } from '../shared/index.js'

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.querySelector('form')
  const submitButton = form.querySelector('button')

  const renderFormField = ({ defaultValue, title, ...inputAttributes }) => {
    const mk = (tag, attrs) => Object.assign(document.createElement(tag), attrs)
    const el = mk('div', { className: 'field' })
    const label = mk('label')
    const text = mk('div', { className: 'label-text', textContent: title })
    label.append(text)
    const input = mk('input', inputAttributes)
    label.append(input)
    el.append(label)
    form.insertBefore(el, submitButton)
  }

  Configuration.fields.forEach(renderFormField)

  const getEnteredValues = () =>
    [...document.querySelectorAll('input')].reduce((a, e) => (
      { ...a, [e.id]: e.type === 'checkbox' ? e.checked : e.value }
    ), {})

  const showMessage = (string) =>
    document.getElementById('message').textContent = string

  const saveValues = (event) => {
    event.preventDefault()
    Configuration.save(getEnteredValues())
    showMessage('😊 Saved!')
  }

  const restoreValues = async () => {
    const config = await Configuration.load()
    Configuration.fields.forEach(({ defaultValue, id, type }) => {
      const element = document.getElementById(id)
      const value = config[id]
      const attr = type === 'checkbox' ? 'checked' : 'value'
      element[attr] = value === undefined ? defaultValue : value
    })
  }

  await restoreValues()

  form.addEventListener('submit', saveValues)

  document.getElementById('logoutButton').addEventListener('click', (event) => {
    event.preventDefault()
    const client = new ApiClient(getEnteredValues())
    client.logout()
      .then((_res) => showMessage('😊 Logged out!'))
      .catch((err) => showMessage(`😕 Error logging out. ${err.message}`))
  })
})
