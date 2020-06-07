/// <reference path="../../support/index.d.ts" />

context('Item drag and drop', () => {
  it('allows moving items to a folder', () => {
    cy.createItem({ type: 'folder', name: 'Folder 1' })
    cy.createItem({ type: 'url', name: 'URL 1', url: 'http://example.com' })

    cy.visit('/')

    cy.item('URL 1').drag('.item') // works as folder happens to be first .item

    cy.shouldNotHaveItem('URL 1')
    cy.item('Folder 1').dblclick()
    cy.shouldHaveItem('URL 1')
  })

  it('allows moving multiple selected items', () => {
    cy.createItem({ type: 'folder', name: 'Folder 1' })
    cy.createItem({ type: 'url', name: 'URL 1', url: 'http://example.com' })
    cy.createItem({ type: 'url', name: 'URL 2', url: 'http://example.com' })

    cy.visit('/')

    cy.item('URL 1').click()
    cy.item('URL 2').click()
    cy.item('URL 1').drag('.item') // works as folder happens to be first .item

    cy.shouldNotHaveItem('URL 1')
    cy.shouldNotHaveItem('URL 2')
    cy.item('Folder 1').dblclick()
    cy.shouldHaveItem('URL 1')
    cy.shouldHaveItem('URL 2')
  })
})
