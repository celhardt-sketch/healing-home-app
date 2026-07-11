import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { CheckCircle } from 'lucide-react'

export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await requestPasswordReset(email)
    setLoading(false)
    if (result.ok) {
      setSent(true)
    } else {
      setError(result.error || 'Something went wrong')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-blue-bg via-white to-healing-purple/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-6">
          <img src="/logo.png" alt="The Healing Home Approach" className="h-16 w-auto mx-auto mb-4" />
          <h2 className="text-2xl font-bold font-heading text-slate-blue">Reset your password</h2>
          <p className="text-sm text-charcoal-70 mt-1">
            Enter your email and we'll send you a link to set a new password.
          </p>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 flex items-start gap-2 text-left">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>
                If an account exists for <strong>{email}</strong>, a password reset link is on its
                way. The link expires in 1 hour. Be sure to check your spam folder.
              </span>
            </div>
            <Link to="/disclaimer" className="text-slate-blue font-medium hover:underline text-sm">
              Back to sign in
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
                <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-blue text-white py-2.5 rounded-lg font-semibold hover:bg-slate-blue-dark transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>
            <p className="text-center text-sm text-charcoal-70 mt-4">
              Remembered it?{' '}
              <Link to="/disclaimer" className="text-slate-blue font-medium hover:underline">
                Sign In
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
