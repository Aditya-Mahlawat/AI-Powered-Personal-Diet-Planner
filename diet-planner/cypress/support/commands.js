// cypress/support/commands.js
// Custom Cypress commands for the diet planner tests

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('#email').type(email)
  cy.get('#password').type(password)
  cy.get('#login').click()
  cy.url({ timeout: 10000 }).should('not.include', '/login')
})

Cypress.Commands.add('clearAppStorage', () => {
  cy.window().then(win => {
    win.localStorage.clear()
    win.sessionStorage.clear()
    win.indexedDB.deleteDatabase('firebaseLocalStorageDb')
  })
})
