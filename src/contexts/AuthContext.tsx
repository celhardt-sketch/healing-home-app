import { createContext, useContext, useState, type ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  isAdmin: boolean
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  disclaimerAccepted: boolean
  signIn: (email: string, password: string) => void
  signOut: () => void
  acceptDisclaimer: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(() => {
    return localStorage.getItem('disclaimerAccepted') === 'true'
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const signIn = (email: string, _password: string) => {
    setUser({
      id: '1',
      name: email.split('@')[0],
      email,
      isAdmin: false,
    })
  }

  const signOut = () => {
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
