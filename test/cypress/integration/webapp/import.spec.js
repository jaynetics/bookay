/// <reference path="../../support/index.d.ts" />

context('Import', () => {
  it('allows uploading a bookmarks.html', () => {
    cy.visit('/')
    cy.get('.burger').click()
    cy.contains('Import').click()
    cy.url().should('contain', '/import')

    cy.get('[type=file]').attachFile('../../../shared/fixtures/bookmarks.html')
    cy.get('form').submit()
    cy.shouldFlash('Added 4 items')
    cy.shouldHaveItem('Good reads')
    cy.shouldHaveItem('URL at Root')
  })
})
