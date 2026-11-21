import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

/**
 * Back control for public safety pages. Signed-out visitors go home.
 * Signed-in visitors still return to the dashboard.
 */
export default function PublicBackLink() {
  const { isAuthenticated, initializing } = useAuth()
  const hasToken = typeof localStorage !== 'undefined' && !!localStorage.getItem('auth_token')
  const signedIn = isAuthenticated || initializing || hasToken
  const label = signedIn ? 'Back to dashboard' : 'Back'

  return (
    <Link
      to={signedIn ? '/dashboard' : '/'}
      className="inline-flex items-center gap-1.5 min-h-[44px] px-1 shrink-0 text-charcoal hover:text-slate-blue"
    >
      <ArrowLeft className="w-5 h-5" aria-hidden="true" />
      <span className={signedIn ? 'sr-only' : 'text-sm font-medium'}>{label}</span>
    </Link>
  )
}
