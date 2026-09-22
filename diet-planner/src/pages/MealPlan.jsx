// src/pages/MealPlan.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { calculateTargets, planDay, scalePresetPlan } from '../utils/macros'
import { FOODS_CATALOG, INDIAN_PRESET_PLANS } from '../data/foods'
import { getSavedPlans, savePlanData } from '../services/storageService'
import MealCard from '../components/MealCard'
import MacroRing from '../components/MacroRing'
import toast from 'react-hot-toast'

const SLOT_META = {
  breakfast: { title: 'Breakfast', icon: '🌅', color: '#ffb703' },
  lunch:     { title: 'Lunch',     icon: '☀️', color: '#00d4ff' },
  snack:     { title: 'Evening Snack', icon: '☕', color: '#a78bfa' },
  dinner:    { title: 'Dinner',    icon: '🌙', color: '#00ff88' },
}

const ALLERGY_OPTIONS = [
  { id: 'nuts',      label: '🥜 Nuts' },
  { id: 'lactose',   label: '🥛 Lactose' },
  { id: 'gluten',    label: '🌾 Gluten' },
  { id: 'shellfish', label: '🦐 Shellfish' },
  { id: 'soy',       label: '🫘 Soy' },
]

const CUISINE_OPTIONS = [
  { id: 'indian',        label: '🇮🇳 Indian' },
  { id: 'mexican',       label: '🌮 Mexican' },
  { id: 'mediterranean', label: '🫒 Mediterranean' },
  { id: 'asian',         label: '🍜 Asian' },
  { id: 'global',        label: '🌍 Global' },
]

export default function MealPlan() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [targets, setTargets] = useState(null)
  const [plan, setPlan] = useState([])
  const [planSource, setPlanSource] = useState('custom')
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedPlans, setSavedPlans] = useState([])
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [selectedPresetId, setSelectedPresetId] = useState('north_indian_veg')
  const [activeTab, setActiveTab] = useState('presets') // 'presets' | 'custom'
  const [selectedAllergies, setSelectedAllergies] = useState([])
  const [selectedCuisines, setSelectedCuisines] = useState(['indian'])
  const [dietPref, setDietPref] = useState('omnivore')

  useEffect(() => {
    if (profile) {
      const t = calculateTargets({
        sex: profile.sex,
        weight_kg: profile.weight_kg,
        height_cm: profile.height_cm,
        age: profile.age,
        activity_level: profile.activity_level,
        goal: profile.goal,
      })
      setTargets(t)
      loadSavedPlans()

      if (profile.allergies?.length) setSelectedAllergies(profile.allergies)
      if (profile.cuisines?.length) setSelectedCuisines(profile.cuisines)
      if (profile.diet_pref) setDietPref(profile.diet_pref)

      // Auto-load default Indian preset scaled to user's targets
      const defaultPreset = INDIAN_PRESET_PLANS[0]
      if (defaultPreset) {
        const scaled = scalePresetPlan(defaultPreset, t.cal)
        setPlan(scaled.flatItems)
        setPlanSource(defaultPreset.title)
      }
    }
  }, [profile])

  const loadSavedPlans = async () => {
    if (!user) return
    setLoadingPlans(true)
    try {
      const plans = await getSavedPlans(user.uid, user.isLocal)
      setSavedPlans(plans)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingPlans(false)
    }
  }

  const toggleAllergy = (id) => {
    setSelectedAllergies(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const toggleCuisine = (id) => {
    setSelectedCuisines(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  // Load a curated Indian plan
  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id)
    if (!targets) return
    const scaled = scalePresetPlan(preset, targets.cal)
    setPlan(scaled.flatItems)
    setPlanSource(preset.title)
    toast.success(`Loaded "${preset.title}" calibrated to ${scaled.scaledCalories} kcal`)
  }

  // Custom algorithmic plan generation
  const handleGenerateCustom = () => {
    if (!targets || !profile) return
    setGenerating(true)
    setTimeout(() => {
      try {
        const generated = planDay({
          macros: targets.macros,
          diet_pref: dietPref,
          allergies: selectedAllergies,
          cuisines: selectedCuisines,
          foods: FOODS_CATALOG,
        })
        setPlan(generated)
        const cuisineNames = selectedCuisines.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(' / ')
        setPlanSource(`Custom Plan (${cuisineNames || 'Any Cuisine'})`)
        if (generated.length === 0) {
          toast.error('No suitable foods found for your preferences. Try adjusting settings.')
        } else {
          toast.success(`Generated custom plan matching your exact macros!`)
        }
      } catch (err) {
        toast.error('Failed to generate plan.')
        console.error(err)
      } finally {
        setGenerating(false)
      }
    }, 600)
  }

  const handleSavePlan = async () => {
    if (!plan.length || !targets || !user) return
    setSaving(true)
    try {
      const totals = plan.reduce((acc, item) => ({
        kcal: acc.kcal + item.kcal,
        p: Math.round((acc.p + item.p) * 10) / 10,
        c: Math.round((acc.c + item.c) * 10) / 10,
        f: Math.round((acc.f + item.f) * 10) / 10,
      }), { kcal: 0, p: 0, c: 0, f: 0 })

      await savePlanData(
        user.uid,
        {
          title: planSource,
          total_cal: totals.kcal,
          macros: { p: totals.p, c: totals.c, f: totals.f },
          days: [{ items: plan }],
          targets: targets.macros,
        },
        user.isLocal
      )

      toast.success('Plan saved to cloud storage!')
      await loadSavedPlans()
    } catch (err) {
      console.error(err)
      toast.error('Failed to save plan.')
    } finally {
      setSaving(false)
    }
  }

  const handleOpenGrocery = () => {
    // Save current plan to localStorage temporarily so grocery list page can read it
    localStorage.setItem('nutrimind_active_plan', JSON.stringify(plan))
    navigate('/grocery')
  }

  const planTotals = plan.reduce((acc, item) => ({
    kcal: acc.kcal + item.kcal,
    p: Math.round((acc.p + item.p) * 10) / 10,
    c: Math.round((acc.c + item.c) * 10) / 10,
    f: Math.round((acc.f + item.f) * 10) / 10,
  }), { kcal: 0, p: 0, c: 0, f: 0 })

  // Group plan into meal slots
  const groupedPlan = {
    breakfast: plan.filter(i => i.mealSlot === 'breakfast'),
    lunch:     plan.filter(i => i.mealSlot === 'lunch'),
    snack:     plan.filter(i => i.mealSlot === 'snack'),
    dinner:    plan.filter(i => i.mealSlot === 'dinner'),
  }
  // If plan items didn't have mealSlot assigned, distribute them evenly
  if (groupedPlan.breakfast.length === 0 && plan.length > 0) {
    const perSlot = Math.ceil(plan.length / 4)
    groupedPlan.breakfast = plan.slice(0, perSlot)
    groupedPlan.lunch = plan.slice(perSlot, perSlot * 2)
    groupedPlan.snack = plan.slice(perSlot * 2, perSlot * 3)
    groupedPlan.dinner = plan.slice(perSlot * 3)
  }

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>🍽 <span className="gradient-text">Meal Plans & Diet Schedules</span></h1>
          <p>Explore curated Indian regional diet plans or generate custom daily menus calibrated to your macros.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleOpenGrocery} className="btn btn-secondary">
            🛒 Grocery List
          </button>
        </div>
      </div>

      {/* Target summary badge */}
      {targets && (
        <div className="card card-gradient mb-4" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3>Daily Nutrition Targets</h3>
              <p className="text-sm">Calibrated for {profile?.name || 'you'}: {profile?.goal?.toUpperCase()} goal · {profile?.diet_pref?.toUpperCase()} diet</p>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-green)' }}>{targets.cal}</div>
                <div className="text-xs text-muted">kcal / day</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#00ff88' }}>{targets.macros.p}g</div>
                <div className="text-xs text-muted">Protein</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#00d4ff' }}>{targets.macros.c}g</div>
                <div className="text-xs text-muted">Carbs</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#8b5cf6' }}>{targets.macros.f}g</div>
                <div className="text-xs text-muted">Fats</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('presets')}
          className={`btn ${activeTab === 'presets' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ fontSize: '0.9rem' }}
        >
          🍛 Indian Regional Plans ({INDIAN_PRESET_PLANS.length})
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`btn ${activeTab === 'custom' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ fontSize: '0.9rem' }}
        >
          ✨ Custom Macro Generator
        </button>
      </div>

      {/* Tab: Indian Presets */}
      {activeTab === 'presets' && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {INDIAN_PRESET_PLANS.map((preset) => {
              const isSelected = selectedPresetId === preset.id
              return (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className="card"
                  style={{
                    cursor: 'pointer',
                    borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                    background: isSelected ? 'rgba(0, 255, 136, 0.05)' : 'var(--surface)',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 16px rgba(0, 255, 136, 0.15)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>{preset.region}</span>
                    <span className="text-xs text-muted">~{preset.calories} kcal base</span>
                  </div>
                  <h4 style={{ margin: '0.3rem 0 0.4rem', color: isSelected ? 'var(--primary)' : 'var(--text-primary)' }}>
                    {preset.title}
                  </h4>
                  <p className="text-sm text-muted" style={{ lineHeight: 1.4, marginBottom: '0.75rem' }}>
                    {preset.description}
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <span>P: <b>{preset.macros.p}g</b></span>
                    <span>C: <b>{preset.macros.c}g</b></span>
                    <span>F: <b>{preset.macros.f}g</b></span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tab: Custom Generator */}
      {activeTab === 'custom' && (
        <div className="card mb-4" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ margin: 0 }}>✨ Algorithmic Meal Composition</h3>
              <p className="text-sm text-muted" style={{ margin: '0.25rem 0 0' }}>
                Select your cuisine preferences and allergies below, then synthesize a tailored daily menu matching your exact targets.
              </p>
            </div>
            <button
              id="btnSynthesizePlan"
              onClick={handleGenerateCustom}
              className="btn btn-primary btn-lg"
              disabled={generating}
            >
              {generating
                ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Generating…</>
                : '⚡ Synthesize Custom Plan'
              }
            </button>
          </div>

          {/* Interactive Preferences & Filter Controls */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            {/* Preferred Cuisines */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <label className="form-label" style={{ margin: 0, fontWeight: 600 }}>Preferred Cuisines</label>
                <span className="text-xs text-muted">{selectedCuisines.length} selected</span>
              </div>
              <div className="checkbox-group">
                {CUISINE_OPTIONS.map(({ id, label }) => {
                  const isChecked = selectedCuisines.includes(id)
                  return (
                    <button
                      type="button"
                      id={`btn-cuisine-${id}`}
                      key={id}
                      className={`checkbox-chip${isChecked ? ' checked' : ''}`}
                      onClick={() => toggleCuisine(id)}
                      aria-pressed={isChecked}
                    >
                      <span>{isChecked ? '✓' : '+'}</span>
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Allergies & Exclusions */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <label className="form-label" style={{ margin: 0, fontWeight: 600 }}>Allergies / Avoid Foods</label>
                <span className="text-xs text-muted">{selectedAllergies.length} excluded</span>
              </div>
              <div className="checkbox-group">
                {ALLERGY_OPTIONS.map(({ id, label }) => {
                  const isChecked = selectedAllergies.includes(id)
                  return (
                    <button
                      type="button"
                      id={`btn-allergy-${id}`}
                      key={id}
                      className={`checkbox-chip${isChecked ? ' checked' : ''}`}
                      onClick={() => toggleAllergy(id)}
                      aria-pressed={isChecked}
                    >
                      <span>{isChecked ? '✓' : '+'}</span>
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Dietary Preference */}
            <div>
              <label className="form-label" style={{ marginBottom: '0.6rem', fontWeight: 600 }}>Dietary Lifestyle</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'omnivore', label: '🥩 Omnivore' },
                  { id: 'veg', label: '🥦 Vegetarian' },
                  { id: 'vegan', label: '🌱 Vegan' },
                ].map(({ id, label }) => (
                  <button
                    type="button"
                    id={`btn-diet-${id}`}
                    key={id}
                    onClick={() => setDietPref(id)}
                    className={`btn btn-sm ${dietPref === id ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ fontSize: '0.82rem' }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Meal Plan Breakdown */}
      {plan.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2>{planSource}</h2>
              <span className="text-sm text-muted">Calibrated to your daily requirements</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button
                onClick={handleSavePlan}
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? 'Saving…' : '💾 Save to Cloud'}
              </button>
              <button
                onClick={handleOpenGrocery}
                className="btn btn-secondary"
              >
                🛒 View Grocery Checklist
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', alignItems: 'start' }}>
            {/* Meal Slots list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {Object.entries(groupedPlan).map(([slotKey, items]) => {
                const meta = SLOT_META[slotKey] || { title: slotKey, icon: '🍽', color: '#00ff88' }
                const slotCalories = items.reduce((acc, i) => acc + (i.kcal || 0), 0)
                const slotProtein = items.reduce((acc, i) => acc + (i.p || 0), 0).toFixed(1)
                const slotCarbs = items.reduce((acc, i) => acc + (i.c || 0), 0).toFixed(1)
                const slotFat = items.reduce((acc, i) => acc + (i.f || 0), 0).toFixed(1)

                return (
                  <div key={slotKey} className="card" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '1.05rem', color: meta.color }}>
                        <span>{meta.icon}</span>
                        <span>{meta.title}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{slotCalories} kcal</span>
                        <span>P: {slotProtein}g</span>
                        <span>C: {slotCarbs}g</span>
                        <span>F: {slotFat}g</span>
                      </div>
                    </div>

                    {items.length === 0 ? (
                      <p className="text-sm text-muted" style={{ margin: '0.5rem 0' }}>No items planned for this slot.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {items.map((item, idx) => (
                          <MealCard key={idx} item={item} />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Macro ring & summary sidebar */}
            <div className="card card-gradient" style={{ position: 'sticky', top: '1.5rem' }}>
              <h4 style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>PLAN TOTALS</h4>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <MacroRing macros={{ p: planTotals.p, c: planTotals.c, f: planTotals.f }} size={170} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Calories:</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{planTotals.kcal} kcal</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#00ff88' }}>Protein:</span>
                  <b>{planTotals.p}g</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#00d4ff' }}>Carbohydrates:</span>
                  <b>{planTotals.c}g</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#8b5cf6' }}>Fat:</span>
                  <b>{planTotals.f}g</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved plans list */}
      <div>
        <div className="section-title">Saved Plans in Cloud Storage</div>
        {loadingPlans ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <div className="spinner" />
          </div>
        ) : savedPlans.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <p>No saved plans yet. Generate or select a plan above and save it to your cloud storage.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {savedPlans.map((p) => {
              const date = p.createdAt?.toDate
                ? p.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                : new Date(p.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
              const items = p.days?.[0]?.items || []
              return (
                <div
                  key={p.id}
                  className="card"
                  onClick={() => {
                    setPlan(items)
                    setPlanSource(p.title || 'Saved Plan')
                    toast.success('Loaded saved plan!')
                  }}
                  style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>
                    <h4 style={{ margin: 0 }}>{p.title || 'Saved Meal Plan'}</h4>
                    <span className="text-xs text-muted">{date} · {items.length} items planned</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                    <span className="badge badge-green">{p.total_cal} kcal</span>
                    <button className="btn btn-ghost btn-sm">Load</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
