// src/pages/MealPlan.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { calculateTargets, planDay, computeIntakeTotals } from '../utils/macros'
import { getSavedPlans, savePlanData } from '../services/storageService'
import { FOODS_CATALOG } from '../data/foods'
import MealCard from '../components/MealCard'
import MacroRing from '../components/MacroRing'
import toast from 'react-hot-toast'

export default function MealPlan() {
  const { user, profile } = useAuth()
  const [targets, setTargets] = useState(null)
  const [plan, setPlan] = useState([])
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedPlans, setSavedPlans] = useState([])
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [viewPlan, setViewPlan] = useState(null)

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

  const handleGenerate = () => {
    if (!targets || !profile) return
    setGenerating(true)
    setViewPlan(null)
    setTimeout(() => {
      try {
        const generated = planDay({
          macros: targets.macros,
          diet_pref: profile.diet_pref,
          allergies: profile.allergies || [],
          foods: FOODS_CATALOG,
        })
        setPlan(generated)
        if (generated.length === 0) {
          toast.error('No suitable foods found for your preferences. Try adjusting your dietary settings.')
        } else {
          toast.success(`Generated ${generated.length} meals for your day!`)
        }
      } catch (err) {
        toast.error('Failed to generate plan.')
        console.error(err)
      } finally {
        setGenerating(false)
      }
    }, 800) // simulate thinking time for better UX
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
          total_cal: totals.kcal,
          macros: { p: totals.p, c: totals.c, f: totals.f },
          days: [{ items: plan }],
          targets: targets.macros,
        },
        user.isLocal
      )

      toast.success('Plan saved successfully!')
      setPlan([])
      await loadSavedPlans()
    } catch (err) {
      console.error(err)
      toast.error('Failed to save plan.')
    } finally {
      setSaving(false)
    }
  }

  const planTotals = plan.reduce((acc, item) => ({
    kcal: acc.kcal + item.kcal,
    p: Math.round((acc.p + item.p) * 10) / 10,
    c: Math.round((acc.c + item.c) * 10) / 10,
    f: Math.round((acc.f + item.f) * 10) / 10,
  }), { kcal: 0, p: 0, c: 0, f: 0 })

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🍽 <span className="gradient-text">Meal Plans</span></h1>
        <p>Generate personalised day plans tailored to your macros, preferences, and dietary goals.</p>
      </div>

      {/* Targets summary */}
      {targets && (
        <div className="card card-gradient mb-4" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3>Your Daily Targets</h3>
              <p className="text-sm">Based on your profile: {profile?.goal} goal, {profile?.diet_pref} diet</p>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-green)' }}>{targets.cal}</div>
                <div className="text-xs text-muted">kcal/day</div>
              </div>
              {[
                { label: 'Protein', value: `${targets.macros.p}g`, color: '#00ff88' },
                { label: 'Carbs', value: `${targets.macros.c}g`, color: '#00d4ff' },
                { label: 'Fat', value: `${targets.macros.f}g`, color: '#8b5cf6' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color }}>{value}</div>
                  <div className="text-xs text-muted">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Generate button */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={handleGenerate}
          className="btn btn-primary btn-lg"
          disabled={generating}
        >
          {generating
            ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Generating…</>
            : '✨ Generate Plan'
          }
        </button>
        {plan.length > 0 && (
          <button
            onClick={handleSavePlan}
            className="btn btn-secondary"
            disabled={saving}
          >
            {saving ? 'Saving…' : '💾 Save to Cloud'}
          </button>
        )}
      </div>

      {/* Generated plan */}
      {plan.length > 0 && (
        <div className="card mb-4" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h2>Your Meal Plan</h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <span className="badge badge-green">{planTotals.kcal} kcal total</span>
              <span className="text-xs text-muted">P:{planTotals.p}g · C:{planTotals.c}g · F:{planTotals.f}g</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {plan.map((item, i) => (
                <div key={i} style={{ animationDelay: `${i * 0.08}s`, padding: 0 }}>
                  <MealCard item={item} />
                </div>
              ))}
            </div>

            <div style={{ minWidth: 200 }}>
              <MacroRing macros={{ p: planTotals.p, c: planTotals.c, f: planTotals.f }} size={160} />
            </div>
          </div>

          <div className="alert alert-info mt-3" style={{ marginTop: '1rem' }}>
            <span>💡</span>
            <span>This plan is built to hit your daily macro targets. Feel free to adjust portions based on your preference and hunger.</span>
          </div>
        </div>
      )}

      {/* Saved plans */}
      <div>
        <div className="section-title">Saved Plans</div>
        {loadingPlans ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <div className="spinner" />
          </div>
        ) : savedPlans.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <p>No saved plans yet. Generate and save your first plan above.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {savedPlans.map((p) => {
              const date = p.createdAt?.toDate
                ? p.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                : 'Saved plan'
              const items = p.days?.[0]?.items || []
              return (
                <div
                  key={p.id}
                  className="card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setViewPlan(viewPlan === p.id ? null : p.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{date}</div>
                      <div className="text-xs text-muted">{items.length} items · {p.total_cal} kcal</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span className="badge badge-green">{p.total_cal} kcal</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{viewPlan === p.id ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {viewPlan === p.id && items.length > 0 && (
                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <hr className="divider" />
                      {items.map((item, i) => <MealCard key={i} item={item} />)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
