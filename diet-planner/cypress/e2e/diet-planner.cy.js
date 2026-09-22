// cypress/e2e/diet-planner.cy.js
describe('Diet Planner End-to-End Automated Browser Test', () => {
  beforeEach(() => {
    // Clear localStorage before each test for a fresh state
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('1. shows login page with rich UI and all input controls', () => {
    cy.url().should('include', '/login')
    cy.contains('NutriMind')
    cy.get('#email').should('be.visible')
    cy.get('#password').should('be.visible')
    cy.get('#login').should('be.visible')
    cy.get('#free-mode').should('be.visible')
    cy.screenshot('01-login-page')
  })

  it('2. validates form inputs properly on empty submit', () => {
    cy.visit('/login')
    cy.get('#login').click()
    cy.contains('valid email').should('be.visible')
    cy.screenshot('02-validation-errors')
  })

  it('3. completes onboarding, generates meal plan, and logs intake in Free Mode', () => {
    cy.visit('/login')

    // Click Continue in Free Mode
    cy.get('#free-mode').click()

    // Should land on Profile Setup
    cy.url({ timeout: 10000 }).should('match', /\/(setup)?$/)

    // Complete Step 0: Basic info
    cy.contains('Basic Info')
    cy.get('#name').should('exist')
    cy.contains('Continue').click()

    // Step 1: Body metrics
    cy.contains('Body Metrics')
    cy.get('#height').clear().type('175')
    cy.get('#weight').clear().type('72')
    cy.get('#sex').select('male')
    cy.get('#age').clear().type('24')
    cy.contains('Continue').click()

    // Step 2: Goals
    cy.contains('Goals & Diet')
    cy.get('#activity').select('moderate')
    cy.get('#goal').select('cut')
    cy.contains('Continue').click()

    // Step 3: Dietary preferences
    cy.contains('Preferences')
    cy.get('#diet_pref').select('omnivore')
    cy.get('#saveProfile').click()

    // Lands on Dashboard
    cy.url({ timeout: 10000 }).should('not.include', '/setup')
    cy.contains('Daily Calories', { timeout: 10000 }).should('be.visible')
    cy.contains('BMR').should('be.visible')
    cy.contains('TDEE').should('be.visible')
    cy.screenshot('03-dashboard')

    // Navigate to Meal Plan
    cy.visit('/meal-plan')
    cy.contains('Meal Plans').should('be.visible')
    cy.contains('Generate Plan').click()

    // Meal plan generated
    cy.contains('Your Meal Plan', { timeout: 10000 }).should('be.visible')
    cy.get('.meal-card').should('have.length.at.least', 1)
    cy.screenshot('04-meal-plan-generated')

    // Save Meal Plan
    cy.contains('Save to Cloud').click()
    cy.contains('Plan saved successfully!', { timeout: 10000 }).should('be.visible')

    // Navigate to Intake Log
    cy.visit('/intake')
    cy.contains('Intake Log').should('be.visible')

    // Search and log food
    cy.get('input[placeholder*="chicken"]').type('oats')
    cy.contains('.food-result-item', 'Oats', { timeout: 5000 }).click()
    cy.contains('+ Add').click()
    cy.contains('Added Oats', { timeout: 5000 }).should('be.visible')
    cy.screenshot('05-intake-logged')
  })
})
