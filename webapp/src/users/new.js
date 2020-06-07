/** @jsx h */
import { h } from 'preact'
import { route } from 'preact-router'
import { Form, flash, useForm } from '../lib'
import { client } from '../shared'

export const NewUser = ({ path }) => {
  const form = useForm({ type: 'url' })

  return <Form headline='New user' onSubmit={onSubmit} {...form}>
    <Form.Input name='username' label='Username' {...form} />
    <Form.Input name='password' label='Password' type='password' {...form} />
    <Form.Input name='ownPassword'
      label={<span>Enter your <i>own</i> password to confirm (not needed to add initial user)</span>}
      type='password'
      {...form}
    />
  </Form >
}

const onSubmit = ({ username, password, ownPassword }, { fail }) =>
  client.createUser({ username, password, ownPassword })
    .then(() => {
      flash(`User ${username} created!`)
      route('/')
    })
    .catch(() => fail())
