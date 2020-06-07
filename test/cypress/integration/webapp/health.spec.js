/// <reference path="../../support/index.d.ts" />

context('Health', () => {
  it('shows duplicate bookmarks', () => {
    cy.createItem({ type: 'url', url: 'http://foo.com', name: 'Foo' })
    cy.createItem({ type: 'url', url: 'http://bar.com', name: 'Bar 1' })
    cy.createItem({ type: 'url', url: 'http://bar.com', name: 'Bar 2' })

    cy.visit('/#/health')

    cy.shouldNotHaveItem('For')
    cy.shouldHaveItem('Bar 1')
    cy.shouldHaveItem('Bar 2')
  })

  it('shows empty folders', () => {
    cy.createItem({
      type: 'folder', name: 'Folder with content', children: [
        { type: 'folder', name: 'Empty folder' },
      ]
    })

    cy.visit('/#/health')

    cy.shouldNotHaveItem('Folder with content')
    cy.shouldHaveItem('Empty folder')
  })

  it('can scan for broken links', () => {
    cy.createItem({ type: 'url', url: 'http://httpstat.us/200', name: 'OK' })
    cy.createItem({ type: 'url', url: 'http://httpstat.us/500', name: 'Bad' })

    cy.visit('/#/health')
    cy.contains('Scan now').click()

    cy.shouldNotHaveItem('OK')
    cy.shouldHaveItem('Bad')
  })
})
