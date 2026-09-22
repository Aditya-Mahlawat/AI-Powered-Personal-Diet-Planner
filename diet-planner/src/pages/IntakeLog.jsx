// src/pages/IntakeLog.jsx
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { calculateTargets, computeNutrition, computeIntakeTotals } from '../utils/macros'
import { FOODS_CATALOG, searchFoods } from '../data/foods'
import { getDayIntake, addDayIntakeItem, updateDayIntakeItems } from '../services/storageService'
import MealCard from '../components/MealCard'
import MacroRing from '../components/MacroRing'
import toast from 'react-hot-toast'

const MEAL_SLOTS = [
  { id: 'breakfast', label: '🌅 Breakfast', icon: '🌅' },
  { id: 'lunch',     label: '☀️ Lunch',     icon: '☀️' },
  { id: 'snack',     label: '☕ Snack',     icon: '☕' },
  { id: 'dinner',    label: '🌙 Dinner',    icon: '🌙' },
]

export default function IntakeLog() {
  const { user, profile } = useAuth()
  const [targets, setTargets] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [selectedFood, setSelectedFood] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState('lunch')
  const [grams, setGrams] = useState(100)
  const [todayItems, setTodayItems] = useState([])
  const [waterGlasses, setWaterGlasses] = useState(0)
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
      const savedWater = localStorage.getItem(`nutrimind_water_${user.uid}_${todayKey}`)
      if (savedWater) setWaterGlasses(Number(savedWater))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [user, todayKey])

  const handleWaterClick = (count) => {
    if (!user) return
    const newCount = count === waterGlasses ? count - 1 : count
    setWaterGlasses(newCount)
    localStorage.setItem(`nutrimind_water_${user.uid}_${todayKey}`, newCount.toString())
    if (newCount === 8) {
      toast.success('🎉 Daily hydration goal reached! 2 Liters completed.')
    }
  }

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
        mealSlot: selectedSlot,
        ...nutrition,
        loggedAt: new Date().toISOString(),
      }

      await addDayIntakeItem(user.uid, todayKey, newItem, user.isLocal)

      setTodayItems(prev => [...prev, newItem])
      setSelectedFood(null)
      setSearchQuery('')
      setGrams(100)
      toast.success(`Added ${selectedFood.name} (${grams}g) to ${selectedSlot.toUpperCase()}`)
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

  // Group logged items by slot
  const slotGroups = {
    breakfast: todayItems.filter(i => i.mealSlot === 'breakfast'),
    lunch:     todayItems.filter(i => !i.mealSlot || i.mealSlot === 'lunch'),
    snack:     todayItems.filter(i => i.mealSlot === 'snack'),
    dinner:    todayItems.filter(i => i.mealSlot === 'dinner'),
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📋 <span className="gradient-text">Daily Intake Log</span></h1>
        <p>{todayFormatted} — Track every meal, snack, and water glass toward your daily target.</p>
      </div>

      {/* Water tracker card */}
      <div className="card mb-4" style={{ marginBottom: '1.5rem', background: 'rgba(0, 212, 255, 0.04)', borderColor: 'rgba(0, 212, 255, 0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.5rem' }}>💧</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Hydration Tracker</h3>
              <span className="text-xs text-muted">Daily Goal: 8 Glasses (2.0 Liters)</span>
            </div>
          </div>
          <span className="badge badge-blue" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            {waterGlasses * 250} ml / 2000 ml ({Math.round((waterGlasses / 8) * 100)}%)
          </span>
        </div>

        {/* 8 clickable glasses */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {Array.from({ length: 8 }).map((_, idx) => {
            const isDrank = idx < waterGlasses
            return (
              <button
                key={idx}
                onClick={() => handleWaterClick(idx + 1)}
                style={{
                  flex: 1,
                  minWidth: 42,
                  height: 48,
                  borderRadius: 8,
                  border: isDrank ? '1px solid #00d4ff' : '1px solid var(--border)',
                  background: isDrank ? 'rgba(0, 212, 255, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: isDrank ? '#00d4ff' : 'var(--text-muted)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                }}
              >
                <span>🥛</span>
                <span>{idx + 1}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Log a Food Item Box */}
      <div className="card mb-4" style={{ marginBottom: '1.5rem' }}>
        <div className="section-title" style={{ marginBottom: '1rem' }}>Log a Food Item</div>

        {/* Meal slot selector */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {MEAL_SLOTS.map((slot) => (
            <button
              key={slot.id}
              type="button"
              onClick={() => setSelectedSlot(slot.id)}
              className={`btn btn-sm ${selectedSlot === slot.id ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: 20 }}
            >
              {slot.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1rem', alignItems: 'flex-end' }}>
          {/* Search box */}
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Search Food</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input food-search-input"
                placeholder="e.g. roti, paneer bhurji, dal, oats, chicken curry…"
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
              id="grams"
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

      {/* Today's categorized intake + ring */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', alignItems: 'start', marginBottom: '1.5rem' }}>
        <div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <div className="spinner" />
            </div>
          ) : todayItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🍽</div>
              <p>Nothing logged yet. Search for an Indian or global food item above to get started.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {MEAL_SLOTS.map((slot) => {
                const itemsInSlot = slotGroups[slot.id] || []
                if (itemsInSlot.length === 0) return null
                const slotCalories = itemsInSlot.reduce((acc, i) => acc + (i.kcal || 0), 0)

                return (
                  <div key={slot.id} className="card" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>{slot.label}</span>
                      <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>{slotCalories} kcal</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {itemsInSlot.map((item, i) => {
                        const originalIndex = todayItems.indexOf(item)
                        return (
                          <MealCard key={i} item={item} onRemove={() => handleRemove(originalIndex)} />
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Macro ring & summary sidebar */}
        <div className="card card-gradient" style={{ position: 'sticky', top: '1.5rem' }}>
          <h4 style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>TODAY'S TOTALS</h4>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <MacroRing macros={{ p: totals.p, c: totals.c, f: totals.f }} size={160} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Calories:</span>
              <b>{totals.kcal} {targets ? `/ ${targets.cal} kcal` : 'kcal'}</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#00ff88' }}>Protein:</span>
              <b>{totals.p}g {targets ? `/ ${targets.macros.p}g` : ''}</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#00d4ff' }}>Carbs:</span>
              <b>{totals.c}g {targets ? `/ ${targets.macros.c}g` : ''}</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#8b5cf6' }}>Fat:</span>
              <b>{totals.f}g {targets ? `/ ${targets.macros.f}g` : ''}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
