import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
  requireSubscription?: boolean
}

export default function ProtectedRoute({
  children,
  requireSubscription = true,
}: ProtectedRouteProps) {
  const { isAuthenticated, initializing, subscription } = useAuth()

  if (initializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-charcoal-70">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/disclaimer" replace />
  }

  if (requireSubscription && !subscription.has_access) {
    return <Navigate to="/access-gate" replace />
  }

  return <>{children}</>
}
