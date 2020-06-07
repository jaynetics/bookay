/** @jsx h */
import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { Form } from '../lib'
import { client } from './client'
import { Item } from '../items'

export const FolderSelect = ({
  rootLabel = 'none (root)',
  name,
  label = null,
  ...form
}) => {
  const defaultOption = [rootLabel, '']
  const [options, setOptions] = useState([])

  useEffect(() => {
    client.getAll({ filter: { type: 'folder' } })
      .then((res) => setOptions(Item.sort(res).map(f => [f.name, f.id])))
  }, [setOptions])

  return <div style={options.length === 0 && { display: 'none' }}>
    <Form.Select
      options={[defaultOption, ...options]}
      name={name}
      label={label}
      {...form}
    />
  </div>
}
