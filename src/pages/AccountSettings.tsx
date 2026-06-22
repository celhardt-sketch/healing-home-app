import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Settings, User, Bell, Shield, LogOut, Save, Mail, Lock, CreditCard } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import SafetyFooter from '../components/SafetyFooter'

export default function AccountSettings() {
  const { user, signOut, subscription, openBillingPortal } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [notifications, setNotifications] = useState(true)
  const [saved, setSaved] = useState(false)

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

      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
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
              {subscription.has_access && (
                <button
                  onClick={async () => {
                    const url = await openBillingPortal()
                    if (url) window.location.href = url
                  }}
                  className="w-full bg-gray-50 text-charcoal py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  Manage Billing
                </button>
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
            <button className="text-sm text-slate-blue font-medium hover:text-slate-blue-dark transition-colors">
              Change Password
            </button>
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
