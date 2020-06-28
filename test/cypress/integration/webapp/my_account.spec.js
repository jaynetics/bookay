/// <reference path="../../support/index.d.ts" />

context('My account', () => {
  it('allows changing the password', () => {
    cy.visit('/#/users/show')
    cy.get('[name=oldPassword]').type('pw')
    cy.get('[name=newPassword]').type('nupw')
    cy.contains('button', 'Save').click()
    cy.shouldFlash('changed')

    // old password should no longer work
    cy.visit('/#/logout')
    cy.visit('/#/login')
    cy.get('[name=username]').type('Sonia')
    cy.get('[name=password]').type('pw')
    cy.get('form').submit()
    cy.contains('Wrong').should('exist')
  })

  it('allows deleting the account', () => {
    cy.visit('/#/users/show')
    cy.get('[name=confirmation]').type('delete everything')
    cy.contains('button', 'Delete').click()
    cy.shouldFlash('Goodbye')
    cy.url().should('contain', '/#/login')

    // login should no longer be possible
    cy.get('[name=username]').type('Sonia')
    cy.get('[name=password]').type('pw')
    cy.get('form').submit()
    cy.contains('Wrong').should('exist')
  })
})
