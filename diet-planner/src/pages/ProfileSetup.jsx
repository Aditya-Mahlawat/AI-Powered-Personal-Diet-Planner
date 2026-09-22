// src/pages/ProfileSetup.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { validateProfile } from '../utils/validators'
import { useNavigate } from 'react-router-dom'
import { saveProfileData, fileToBase64 } from '../services/storageService'
import toast from 'react-hot-toast'

const STEPS = ['Basic Info', 'Body Metrics', 'Goals & Diet', 'Preferences']

const ALLERGY_OPTIONS = [
  { id: 'nuts',    label: '🥜 Nuts' },
  { id: 'lactose', label: '🥛 Lactose' },
  { id: 'gluten',  label: '🌾 Gluten' },
  { id: 'shellfish', label: '🦐 Shellfish' },
  { id: 'soy',    label: '🫘 Soy' },
]

const CUISINE_OPTIONS = [
  { id: 'indian',   label: '🇮🇳 Indian' },
  { id: 'asian',    label: '🍜 Asian' },
  { id: 'global',   label: '🌍 Global' },
  { id: 'mediterranean', label: '🫒 Mediterranean' },
  { id: 'mexican',  label: '🌮 Mexican' },
]

const DEFAULT_FORM = {
  name: '', age: '', sex: '', height_cm: '', weight_kg: '',
  activity_level: '', goal: '', diet_pref: '',
  allergies: [], cuisines: [], budget_per_day: '', timeline_weeks: '',
}

export default function ProfileSetup() {
  const { user, profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(DEFAULT_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)

  // Pre-fill if editing
  useEffect(() => {
    if (profile) {
      setForm(f => ({ ...DEFAULT_FORM, ...profile, allergies: profile.allergies || [], cuisines: profile.cuisines || [] }))
    }
    if (user?.displayName && !profile) {
      setForm(f => ({ ...f, name: user.displayName }))
    }
  }, [profile, user])

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  const toggleArray = (field, val) => {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(val) ? f[field].filter(v => v !== val) : [...f[field], val],
    }))
  }

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const validateStep = () => {
    const allErrors = validateProfile(form)
    const stepFields = [
      ['name'],
      ['age', 'sex', 'height_cm', 'weight_kg'],
      ['activity_level', 'goal'],
      ['diet_pref'],
    ]
    const relevant = Object.fromEntries(
      Object.entries(allErrors).filter(([k]) => stepFields[step].includes(k))
    )
    setErrors(relevant)
    return Object.keys(relevant).length === 0
  }

  const nextStep = () => { if (validateStep()) setStep(s => s + 1) }
  const prevStep = () => setStep(s => s - 1)

  const handleSave = async () => {
    const allErrors = validateProfile(form)
    if (Object.keys(allErrors).length) {
      setErrors(allErrors)
      toast.error('Please fix the form errors.')
      return
    }

    setSaving(true)
    try {
      if (!user) {
        toast.error('Please sign in first.')
        return
      }
      const uid = user.uid
      let photoURL = profile?.photoURL || null

      if (photoFile) {
        try {
          photoURL = await fileToBase64(photoFile)
        } catch (storageErr) {
          console.warn('Photo processing error:', storageErr)
        }
      }

      await saveProfileData(
        uid,
        {
          name: form.name.trim(),
          age: Number(form.age),
          sex: form.sex,
          height_cm: Number(form.height_cm),
          weight_kg: Number(form.weight_kg),
          activity_level: form.activity_level,
          goal: form.goal,
          diet_pref: form.diet_pref,
          allergies: form.allergies,
          cuisines: form.cuisines,
          budget_per_day: form.budget_per_day ? Number(form.budget_per_day) : null,
          timeline_weeks: form.timeline_weeks ? Number(form.timeline_weeks) : null,
          photoURL,
        },
        user.isLocal
      )

      await refreshProfile()
      toast.success('Profile saved successfully!')
      navigate('/')
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Failed to save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-container" style={{ maxWidth: 680, margin: '0 auto' }}>
      {/* Header */}
      <div className="page-header">
        <h1>{profile ? 'Edit Profile' : 'Set Up Your Profile'}</h1>
        <p>{profile ? 'Update your details to keep recommendations accurate.' : 'Tell us about yourself so we can personalise your meal plans.'}</p>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', alignItems: 'center' }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0, gap: '0.5rem' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', fontWeight: 700,
              background: i < step ? 'var(--gradient-brand)' : i === step ? 'rgba(0,255,136,0.15)' : 'rgba(255,255,255,0.05)',
              color: i < step ? '#07080f' : i === step ? 'var(--accent-green)' : 'var(--text-muted)',
              border: i === step ? '2px solid var(--accent-green)' : '2px solid transparent',
              transition: 'all 0.3s ease',
            }}>
              {i < step ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: '0.78rem', color: i === step ? 'var(--text-primary)' : 'var(--text-muted)', display: window.innerWidth > 480 ? 'block' : 'none' }}>
              {s}
            </span>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i < step ? 'var(--accent-green)' : 'var(--glass-border)', borderRadius: 2, transition: 'background 0.3s ease' }} />
            )}
          </div>
        ))}
      </div>

      <div className="card">
        {/* Step 0 — Basic Info */}
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3>Basic Information</h3>

            {/* Photo upload */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: photoPreview ? 'none' : 'var(--gradient-brand)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.75rem', overflow: 'hidden', flexShrink: 0,
                border: '2px solid var(--glass-border)',
              }}>
                {photoPreview
                  ? <img src={photoPreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : '👤'
                }
              </div>
              <div>
                <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                  Upload Photo
                  <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
                </label>
                <p className="text-xs text-muted" style={{ marginTop: '0.3rem' }}>Optional. Stored securely in Firebase Storage.</p>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                id="name"
                className="form-input"
                placeholder="Your name"
                value={form.name}
                onChange={e => set('name', e.target.value)}
              />
              {errors.name && <span className="form-error">⚠ {errors.name}</span>}
            </div>
          </div>
        )}

        {/* Step 1 — Body Metrics */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3>Body Metrics</h3>
            <p className="text-sm text-secondary">Used to calculate your BMR and daily calorie needs using the Mifflin-St Jeor formula.</p>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Age *</label>
                <input
                  id="age"
                  className="form-input"
                  type="number"
                  min={10} max={100}
                  placeholder="e.g. 25"
                  value={form.age}
                  onChange={e => set('age', e.target.value)}
                />
                {errors.age && <span className="form-error">⚠ {errors.age}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Biological Sex *</label>
                <select
                  id="sex"
                  className="form-select"
                  value={form.sex}
                  onChange={e => set('sex', e.target.value)}
                >
                  <option value="">Select…</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {errors.sex && <span className="form-error">⚠ {errors.sex}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Height (cm) *</label>
                <input
                  id="height"
                  className="form-input"
                  type="number"
                  min={100} max={250}
                  placeholder="e.g. 170"
                  value={form.height_cm}
                  onChange={e => set('height_cm', e.target.value)}
                />
                {errors.height_cm && <span className="form-error">⚠ {errors.height_cm}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Weight (kg) *</label>
                <input
                  id="weight"
                  className="form-input"
                  type="number"
                  min={20} max={300}
                  step="0.1"
                  placeholder="e.g. 68"
                  value={form.weight_kg}
                  onChange={e => set('weight_kg', e.target.value)}
                />
                {errors.weight_kg && <span className="form-error">⚠ {errors.weight_kg}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Goals & Activity */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3>Goals & Activity Level</h3>

            <div className="form-group">
              <label className="form-label">Activity Level *</label>
              <select
                id="activity"
                className="form-select"
                value={form.activity_level}
                onChange={e => set('activity_level', e.target.value)}
              >
                <option value="">Select your activity level…</option>
                <option value="sedentary">Sedentary — Little to no exercise</option>
                <option value="light">Light — 1–3 days/week</option>
                <option value="moderate">Moderate — 3–5 days/week</option>
                <option value="active">Active — 6–7 days/week</option>
              </select>
              {errors.activity_level && <span className="form-error">⚠ {errors.activity_level}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Your Goal *</label>
              <select
                id="goal"
                className="form-select"
                value={form.goal}
                onChange={e => set('goal', e.target.value)}
              >
                <option value="">Select your goal…</option>
                <option value="cut">Cut — Lose weight (−15% calories)</option>
                <option value="maintain">Maintain — Stay at current weight</option>
                <option value="gain">Gain — Build muscle (+15% calories)</option>
              </select>
              {errors.goal && <span className="form-error">⚠ {errors.goal}</span>}
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Timeline (weeks)</label>
                <input
                  className="form-input"
                  type="number"
                  min={1} max={52}
                  placeholder="e.g. 12"
                  value={form.timeline_weeks}
                  onChange={e => set('timeline_weeks', e.target.value)}
                />
                {errors.timeline_weeks && <span className="form-error">⚠ {errors.timeline_weeks}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Daily Budget (₹)</label>
                <input
                  className="form-input"
                  type="number"
                  min={0}
                  placeholder="e.g. 300"
                  value={form.budget_per_day}
                  onChange={e => set('budget_per_day', e.target.value)}
                />
                {errors.budget_per_day && <span className="form-error">⚠ {errors.budget_per_day}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — Preferences */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3>Dietary Preferences</h3>

            <div className="form-group">
              <label className="form-label">Dietary Preference *</label>
              <select
                id="diet_pref"
                className="form-select"
                value={form.diet_pref}
                onChange={e => set('diet_pref', e.target.value)}
              >
                <option value="">Select preference…</option>
                <option value="veg">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="omnivore">Omnivore (includes non-veg)</option>
              </select>
              {errors.diet_pref && <span className="form-error">⚠ {errors.diet_pref}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Allergies / Intolerances</label>
              <div className="checkbox-group">
                {ALLERGY_OPTIONS.map(({ id, label }) => {
                  const isChecked = form.allergies.includes(id)
                  return (
                    <button
                      type="button"
                      key={id}
                      className={`checkbox-chip${isChecked ? ' checked' : ''}`}
                      onClick={() => toggleArray('allergies', id)}
                      aria-pressed={isChecked}
                    >
                      <span>{isChecked ? '✓' : '+'}</span>
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Cuisines</label>
              <div className="checkbox-group">
                {CUISINE_OPTIONS.map(({ id, label }) => {
                  const isChecked = form.cuisines.includes(id)
                  return (
                    <button
                      type="button"
                      key={id}
                      className={`checkbox-chip${isChecked ? ' checked' : ''}`}
                      onClick={() => toggleArray('cuisines', id)}
                      aria-pressed={isChecked}
                    >
                      <span>{isChecked ? '✓' : '+'}</span>
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', gap: '1rem' }}>
          {step > 0
            ? <button onClick={prevStep} className="btn btn-secondary">← Back</button>
            : <div />
          }
          {step < STEPS.length - 1
            ? <button onClick={nextStep} className="btn btn-primary">Continue →</button>
            : <button
                id="saveProfile"
                onClick={handleSave}
                className="btn btn-primary btn-lg"
                disabled={saving}
              >
                {saving
                  ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Saving…</>
                  : '✓ Save Profile'
                }
              </button>
          }
        </div>
      </div>
    </div>
  )
}
