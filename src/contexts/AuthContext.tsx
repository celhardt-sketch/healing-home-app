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
  is_admin?: boolean
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  initializing: boolean
  subscription: SubscriptionInfo
  disclaimerAccepted: boolean
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  signOut: () => void
  acceptDisclaimer: () => void
  checkSubscription: () => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ ok: boolean; error?: string }>
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
  const [initializing, setInitializing] = useState<boolean>(
    () => localStorage.getItem('auth_token') !== null
  )

  // On mount, restore session from stored token
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    // initializing starts false when there is no token, so only the
    // authenticated path needs to flip it once the profile resolves.
    if (token) {
      const sessionId = new URLSearchParams(window.location.search).get('session_id')
      fetchProfile(token)
        .then(() => (sessionId ? confirmCheckoutWithToken(token, sessionId) : undefined))
        .finally(() => setInitializing(false))
    }
  }, [])

  // Verify a completed Stripe checkout directly, so access does not depend on
  // the webhook arriving first. Retries briefly while Stripe finishes the session.
  async function confirmCheckoutWithToken(token: string, sessionId: string) {
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const res = await fetch(`${API_URL}/api/subscription/confirm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ session_id: sessionId }),
        })
        if (res.ok) {
          const data = await res.json()
          setSubscription(data)
          localStorage.setItem('subscription_access', data.has_access ? 'true' : 'false')
          localStorage.setItem('subscription_status', data.status)
          if (data.has_access) break
        }
      } catch {
        // Network error — fall through to retry, then rely on cached status.
      }
      await new Promise((r) => setTimeout(r, 1500))
    }
  }

  async function fetchProfile(token: string): Promise<void> {
    try {
      const res = await fetch(`${API_URL}/api/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data)
        // Resolve subscription/access before callers navigate into guarded routes
        await checkSubscriptionWithToken(token)
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

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ ok: boolean; error?: string }> => {
    const token = localStorage.getItem('auth_token')
    if (!token) return { ok: false, error: 'You must be signed in' }
    try {
      const res = await fetch(`${API_URL}/api/me/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      })
      if (res.ok) return { ok: true }
      const err = await res.json()
      return { ok: false, error: err.detail || 'Could not change password' }
    } catch {
      return { ok: false, error: 'Network error — please check your connection' }
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
          success_url: `${window.location.origin}/dashboard?subscription=success&session_id={CHECKOUT_SESSION_ID}`,
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
        initializing,
        subscription,
        disclaimerAccepted,
        signIn,
        register,
        signOut,
        acceptDisclaimer,
        checkSubscription,
        changePassword,
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
