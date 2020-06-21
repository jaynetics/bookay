/** @jsx h */
import { Component, h } from 'preact'
import { client, useAPI, Loader } from '../shared'
import { Item } from './item'
import { useState } from 'preact/hooks'

export const ItemHealth = ({ path }) => {
  const { data } = useAPI(client.getStats())
  const [scanBroken, setScanBroken] = useState(false)
  if (!data) return <Loader />

  const { duplicates, emptyFolders, typeCounts } = data;
  [...duplicates, ...emptyFolders].forEach(i => i.customMenu = 'discardMenu')

  return <section className='row'>
    <div>
      <h3>Stats</h3>
      {Object.entries(typeCounts).map(([type, count]) =>
        <p>{pluralize(Item.typeName(type), count)}</p>)}
    </div>
    <div>
      <h3>Duplicates</h3>
      {duplicates.length ?
        <Item.List items={duplicates} showMenuButton={true} /> : <None />}
    </div>
    <div>
      <h3>Empty folders</h3>
      {emptyFolders.length ?
        <Item.List items={emptyFolders} showMenuButton={true} /> : <None />}
    </div>
    <div className='broken-links'>
      <h3>Broken Links</h3>
      {scanBroken ?
        <BrokenBookmarksStream totalCount={typeCounts['url'] || 0} /> :
        <button onClick={() => setScanBroken(true)}>Scan now</button>}
    </div>
  </section>
}

class BrokenBookmarksStream extends Component {
  state = { checked: 0, broken: [] }

  componentDidMount() {
    client.streamBookmarkHealth(async ([status, item]) => {
      const checked = this.state.checked + 1
      if (status >= 400) {
        item.customMenu = 'brokenURLMenu'
        item.info = `${status} ${ERROR_MESSAGES[status]}`
        this.setState({ checked, broken: [...this.state.broken, item] })
      }
      else {
        this.setState({ checked })
      }
      return true
    })
  }

  get header() {
    const { checked, broken } = this.state
    const { totalCount } = this.props

    if (checked < totalCount) {
      return <div className='progress-bar'>
        <div style={{ width: `${Math.round((checked / totalCount) * 100)}%` }}>
          <p>Checked {checked} of {totalCount} ...</p>
        </div>
      </div>
    }
    else if (broken.length === 0) {
      return <None />
    }
    else {
      return <p>{pluralize('link', broken.length)}</p>
    }
  }

  render() {
    return <div>
      {this.header}
      <Item.List items={this.state.broken} showMenuButton={true} />
    </div>
  }
}

const None = () =>
  <p>None! <span role='img' aria-label='Party'>🎉</span></p>

const pluralize = (name, count) =>
  `${count} ${name}${count === 1 ? '' : 's'}`

const ERROR_MESSAGES = Object.entries({
  '400': 'Bad Request',
  '401': 'Unauthorized',
  '402': 'Payment Required',
  '403': 'Forbidden',
  '404': 'Not Found',
  '405': 'Method Not Allowed',
  '406': 'Not Acceptable',
  '407': 'Proxy Authentication Required',
  '408': 'Request Timeout',
  '409': 'Conflict',
  '410': 'Gone',
  '411': 'Length Required',
  '412': 'Precondition Failed',
  '413': 'Payload Too Large',
  '414': 'Request-URI Too Long',
  '415': 'Unsupported Media Type',
  '416': 'Requested Range Not Satisfiable',
  '417': 'Expectation Failed',
  '418': 'Im a teapot',
  '421': 'Misdirected Request',
  '422': 'Unprocessable Entity',
  '423': 'Locked',
  '424': 'Failed Dependency',
  '426': 'Upgrade Required',
  '428': 'Precondition Required',
  '429': 'Too Many Requests',
  '431': 'Request Header Fields Too Large',
  '444': 'Connection Closed Without Response',
  '451': 'Unavailable For Legal Reasons',
  '499': 'Client Closed Request',
  '500': 'Internal Server Error',
  '501': 'Not Implemented',
  '502': 'Bad Gateway',
  '503': 'Service Unavailable',
  '504': 'Gateway Timeout',
  '505': 'HTTP Version Not Supported',
  '506': 'Variant Also Negotiates',
  '507': 'Insufficient Storage',
  '508': 'Loop Detected',
  '510': 'Not Extended',
  '511': 'Network Authentication Required',
  '599': 'Network Connect Timeout Error',
}).reduce((a, e) => ({ ...a, [parseInt(e[0])]: e[1] }), {})
