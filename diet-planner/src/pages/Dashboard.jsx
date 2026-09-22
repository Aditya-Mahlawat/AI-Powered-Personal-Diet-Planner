// src/pages/Dashboard.jsx
import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { calculateTargets, computeIntakeTotals } from '../utils/macros'
import { getDayIntake, getIntakeWeekHistory } from '../services/storageService'
import MacroRing from '../components/MacroRing'
import ProgressChart from '../components/ProgressChart'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

function StatCard({ label, value, unit, sub, color = 'green', icon }) {
  return (
    <div className={`stat-card ${color}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span className="stat-label">{label}</span>
        {icon && <span style={{ fontSize: '1.3rem', opacity: 0.6 }}>{icon}</span>}
      </div>
      <div>
        <span className="stat-value">{value}</span>
        {unit && <span className="stat-unit">{unit}</span>}
      </div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  )
}

export default function Dashboard() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [targets, setTargets] = useState(null)
  const [todayIntake, setTodayIntake] = useState(null)
  const [chartData, setChartData] = useState([])
  const [loadingIntake, setLoadingIntake] = useState(true)

  const todayKey = new Date().toISOString().slice(0, 10)

  const loadData = useCallback(async () => {
    if (!profile || !user) return
    setLoadingIntake(true)
    try {
      const uid = user.uid

      // Today's intake
      const todayData = await getDayIntake(uid, todayKey, user.isLocal)
      const items = todayData?.items || []
      setTodayIntake(computeIntakeTotals(items))

      // Last 7 days chart data
      const history = await getIntakeWeekHistory(uid, user.isLocal)
      const days = history.map(d => {
        const totals = computeIntakeTotals(d.items || [])
        return { date: d.id.slice(5), kcal: totals.kcal }
      })
      setChartData(days)
    } catch (err) {
      console.error('Error loading dashboard data:', err)
    } finally {
      setLoadingIntake(false)
    }
  }, [profile, user, todayKey])

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
      loadData()
    }
  }, [profile, loadData])

  if (!profile) return null

  const goalLabel = { cut: 'Weight Loss', maintain: 'Maintenance', gain: 'Muscle Gain' }
  const actLabel = { sedentary: 'Sedentary', light: 'Lightly Active', moderate: 'Moderately Active', active: 'Very Active' }

  const caloriesPct = targets && todayIntake
    ? Math.min(100, Math.round((todayIntake.kcal / targets.cal) * 100))
    : 0

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
              <span className="gradient-text">{profile.name?.split(' ')[0] || 'there'}</span> 👋
            </h1>
            <p>{today}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/meal-plan')} className="btn btn-primary">
              🍽 Meal Plans
            </button>
            <button onClick={() => navigate('/intake')} className="btn btn-secondary">
              📋 Log Food
            </button>
            <button onClick={() => navigate('/grocery')} className="btn btn-secondary">
              🛒 Grocery List
            </button>
            <button onClick={() => navigate('/foods')} className="btn btn-secondary">
              🔍 Food Directory
            </button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      {targets && (
        <div className="grid-4 mb-4" style={{ marginBottom: '1.5rem' }}>
          <StatCard
            label="Daily Calories"
            value={targets.cal.toLocaleString()}
            unit="kcal"
            sub={`Goal: ${goalLabel[profile.goal]}`}
            color="green"
            icon="🔥"
          />
          <StatCard
            label="BMR"
            value={targets.bmr.toLocaleString()}
            unit="kcal"
            sub="Basal metabolic rate"
            color="cyan"
            icon="💓"
          />
          <StatCard
            label="TDEE"
            value={targets.tdee.toLocaleString()}
            unit="kcal"
            sub={actLabel[profile.activity_level]}
            color="purple"
            icon="⚡"
          />
          <StatCard
            label="Today's Intake"
            value={todayIntake?.kcal?.toLocaleString() ?? '—'}
            unit="kcal"
            sub={`${caloriesPct}% of daily target`}
            color="orange"
            icon="🥗"
          />
        </div>
      )}

      {/* Main 2-col layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Macro Ring */}
        <div className="card card-gradient">
          <h3 style={{ marginBottom: '1.25rem' }}>Daily Macros</h3>
          {targets ? (
            <MacroRing
              macros={targets.macros}
              consumed={todayIntake}
              size={170}
            />
          ) : (
            <div className="loading-screen" style={{ minHeight: 200 }}>
              <div className="spinner" />
            </div>
          )}
        </div>

        {/* Today's calorie bar */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3>Today's Progress</h3>
            {todayIntake && (
              <span className={`badge badge-${caloriesPct >= 90 ? 'green' : caloriesPct >= 50 ? 'cyan' : 'orange'}`}>
                {caloriesPct}% complete
              </span>
            )}
          </div>

          {loadingIntake ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <div className="spinner" />
            </div>
          ) : todayIntake && targets ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Calorie bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="text-sm text-secondary">Calories</span>
                  <span className="text-sm font-semibold">
                    {todayIntake.kcal} / {targets.cal} kcal
                  </span>
                </div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar" style={{ width: `${caloriesPct}%` }} />
                </div>
              </div>

              {/* Macro bars */}
              {[
                { label: 'Protein', consumed: todayIntake.p, target: targets.macros.p, color: '#00ff88' },
                { label: 'Carbohydrates', consumed: todayIntake.c, target: targets.macros.c, color: '#00d4ff' },
                { label: 'Fat', consumed: todayIntake.f, target: targets.macros.f, color: '#8b5cf6' },
              ].map(({ label, consumed, target: t, color }) => {
                const pct = t > 0 ? Math.min(100, Math.round((consumed / t) * 100)) : 0
                return (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span className="text-xs text-secondary">{label}</span>
                      <span className="text-xs" style={{ color }}>
                        {consumed}g / {t}g
                      </span>
                    </div>
                    <div className="progress-bar-wrap">
                      <div
                        className="progress-bar"
                        style={{ width: `${pct}%`, background: color }}
                      />
                    </div>
                  </div>
                )
              })}

              <button
                onClick={() => navigate('/intake')}
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '0.5rem' }}
              >
                + Log Food
              </button>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🌅</div>
              <p>No intake logged today yet.</p>
              <button onClick={() => navigate('/intake')} className="btn btn-primary btn-sm">
                Start Logging
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Weekly chart */}
      <div className="card mb-4">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3>7-Day Calorie Trend</h3>
          {targets && (
            <span className="text-xs text-muted">Target: {targets.cal} kcal</span>
          )}
        </div>
        <ProgressChart data={chartData} target={targets?.cal} />
      </div>

      {/* Profile snapshot */}
      <div className="card card-highlight">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Your Profile</h3>
          <button onClick={() => navigate('/setup')} className="btn btn-ghost btn-sm">Edit →</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
          {[
            { label: 'Age', value: `${profile.age} yrs` },
            { label: 'Height', value: `${profile.height_cm} cm` },
            { label: 'Weight', value: `${profile.weight_kg} kg` },
            { label: 'Goal', value: goalLabel[profile.goal] },
            { label: 'Activity', value: actLabel[profile.activity_level] },
            { label: 'Diet', value: { veg: 'Vegetarian', vegan: 'Vegan', omnivore: 'Omnivore' }[profile.diet_pref] },
          ].map(({ label, value }) => (
            <div key={label} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
              <div className="stat-label" style={{ marginBottom: '0.2rem' }}>{label}</div>
              <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{value}</div>
            </div>
          ))}
        </div>

        {profile.allergies?.length > 0 && (
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span className="text-xs text-muted">Avoids:</span>
            {profile.allergies.map(a => (
              <span key={a} className="badge badge-red">{a}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
