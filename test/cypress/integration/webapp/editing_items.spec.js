/// <reference path="../../support/index.d.ts" />

context('Editing items', () => {
  it('allows changing item properties', () => {
    cy.createItem({ type: 'folder', name: 'Folder 1' }).then(response => {
      // verify that name can be changed
      cy.visit(`/#/items/${response.body.id}`)
      cy.get('[name=name]').type('234')
      cy.get('form').submit()
      cy.shouldHaveItem('Folder 1234')

      // verify that folder can be changed
      cy.createItem({ type: 'folder', name: 'Folder 2' })
      cy.visit(`/#/items/${response.body.id}`)
      cy.get('[name=folderId]').select('Folder 2').wait(100)
      cy.get('[name=folderId] :selected').should('have.text', 'Folder 2')
      cy.get('form').submit()

      // Folder 1234 is now nested so should no longer be directly visible
      cy.shouldNotHaveItem('Folder 1234')

      // verify that root folder (folderId === null) can be set
      cy.visit(`/#/items/${response.body.id}`)
      cy.get('[name=folderId]').select('none (root)').wait(100)
      cy.get('[name=folderId] :selected').should('have.text', 'none (root)')
      cy.get('form').submit()

      // Folder 1234 should be back at root
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
      cy.contains('Choose this folder').click().wait(100)
      cy.get('[name=folderId] :selected').should('have.text', 'Folder 2')
      cy.get('form').submit()

      // Folder 1 is now nested so should no longer be directly visible
      cy.shouldNotHaveItem('Folder 1')
    })
  })
})
