/** @jsx h */
import { h } from 'preact'
import { route } from 'preact-router'
import { Form, flash, useForm } from '../lib'
import { FolderSelect, Loader, client, useAPI } from '../shared'
import { Item } from './item'

export const EditItem = (props) => {
  const { id } = props.matches
  const { data } = useAPI(client.get({ id }), [id])

  return data ? <EditItemForm id={id} {...data} /> : <Loader />
}

const EditItemForm = ({ ...values }) => {
  const form = useForm(values)
  const headline = `Edit ${Item.typeName(values.type)}`

  return <Form headline={headline} onSubmit={onSubmit} {...form} >
    <Form.Input name='name' label='Name' {...form} />
    {values.type === 'url' && <Form.Input name='url' label='URL' {...form} />}
    <FolderSelect name='folderId' label='Parent folder' {...form} />
  </Form>
}

const onSubmit = ({ type, id, name, folderId, url }, { fail }) => {
  if (!name) return fail()
  if (type === 'url' && !url) return fail()

  client.update({ id, name, folderId, url })
    .then(() => flash('Changes saved!') && route('/'))
    .catch(flash)
}
