/// <reference path="../../support/index.d.ts" />

context('Tree navigation', () => {
  it('shows only root trees at first, others can be expanded', () => {
    cy.createItem({
      name: 'Foo', type: 'folder', children: [
        {
          name: 'Bar', type: 'folder', children: [
            { name: 'Baz', type: 'url', url: 'http://baz.com' }
          ]
        }
      ]
    })
    cy.visit('/')
    cy.shouldNotHaveItem('Bar', { within: 'tree' })
    cy.shouldNotHaveItem('Baz', { within: 'tree' })
    cy.item('Foo', { within: 'tree' })
      .get('.item-toggle').filter(':visible').click()
    cy.shouldHaveItem('Bar', { within: 'tree' })
    cy.shouldNotHaveItem('Baz')

    // deepest folder should not have toggle, but contents can be shown
    cy.item('Bar', { within: 'tree' })
      .get('.item-toggle')
      .should('be.empty')
      .should('have.attr', 'aria-disabled')
    cy.item('Bar', { within: 'tree' }).click()
    cy.shouldHaveItem('Baz')
  })
})
