/** @jsx h */
import { h } from 'preact'
import { route } from 'preact-router'
import { Form, flash, useForm } from '../lib'
import { client } from '../shared'

export const ShowUser = ({ path }) =>
  <section className='row'>
    <ChangePasswordForm />
    <DeleteAccountForm />
  </section>

const ChangePasswordForm = () => {
  const form = useForm()

  return <Form headline='Change password' onSubmit={changePassword} {...form}>
    <Form.Input name='oldPassword' label='Old password' type='password' {...form} />
    <Form.Input name='newPassword' label='New password' type='password' {...form} />
  </Form>
}

const changePassword = ({ newPassword, oldPassword }, { fail }) =>
  client.changePassword({ newPassword, oldPassword })
    .then(() => flash('Password changed!') && route('/users/show'))
    .catch(() => fail())

const DeleteAccountForm = () => {
  const form = useForm()

  return <Form
    disabled={form.values['confirmation'] !== CONFIRMATION}
    headline='Delete account'
    onSubmit={deleteAccount}
    submitText='Delete'
    {...form}
  >
    <p>This will delete your account along with all your bookmarks and can not be undone.</p >
    <Form.Input name='confirmation' label='Type "delete everything" to confirm' {...form} />
  </Form>
}

const deleteAccount = ({ confirmation }, { fail }) => {
  console.log(confirmation);
  if (confirmation !== CONFIRMATION) return fail()

  client.deleteAccount()
    .then(() => flash('Goodbye!') && route('/login'))
    .catch(() => fail())
}

const CONFIRMATION = 'delete everything'
