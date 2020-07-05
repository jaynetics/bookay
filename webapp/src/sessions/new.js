/** @jsx h */
import { h } from 'preact'
import { Form, currentSearch, flash, useForm, route } from '../lib'
import { client } from '../shared'

export const NewSession = () => {
  const form = useForm({})

  return <Form
    headline='Login'
    onSubmit={onSubmit} {...form}
    submitText='Login'
  >
    <Form.Input name='username' label='User' {...form} />
    <Form.Input name='password' label='Password' type='password' {...form} />
    <CreateAccountLink />
  </Form>
}

const onSubmit = ({ username, password }, { fail }) => {
  client.login({ username, password })
    .then(() => {
      flash('Logged in!')
      route(decodeURIComponent(currentSearch().get('returnTo') || '/'))
    })
    .catch(() => fail('Wrong!'))
}

const CreateAccountLink = () =>
  <button
    type='button'
    onClick={() => route('/users/create')}
    style={{ float: 'right' }}
  >
    Create an account
  </button>
