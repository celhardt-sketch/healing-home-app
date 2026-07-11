import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { CheckCircle } from 'lucide-react'

export default function ResetPassword() {
  const { resetPassword } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    const result = await resetPassword(token, password)
    setLoading(false)
    if (result.ok) {
      setDone(true)
    } else {
      setError(result.error || 'Could not reset password')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-blue-bg via-white to-healing-purple/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-6">
          <img src="/logo.png" alt="The Healing Home Approach" className="h-16 w-auto mx-auto mb-4" />
          <h2 className="text-2xl font-bold font-heading text-slate-blue">Choose a new password</h2>
        </div>

        {done ? (
          <div className="text-center">
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 flex items-start gap-2 text-left">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>Your password has been reset. You can now sign in with your new password.</span>
            </div>
            <button
              onClick={() => navigate('/disclaimer')}
              className="w-full bg-slate-blue text-white py-2.5 rounded-lg font-semibold hover:bg-slate-blue-dark transition-colors"
            >
              Go to Sign In
            </button>
          </div>
        ) : !token ? (
          <div className="text-center">
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              This reset link is missing its token. Please request a new one.
            </div>
            <Link to="/forgot-password" className="text-slate-blue font-medium hover:underline text-sm">
              Request a new reset link
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">New password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none"
                  required
                  minLength={8}
                />
                <p className="text-xs text-charcoal-70 mt-1">Minimum 8 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Confirm new password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none"
                  required
                  minLength={8}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-blue text-white py-2.5 rounded-lg font-semibold hover:bg-slate-blue-dark transition-colors disabled:opacity-50"
              >
                {loading ? 'Resetting...' : 'Reset password'}
              </button>
            </form>
            <p className="text-center text-sm text-charcoal-70 mt-4">
              <Link to="/disclaimer" className="text-slate-blue font-medium hover:underline">
                Back to sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
