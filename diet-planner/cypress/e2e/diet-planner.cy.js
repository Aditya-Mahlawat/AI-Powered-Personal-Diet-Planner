// cypress/e2e/diet-planner.cy.js
describe('NutriMind Comprehensive End-to-End Automated Browser Test', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('1. shows authentic login page with inputs and validates empty submission', () => {
    cy.url().should('include', '/login')
    cy.contains('NutriMind')
    cy.get('#email').should('be.visible')
    cy.get('#password').should('be.visible')
    cy.get('#login').should('be.visible')

    // Submit empty to check validation
    cy.get('#login').click()
    cy.contains('valid email').should('be.visible')
  })

  it('2. signs in seamlessly, completes profile onboarding, and explores all features', () => {
    cy.visit('/login')

    // Sign in with standard credentials
    cy.get('#email').type('aditya@dietplanner.com')
    cy.get('#password').type('securePass123')
    cy.get('#login').click()

    // Should land on Profile Setup
    cy.url({ timeout: 10000 }).should('match', /\/(setup)?$/)

    // Complete Step 0: Basic info
    cy.contains('Basic Info')
    cy.get('#name').should('exist')
    cy.contains('Continue').click()

    // Step 1: Body metrics
    cy.contains('Body Metrics')
    cy.get('#height').clear().type('175')
    cy.get('#weight').clear().type('70')
    cy.get('#sex').select('male')
    cy.get('#age').clear().type('23')
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

    // 1. Verify Dashboard
    cy.url({ timeout: 10000 }).should('not.include', '/setup')
    cy.contains('Daily Calories', { timeout: 10000 }).should('be.visible')
    cy.contains('BMR').should('be.visible')
    cy.contains('TDEE').should('be.visible')

    // 2. Test Indian Regional Meal Plans
    cy.visit('/meal-plan')
    cy.contains('Meal Plans & Diet Schedules').should('be.visible')
    cy.contains('North Indian Homestyle').should('be.visible')
    cy.contains('South Indian Traditional').should('be.visible')
    cy.contains('High-Protein Indian Vegetarian').should('be.visible')

    // Select South Indian Traditional preset
    cy.contains('South Indian Traditional').click()
    cy.contains('Loaded "South Indian Traditional Feast"').should('be.visible')

    // Verify structured meal slots exist
    cy.contains('Breakfast').should('be.visible')
    cy.contains('Lunch').should('be.visible')
    cy.contains('Evening Snack').should('be.visible')
    cy.contains('Dinner').should('be.visible')

    // Save plan
    cy.contains('Save to Cloud').click()
    cy.contains('Plan saved to cloud storage!', { timeout: 10000 }).should('be.visible')

    // 3. Test Smart Grocery List
    cy.visit('/grocery')
    cy.contains('Smart Grocery Checklist').should('be.visible')
    cy.contains('Plan Duration:').should('be.visible')
    cy.get('input[type="checkbox"]').should('have.length.at.least', 3)
    // Toggle first grocery item checkbox
    cy.get('input[type="checkbox"]').first().click()

    // 4. Test Food Explorer
    cy.visit('/foods')
    cy.contains('Indian Nutrition & Food Directory').should('be.visible')
    cy.contains('Roti & Grains').click()
    cy.contains('Chapati (Whole Wheat Roti)').should('be.visible')
    cy.contains('Veg Protein & Dal').click()
    cy.contains('Paneer (Fresh Cottage Cheese)').should('be.visible')

    // 5. Test Intake Log with Water Tracker
    cy.visit('/intake')
    cy.contains('Daily Intake Log').should('be.visible')
    cy.contains('Hydration Tracker').should('be.visible')

    // Click on water glass 1 and 2
    cy.contains('button', '1').click()
    cy.contains('250 ml / 2000 ml').should('be.visible')

    // Search and log an Indian food item
    cy.get('input[placeholder*="roti"]').type('paneer bhurji')
    cy.contains('.food-result-item', 'Paneer Bhurji', { timeout: 5000 }).click()
    cy.contains('+ Add').click()
    cy.contains('Added Paneer Bhurji', { timeout: 5000 }).should('be.visible')
  })
})
