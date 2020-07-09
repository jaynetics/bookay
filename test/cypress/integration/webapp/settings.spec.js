/// <reference path="../../support/index.d.ts" />

context('Settings', () => {
  it('allows changing settings', () => {
    cy.visit('/#/settings')
    cy.get('[name=faviconSource] :selected').should('have.text', 'Disabled')
    cy.get('[name=faviconSource]')
      .select('Google').wait(100)
      .siblings('button').contains('Save').click()
    cy.shouldFlash('Saved')

    cy.visit('/#/settings')
    cy.get('[name=faviconSource] :selected').should('have.text', 'Google')

    // restore old state
    cy.get('[name=faviconSource]')
      .select('Disabled').wait(100)
      .siblings('button').contains('Save').click()
  })

  it('allows changing the password', () => {
    cy.visit('/#/settings')
    cy.get('[name=oldPassword]').type('pw')
    cy.get('[name=newPassword]').type('nupw')
      .siblings('button').contains('Save').click()
    cy.shouldFlash('Saved')

    // old password should no longer work
    cy.visit('/#/logout')
    cy.visit('/#/login')
    cy.get('[name=username]').type('Sonia')
    cy.get('[name=password]').type('pw')
    cy.get('form').submit()
    cy.contains('Wrong').should('exist')
  })

  it('allows deleting the account', () => {
    cy.visit('/#/settings')
    cy.get('[name=confirmation]').type('Sonia')
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
