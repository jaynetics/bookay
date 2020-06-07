/// <reference path="../../support/index.d.ts" />

context('Editing items', () => {
  it('allows changing item properties', () => {
    cy.createItem({ type: 'folder', name: 'Folder 1' }).then(response => {
      cy.visit(`/#/items/${response.body.id}`)
      cy.get('[name=name]').type('234')
      cy.get('form').submit()
      cy.shouldHaveItem('Folder 1234')
    })
  })
})
