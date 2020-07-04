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

  it('allows choosing a new folder by browsing', () => {
    cy.createItem({ type: 'folder', name: 'Folder 1' }).then(response => {
      cy.createItem({ type: 'folder', name: 'Folder 2' })
      cy.visit(`/#/items/${response.body.id}`)
      cy.get('[name=folderId] :selected').should('have.text', 'none (root)')

      cy.contains('Browse folders').click()
      cy.item('Folder 2').click()
      cy.contains('Choose this folder').click().wait(1)
      cy.get('[name=folderId] :selected').should('have.text', 'Folder 2')
    })
  })
})
