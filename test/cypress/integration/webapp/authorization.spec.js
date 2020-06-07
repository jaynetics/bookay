/// <reference path="../../support/index.d.ts" />

context('Authorization', () => {
  it('allows logging in and out', () => {
    // test logout
    cy.visit('/')
    cy.get('.burger').click()
    cy.contains('Logout').click()
    cy.url().should('contain', '/#/login')
    cy.shouldFlash('Logged out')

    // test redirect when accessing unpermitted URL
    cy.visit('/#/items/create')
    cy.url().should('contain', '/#/login')

    // test incorrect login
    cy.get('[name=username]').type('Sonia')
    cy.get('[name=password]').type('wrong pw')
    cy.get('form').submit()
    cy.url().should('contain', '/#/login')
    cy.shouldFlash('Wrong')

    // test redirect after successful login
    cy.get('[type=password]').clear().type('pw')
    cy.get('form').submit()
    cy.url().should('match', new RegExp('/#/items/create$'))
    cy.shouldFlash('Logged in')
  })
})
