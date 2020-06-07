/** @jsx h */
import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { route } from 'preact-router'
import { Form, flash, useForm } from '../lib'
import { FolderSelect, client } from '../shared'
import { Item } from './item'

export const EditItem = (props) => {
  const { id } = props.matches
  const [values, setValues] = useState(null)

  useEffect(() => {
    client.get({ id }).then(setValues).catch(console.warn)
  }, [id])

  return values && <EditItemForm id={id} {...values} />
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

const onSubmit = async ({ type, id, name, folderId, url }, { fail }) => {
  if (!name) return fail()
  if (type === 'url' && !url) return fail()

  await client.update({ id, name, folderId, url })
  flash('Changes saved!')
  route('/')
}
