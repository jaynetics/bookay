/// <reference path="../../support/index.d.ts" />

context('Creating users', () => {
  it('works', () => {
    cy.visit('/#/users/create')

    cy.get('[name=username]').type('new user')
    cy.get('[name=password]').type('pw')
    cy.get('[name=ownPassword]').type('WRONG')
    cy.get('form').submit()
    cy.should('contain', 'check your input')

    cy.get('[name=ownPassword]').clear().type('pw')
    cy.get('form').submit()
    cy.shouldFlash('created')
  })
})
