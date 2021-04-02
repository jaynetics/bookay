import { Form, flash, route, useForm } from '../lib'
import { client } from '../shared'
import { useContext } from 'preact/hooks'
import { AppContext } from '../app/index'

export const EditUser = () => {
  const { user } = useContext(AppContext)
  if (!user) return null

  return <section className='row'>
    <SettingsForm />
    <ChangePasswordForm />
    <DeleteAccountForm />
  </section>
}

const SettingsForm = () => {
  const { user, loadUser } = useContext(AppContext)
  const form = useForm(user.settings)

  return <Form
    headline='Settings'
    onSubmit={(settings, form) => updateUser({ settings }, form).then(loadUser)}
    {...form}
  >
    <p>
      Source for bookmark icons. Disable to save a tiny bit of bandwidth
      and privacy.
    </p>
    <Form.Select name={'faviconSource'} label={null} options={[
      ['DuckDuckGo', 'ddg'],
      ['Google', 'google'],
      ['Bookmarked sites', 'origin'],
      ['Disabled', 'disabled'],
    ]} {...form} />
    <br />
  </Form>
}

const updateUser = ({ ...updateBody }, { fail, setSubmitting }) =>
  client.updateUser(updateBody)
    .then(() => flash('Saved!') && setTimeout(() => setSubmitting(false), 100))
    .catch(() => fail())

const ChangePasswordForm = () => {
  const form = useForm()

  return <Form headline='Change password' onSubmit={updateUser} {...form}>
    <Form.Input name='oldPassword' label='Old password' type='password' {...form} />
    <Form.Input name='newPassword' label='New password' type='password' {...form} />
  </Form>
}

const DeleteAccountForm = () => {
  const { user } = useContext(AppContext)
  const form = useForm()

  return <Form
    disabled={form.values['confirmation'] !== user.username}
    headline='Delete account'
    onSubmit={(values, form) => deleteAccount(values, form, user)}
    submitText='Delete'
    {...form}
  >
    <p>This will delete your account along with all your bookmarks and can not be undone.</p>
    <Form.Input name='confirmation' label={'Type your username to confirm'} {...form} />
  </Form>
}

const deleteAccount = ({ confirmation }, { fail }, user) => {
  if (confirmation !== user.username) return fail()

  client.deleteAccount()
    .then(() => flash('Goodbye!') && route('/login'))
    .catch(() => fail())
}
