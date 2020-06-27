/** @jsx h */
import { h } from 'preact'
import { Form } from '../lib'
import { client, useAPI } from './client'
import { Item } from '../items'
import { useMemo } from 'preact/hooks'

export const FolderSelect = ({
  rootLabel = 'none (root)',
  name,
  label = null,
  ...form
}) => {
  const defaultOption = [rootLabel, '']
  const { data } = useAPI(client.getAllFolders())
  const options = useMemo(
    () => data && Item.sort(data).map((f) => [f.name, f.id]), [data]
  ) || []

  return <div style={options.length === 0 && { visibility: 'hidden' }}>
    <Form.Select
      options={[defaultOption, ...options]}
      name={name}
      label={label}
      {...form}
    />
  </div>
}
