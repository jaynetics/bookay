/// <reference path="../../support/index.d.ts" />

context('Recent items', () => {
  it('shows bookmarks with the latest first', () => {
    cy.createItem({ type: 'url', name: 'Bookmark 1', url: 'http://foo.com' })
    cy.createItem({ type: 'url', name: 'Bookmark 2', url: 'http://foo.com' })
    cy.createItem({ type: 'folder', name: 'Folder 1' })

    cy.visit('/#/recent')

    cy.get('.item-name').first().should('contain', 'Bookmark 2')
    cy.get('.item-name').last().should('contain', 'Bookmark 1')
    cy.shouldNotHaveItem('Folder 1')
  })
})
