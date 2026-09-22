// src/pages/Login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { validateAuth } from '../utils/validators'
import toast from 'react-hot-toast'

export default function Login() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('login')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setErrors(er => ({ ...er, [e.target.name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validateAuth(form)
    if (tab === 'register' && (!form.name || form.name.trim().length < 2)) {
      errs.name = 'Name must be at least 2 characters.'
    }
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      if (tab === 'login') {
        await login(form.email, form.password)
        toast.success('Welcome back!')
      } else {
        await register(form.email, form.password, form.name.trim())
        toast.success('Account created! Let\'s set up your profile.')
      }
      navigate('/')
      let msg = 'Something went wrong. Please try again.'
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password.'
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered. Try signing in instead.'
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password must be at least 6 characters.'
      } else if (err.code === 'auth/operation-not-allowed') {
        msg = 'Email/Password sign-in is not enabled in Firebase Console. Go to Build > Authentication > Sign-in method to enable it.'
      } else if (err.code === 'auth/network-request-failed') {
        msg = 'Network connection failed. Please check your internet.'
      } else if (err.message) {
        msg = err.message
      }
      toast.error(msg, { duration: 6000 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {/* Background orbs */}
      <div style={{
        position: 'fixed', top: '15%', left: '10%', width: 400, height: 400,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '15%', right: '10%', width: 300, height: 300,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">🥗</div>
          <div>
            <h2 style={{ marginBottom: 0 }}>NutriMind</h2>
            <p style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Your personal AI diet planner
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab${tab === 'login' ? ' active' : ''}`}
            onClick={() => { setTab('login'); setErrors({}) }}
          >
            Sign In
          </button>
          <button
            className={`auth-tab${tab === 'register' ? ' active' : ''}`}
            onClick={() => { setTab('register'); setErrors({}) }}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {tab === 'register' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
              {errors.name && <span className="form-error">⚠ {errors.name}</span>}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <span className="form-error">⚠ {errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              placeholder={tab === 'register' ? 'At least 6 characters' : 'Your password'}
              value={form.password}
              onChange={handleChange}
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
            />
            {errors.password && <span className="form-error">⚠ {errors.password}</span>}
          </div>

          <button
            id="login"
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading
              ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Processing…</>
              : tab === 'login' ? 'Sign In' : 'Create Account'
            }
          </button>
        </form>

        <p className="text-center text-xs text-muted" style={{ marginTop: '1.75rem', lineHeight: 1.6 }}>
          By continuing, you agree to our terms of service and privacy policy.
          Your nutrition profiles and meal plans are securely synchronized to cloud storage.
        </p>
      </div>
    </div>
  )
}
