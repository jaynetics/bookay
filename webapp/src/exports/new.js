/** @jsx h */
import { h } from 'preact'
import { Form, useForm } from '../lib'
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

const onSubmit = ({ folderId }) =>
  window.location.href = client.exportURL({ folderId })
