// src/services/storageService.js
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore'
import { db, auth } from '../firebase'

/**
 * Resizes and converts any uploaded image into a compact Base64 JPEG (< 40KB).
 * This eliminates the need for Firebase Cloud Storage (which requires billing).
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const maxDim = 256
        let width = img.width
        let height = img.height
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width)
            width = maxDim
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height)
            height = maxDim
          }
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.onerror = reject
      img.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// LocalStorage helpers
function getLocalItem(key, defaultValue = null) {
  try {
    const val = localStorage.getItem(key)
    return val ? JSON.parse(val) : defaultValue
  } catch {
    return defaultValue
  }
}

function setLocalItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn('LocalStorage save failed:', e)
  }
}

// Profile Storage
export async function saveProfileData(uid, profileData, isLocal = false) {
  setLocalItem(`nutrimind_profile_${uid}`, profileData)
  if (isLocal) return { success: true, mode: 'local' }

  try {
    await setDoc(
      doc(db, 'users', uid, 'profile', 'main'),
      {
        ...profileData,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    )
    return { success: true, mode: 'cloud' }
  } catch (err) {
    console.warn('Firestore profile save failed, saved to local storage:', err)
    return { success: true, mode: 'local-fallback' }
  }
}

export async function getProfileData(uid, isLocal = false) {
  if (isLocal) {
    return getLocalItem(`nutrimind_profile_${uid}`, null)
  }
  try {
    const snap = await getDoc(doc(db, 'users', uid, 'profile', 'main'))
    if (snap.exists()) {
      const data = snap.data()
      setLocalItem(`nutrimind_profile_${uid}`, data)
      return data
    }
    return getLocalItem(`nutrimind_profile_${uid}`, null)
  } catch (err) {
    console.warn('Firestore profile read failed, reading from local storage:', err)
    return getLocalItem(`nutrimind_profile_${uid}`, null)
  }
}

// Meal Plans Storage
export async function savePlanData(uid, planData, isLocal = false) {
  const localKey = `nutrimind_plans_${uid}`
  const existing = getLocalItem(localKey, [])
  const newLocalItem = {
    id: 'local_' + Date.now(),
    createdAt: new Date().toISOString(),
    ...planData,
  }
  setLocalItem(localKey, [newLocalItem, ...existing])

  if (isLocal) return { success: true, mode: 'local' }

  try {
    await addDoc(collection(db, 'users', uid, 'plans'), {
      ...planData,
      createdAt: serverTimestamp(),
    })
    return { success: true, mode: 'cloud' }
  } catch (err) {
    console.warn('Firestore plan save failed, saved to local storage:', err)
    return { success: true, mode: 'local-fallback' }
  }
}

export async function getSavedPlans(uid, isLocal = false) {
  const localKey = `nutrimind_plans_${uid}`
  if (isLocal) {
    return getLocalItem(localKey, [])
  }
  try {
    const q = query(collection(db, 'users', uid, 'plans'), orderBy('createdAt', 'desc'), limit(5))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (err) {
    console.warn('Firestore plans read failed, falling back to local storage:', err)
    return getLocalItem(localKey, [])
  }
}

// Daily Intake Storage
export async function getDayIntake(uid, dateKey, isLocal = false) {
  const localKey = `nutrimind_intake_${uid}_${dateKey}`
  if (isLocal) {
    return getLocalItem(localKey, { items: [], date: dateKey })
  }
  try {
    const snap = await getDoc(doc(db, 'users', uid, 'intake', dateKey))
    if (snap.exists()) {
      const data = snap.data()
      setLocalItem(localKey, data)
      return data
    }
    return getLocalItem(localKey, { items: [], date: dateKey })
  } catch (err) {
    console.warn('Firestore intake read failed, reading from local storage:', err)
    return getLocalItem(localKey, { items: [], date: dateKey })
  }
}

export async function addDayIntakeItem(uid, dateKey, item, isLocal = false) {
  const localKey = `nutrimind_intake_${uid}_${dateKey}`
  const existing = getLocalItem(localKey, { items: [], date: dateKey })
  const updatedItems = [...(existing.items || []), item]
  const updatedData = { ...existing, items: updatedItems, date: dateKey }
  setLocalItem(localKey, updatedData)

  // Track dates list for history
  const datesKey = `nutrimind_intake_dates_${uid}`
  const datesList = getLocalItem(datesKey, [])
  if (!datesList.includes(dateKey)) {
    setLocalItem(datesKey, [...datesList, dateKey])
  }

  if (isLocal) return { success: true, mode: 'local' }

  try {
    const intakeRef = doc(db, 'users', uid, 'intake', dateKey)
    const snap = await getDoc(intakeRef)
    if (snap.exists()) {
      await updateDoc(intakeRef, { items: arrayUnion(item) })
    } else {
      await setDoc(intakeRef, {
        items: [item],
        date: dateKey,
        updatedAt: serverTimestamp(),
      })
    }
    return { success: true, mode: 'cloud' }
  } catch (err) {
    console.warn('Firestore intake item save failed, saved to local storage:', err)
    return { success: true, mode: 'local-fallback' }
  }
}

export async function updateDayIntakeItems(uid, dateKey, items, isLocal = false) {
  const localKey = `nutrimind_intake_${uid}_${dateKey}`
  const existing = getLocalItem(localKey, { date: dateKey })
  setLocalItem(localKey, { ...existing, items, date: dateKey })

  if (isLocal) return { success: true, mode: 'local' }

  try {
    await setDoc(
      doc(db, 'users', uid, 'intake', dateKey),
      { items, date: dateKey, updatedAt: serverTimestamp() },
      { merge: true }
    )
    return { success: true, mode: 'cloud' }
  } catch (err) {
    console.warn('Firestore intake update failed, updated in local storage:', err)
    return { success: true, mode: 'local-fallback' }
  }
}

export async function getIntakeWeekHistory(uid, isLocal = false) {
  if (isLocal) {
    const datesKey = `nutrimind_intake_dates_${uid}`
    const datesList = getLocalItem(datesKey, [])
    const recent = datesList.sort().slice(-7)
    return recent.map(date => {
      const data = getLocalItem(`nutrimind_intake_${uid}_${date}`, { items: [] })
      return { id: date, items: data.items || [] }
    })
  }

  try {
    const intakeRef = collection(db, 'users', uid, 'intake')
    const q = query(intakeRef, orderBy('__name__', 'desc'), limit(7))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, items: d.data().items || [] })).reverse()
  } catch (err) {
    console.warn('Firestore history read failed, reading from local storage:', err)
    const datesKey = `nutrimind_intake_dates_${uid}`
    const datesList = getLocalItem(datesKey, [])
    const recent = datesList.sort().slice(-7)
    return recent.map(date => {
      const data = getLocalItem(`nutrimind_intake_${uid}_${date}`, { items: [] })
      return { id: date, items: data.items || [] }
    })
  }
}
