import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

const API_URL = import.meta.env.VITE_API_URL || ''

interface User {
  id: number
  name: string
  email: string
}

interface SubscriptionInfo {
  status: string
  has_access: boolean
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  subscription: SubscriptionInfo
  disclaimerAccepted: boolean
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  signOut: () => void
  acceptDisclaimer: () => void
  checkSubscription: () => Promise<void>
  createCheckoutSession: () => Promise<string | null>
  openBillingPortal: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [subscription, setSubscription] = useState<SubscriptionInfo>(() => {
    // CRITICAL ACCESS-CACHING RULE: Check device-cached access flag first
    const cachedAccess = localStorage.getItem('subscription_access')
    if (cachedAccess === 'true') {
      return { status: 'active', has_access: true }
    }
    return { status: 'none', has_access: false }
  })
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
        // Background check subscription status
        checkSubscriptionWithToken(token)
      } else {
        localStorage.removeItem('auth_token')
      }
    } catch {
      // Network error — app continues to work offline
      // Use cached subscription status (already loaded from localStorage)
    }
  }

  async function checkSubscriptionWithToken(token: string) {
    try {
      const res = await fetch(`${API_URL}/api/subscription/status`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setSubscription(data)
        // Cache the access flag on device for offline use
        localStorage.setItem('subscription_access', data.has_access ? 'true' : 'false')
        localStorage.setItem('subscription_status', data.status)
      }
    } catch {
      // Network error — use cached status, don't block the user
    }
  }

  const checkSubscription = async () => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      await checkSubscriptionWithToken(token)
    }
  }

  const createCheckoutSession = async (): Promise<string | null> => {
    const token = localStorage.getItem('auth_token')
    if (!token) return null

    try {
      const res = await fetch(`${API_URL}/api/subscription/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          success_url: `${window.location.origin}/dashboard?subscription=success`,
          cancel_url: `${window.location.origin}/access-gate?subscription=canceled`,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        return data.checkout_url
      }
      return null
    } catch {
      return null
    }
  }

  const openBillingPortal = async (): Promise<string | null> => {
    const token = localStorage.getItem('auth_token')
    if (!token) return null

    try {
      const res = await fetch(`${API_URL}/api/subscription/billing-portal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          return_url: `${window.location.origin}/account`,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        return data.portal_url
      }
      return null
    } catch {
      return null
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
    localStorage.removeItem('subscription_access')
    localStorage.removeItem('subscription_status')
    setUser(null)
    setSubscription({ status: 'none', has_access: false })
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
        subscription,
        disclaimerAccepted,
        signIn,
        register,
        signOut,
        acceptDisclaimer,
        checkSubscription,
        createCheckoutSession,
        openBillingPortal,
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
