/// <reference path="../../support/index.d.ts" />

context('Creating items', () => {
  it('is accessible via the nav bar', () => {
    cy.visit('/')
    cy.contains('+').click()
    cy.url().should('contain', '/#/items/create')
  })

  it('allows adding new URLs', () => {
    cy.visit('/#/items/create')

    // error case
    cy.get('form').submit()
    cy.should('contain', 'check your input')

    // correct submission
    cy.get('[name=url]').type('https://example.com')
    cy.get('[name=name]').type('My 1st bookmark')
    cy.get('form').submit()

    cy.url().should('match', new RegExp('/#/$'))
    cy.shouldFlash('created')
    cy.shouldHaveItem('My 1st bookmark')
  })

  it('allows adding new Folders', () => {
    cy.visit('/#/items/create')

    cy.contains('Folder').click()
    cy.get('[name=name]').type('My 1st Folder')
    cy.get('form').submit()

    cy.shouldFlash('created')
    cy.shouldHaveItem('My 1st Folder')
  })

  it('allows adding items to the currently viewed folder', () => {
    cy.createItem({ type: 'folder', name: 'Folder 1' })
    cy.visit('/')
    cy.contains('Folder 1').dblclick()
    cy.contains('+').click()

    // last-viewed folder should be preselected
    cy.get('[name=folderId]').invoke('val').should('not.be.empty')

    cy.contains('Folder').click()
    cy.get('[name=name]').type('Nested folder')
    cy.get('form').submit()

    cy.shouldHaveItem('Nested folder')
  })

  it('allows adding items to manually chosen folders', () => {
    cy.createItem({ type: 'folder', name: 'Folder 1' })
    cy.visit('/#/items/create')

    cy.contains('Folder').click()
    cy.get('[name=name]').type('Nested folder')
    cy.get('[name=folderId]').select('Folder 1')
    cy.wait(100) // wait for value to be set
    cy.get('form').submit()

    cy.visit('/')
    cy.item('Folder 1').dblclick()
    cy.shouldHaveItem('Nested folder')
  })

  it('allows adding items to a folder chosen by browsing', () => {
    cy.createItem({
      type: 'folder', name: 'Folder 1', children: [
        { type: 'folder', name: 'Folder 2' }
      ]
    })
    cy.visit('/#/items/create')

    cy.contains('Folder').click()
    cy.get('[name=name]').type('Nested folder')
    cy.contains('Browse folders').click()
    cy.item('Folder 1').click()
    cy.item('Folder 2').click()
    cy.contains('Choose').click()
    cy.wait(100) // wait for folder select to re-render
    cy.get('[name=folderId] :selected').should('have.text', 'Folder 2')
  })

  it('allows adding items to a folder created while browsing', () => {
    cy.createItem({
      type: 'folder', name: 'Folder 1', children: [
        { type: 'folder', name: 'Folder 2' }
      ]
    })
    cy.visit('/#/items/create')

    cy.contains('Folder').click()
    cy.get('[name=name]').type('Nested folder')
    cy.contains('Browse folders').click()
    cy.item('Folder 1').click()
    cy.item('Folder 2').click()

    // adding and choosing a new folder
    cy.contains('New folder').click()
    cy.get('.modal [name=name]').type('Folder 3')
    cy.get('.modal').contains('Add').click()
    cy.item('Folder 3').click()
    cy.contains('Choose').click()

    cy.wait(100) // wait for folder select to re-render
    cy.get('[name=folderId] :selected').should('have.text', 'Folder 3')
  })

  it('supports URL params', () => {
    cy.visit('/#/items/create?url=https://everything2.com&name=e2')
    cy.get('form').submit()

    cy.shouldHaveItem('e2')
  })

  it('falls back to the URL as name if no name is entered', () => {
    cy.visit('/#/items/create')

    cy.get('[name=url]').type('https://everything2.com/')
    cy.get('form').submit()

    cy.shouldFlash('created')
    cy.shouldHaveItem('https://everything2.com/')
  })
})
