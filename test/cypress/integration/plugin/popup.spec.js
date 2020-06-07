/// <reference path="../../support/index.d.ts" />

context('Plugin popup', () => {
  it('requires authentication', () => {
    cy.setLocalStorage('bookay_session_id', 'wrong')

    cy.showPluginElement('popup')

    // wrong credentials, should keep showing form
    cy.get('[name=username]').type('Sonia')
    cy.get('[name=password]').type('wrong')
    cy.get('form').submit()

    // correct credentials
    cy.get('[name=username]').clear().type('Sonia')
    cy.get('[name=password]').clear().type('pw')
    cy.get('form').submit()

    // login success triggers location.reload, broken in cypress
    cy.showPluginElement('popup')
    cy.contains('Manage').should('exist')
  })

  it('allows adding URLs', () => {
    cy.showPluginElement('popup')
    cy.contains('Add').should('exist')
    cy.contains('Root').click()

    // popup closes after adding, so open again to check new state
    cy.showPluginElement('popup')
    cy.contains('bookmarked').should('exist')
    cy.contains('Add').should('not.exist')
    cy.contains('Edit bookmark').should('exist')
  })

  it('allows editing added URLs', () => {
    cy.createItem({ type: 'url', url: 'http://example.com', name: 'Foo' })
    cy.showPluginElement('popup')
    cy.contains('Edit').click()

    // should show webapp
    cy.get('[name=name]').should('exist')
    cy.get('[name=url]').should('exist')
    cy.get('[name=folderId]').should('exist')
  })

  it('allows removing URLs', () => {
    cy.createItem({ type: 'url', url: 'http://example.com', name: 'Foo' })
    cy.showPluginElement('popup')
    cy.contains('Add').should('not.exist')
    cy.contains('Remove').click()

    // popup closes after deleting, so open again to check new state
    cy.showPluginElement('popup')
    cy.contains('Remove').should('not.exist')
    cy.contains('Manage').should('exist')
    cy.contains('Add').should('exist')
  })

  it('allows adding to a recently used folder', () => {
    cy.createItem({ type: 'folder', name: 'Good stuff' })
    cy.showPluginElement('popup')
    cy.contains('Good stuff').click()

    // visit webapp to verify placement in correct folder
    cy.visit('/')
    cy.contains('Good stuff').dblclick()
    cy.shouldHaveItem('Example.com')
  })

  it('allows adding with custom settings', () => {
    cy.showPluginElement('popup')
    cy.contains('other folder').click()
    cy.get('input[name=name]').should('exist')
    cy.get('input[name=url]').should('exist')
    cy.get('select[name=folderId]').should('exist')
  })

  it('has a link to the webapp', () => {
    cy.showPluginElement('popup')
    cy.contains('Manage').click()
    cy.url().should('match', new RegExp('/#/$'))
  })

  it('shows recent bookmarks if there are any', () => {
    cy.showPluginElement('popup')
    cy.contains('Recent bookmarks').should('not.exist')

    cy.createItem({ type: 'url', url: 'http://foo.com', name: 'Foo' })
    cy.createItem({ type: 'url', url: 'http://bar.com', name: 'Bar' })

    cy.showPluginElement('popup')
    cy.contains('Recent bookmarks').should('exist')
    cy.contains('Foo').should('exist')
    cy.contains('Bar').should('exist')
  })
})
