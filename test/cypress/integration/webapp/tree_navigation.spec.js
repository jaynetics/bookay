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
      .get('.item-expansion-toggle').filter(':visible').click()
    cy.shouldHaveItem('Bar', { within: 'tree' })
    cy.shouldNotHaveItem('Baz')

    // deepest folder should not have toggle, but contents can be shown
    cy.item('Bar', { within: 'tree' })
      .get('.item-expansion-toggle')
      .should('be.empty')
    cy.item('Bar', { within: 'tree' }).click()
    cy.shouldHaveItem('Baz')
  })

  it('can be used to select folders across nesting levels', () => {
    cy.createItem({
      name: 'Foo', type: 'folder', children: [
        {
          name: 'Bar', type: 'folder', children: [
            { name: 'Baz', type: 'folder' }
          ]
        }
      ]
    })
    cy.visit('/')

    cy.item('Foo', { within: 'tree' })
      .get('.item-expansion-toggle').click()
    cy.item('Bar', { within: 'tree' })
      .get('.item-expansion-toggle').last().click()

    cy.item('Bar', { within: 'tree' }).rightclick('top')
    cy.contains('Select').click()
    cy.item('Baz', { within: 'tree' }).rightclick()
    cy.contains('Select').click()

    cy.item('Foo', { within: 'tree' }).should('not.have.class', 'selected')
    cy.item('Bar', { within: 'tree' }).should('have.class', 'selected')
    cy.item('Baz', { within: 'tree' }).should('have.class', 'selected')

    // should be able to de-select by clicking checkmark
    cy.item('Baz', { within: 'tree' })
      .get('.item-accessory').last().click()

    cy.item('Foo', { within: 'tree' }).should('not.have.class', 'selected')
    cy.item('Bar', { within: 'tree' }).should('have.class', 'selected')
    cy.item('Baz', { within: 'tree' }).should('not.have.class', 'selected')
  })
})
