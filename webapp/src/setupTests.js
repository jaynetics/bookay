import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-preact-pure'
import fetchMock from 'fetch-mock-jest'
import initFetchMocks from './shared/init_fetch_mocks'
import { client } from './shared'

configure({ adapter: new Adapter() })

initFetchMocks(fetchMock, client)

global['sleep'] = (ms) => new Promise(resolve => setTimeout(resolve, ms))

global['effects'] = () => global['sleep'](20)
