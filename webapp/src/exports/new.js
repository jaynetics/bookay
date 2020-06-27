/** @jsx h */
import { h } from 'preact'
import { Form, useForm, flash } from '../lib'
import { FolderSelect, client } from '../shared'

export const NewExport = ({ path }) => {
  const form = useForm({})

  return <Form
    disableOnSubmit={false}
    headline='Export bookmarks'
    onSubmit={onSubmit}
    submitText='Download'
    {...form}
  >
    <FolderSelect name='folderId' label='Folder' rootLabel='All' {...form} />
  </Form>
}

const onSubmit = ({ folderId }) => {
  client.prepareExport({ folderId })
    .then(({ blob, filename }) => {
      const dummy = document.createElement('a')
      dummy.href = window.URL.createObjectURL(blob)
      dummy.setAttribute('download', filename)
      dummy.click()
    })
    .catch(flash)
}
