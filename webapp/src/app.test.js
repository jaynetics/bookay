/** @jsx h */
import { h } from 'preact'
import { expect } from 'chai'
import { mount } from 'enzyme'

import App from './app'

// Most testing is done via integration tests in <repo-root>/test.
// This is just here as an example, and to make sure the app runs non-built.
// There isn't really a lot of logic worth unit-testing in any component yet.

describe('App', () => {
  it('renders', async () => {
    const wrapper = mount(<App />)
    expect(wrapper.text()).to.contain('bookay')
    await effects()
    expect(wrapper.text()).to.contain('Baz')
    // wrapper.find('button').simulate('click')
  })
})
