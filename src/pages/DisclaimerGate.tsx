import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Shield, AlertTriangle, Phone, CheckCircle } from 'lucide-react'

export default function DisclaimerGate() {
  const { acceptDisclaimer, disclaimerAccepted, signIn, register } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [showLogin, setShowLogin] = useState(disclaimerAccepted)
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAccept = () => {
    acceptDisclaimer()
    setShowLogin(true)
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn(email, password)
    setLoading(false)

    if (result.ok) {
      navigate('/dashboard')
    } else {
      setError(result.error || 'Login failed')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    const result = await register(name, email, password)
    setLoading(false)

    if (result.ok) {
      navigate('/dashboard')
    } else {
      setError(result.error || 'Registration failed')
    }
  }

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-blue-bg via-white to-healing-purple/5 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-6">
            <img src="/logo.png" alt="The Healing Home Approach" className="h-16 w-auto mx-auto mb-4" />
            <h2 className="text-2xl font-bold font-heading text-slate-blue">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-sm text-charcoal-70 mt-1">
              {isRegister ? 'Sign up to save your progress' : 'Sign in to access your tools'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={isRegister ? handleRegister : handleSignIn} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none"
                  required
                />
              </div>
            )}
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
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none"
                required
                minLength={8}
              />
              {isRegister && (
                <p className="text-xs text-charcoal-70 mt-1">Minimum 8 characters</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-blue text-white py-2.5 rounded-lg font-semibold hover:bg-slate-blue-dark transition-colors disabled:opacity-50"
            >
              {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-charcoal-70 mt-4">
            {isRegister ? (
              <>
                Already have an account?{' '}
                <button onClick={() => { setIsRegister(false); setError('') }} className="text-slate-blue font-medium hover:underline">
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button onClick={() => { setIsRegister(true); setError('') }} className="text-slate-blue font-medium hover:underline">
                  Create Account
                </button>
              </>
            )}
          </p>

          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <Link to="/dashboard" className="text-sm text-charcoal-70 hover:text-slate-blue">
              Continue without account →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-blue-bg via-white to-healing-purple/5 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="text-center p-8 pb-6">
          <img src="/logo.png" alt="The Healing Home Approach" className="h-20 w-auto mx-auto mb-4" />
          <p className="text-sm text-charcoal-70">Elhardt Family Wellness LLC</p>
          <h2 className="text-2xl font-bold font-heading text-slate-blue mt-4">
            Welcome to The Healing Home Approach&#8482;
          </h2>
          <p className="text-charcoal-80 mt-2">
            A trauma-informed psychoeducational support tool for foster and adoptive caregivers
          </p>
        </div>

        <div className="px-8 pb-8 space-y-6">
          <div className="bg-sky-blue-bg rounded-xl p-6">
            <h3 className="font-heading font-bold text-slate-blue flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5" /> Important Disclaimer
            </h3>
            <p className="text-sm text-charcoal-80 leading-relaxed mb-4">
              This content is designed to inform, support, and empower individuals by offering
              evidence-based education on mental health, trauma, parenting strategies, and emotional
              regulation techniques. It does not constitute professional advice, diagnosis, or treatment.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-charcoal-80">
                <strong>This app is NOT:</strong>
              </p>
              <ul className="text-sm text-charcoal-80 space-y-1 ml-4 list-disc">
                <li>A replacement for crisis intervention or emergency services</li>
                <li>A substitute for therapy or clinical treatment</li>
                <li>A diagnostic tool</li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-6">
            <h3 className="font-heading font-bold text-amber-800 flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5" /> Before Using This App
            </h3>
            <p className="text-sm text-charcoal-80 leading-relaxed">
              We strongly recommend obtaining written or verbal authorization from your child's treating
              mental health professional to use psychoeducational regulation and connection tools at home.
              This app provides guidance that complements, but never replaces, professional therapeutic support.
            </p>
          </div>

          <div className="bg-red-50 rounded-xl p-6">
            <h3 className="font-heading font-bold text-red-800 flex items-center gap-2 mb-3">
              <Phone className="w-5 h-5" /> In Case of Emergency
            </h3>
            <p className="text-sm text-charcoal-80 leading-relaxed">
              If you or your child are in immediate danger, please contact emergency services
              immediately. This app is not a crisis intervention tool.
            </p>
            <p className="text-sm font-semibold text-red-800 mt-2">
              Suicide &amp; Crisis Lifeline: <a href="tel:988" className="underline">988</a>
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 text-sm text-charcoal-80">
            <p>
              This application is intended for use by adults (18 years of age or older) who are
              caregivers, foster parents, adoptive parents, or professionals working with children.
              This app is not designed for use by minors.
            </p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-gray-300 text-slate-blue focus:ring-slate-blue"
            />
            <span className="text-sm text-charcoal-80">
              I confirm that I am 18 years of age or older, that my child's mental health professional
              has approved the use of psychoeducational regulation tools, and I am a caregiver, foster parent,
              adoptive parent, or professional working with children. I have read and understand the disclaimer
              listed above and agree that app guidance is always subordinate to professional, legal, and caregiver judgment.
            </span>
          </label>

          <button
            onClick={handleAccept}
            disabled={!agreed}
            className="w-full bg-slate-blue text-white py-3 rounded-lg font-semibold hover:bg-slate-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            I Understand and Accept
          </button>

          <p className="text-xs text-charcoal-70 text-center">
            Your acceptance will be timestamped and recorded for safety and compliance purposes.
            Future updates to this disclaimer or legal documents may require re-acceptance.
          </p>
        </div>
      </div>
    </div>
  )
}
