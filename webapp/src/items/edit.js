import { Form, flash, route, useForm } from '../lib'
import { FolderSelect, Loader, client, useAPI } from '../shared'
import { Item } from './item'

export const EditItem = ({ params }) => {
  const { id } = params
  const { data } = useAPI(client.get({ id }), [id])
  if (!data) return <Loader />

  return <EditItemForm {...data} />
}

const EditItemForm = ({ ...values }) => {
  const form = useForm(values)
  const headline = `Edit ${Item.typeName(values.type)}`

  return <Form headline={headline} onSubmit={onSubmit} {...form} >
    <Form.Input name='name' label='Name' {...form} />
    {values.type === 'url' && <Form.Input name='url' label='URL' {...form} />}
    <FolderSelect blockedIds={[values.id]} label='Parent folder' {...form} />
  </Form>
}

const onSubmit = ({ type, id, name, folderId, url }, { fail }) => {
  if (!name) return fail()
  if (type === 'url' && !url) return fail()

  client.update({ id, name, folderId, url })
    .then(() => flash('Changes saved!') && route('/'))
    .catch(flash)
}
