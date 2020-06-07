/// <reference path="./index.d.ts" />

import 'cypress-localstorage-commands'
import 'cypress-file-upload'
import '@4tw/cypress-drag-drop'

Cypress.Commands.add('createItem', ({ children = [], ...attributes }) =>
  cy.post({ url: '/api/items', body: { ...attributes } }).then(response => {
    const itemId = response.body.id
    children.forEach(child => cy.createItem({ folderId: itemId, ...child }))
  })
)

Cypress.Commands.add('post', ({ url, body = undefined }) =>
  cy.request({
    body,
    headers: { 'x-session-id': 'SoSafe' },
    method: 'POST',
    url,
  })
)

Cypress.Commands.add('shouldFlash', (message) =>
  cy.get('.flash-message').should('contain', message)
)

Cypress.Commands.add('item', (name, opts = { within: 'main' }) => {
  let container
  if (opts.within === 'main') container = 'main'
  else if (opts.within === 'folder') container = '.folder-content'
  else if (opts.within === 'tree') container = '.folder-tree'

  return cy.contains(`${container} .item`, name)
})

Cypress.Commands.add('shouldHaveItem', (name, opts) =>
  cy.item(name, opts).should('exist')
)

Cypress.Commands.add('shouldNotHaveItem', (name, opts) =>
  cy.item(name, opts).should('not.exist')
)

import mockPluginBrowserAPI from './mock_plugin_browser_api'

Cypress.Commands.add('showPluginElement', (name) =>
  cy.visit(`/plugin/${name}/${name}.html`, {
    onBeforeLoad(win) { mockPluginBrowserAPI(win) }
  })
)
