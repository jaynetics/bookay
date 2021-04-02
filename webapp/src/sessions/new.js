import { useContext } from 'preact/hooks'
import { Form, currentSearch, flash, useForm, route } from '../lib'
import { client } from '../shared'
import { AppContext } from '../app/index'

export const NewSession = () => {
  const form = useForm({})
  const { loadUser } = useContext(AppContext)

  return <Form
    headline='Login'
    onSubmit={(values, form) => login(values, form, loadUser)}
    submitText='Login'
    {...form}
  >
    <Form.Input name='username' label='User' {...form} />
    <Form.Input name='password' label='Password' type='password' {...form} />
    <CreateAccountLink />
  </Form>
}

const login = ({ username, password }, { fail }, loadUser) => {
  client.login({ username, password })
    .then(() => {
      loadUser()
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
