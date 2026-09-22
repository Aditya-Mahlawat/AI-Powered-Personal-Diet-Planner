// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import ProfileSetup from './pages/ProfileSetup'
import Dashboard from './pages/Dashboard'
import MealPlan from './pages/MealPlan'
import IntakeLog from './pages/IntakeLog'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span>Loading NutriMind…</span>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  return children
}

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

export default function App() {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span>Loading NutriMind…</span>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />

      {/* Profile setup — shown to logged-in users without a profile */}
      <Route
        path="/setup"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProfileSetup />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Protected app routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            {!profile ? (
              <Navigate to="/setup" replace />
            ) : (
              <AppLayout>
                <Dashboard />
              </AppLayout>
            )}
          </ProtectedRoute>
        }
      />
      <Route
        path="/meal-plan"
        element={
          <ProtectedRoute>
            {!profile ? (
              <Navigate to="/setup" replace />
            ) : (
              <AppLayout>
                <MealPlan />
              </AppLayout>
            )}
          </ProtectedRoute>
        }
      />
      <Route
        path="/intake"
        element={
          <ProtectedRoute>
            {!profile ? (
              <Navigate to="/setup" replace />
            ) : (
              <AppLayout>
                <IntakeLog />
              </AppLayout>
            )}
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
