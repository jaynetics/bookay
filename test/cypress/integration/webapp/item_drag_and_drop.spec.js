/// <reference path="../../support/index.d.ts" />

context('Item drag and drop', () => {
  it('allows moving items to a folder', () => {
    cy.createItem({ type: 'folder', name: 'Folder 1' })
    cy.createItem({ type: 'url', name: 'URL 1', url: 'http://example.com' })

    cy.visit('/')

    // test dialog rejection, should not move
    cy.once('window:confirm', () => false)
    cy.item('URL 1').drag('.item') // works as folder happens to be first .item
    cy.shouldHaveItem('URL 1') // not yet moved due to dialog rejection

    // try again
    cy.item('URL 1').drag('.item')
    cy.shouldNotHaveItem('URL 1')
    cy.item('Folder 1').dblclick()
    cy.shouldHaveItem('URL 1')
  })

  it('allows moving items to root', () => {
    cy.createItem({
      type: 'folder', name: 'Folder 1', children: [
        { type: 'folder', name: 'Folder 2' }
      ]
    })

    cy.visit('/')
    cy.shouldNotHaveItem('Folder 2', { within: 'folder' })

    cy.item('Folder 1').dblclick()
    cy.item('Folder 2').drag('.folder-tree')
    cy.visit('/')
    cy.shouldHaveItem('Folder 2', { within: 'folder' })
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
