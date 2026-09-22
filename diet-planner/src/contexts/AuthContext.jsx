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
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName })
    return cred.user
  }

  const login = async (email, password) => {
    localStorage.removeItem('nutrimind_active_user')
    return signInWithEmailAndPassword(auth, email, password)
  }

  const loginAsGuest = async (displayName = 'Diet Explorer') => {
    let guestId = localStorage.getItem('nutrimind_guest_id')
    if (!guestId) {
      guestId = 'guest_' + Math.random().toString(36).slice(2, 9)
      localStorage.setItem('nutrimind_guest_id', guestId)
    }
    const guestUser = {
      uid: guestId,
      displayName,
      email: 'free-user@nutrimind.local',
      isLocal: true,
    }
    localStorage.setItem('nutrimind_active_user', JSON.stringify(guestUser))
    setUser(guestUser)
    const p = await getProfileData(guestUser.uid, true)
    setProfile(p)
    return guestUser
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
    <AuthContext.Provider value={{ user, profile, loading, register, login, loginAsGuest, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
