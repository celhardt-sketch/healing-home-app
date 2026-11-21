import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, CreditCard, ArrowRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import SafetyFooter from '../components/SafetyFooter'
import { usePublicPlans, isClassicMonthly, planIntervalLabel } from '../lib/plans'

function redirectTo(url: string) {
  window.location.assign(url)
}

export default function AccessGate() {
  const { user, subscription, createCheckoutSession } = useAuth()
  const navigate = useNavigate()
  const plans = usePublicPlans()
  const classic = isClassicMonthly(plans)
  const familyTrial = plans.some((plan) => plan.trial_days > 0)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [error, setError] = useState('')
  const returning = Boolean(subscription.trial_used) || (subscription.status !== 'none' && subscription.status !== '')

  const handleSubscribe = async (planId?: string) => {
    setLoadingPlan(planId || 'monthly')
    setError('')

    const result = await createCheckoutSession(planId)
    if (result.alreadySubscribed) {
      // Already paying. Don't charge again; send them into the app.
      navigate('/dashboard')
      return
    }
    if (result.url) {
      redirectTo(result.url)
    } else {
      setError(result.error || 'Unable to start checkout. Please try again or check your connection.')
      setLoadingPlan(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-blue-bg via-white to-healing-purple/5 flex flex-col">
      <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-[var(--public-help-strip-height)] z-50">
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
                {classic
                  ? 'Subscribe to The Healing Home Approach using the button below'
                  : 'Choose a plan below'}
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

          {classic ? (
            <>
              <button
                onClick={() => handleSubscribe()}
                disabled={loadingPlan !== null}
                className="w-full bg-slate-blue text-white py-3 rounded-lg font-semibold hover:bg-slate-blue-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                {loadingPlan ? 'Redirecting to checkout...' : 'Subscribe to The Healing Home Approach'}
              </button>

              <p className="text-xs text-charcoal-70 mt-3">
                $9.99/month &bull; Cancel anytime &bull; Powered by Stripe
              </p>
            </>
          ) : (
            <div className="space-y-3 text-left">
              {familyTrial && (
                <p className="text-sm text-charcoal-70">
                  {returning
                    ? 'Your free trial has already been used, so the plan you choose starts as a paid subscription.'
                    : 'New families get one 7-day free trial on a family plan. We save your card now and do not charge it until the trial ends.'}
                </p>
              )}
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loadingPlan !== null}
                  className="w-full border border-gray-200 rounded-xl p-4 hover:border-slate-blue disabled:opacity-50 text-left"
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="font-bold text-charcoal">{plan.name}</span>
                    <span className="font-bold text-slate-blue">{plan.amount_display}/{planIntervalLabel(plan)}</span>
                  </span>
                  <span className="block text-sm text-charcoal-70 mt-1">{plan.description}</span>
                  {plan.trial_days > 0 && !returning && (
                    <span className="block text-sm text-growth-green-dark mt-1">
                      {plan.trial_days}-day free trial. Card saved now, charged when the trial ends.
                    </span>
                  )}
                  {loadingPlan === plan.id && (
                    <span className="block text-sm text-slate-blue mt-2">Redirecting to checkout...</span>
                  )}
                </button>
              ))}
              <p className="text-xs text-charcoal-70 text-center">
                Cancel anytime &bull; Powered by Stripe
              </p>
            </div>
          )}

          <p className="text-sm text-charcoal-70 mt-4">
            Already subscribed? Make sure you used the same email address.
          </p>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link
              to="/crisis"
              className="text-sm text-charcoal-70 hover:text-slate-blue inline-flex items-center gap-1"
            >
              Access free crisis &amp; safety tools <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </main>

      <SafetyFooter />
    </div>
  )
}
