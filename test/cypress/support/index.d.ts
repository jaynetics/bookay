// load type definitions that come with Cypress module
/// <reference types="cypress" />
/// <reference types="cypress-localstorage-commands" />
/// <reference types="@4tw/cypress-drag-drop" />

declare namespace bookay {
  interface PostArgs {
    body?: object
    url: string
  }
  interface Item {
    folderId?: number
    name: string
  }
  interface Bookmark extends Item {
    type: 'url'
    url: string
  }
  interface Folder extends Item {
    children?: (Bookmark|Folder)[]
    type: 'folder'
  }

  interface ItemLookupOpts {
    within: 'main' | 'folder' | 'tree'
  }
}

declare namespace Cypress {
  interface Chainable {
    createItem(args: (bookay.Bookmark|bookay.Folder)): Chainable<Response>
    post(args: bookay.PostArgs): Chainable<Response>
    shouldFlash(message: string): Chainable<Element>
    item(name: string, opts?: bookay.ItemLookupOpts): Chainable<Element>
    shouldHaveItem(name: string, opts?: bookay.ItemLookupOpts): Chainable<Element>
    shouldNotHaveItem(name: string, opts?: bookay.ItemLookupOpts): Chainable<Element>
    showPluginElement(name: 'options' | 'popup'): Chainable<Element>
  }
}
