// src/pages/GroceryList.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getSavedPlans } from '../services/storageService'
import { FOODS_CATALOG } from '../data/foods'
import toast from 'react-hot-toast'

const CATEGORY_META = {
  grains:          { title: 'Grains, Flours & Breads', icon: '🌾' },
  protein_veg:     { title: 'Vegetarian Proteins & Dairy', icon: '🥛' },
  protein_nonveg:  { title: 'Eggs, Poultry & Fish', icon: '🍗' },
  south_indian:    { title: 'South Indian Ingredients', icon: '🥥' },
  vegetables:      { title: 'Fresh Produce & Vegetables', icon: '🥦' },
  snacks:          { title: 'Nuts, Snacks & Pantry', icon: '🥜' },
  other:           { title: 'General Grocery', icon: '🛒' },
}

export default function GroceryList() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [checkedItems, setCheckedItems] = useState({})
  const [planName, setPlanName] = useState('Current Active Plan')
  const [daysMultiplier, setDaysMultiplier] = useState(1) // 1 day, 3 days, 7 days (weekly)

  useEffect(() => {
    // Load from active plan in localStorage or latest saved plan
    let raw = localStorage.getItem('nutrimind_active_plan')
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        aggregateIngredients(parsed)
        return
      } catch (e) {
        console.warn(e)
      }
    }

    // Fallback to latest saved plan from storageService
    if (user) {
      getSavedPlans(user.uid, user.isLocal).then((plans) => {
        if (plans && plans.length > 0) {
          const latest = plans[0]
          setPlanName(latest.title || 'Latest Saved Plan')
          const planItems = latest.days?.[0]?.items || []
          aggregateIngredients(planItems)
        }
      })
    }
  }, [user])

  const aggregateIngredients = (planItems) => {
    const map = {}
    planItems.forEach((item) => {
      const foodId = item.foodId || item.id
      const foodMeta = FOODS_CATALOG.find((f) => f.id === foodId)
      const category = foodMeta?.category || 'other'
      const key = item.name

      if (!map[key]) {
        map[key] = {
          name: item.name,
          foodId,
          category,
          grams: 0,
        }
      }
      map[key].grams += item.grams || 100
    })

    setItems(Object.values(map))
  }

  const toggleCheck = (itemName) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }))
  }

  const handleCopyClipboard = () => {
    if (items.length === 0) return
    const text = items
      .map((item) => {
        const totalGrams = item.grams * daysMultiplier
        const qty = totalGrams >= 1000 ? `${(totalGrams / 1000).toFixed(1)} kg` : `${totalGrams} g`
        return `• ${item.name}: ${qty}`
      })
      .join('\n')

    navigator.clipboard.writeText(`🛒 NutriMind Grocery List (${daysMultiplier}-Day Plan):\n\n` + text)
    toast.success('Grocery list copied to clipboard!')
  }

  // Group by category
  const grouped = items.reduce((acc, item) => {
    const cat = item.category || 'other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})

  const totalItems = items.length
  const completedItems = Object.values(checkedItems).filter(Boolean).length

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>🛒 <span className="gradient-text">Smart Grocery Checklist</span></h1>
          <p>Consolidated ingredients required for your planned meals. Ready for supermarket or local mandi shopping.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button onClick={handleCopyClipboard} className="btn btn-secondary">
            📋 Copy List
          </button>
          <Link to="/meal-plan" className="btn btn-primary">
            ← Back to Meal Plans
          </Link>
        </div>
      </div>

      {/* Shopping controls card */}
      <div className="card mb-4" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="text-xs text-muted">ACTIVE MEAL PLAN</span>
          <h3 style={{ margin: '0.2rem 0' }}>{planName}</h3>
          <span className="text-sm text-muted">
            Progress: <b>{completedItems}</b> of <b>{totalItems}</b> items gathered ({totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0}%)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="text-sm" style={{ fontWeight: 600 }}>Plan Duration:</span>
          {[
            { label: '1 Day', mult: 1 },
            { label: '3 Days', mult: 3 },
            { label: '7 Days (Weekly)', mult: 7 },
          ].map(({ label, mult }) => (
            <button
              key={mult}
              onClick={() => setDaysMultiplier(mult)}
              className={`btn btn-sm ${daysMultiplier === mult ? 'btn-primary' : 'btn-ghost'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h3>No Active Meal Plan Found</h3>
          <p style={{ margin: '0.5rem 0 1.5rem' }}>Select or generate a meal plan first to automatically compile your grocery shopping checklist.</p>
          <Link to="/meal-plan" className="btn btn-primary">
            Go to Meal Plans
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {Object.entries(grouped).map(([categoryKey, catItems]) => {
            const meta = CATEGORY_META[categoryKey] || CATEGORY_META.other
            return (
              <div key={categoryKey} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>{meta.icon}</span>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>{meta.title}</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {catItems.map((item) => {
                    const isChecked = !!checkedItems[item.name]
                    const totalGrams = item.grams * daysMultiplier
                    const qtyDisplay = totalGrams >= 1000 ? `${(totalGrams / 1000).toFixed(1)} kg` : `${totalGrams} g`

                    return (
                      <div
                        key={item.name}
                        onClick={() => toggleCheck(item.name)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.6rem 0.85rem',
                          borderRadius: 10,
                          background: isChecked ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                          cursor: 'pointer',
                          userSelect: 'none',
                          transition: 'all 0.2s ease',
                          opacity: isChecked ? 0.45 : 1,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            style={{ cursor: 'pointer', accentColor: 'var(--primary)', width: 16, height: 16 }}
                          />
                          <span style={{ textDecoration: isChecked ? 'line-through' : 'none', fontWeight: 500, fontSize: '0.9rem' }}>
                            {item.name}
                          </span>
                        </div>
                        <span className="badge badge-green" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                          {qtyDisplay}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
