import { Form, currentSearch, flash, route, useForm, } from '../lib'
import { FolderSelect, client } from '../shared'
import { Item } from './item'

export const NewItem = (props) => {
  const search = currentSearch()
  const form = useForm({
    type: search.get('type') || 'url',
    name: search.get('name'),
    folderId: search.get('folderId'),
    url: search.get('url'),
  })

  const headline = `Create new ${Item.typeName(form.values.type)}`

  return <Form headline={headline} onSubmit={onSubmit} {...form} >
    <Form.RadioButton name='type' label='Bookmark' value='url' {...form} />
    <Form.RadioButton name='type' label='Folder' value='folder' {...form} />
    <div style={{ height: 16 }} />
    <Form.Input name='name' label='Name' {...form} />
    {form.values.type === 'url' && <Form.Input name='url' label='URL' {...form} />}
    <FolderSelect label='Parent folder' {...form} />
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
