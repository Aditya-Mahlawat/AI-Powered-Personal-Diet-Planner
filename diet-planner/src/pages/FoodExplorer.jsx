// src/pages/FoodExplorer.jsx
import { useState } from 'react'
import { FOODS_CATALOG } from '../data/foods'
import { useAuth } from '../contexts/AuthContext'
import { addDayIntakeItem } from '../services/storageService'
import { computeNutrition } from '../utils/macros'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { id: 'all',            label: 'All Foods' },
  { id: 'grains',         label: '🌾 Roti & Grains' },
  { id: 'protein_veg',    label: '🧀 Veg Protein & Dal' },
  { id: 'protein_nonveg', label: '🍗 Eggs & Meat' },
  { id: 'south_indian',   label: '🥥 South Indian' },
  { id: 'vegetables',     label: '🥦 Sabzi & Veggies' },
  { id: 'snacks',         label: '🥜 Snacks & Drinks' },
  { id: 'high_protein',   label: '⚡ High Protein' },
]

export default function FoodExplorer() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [addingId, setAddingId] = useState(null)

  const filteredFoods = FOODS_CATALOG.filter((food) => {
    // Category match
    if (activeCategory === 'high_protein') {
      if (!food.tags.includes('high_protein')) return false
    } else if (activeCategory !== 'all') {
      if (food.category !== activeCategory) return false
    }

    // Search query match
    if (search.trim()) {
      const q = search.toLowerCase()
      const matchName = food.name.toLowerCase().includes(q)
      const matchTags = food.tags.some((t) => t.toLowerCase().includes(q))
      const matchCuisine = food.cuisine?.toLowerCase().includes(q)
      if (!matchName && !matchTags && !matchCuisine) return false
    }

    return true
  })

  const handleQuickLog = async (food) => {
    if (!user) {
      toast.error('Please sign in first.')
      return
    }

    setAddingId(food.id)
    try {
      const todayKey = new Date().toISOString().slice(0, 10)
      const nutrition = computeNutrition(food, 100)
      const item = {
        foodId: food.id,
        name: food.name,
        grams: 100,
        ...nutrition,
        mealSlot: 'lunch',
        loggedAt: new Date().toISOString(),
      }

      await addDayIntakeItem(user.uid, todayKey, item, user.isLocal)
      toast.success(`Logged 100g of ${food.name} to Today's Intake!`)
    } catch (e) {
      console.error(e)
      toast.error('Failed to log food.')
    } finally {
      setAddingId(null)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🔍 <span className="gradient-text">Indian Nutrition & Food Directory</span></h1>
        <p>Explore exact macro profiles, portion benchmarks, and dietary values for 60+ authentic Indian and global foods.</p>
      </div>

      {/* Search and filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search foods (e.g. paneer, dal tadka, idli, soya chunks, chicken breast)…"
          className="form-input"
          style={{ fontSize: '1rem', padding: '0.85rem 1.25rem' }}
        />

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`btn btn-sm ${activeCategory === cat.id ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: 20 }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Food Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filteredFoods.map((food) => {
          const isHighProtein = food.tags.includes('high_protein')
          const isJain = food.tags.includes('jain')

          return (
            <div key={food.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{food.name}</h3>
                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    {isHighProtein && <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>⚡ High Protein</span>}
                    {isJain && <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>🪷 Jain</span>}
                  </div>
                </div>

                {food.serving && (
                  <p className="text-xs text-muted" style={{ marginBottom: '1rem' }}>
                    Serving: {food.serving}
                  </p>
                )}

                {/* Macro breakdown bar */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.03)',
                  marginBottom: '1rem',
                  textAlign: 'center',
                }}>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {food.per100.kcal}
                    </div>
                    <div className="text-xs text-muted">kcal</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#00ff88' }}>
                      {food.per100.p}g
                    </div>
                    <div className="text-xs text-muted">Protein</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#00d4ff' }}>
                      {food.per100.c}g
                    </div>
                    <div className="text-xs text-muted">Carbs</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#8b5cf6' }}>
                      {food.per100.f}g
                    </div>
                    <div className="text-xs text-muted">Fat</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                <span className="text-xs text-muted">Per 100g basis</span>
                <button
                  onClick={() => handleQuickLog(food)}
                  className="btn btn-secondary btn-sm"
                  disabled={addingId === food.id}
                >
                  {addingId === food.id ? 'Adding…' : '+ Log (100g)'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {filteredFoods.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No matching foods found</h3>
          <p>Try searching for another Indian or global ingredient.</p>
        </div>
      )}
    </div>
  )
}
