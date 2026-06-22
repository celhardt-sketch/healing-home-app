import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

const API_URL = import.meta.env.VITE_API_URL || ''

interface User {
  id: number
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  disclaimerAccepted: boolean
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  signOut: () => void
  acceptDisclaimer: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(() => {
    return localStorage.getItem('disclaimerAccepted') === 'true'
  })

  // On mount, restore session from stored token
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      fetchProfile(token)
    }
  }, [])

  async function fetchProfile(token: string) {
    try {
      const res = await fetch(`${API_URL}/api/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data)
      } else {
        // Token expired or invalid — clear it
        localStorage.removeItem('auth_token')
      }
    } catch {
      // Network error — user stays offline, that's fine
      // First Aid tools still work without auth
    }
  }

  const signIn = async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) {
        const data = await res.json()
        localStorage.setItem('auth_token', data.access_token)
        await fetchProfile(data.access_token)
        return { ok: true }
      }
      const err = await res.json()
      return { ok: false, error: err.detail || 'Login failed' }
    } catch {
      return { ok: false, error: 'Network error — please check your connection' }
    }
  }

  const register = async (name: string, email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      if (res.ok) {
        const data = await res.json()
        localStorage.setItem('auth_token', data.access_token)
        await fetchProfile(data.access_token)
        return { ok: true }
      }
      const err = await res.json()
      return { ok: false, error: err.detail || 'Registration failed' }
    } catch {
      return { ok: false, error: 'Network error — please check your connection' }
    }
  }

  const signOut = () => {
    localStorage.removeItem('auth_token')
    setUser(null)
  }

  const acceptDisclaimer = () => {
    setDisclaimerAccepted(true)
    localStorage.setItem('disclaimerAccepted', 'true')
    localStorage.setItem('disclaimerTimestamp', new Date().toISOString())
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        disclaimerAccepted,
        signIn,
        register,
        signOut,
        acceptDisclaimer,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
