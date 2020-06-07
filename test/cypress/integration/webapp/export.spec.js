/// <reference path="../../support/index.d.ts" />

context('Export', () => {
  it('allows downloading a bookmarks.html', () => {
    cy.createItem({ type: 'url', url: 'http://foo.com', name: 'Foo' })
    cy.createItem({
      type: 'folder', name: 'Bar', children: [
        { type: 'url', url: 'http://baz.com', name: 'baz' },
        { type: 'folder', name: 'Empty folder in folder' },
      ]
    })

    cy.visit('/')
    cy.get('.burger').click()
    cy.contains('Export').click()
    cy.url().should('contain', '/export')

    // TODO: complete after https://github.com/cypress-io/cypress/issues/949
    // cy.get('form').submit()
    // cy.shouldFlash('Preparing download')
    // ... file should be downloaded ...
  })
})
