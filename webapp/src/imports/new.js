import { createRef } from 'preact'
import { Form, flash, route, useForm } from '../lib'
import { FolderSelect, client } from '../shared'

export const NewImport = (props) => {
  const form = useForm({ type: 'url' })
  const fileInput = createRef()

  return <Form
    headline='Import bookmarks'
    onSubmit={(values, actions) => onSubmit(values, actions, fileInput)}
    submitText='Import'
    {...form}
  >
    <label for='file'>Choose a file (e.g. bookmarks.html - you can export this from your browser):</label>
    <input id='file' type='file' ref={fileInput} style={{ width: '100%' }} />
    <FolderSelect label='Target folder' {...form} />
  </Form >
}

const onSubmit = ({ folderId }, { fail }, fileInput) => {
  const file = fileInput.current.files[0]
  if (!file) return fail()

  client.createImport({ file, folderId })
    .then(({ message }) => flash(message) && route('/'))
    .catch(() => fail())
}
