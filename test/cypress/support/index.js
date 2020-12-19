import './commands'

// https://github.com/archfz/cypress-terminal-report
require('cypress-terminal-report/src/installLogsCollector')()

beforeEach(() => {
  cy.setLocalStorage('bookay_session_id', 'SoSafe')
  // clears db, sets up session with id 'SoSafe':
  cy.post({ url: 'http://localhost:3033/api/integration_test' })
})
