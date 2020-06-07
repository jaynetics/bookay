/** @jsx h */
import { h, Fragment } from 'preact'
import { useState } from 'preact/hooks'

export const useForm = ({ ...initialValues }) => {
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [values, setValues] = useState(initialValues)
  const onChange = (e) => setValues({
    ...values,
    [e.target.name]: e.target.value || e.target.checked,
  })

  return { error, setError, onChange, submitting, setSubmitting, values }
}

export const Form = ({
  altButton = null,
  children = null,
  disableOnSubmit = true,
  error,
  headline,
  onSubmit,
  setError = null,
  setSubmitting = null,
  submitText = 'Save',
  submitting,
  values
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
        }
      })
  }}>
    <h2>{headline}</h2>
    {children}
    <br /> <br />
    <button disabled={disableOnSubmit && submitting} type='submit'>
      {submitText}
    </button>
    {error && <small style={{ color: '#d00', paddingLeft: 12 }}>{error}</small>}
    {' '}
    {altButton}
  </form>

Form.Input = ({ name, label, type = 'text', values = null, onChange = null }) =>
  <Fragment>
    <label for={name}>{label}</label>
    <input name={name} type={type} value={values[name] || ''} onKeyUp={onChange} style={{ width: '100%' }} />
  </Fragment>

Form.RadioButton = ({ name, label, value, values = null, onChange = null }) =>
  <label>
    <input type='radio' name={name} checked={values[name] === value} value={value}
      onChange={e => e.target.checked && onChange(e)} />
    <span>{' '}{label}</span>
  </label>

Form.Select = ({ name, label, options, values = null, onChange = null }) =>
  <Fragment>
    {label && <label for={`${name}-select`}>{label}</label>}
    <select id={`${name}-select`} name={name} onChange={onChange} value={values[name]}>
      {options.map(([name, value]) => <option value={value}>{name}</option>)}
    </select>
  </Fragment>
