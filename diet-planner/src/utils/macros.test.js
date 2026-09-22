// src/utils/macros.test.js
import { describe, it, expect } from 'vitest'
import { calculateBMR, calculateTargets, computeNutrition, planDay } from './macros'
import { FOODS_CATALOG } from '../data/foods'

describe('calculateBMR', () => {
  it('calculates male BMR correctly (Mifflin-St Jeor)', () => {
    // (10*80) + (6.25*180) - (5*25) + 5 = 800+1125-125+5 = 1805
    const bmr = calculateBMR({ sex: 'male', weight_kg: 80, height_cm: 180, age: 25 })
    expect(bmr).toBeCloseTo(1805, 0)
  })

  it('calculates female BMR correctly', () => {
    // (10*62) + (6.25*165) - (5*22) - 161 = 620+1031.25-110-161 = 1380.25
    const bmr = calculateBMR({ sex: 'female', weight_kg: 62, height_cm: 165, age: 22 })
    expect(bmr).toBeCloseTo(1380.25, 0)
  })
})

describe('calculateTargets', () => {
  it('returns cut targets at -15% with 30/40/30 macro split', () => {
    const result = calculateTargets({
      sex: 'female', weight_kg: 62, height_cm: 165, age: 22,
      activity_level: 'moderate', goal: 'cut',
    })
    expect(result.bmr).toBeGreaterThan(1000)
    expect(result.tdee).toBeGreaterThan(result.bmr)
    expect(result.cal).toBeLessThan(result.tdee)
    // Cal should be 85% of TDEE
    expect(result.cal).toBeCloseTo(result.tdee * 0.85, -1)
    // Macro split check
    const { p, c, f } = result.macros
    expect(p * 4 + c * 4 + f * 9).toBeCloseTo(result.cal, -2)
  })

  it('returns gain targets at +15%', () => {
    const result = calculateTargets({
      sex: 'male', weight_kg: 70, height_cm: 175, age: 25,
      activity_level: 'active', goal: 'gain',
    })
    expect(result.cal).toBeGreaterThan(result.tdee)
    expect(result.cal).toBeCloseTo(result.tdee * 1.15, -1)
  })

  it('returns maintain targets at 0%', () => {
    const result = calculateTargets({
      sex: 'male', weight_kg: 70, height_cm: 175, age: 25,
      activity_level: 'moderate', goal: 'maintain',
    })
    expect(result.cal).toBe(result.tdee)
  })
})

describe('computeNutrition', () => {
  it('scales nutrition correctly from per100g', () => {
    const oats = FOODS_CATALOG.find(f => f.id === 'oats')
    const result = computeNutrition(oats, 200)
    expect(result.kcal).toBe(Math.round(oats.per100.kcal * 2))
    expect(result.p).toBe(Math.round(oats.per100.p * 2 * 10) / 10)
  })

  it('handles 0 grams', () => {
    const egg = FOODS_CATALOG.find(f => f.id === 'egg')
    const result = computeNutrition(egg, 0)
    expect(result.kcal).toBe(0)
  })
})

describe('planDay', () => {
  it('generates a plan with items for omnivore', () => {
    const plan = planDay({
      macros: { p: 130, c: 200, f: 55 },
      diet_pref: 'omnivore',
      allergies: [],
      foods: FOODS_CATALOG,
    })
    expect(plan.length).toBeGreaterThan(0)
    expect(plan.length).toBeLessThanOrEqual(6)
  })

  it('filters out nonveg foods for vegan diet', () => {
    const plan = planDay({
      macros: { p: 80, c: 150, f: 40 },
      diet_pref: 'vegan',
      allergies: [],
      foods: FOODS_CATALOG,
    })
    plan.forEach(item => {
      const food = FOODS_CATALOG.find(f => f.id === item.foodId)
      expect(food.tags).not.toContain('nonveg')
    })
  })

  it('respects allergy filters', () => {
    const plan = planDay({
      macros: { p: 80, c: 150, f: 40 },
      diet_pref: 'omnivore',
      allergies: ['nuts'],
      foods: FOODS_CATALOG,
    })
    plan.forEach(item => {
      const food = FOODS_CATALOG.find(f => f.id === item.foodId)
      expect(food.tags).not.toContain('nuts')
    })
  })
})
