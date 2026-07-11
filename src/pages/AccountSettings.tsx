import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Settings, User, Bell, Shield, LogOut, Save, Mail, Lock, CreditCard, Smartphone } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import SafetyFooter from '../components/SafetyFooter'
import InstallAppModal from '../components/InstallAppModal'

export default function AccountSettings() {
  const { user, signOut, subscription, openBillingPortal, changePassword, cancelSubscription, resumeSubscription } = useAuth()
  const navigate = useNavigate()
  const [showInstall, setShowInstall] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [subLoading, setSubLoading] = useState(false)
  const [subError, setSubError] = useState('')

  const formatEndsAt = (iso?: string | null) => {
    if (!iso) return null
    const d = new Date(iso)
    return isNaN(d.getTime()) ? null : d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const handleCancel = async () => {
    setSubError('')
    setSubLoading(true)
    const result = await cancelSubscription()
    setSubLoading(false)
    if (result.ok) {
      setShowCancelConfirm(false)
    } else {
      setSubError(result.error || 'Could not cancel membership')
    }
  }

  const handleResume = async () => {
    setSubError('')
    setSubLoading(true)
    const result = await resumeSubscription()
    setSubLoading(false)
    if (!result.ok) {
      setSubError(result.error || 'Could not resume membership')
    }
  }
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [notifications, setNotifications] = useState(true)
  const [saved, setSaved] = useState(false)

  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwError('')
    setPwSuccess(false)
    if (newPassword.length < 8) {
      setPwError('New password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match')
      return
    }
    setPwLoading(true)
    const result = await changePassword(currentPassword, newPassword)
    setPwLoading(false)
    if (result.ok) {
      setPwSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setShowPasswordForm(false)
    } else {
      setPwError(result.error || 'Could not change password')
    }
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-blue-bg via-white to-healing-purple/5 flex flex-col">
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-charcoal hover:text-slate-blue">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-blue" />
              Account Settings
            </h1>
          </div>
        </div>
      </div>

      <InstallAppModal open={showInstall} onClose={() => setShowInstall(false)} />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Install App */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-charcoal flex items-center gap-2 mb-2">
              <Smartphone className="w-5 h-5 text-slate-blue" />
              Install App
            </h3>
            <p className="text-sm text-charcoal-70 mb-4">
              Add The Healing Home Approach to your phone's Home Screen for quick access.
            </p>
            <button
              onClick={() => setShowInstall(true)}
              className="w-full bg-slate-blue text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-blue-dark transition-colors"
            >
              Add to Home Screen
            </button>
          </div>

          {/* Profile */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-charcoal flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-slate-blue" />
              Profile
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  <Mail className="w-3 h-3 inline mr-1" /> Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-charcoal flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-slate-blue" />
              Notifications
            </h3>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-charcoal-80">Email notifications for new content</span>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-11 h-6 rounded-full transition-colors ${notifications ? 'bg-growth-green' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
              </button>
            </label>
          </div>

          {/* Subscription & Billing */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-charcoal flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-slate-blue" />
              Subscription &amp; Billing
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-charcoal-80">Status</span>
                <span className={`text-sm font-medium ${subscription.has_access ? 'text-growth-green' : 'text-red-500'}`}>
                  {subscription.status === 'active' ? 'Active' :
                   subscription.status === 'past_due' ? 'Past Due' :
                   subscription.status === 'canceled' ? 'Canceled' : 'None'}
                </span>
              </div>

              {subError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {subError}
                </div>
              )}

              {subscription.has_access && !subscription.is_admin && subscription.cancel_at_period_end && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                  Your membership is set to cancel
                  {formatEndsAt(subscription.ends_at) ? ` on ${formatEndsAt(subscription.ends_at)}` : ' at the end of your billing period'}.
                  You'll keep full access until then.
                </div>
              )}

              {subscription.is_admin && (
                <p className="text-sm text-charcoal-70">
                  You have admin access. No membership or billing applies to your account.
                </p>
              )}

              {subscription.has_access && !subscription.is_admin && (
                <>
                  <button
                    disabled={subLoading}
                    onClick={async () => {
                      setSubError('')
                      setSubLoading(true)
                      const result = await openBillingPortal()
                      setSubLoading(false)
                      if (result.url) {
                        window.location.href = result.url
                      } else {
                        setSubError(result.error || 'Could not open billing portal')
                      }
                    }}
                    className="w-full bg-gray-50 text-charcoal py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors border border-gray-200 disabled:opacity-50"
                  >
                    {subLoading ? 'Opening…' : 'Manage Billing'}
                  </button>

                  {subscription.cancel_at_period_end ? (
                    <button
                      onClick={handleResume}
                      disabled={subLoading}
                      className="w-full bg-slate-blue text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-blue-dark transition-colors disabled:opacity-50"
                    >
                      {subLoading ? 'Working...' : 'Resume Membership'}
                    </button>
                  ) : !showCancelConfirm ? (
                    <button
                      onClick={() => { setShowCancelConfirm(true); setSubError('') }}
                      className="w-full text-red-600 py-2.5 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors border border-red-200"
                    >
                      Cancel Membership
                    </button>
                  ) : (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
                      <p className="text-sm text-charcoal-80">
                        Cancel your membership? You'll keep full access until the end of your
                        current billing period, then it won't renew.
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleCancel}
                          disabled={subLoading}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          {subLoading ? 'Canceling...' : 'Yes, cancel'}
                        </button>
                        <button
                          onClick={() => setShowCancelConfirm(false)}
                          disabled={subLoading}
                          className="text-sm text-charcoal-70 hover:text-charcoal font-medium"
                        >
                          Keep membership
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {!subscription.has_access && (
                <Link
                  to="/access-gate"
                  className="block w-full bg-slate-blue text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-blue-dark transition-colors text-center"
                >
                  Subscribe — $9.99/month
                </Link>
              )}
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-charcoal flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-slate-blue" />
              Security
            </h3>
            {pwSuccess && !showPasswordForm && (
              <p className="text-sm text-growth-green font-medium mb-2">Password updated.</p>
            )}
            {!showPasswordForm ? (
              <button
                onClick={() => { setShowPasswordForm(true); setPwSuccess(false) }}
                className="text-sm text-slate-blue font-medium hover:text-slate-blue-dark transition-colors"
              >
                Change Password
              </button>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-3">
                {pwError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {pwError}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Current password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">New password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none"
                    required
                    minLength={8}
                  />
                  <p className="text-xs text-charcoal-70 mt-1">Minimum 8 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Confirm new password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none"
                    required
                    minLength={8}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={pwLoading}
                    className="bg-slate-blue text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-blue-dark transition-colors disabled:opacity-50"
                  >
                    {pwLoading ? 'Updating...' : 'Update Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false)
                      setPwError('')
                      setCurrentPassword('')
                      setNewPassword('')
                      setConfirmPassword('')
                    }}
                    className="text-sm text-charcoal-70 hover:text-charcoal font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Disclaimer */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-charcoal flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-slate-blue" />
              Disclaimer Status
            </h3>
            <p className="text-sm text-charcoal-80 mb-2">
              Disclaimer accepted: <span className="text-growth-green font-medium">Yes</span>
            </p>
            <p className="text-xs text-charcoal-70">
              Accepted on: {localStorage.getItem('disclaimerTimestamp') || 'N/A'}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-slate-blue text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-blue-dark transition-colors"
            >
              <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save Changes'}
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </main>

      <SafetyFooter />
    </div>
  )
}
