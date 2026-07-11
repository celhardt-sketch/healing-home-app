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
  cancel_at_period_end?: boolean
  ends_at?: string | null
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  initializing: boolean
  subscription: SubscriptionInfo
  disclaimerAccepted: boolean
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  signOut: () => void
  acceptDisclaimer: () => void
  checkSubscription: () => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ ok: boolean; error?: string }>
  requestPasswordReset: (email: string) => Promise<{ ok: boolean; error?: string }>
  resetPassword: (token: string, newPassword: string) => Promise<{ ok: boolean; error?: string }>
  createCheckoutSession: () => Promise<{ url: string | null; alreadySubscribed: boolean }>
  openBillingPortal: () => Promise<{ url: string | null; error?: string }>
  cancelSubscription: () => Promise<{ ok: boolean; error?: string }>
  resumeSubscription: () => Promise<{ ok: boolean; error?: string }>
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

  const requestPasswordReset = async (
    email: string
  ): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) return { ok: true }
      const err = await res.json()
      return { ok: false, error: err.detail || 'Could not send reset email' }
    } catch {
      return { ok: false, error: 'Network error — please check your connection' }
    }
  }

  const resetPassword = async (
    token: string,
    newPassword: string
  ): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: newPassword }),
      })
      if (res.ok) return { ok: true }
      const err = await res.json()
      return { ok: false, error: err.detail || 'Could not reset password' }
    } catch {
      return { ok: false, error: 'Network error — please check your connection' }
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

  const createCheckoutSession = async (): Promise<{ url: string | null; alreadySubscribed: boolean }> => {
    const token = localStorage.getItem('auth_token')
    if (!token) return { url: null, alreadySubscribed: false }

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
        // The user already has a live subscription — refresh local state so the
        // guarded routes open instead of sending them through checkout again.
        if (data.already_subscribed) {
          await checkSubscriptionWithToken(token)
          return { url: null, alreadySubscribed: true }
        }
        return { url: data.checkout_url, alreadySubscribed: false }
      }
      return { url: null, alreadySubscribed: false }
    } catch {
      return { url: null, alreadySubscribed: false }
    }
  }

  const openBillingPortal = async (): Promise<{ url: string | null; error?: string }> => {
    const token = localStorage.getItem('auth_token')
    if (!token) return { url: null, error: 'You must be signed in' }

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
        return { url: data.portal_url }
      }
      const err = await res.json().catch(() => ({}))
      return { url: null, error: err.detail || 'Could not open billing portal' }
    } catch {
      return { url: null, error: 'Network error — please check your connection' }
    }
  }

  const applySubscription = (data: SubscriptionInfo) => {
    setSubscription(data)
    localStorage.setItem('subscription_access', data.has_access ? 'true' : 'false')
    localStorage.setItem('subscription_status', data.status)
  }

  const cancelSubscription = async (): Promise<{ ok: boolean; error?: string }> => {
    const token = localStorage.getItem('auth_token')
    if (!token) return { ok: false, error: 'You must be signed in' }
    try {
      const res = await fetch(`${API_URL}/api/subscription/cancel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        applySubscription(await res.json())
        return { ok: true }
      }
      const err = await res.json().catch(() => ({}))
      return { ok: false, error: err.detail || 'Could not cancel membership' }
    } catch {
      return { ok: false, error: 'Network error — please check your connection' }
    }
  }

  const resumeSubscription = async (): Promise<{ ok: boolean; error?: string }> => {
    const token = localStorage.getItem('auth_token')
    if (!token) return { ok: false, error: 'You must be signed in' }
    try {
      const res = await fetch(`${API_URL}/api/subscription/resume`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        applySubscription(await res.json())
        return { ok: true }
      }
      const err = await res.json().catch(() => ({}))
      return { ok: false, error: err.detail || 'Could not resume membership' }
    } catch {
      return { ok: false, error: 'Network error — please check your connection' }
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

  const register = async (firstName: string, lastName: string, email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password }),
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
        requestPasswordReset,
        resetPassword,
        createCheckoutSession,
        openBillingPortal,
        cancelSubscription,
        resumeSubscription,
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
