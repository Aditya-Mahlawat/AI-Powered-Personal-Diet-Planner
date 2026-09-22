// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0d0f1a',
              color: '#eef0f8',
              border: '1px solid rgba(255,255,255,0.08)',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '0.88rem',
            },
            success: {
              iconTheme: { primary: '#00ff88', secondary: '#07080f' },
            },
            error: {
              iconTheme: { primary: '#ff4d6d', secondary: '#07080f' },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
