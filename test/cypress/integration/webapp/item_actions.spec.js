/// <reference path="../../support/index.d.ts" />

context('Item actions', () => {
  it('includes an Edit button', () => {
    cy.createItem({ type: 'folder', name: 'Folder 1' })
    cy.visit('/')
    cy.item('Folder 1').rightclick()
    cy.contains('Edit').click()
    cy.url().should('match', new RegExp(`/items/\\d+$`))
  })

  it('includes a Delete button', () => {
    cy.createItem({ type: 'folder', name: 'Folder 1' })
    cy.visit('/')

    // test dialog rejection, should not delete
    cy.once('window:confirm', () => false)
    cy.item('Folder 1').rightclick()
    cy.contains('Delete').click()
    cy.item('Folder 1').should('exist')

    // second time, now for real
    cy.item('Folder 1').rightclick()
    cy.contains('Delete').click()
    cy.shouldNotHaveItem('Folder 1')
  })

  it('includes an Open URL button for URLs', () => {
    cy.createItem({ type: 'folder', name: 'Folder 1' })
    cy.createItem({ type: 'url', name: 'Bookmark 1', url: 'http://example.com' })
    cy.visit('/')

    cy.item('Folder 1').rightclick()
    cy.contains('Open URL').should('not.exist')

    cy.item('Bookmark 1').rightclick()
    cy.contains('Open URL').should('exist')
  })

  it('includes a Copy URL button for URLs', () => {
    cy.createItem({ type: 'folder', name: 'Folder 1' })
    cy.createItem({ type: 'url', name: 'Bookmark 1', url: 'http://example.com' })
    cy.visit('/')

    cy.item('Folder 1').rightclick()
    cy.contains('Copy URL').should('not.exist')

    cy.item('Bookmark 1').rightclick()
    cy.contains('Copy URL').should('exist')
  })

  it('includes Cut and Paste buttons', () => {
    cy.createItem({
      type: 'folder', name: 'Folder 1', children: [
        {
          type: 'folder', name: 'Folder 2', children: [
            { type: 'url', name: 'URL 1', url: 'http://url1.com' },
            { type: 'url', name: 'URL 2', url: 'http://url2.com' },
          ]
        },
        { type: 'url', name: 'URL 3', url: 'http://url3.com' },
      ]
    })
    cy.createItem({ type: 'folder', name: 'Folder 3' })

    cy.visit('/')
    cy.item('Folder 1').rightclick()
    cy.contains('Paste').should('be.disabled') // nothing cut yet => cant paste
    cy.get('body').click()

    cy.item('Folder 1').dblclick()

    // paste url into other folder
    cy.item('URL 3').rightclick()
    cy.contains('Cut').click()
    cy.item('URL 3').rightclick()
    cy.contains('Paste').should('not.exist') // can only paste into folder
    cy.get('body').click()
    cy.item('Folder 2').rightclick()
    cy.contains('Paste').click()
    cy.shouldNotHaveItem('URL 3')
    cy.item('Folder 2').dblclick()
    cy.shouldHaveItem('URL 3')

    // paste folder from tree view into other folder
    cy.item('Folder 1').click()
    cy.item('Folder 2').rightclick()
    cy.contains('Cut').click()
    cy.item('Folder 3').rightclick()
    cy.contains('Paste').click()
    cy.item('Folder 3').dblclick()
    cy.shouldHaveItem('Folder 2', { within: 'folder' })
      .dblclick()
    cy.shouldHaveItem('URL 1')
    cy.shouldHaveItem('URL 2')
  })

  it('includes a Dissolve button', () => {
    cy.createItem({
      type: 'folder', name: 'Folder 1', children: [
        { type: 'url', name: 'URL 1', url: 'http://url1.com' },
        { type: 'url', name: 'URL 2', url: 'http://url2.com' },
      ]
    })
    cy.visit('/')

    // test dialog rejection, should not dissolve
    cy.once('window:confirm', () => false)
    cy.item('Folder 1').rightclick()
    cy.contains('Dissolve').click()
    cy.item('Folder 1').should('exist')

    // second time, now for real
    cy.item('Folder 1').rightclick()
    cy.contains('Dissolve').click()
    cy.shouldNotHaveItem('Folder 1')
    cy.shouldHaveItem('URL 1')
    cy.shouldHaveItem('URL 2')
  })

  it('includes a Select / Deselect button', () => {
    cy.createItem({ type: 'url', name: 'URL 1', url: 'http://example.com' })
    cy.createItem({ type: 'url', name: 'URL 2', url: 'http://example.com' })
    cy.createItem({ type: 'url', name: 'URL 3', url: 'http://example.com' })

    cy.visit('/')

    cy.item('URL 1').rightclick()
    cy.contains('Deselect').should('not.exist')
    cy.contains('Select').click()
    cy.item('URL 2').rightclick()
    cy.contains('Select').click()
    cy.item('URL 3').rightclick()
    cy.contains('Select').click()

    cy.item('URL 1').rightclick()
    cy.contains('Select').should('not.exist')
    cy.contains('Deselect').click()

    cy.item('URL 1').should('not.have.class', 'selected')
    cy.item('URL 2').should('have.class', 'selected')
    cy.item('URL 3').should('have.class', 'selected')
  })

  it('includes a Delete selected button', () => {
    cy.createItem({ type: 'url', name: 'URL 1', url: 'http://example.com' })
    cy.createItem({ type: 'url', name: 'URL 2', url: 'http://example.com' })
    cy.createItem({ type: 'url', name: 'URL 3', url: 'http://example.com' })

    cy.visit('/')

    cy.item('URL 1').click()
    cy.item('URL 3').click()
    cy.item('URL 1').rightclick()
    cy.contains('Delete selected (2)').click()

    cy.shouldNotHaveItem('URL 1')
    cy.shouldHaveItem('URL 2')
    cy.shouldNotHaveItem('URL 3')
  })

  it('includes a Cut selected button', () => {
    cy.createItem({ type: 'folder', name: 'Folder 1' })
    cy.createItem({ type: 'url', name: 'URL 1', url: 'http://example.com' })
    cy.createItem({ type: 'url', name: 'URL 2', url: 'http://example.com' })
    cy.createItem({ type: 'url', name: 'URL 3', url: 'http://example.com' })

    cy.visit('/')

    cy.item('URL 1').click()
    cy.item('URL 2').click()
    cy.item('URL 1').rightclick()
    cy.contains('Cut selected (2)').click()
    cy.item('Folder 1').rightclick()
    cy.contains('Paste (2)').click()

    cy.shouldNotHaveItem('URL 1')
    cy.shouldNotHaveItem('URL 2')
    cy.shouldHaveItem('URL 3')
    cy.item('Folder 1').dblclick()
    cy.shouldHaveItem('URL 1')
    cy.shouldHaveItem('URL 2')
  })
})
