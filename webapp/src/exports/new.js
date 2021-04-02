import { Form, useForm } from '../lib'
import { FolderSelect, client } from '../shared'

export const NewExport = (props) => {
  const form = useForm({})

  return <Form
    headline='Export bookmarks'
    onSubmit={onSubmit}
    submitText='Download'
    {...form}
  >
    <FolderSelect label='Folder' rootLabel='All' {...form} />
  </Form>
}

const onSubmit = ({ folderId }, { fail, setSubmitting }) => {
  client.prepareExport({ folderId })
    .then(({ blob, filename }) => {
      const dummy = document.createElement('a')
      dummy.href = window.URL.createObjectURL(blob)
      dummy.setAttribute('download', filename)
      dummy.click()
      setSubmitting(false)
    })
    .catch(fail)
}
