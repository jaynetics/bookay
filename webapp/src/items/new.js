/** @jsx h */
import { h } from 'preact'
import { route } from 'preact-router'
import { Form, flash, getHashParam, useForm } from '../lib'
import { FolderSelect, client } from '../shared'
import { Item } from './item'

export const NewItem = ({ path }) => {
  const form = useForm({
    type: getHashParam('type') || 'url',
    name: getHashParam('name'),
    folderId: getHashParam('folderId'),
    url: getHashParam('url'),
  })

  const headline = `Create new ${Item.typeName(form.values.type)}`

  return <Form headline={headline} onSubmit={onSubmit} {...form} >
    <Form.RadioButton name='type' label='Bookmark' value='url' {...form} />
    <Form.RadioButton name='type' label='Folder' value='folder' {...form} />
    <div style={{ height: 16 }} />
    <Form.Input name='name' label='Name' {...form} />
    {form.values.type === 'url' && <Form.Input name='url' label='URL' {...form} />}
    <FolderSelect name='folderId' label='Parent folder' {...form} />
  </Form >
}

const onSubmit = ({ type, name, folderId, url }, { fail }) => {
  if (type === 'url' && !url) return fail()
  if (type === 'url' && !name) name = url
  if (type === 'folder') url = undefined
  if (!name) return fail()

  client.create({ type, name, folderId, url })
    .then(() => {
      flash(`New ${Item.typeName(type)} created!`)
      route(folderId ? `/folders/${folderId}` : '/')
    })
    .catch(flash)
}
