/// <reference path="../../support/index.d.ts" />

context('Search', () => {
  it('updates results while typing', () => {
    cy.createItem({
      type: 'folder', name: 'Folder 1', children: [
        { type: 'url', name: 'Foo', url: 'http://foo.com' },
        { type: 'url', name: 'Bar', url: 'http://bar.com' },
      ]
    })

    cy.visit('/')

    cy.get('.search-input').type('Fo')
    cy.shouldHaveItem('Folder 1')
    cy.shouldHaveItem('Foo')
    cy.shouldNotHaveItem('Bar')

    cy.get('.search-input').type('o') // add another o
    cy.shouldNotHaveItem('Folder 1')
    cy.shouldHaveItem('Foo')
    cy.shouldNotHaveItem('Bar')
  })
})
