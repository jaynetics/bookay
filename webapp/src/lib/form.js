import { Fragment } from 'preact'
import { useState } from 'preact/hooks'

export const useForm = ({ ...initialValues } = {}) => {
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [values, setValues] = useState(initialValues)
  const setValue = (name, value) => setValues({ ...values, [name]: value })

  return { error, setError, submitting, setSubmitting, values, setValue }
}

export const Form = ({
  children = null,
  disabled = false,
  error,
  headline,
  onSubmit,
  setError = null,
  setSubmitting = null,
  submitText = 'Save',
  submitting,
  values,
}) =>
  <form onSubmit={(e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    onSubmit(values,
      {
        fail: (error = 'Please check your input.') => {
          setSubmitting(false)
          setError(error)
        },
        setSubmitting,
      })
  }}>
    <h2>{headline}</h2>
    {children}
    <button disabled={disabled || submitting} type='submit'>
      {submitText}
    </button>
    {error && <small style={{ color: '#d00', paddingLeft: 12 }}>{error}</small>}
  </form>

Form.Input = ({ label, name, type = 'text', values = null, setValue }) =>
  <Fragment>
    <label for={name}>{label}</label>
    <input
      name={name}
      onKeyUp={(e) => setValue(name, e.target.value)}
      style={{ width: '100%' }}
      type={type}
      value={values[name] || ''}
    />
  </Fragment>

Form.RadioButton = ({ label, name, value, values = null, setValue }) =>
  <label>
    <input
      checked={values[name] === value}
      name={name}
      onChange={(e) => e.target.checked && setValue(name, value)}
      type='radio'
      value={value}
    />
    <span>{' '}{label}</span>
  </label>

Form.Select = ({ label, name, options, values = null, setValue }) =>
  <Fragment>
    {label && <label for={`${name}-select`}>{label}</label>}
    <select
      id={`${name}-select`}
      name={name}
      onChange={(e) => setValue(name, e.target.value || null)}
      value={values[name]}
    >
      {options.map(([name, value]) => <option value={value}>{name}</option>)}
    </select>
  </Fragment>
