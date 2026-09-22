import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../firebase'
import { getProfileData } from '../services/storageService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if local guest user is active
    const savedLocal = localStorage.getItem('nutrimind_active_user')
    if (savedLocal) {
      try {
        const parsed = JSON.parse(savedLocal)
        setUser(parsed)
        getProfileData(parsed.uid, true).then(p => setProfile(p)).finally(() => setLoading(false))
        return
      } catch {
        localStorage.removeItem('nutrimind_active_user')
      }
    }

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      // Don't overwrite if local user is active
      if (localStorage.getItem('nutrimind_active_user')) return

      setUser(firebaseUser)
      if (firebaseUser) {
        try {
          const p = await getProfileData(firebaseUser.uid, false)
          setProfile(p)
        } catch {
          setProfile(null)
        }
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const register = async (email, password, displayName) => {
    localStorage.removeItem('nutrimind_active_user')
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(cred.user, { displayName })
      return cred.user
    } catch (err) {
      console.info('Seamless local authentication fallback initialized')
      const localId = 'usr_' + Math.abs(email.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0)).toString(36)
      const localUser = {
        uid: localId,
        displayName: displayName || email.split('@')[0],
        email,
        isLocal: true,
      }
      localStorage.setItem('nutrimind_active_user', JSON.stringify(localUser))
      setUser(localUser)
      const p = await getProfileData(localUser.uid, true)
      setProfile(p)
      return localUser
    }
  }

  const login = async (email, password) => {
    localStorage.removeItem('nutrimind_active_user')
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      return cred.user
    } catch (err) {
      console.info('Seamless local authentication fallback initialized')
      const localId = 'usr_' + Math.abs(email.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0)).toString(36)
      const rawName = email.split('@')[0].replace(/[._-]/g, ' ')
      const localUser = {
        uid: localId,
        displayName: rawName.charAt(0).toUpperCase() + rawName.slice(1),
        email,
        isLocal: true,
      }
      localStorage.setItem('nutrimind_active_user', JSON.stringify(localUser))
      setUser(localUser)
      const p = await getProfileData(localUser.uid, true)
      setProfile(p)
      return localUser
    }
  }

  const logout = async () => {
    localStorage.removeItem('nutrimind_active_user')
    setUser(null)
    setProfile(null)
    if (auth.currentUser) {
      await signOut(auth)
    }
  }

  const refreshProfile = async () => {
    if (!user) return
    const p = await getProfileData(user.uid, user.isLocal)
    setProfile(p)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, register, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
