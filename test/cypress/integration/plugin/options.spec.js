/// <reference path="../../support/index.d.ts" />

context('Plugin options', () => {
  it('allows changing the plugin settings', () => {
    cy.showPluginElement('options')
    cy.get('#suggestSize').invoke('val').should('eq', '3')
    cy.get('#suggestSize').clear().type('0')
    cy.contains('Save').click()

    cy.window().then(win => {
      win['browser'].storage.sync.get(['suggestSize'], ({ suggestSize }) => {
        expect(suggestSize).to.eq('0')
      })
    })
  })

  it('allows logging out', () => {
    cy.showPluginElement('options')
    cy.get('#logoutButton').click()
    cy.showPluginElement('popup')
    cy.contains('button', 'Log in').should('exist')
  })
})
