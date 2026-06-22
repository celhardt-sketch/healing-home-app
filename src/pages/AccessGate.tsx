import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock, CreditCard, ArrowRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import SafetyFooter from '../components/SafetyFooter'

export default function AccessGate() {
  const { user, createCheckoutSession } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubscribe = async () => {
    setLoading(true)
    setError('')

    const url = await createCheckoutSession()
    if (url) {
      window.location.href = url
    } else {
      setError('Unable to start checkout. Please try again or check your connection.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-blue-bg via-white to-healing-purple/5 flex flex-col">
      <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="The Healing Home Approach" className="h-10 w-auto" />
            <div>
              <h1 className="text-lg font-bold text-slate-blue leading-tight font-heading">
                The Healing Home Approach
              </h1>
              <p className="text-xs text-charcoal-70">by Elhardt Family Wellness LLC</p>
            </div>
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-sky-blue-bg rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-slate-blue" />
          </div>

          <h2 className="text-2xl font-bold font-heading text-charcoal mb-2">
            Access Required
          </h2>
          <p className="text-charcoal-80 mb-6">
            This application requires an active subscription through Elhardt Family Wellness.
            Once your subscription is confirmed, access is granted automatically.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
            <h3 className="font-bold text-charcoal mb-3">How to get access:</h3>
            <ol className="space-y-2 text-sm text-charcoal-80">
              <li className="flex items-start gap-2">
                <span className="font-bold text-slate-blue">1.</span>
                Subscribe to The Healing Home Approach using the button below
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-slate-blue">2.</span>
                Use the same email address you used to sign in
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-slate-blue">3.</span>
                Access is granted automatically within minutes
              </li>
            </ol>
          </div>

          {user && (
            <p className="text-sm text-charcoal-70 mb-4">
              Signed in as: <strong>{user.email}</strong>
            </p>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full bg-slate-blue text-white py-3 rounded-lg font-semibold hover:bg-slate-blue-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            {loading ? 'Redirecting to checkout...' : 'Subscribe to The Healing Home Approach'}
          </button>

          <p className="text-xs text-charcoal-70 mt-3">
            $9.99/month &bull; Cancel anytime &bull; Powered by Stripe
          </p>

          <p className="text-sm text-charcoal-70 mt-4">
            Already subscribed? Make sure you used the same email address.
          </p>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link
              to="/dashboard"
              className="text-sm text-charcoal-70 hover:text-slate-blue inline-flex items-center gap-1"
            >
              Access free First Aid tools <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </main>

      <SafetyFooter />
    </div>
  )
}
