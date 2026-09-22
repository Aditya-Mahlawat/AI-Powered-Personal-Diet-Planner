// src/pages/IntakeLog.jsx
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { calculateTargets, computeNutrition, computeIntakeTotals } from '../utils/macros'
import { FOODS_CATALOG, searchFoods } from '../data/foods'
import { getDayIntake, addDayIntakeItem, updateDayIntakeItems } from '../services/storageService'
import MealCard from '../components/MealCard'
import MacroRing from '../components/MacroRing'
import toast from 'react-hot-toast'

export default function IntakeLog() {
  const { user, profile } = useAuth()
  const [targets, setTargets] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [selectedFood, setSelectedFood] = useState(null)
  const [grams, setGrams] = useState(100)
  const [todayItems, setTodayItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const todayKey = new Date().toISOString().slice(0, 10)
  const todayFormatted = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

  useEffect(() => {
    if (profile) {
      setTargets(calculateTargets({
        sex: profile.sex,
        weight_kg: profile.weight_kg,
        height_cm: profile.height_cm,
        age: profile.age,
        activity_level: profile.activity_level,
        goal: profile.goal,
      }))
      loadToday()
    }
  }, [profile])

  const loadToday = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await getDayIntake(user.uid, todayKey, user.isLocal)
      setTodayItems(data?.items || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [user, todayKey])

  const handleSearch = (val) => {
    setSearchQuery(val)
    if (val.trim().length > 0) {
      setSearchResults(searchFoods(val).slice(0, 8))
      setShowResults(true)
    } else {
      setSearchResults([])
      setShowResults(false)
    }
  }

  const selectFood = (food) => {
    setSelectedFood(food)
    setSearchQuery(food.name)
    setGrams(100)
    setShowResults(false)
  }

  const handleAddItem = async () => {
    if (!selectedFood || !grams || grams <= 0) {
      toast.error('Please select a food and enter a valid gram amount.')
      return
    }
    if (!user) return

    setSaving(true)
    try {
      const nutrition = computeNutrition(selectedFood, Number(grams))
      const newItem = {
        foodId: selectedFood.id,
        name: selectedFood.name,
        grams: Number(grams),
        ...nutrition,
        loggedAt: new Date().toISOString(),
      }

      await addDayIntakeItem(user.uid, todayKey, newItem, user.isLocal)

      setTodayItems(prev => [...prev, newItem])
      setSelectedFood(null)
      setSearchQuery('')
      setGrams(100)
      toast.success(`Added ${selectedFood.name} (${grams}g)`)
    } catch (err) {
      console.error(err)
      toast.error('Failed to log food item.')
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = async (index) => {
    if (!user) return
    const updated = todayItems.filter((_, i) => i !== index)
    setTodayItems(updated)
    try {
      await updateDayIntakeItems(user.uid, todayKey, updated, user.isLocal)
      toast.success('Item removed')
    } catch (err) {
      toast.error('Failed to remove item.')
    }
  }

  const totals = computeIntakeTotals(todayItems)

  const preview = selectedFood && grams > 0
    ? computeNutrition(selectedFood, Number(grams))
    : null

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📋 <span className="gradient-text">Intake Log</span></h1>
        <p>{todayFormatted} — Track everything you eat today.</p>
      </div>

      {/* Add food */}
      <div className="card mb-4" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.25rem' }}>Log a Food Item</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '0.75rem', alignItems: 'end' }}>
          {/* Search */}
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Search Food</label>
            <div className="food-search-wrap">
              <span className="food-search-icon">🔍</span>
              <input
                className="form-input food-search-input"
                placeholder="e.g. chicken breast, paneer, oats…"
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                onFocus={() => searchQuery && setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
              />
              {showResults && searchResults.length > 0 && (
                <div className="food-results">
                  {searchResults.map(food => (
                    <div
                      key={food.id}
                      className="food-result-item"
                      onMouseDown={() => selectFood(food)}
                    >
                      <div>
                        <div className="food-name">{food.name}</div>
                        <div className="food-meta">{food.cuisine} · {food.tags.join(', ')}</div>
                      </div>
                      <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#4a5370' }}>
                        {food.per100.kcal} kcal<br />per 100g
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Grams */}
          <div className="form-group">
            <label className="form-label">Grams (g)</label>
            <input
              className="form-input"
              type="number"
              min={1}
              max={2000}
              value={grams}
              onChange={e => setGrams(e.target.value)}
              style={{ width: 110 }}
            />
          </div>

          <button
            onClick={handleAddItem}
            className="btn btn-primary"
            disabled={!selectedFood || saving}
            style={{ height: 48 }}
          >
            {saving ? '…' : '+ Add'}
          </button>
        </div>

        {/* Nutrition preview */}
        {preview && selectedFood && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem 1rem',
            background: 'rgba(0,255,136,0.06)',
            border: '1px solid rgba(0,255,136,0.15)',
            borderRadius: 12,
            display: 'flex',
            gap: '1.5rem',
            flexWrap: 'wrap',
            fontSize: '0.85rem',
          }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedFood.name} · {grams}g</span>
            <span style={{ color: '#eef0f8' }}>🔥 {preview.kcal} kcal</span>
            <span style={{ color: '#00ff88' }}>P {preview.p}g</span>
            <span style={{ color: '#00d4ff' }}>C {preview.c}g</span>
            <span style={{ color: '#8b5cf6' }}>F {preview.f}g</span>
          </div>
        )}
      </div>

      {/* Today's intake + ring */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem', alignItems: 'start', marginBottom: '1.5rem' }}>
        <div>
          <div className="section-title">Today's Log</div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <div className="spinner" />
            </div>
          ) : todayItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🍽</div>
              <p>Nothing logged yet. Search for a food item above to get started.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {todayItems.map((item, i) => (
                <MealCard key={i} item={item} onRemove={() => handleRemove(i)} />
              ))}
            </div>
          )}
        </div>

        {/* Macro ring */}
        <div className="card card-gradient" style={{ minWidth: 200, maxWidth: 240 }}>
          <h4 style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>TODAY'S TOTALS</h4>
          {targets ? (
            <MacroRing macros={targets.macros} consumed={totals} size={150} />
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
              <div className="spinner" />
            </div>
          )}
          <hr className="divider" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {[
              { label: 'Calories', value: totals.kcal, color: 'var(--text-primary)', unit: 'kcal' },
              { label: 'Protein', value: `${totals.p}`, color: '#00ff88', unit: 'g' },
              { label: 'Carbs', value: `${totals.c}`, color: '#00d4ff', unit: 'g' },
              { label: 'Fat', value: `${totals.f}`, color: '#8b5cf6', unit: 'g' },
            ].map(({ label, value, color, unit }) => (
              <div key={label} style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, color }}>{value}<span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginLeft: 2 }}>{unit}</span></div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily summary */}
      {targets && todayItems.length > 0 && (
        <div className="card card-highlight">
          <h3 style={{ marginBottom: '1rem' }}>Daily Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'Calories', consumed: totals.kcal, target: targets.cal, color: '#00ff88', unit: 'kcal' },
              { label: 'Protein', consumed: totals.p, target: targets.macros.p, color: '#00ff88', unit: 'g' },
              { label: 'Carbohydrates', consumed: totals.c, target: targets.macros.c, color: '#00d4ff', unit: 'g' },
              { label: 'Fat', consumed: totals.f, target: targets.macros.f, color: '#8b5cf6', unit: 'g' },
            ].map(({ label, consumed, target, color, unit }) => {
              const pct = target > 0 ? Math.min(100, Math.round((consumed / target) * 100)) : 0
              const remaining = Math.max(0, target - consumed)
              return (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                    <span className="text-sm font-semibold">
                      {consumed}{unit} / {target}{unit}
                      {remaining > 0 && (
                        <span className="text-muted" style={{ fontWeight: 400, marginLeft: 6 }}>
                          ({remaining}{unit} left)
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="progress-bar-wrap">
                    <div className={`progress-bar${pct >= 100 ? ' over' : ''}`} style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--accent-red)' : color }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
