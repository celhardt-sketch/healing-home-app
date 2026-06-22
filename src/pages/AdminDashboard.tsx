import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield, Users, Bell, Video, Mail, Webhook, FileText, BookOpen, Printer, Heart } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || ''

type Tab = 'first-aid' | 'scripts' | 'learning' | 'printables' | 'users' | 'webhooks' | 'videos' | 'pre-auth' | 'notifications'

const tabs: { id: Tab; label: string; icon: typeof Shield }[] = [
  { id: 'first-aid', label: 'First Aid Cards', icon: Heart },
  { id: 'scripts', label: 'Scripts', icon: FileText },
  { id: 'learning', label: 'Learning', icon: BookOpen },
  { id: 'printables', label: 'Printables', icon: Printer },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'webhooks', label: 'Webhooks', icon: Webhook },
  { id: 'videos', label: 'Videos', icon: Video },
  { id: 'pre-auth', label: 'Pre-Auth', icon: Mail },
  { id: 'notifications', label: 'Notifications', icon: Bell },
]

export default function AdminDashboard() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('users')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/disclaimer')
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-charcoal hover:text-slate-blue">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold font-heading text-charcoal">
                The Healing Home Approach Admin
              </h1>
              <p className="text-xs text-charcoal-70">Create, edit, and manage all app content from this dashboard</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-6 max-w-6xl">
        {/* Tabs */}
        <div className="flex overflow-x-auto gap-1 mb-6 bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-slate-blue text-white'
                  : 'text-charcoal-70 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'webhooks' && <WebhooksTab />}
          {activeTab === 'pre-auth' && <PreAuthTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
          {activeTab === 'videos' && <VideosTab />}
          {activeTab === 'first-aid' && <PlaceholderTab name="First Aid Cards" />}
          {activeTab === 'scripts' && <PlaceholderTab name="Scripts" />}
          {activeTab === 'learning' && <PlaceholderTab name="Learning" />}
          {activeTab === 'printables' && <PlaceholderTab name="Printables" />}
        </div>
      </div>
    </div>
  )
}

function PlaceholderTab({ name }: { name: string }) {
  return (
    <div className="text-center py-12 text-charcoal-70">
      <p className="text-lg font-medium mb-2">{name} Management</p>
      <p className="text-sm">Content management for {name.toLowerCase()} will be available here.</p>
    </div>
  )
}

function UsersTab() {
  const [users, setUsers] = useState<Array<{ id: number; name: string; email: string; subscription_status: string; created_at: string }>>([])
  const [loading, setLoading] = useState(true)
  const [actionEmail, setActionEmail] = useState('')
  const [actionMsg, setActionMsg] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    fetch(`${API_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => res.ok ? res.json() : []).then(setUsers).catch(() => {}).finally(() => setLoading(false))
  }, [])

  function fetchUsers() {
    const token = localStorage.getItem('auth_token')
    fetch(`${API_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => res.ok ? res.json() : []).then(setUsers).catch(() => {})
  }

  async function grantAccess() {
    if (!actionEmail) return
    const token = localStorage.getItem('auth_token')
    const res = await fetch(`${API_URL}/api/admin/grant-access?email=${encodeURIComponent(actionEmail)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      setActionMsg(`Access granted to ${actionEmail}`)
      setActionEmail('')
      fetchUsers()
    } else {
      setActionMsg('Failed to grant access')
    }
  }

  async function revokeAccess() {
    if (!actionEmail) return
    const token = localStorage.getItem('auth_token')
    const res = await fetch(`${API_URL}/api/admin/revoke-access?email=${encodeURIComponent(actionEmail)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      setActionMsg(`Access revoked from ${actionEmail}`)
      setActionEmail('')
      fetchUsers()
    } else {
      setActionMsg('Failed to revoke access')
    }
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-charcoal mb-4">User Access Management</h3>
      <p className="text-sm text-charcoal-70 mb-4">Stripe Integration: Webhook-based access granting</p>

      <div className="flex gap-2 mb-4">
        <input
          type="email"
          value={actionEmail}
          onChange={(e) => setActionEmail(e.target.value)}
          placeholder="user@email.com"
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none"
        />
        <button onClick={grantAccess} className="px-4 py-2 bg-growth-green text-white rounded-lg text-sm font-medium hover:bg-growth-green/90">
          Grant Access
        </button>
        <button onClick={revokeAccess} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600">
          Revoke Access
        </button>
      </div>

      {actionMsg && <p className="text-sm text-growth-green mb-4">{actionMsg}</p>}

      {loading ? (
        <p className="text-sm text-charcoal-70">Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 font-semibold">Name</th>
                <th className="text-left p-3 font-semibold">Email</th>
                <th className="text-left p-3 font-semibold">Status</th>
                <th className="text-left p-3 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-gray-100">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      u.subscription_status === 'active' ? 'bg-green-100 text-green-700' :
                      u.subscription_status === 'past_due' ? 'bg-yellow-100 text-yellow-700' :
                      u.subscription_status === 'canceled' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {u.subscription_status || 'none'}
                    </span>
                  </td>
                  <td className="p-3 text-charcoal-70">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={4} className="p-3 text-center text-charcoal-70">No users yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function WebhooksTab() {
  const [events, setEvents] = useState<Array<{ event_id: string; event_type: string; processed_at: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    fetch(`${API_URL}/api/admin/webhook-events`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => res.ok ? res.json() : []).then(setEvents).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h3 className="text-lg font-bold text-charcoal mb-2">Webhook Monitoring</h3>
      <p className="text-sm text-charcoal-70 mb-4">
        Webhook events will appear here when Stripe sends purchase and subscription notifications
        (for example: new subscription, cancellation, or failed payment).
      </p>

      {loading ? (
        <p className="text-sm text-charcoal-70">Loading events...</p>
      ) : events.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Webhook className="w-8 h-8 text-charcoal-70 mx-auto mb-2" />
          <p className="text-sm text-charcoal-70">No webhook events received yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 font-semibold">Event Type</th>
                <th className="text-left p-3 font-semibold">Event ID</th>
                <th className="text-left p-3 font-semibold">Processed</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.event_id} className="border-t border-gray-100">
                  <td className="p-3 font-mono text-xs">{e.event_type}</td>
                  <td className="p-3 font-mono text-xs text-charcoal-70">{e.event_id}</td>
                  <td className="p-3 text-charcoal-70">{new Date(e.processed_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function PreAuthTab() {
  const [emails, setEmails] = useState<Array<{ email: string; added_at: string; consumed_at: string | null }>>([])
  const [newEmail, setNewEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    fetch(`${API_URL}/api/admin/pre-authorized`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => res.ok ? res.json() : []).then(setEmails).catch(() => {}).finally(() => setLoading(false))
  }, [])

  function fetchEmails() {
    const token = localStorage.getItem('auth_token')
    fetch(`${API_URL}/api/admin/pre-authorized`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => res.ok ? res.json() : []).then(setEmails).catch(() => {})
  }

  async function addEmail() {
    if (!newEmail) return
    const token = localStorage.getItem('auth_token')
    const res = await fetch(`${API_URL}/api/admin/pre-authorize?email=${encodeURIComponent(newEmail)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      setMsg(`Pre-authorized: ${newEmail}`)
      setNewEmail('')
      fetchEmails()
    } else {
      setMsg('Failed to pre-authorize')
    }
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-charcoal mb-2">Pre-Authorized Emails</h3>
      <p className="text-sm text-charcoal-70 mb-4">
        Add emails to pre-authorize access before a user signs up.
      </p>

      <div className="flex gap-2 mb-4">
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="email@example.com"
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none"
        />
        <button onClick={addEmail} className="px-4 py-2 bg-slate-blue text-white rounded-lg text-sm font-medium hover:bg-slate-blue-dark">
          Pre-Authorize
        </button>
      </div>

      {msg && <p className="text-sm text-growth-green mb-4">{msg}</p>}

      {loading ? (
        <p className="text-sm text-charcoal-70">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 font-semibold">Email</th>
                <th className="text-left p-3 font-semibold">Status</th>
                <th className="text-left p-3 font-semibold">Added</th>
              </tr>
            </thead>
            <tbody>
              {emails.map((e) => (
                <tr key={e.email} className="border-t border-gray-100">
                  <td className="p-3">{e.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      e.consumed_at ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {e.consumed_at ? 'Consumed (user signed up)' : 'Waiting for signup'}
                    </span>
                  </td>
                  <td className="p-3 text-charcoal-70">{new Date(e.added_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {emails.length === 0 && (
                <tr><td colSpan={3} className="p-3 text-center text-charcoal-70">No pre-authorized emails yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function NotificationsTab() {
  const [message, setMessage] = useState('')
  const [link, setLink] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState('')

  async function sendNotification() {
    if (!message.trim()) return
    setSending(true)
    setResult('')

    const token = localStorage.getItem('auth_token')
    try {
      const res = await fetch(`${API_URL}/api/admin/notifications/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: message.trim(), link: link.trim() || null }),
      })
      if (res.ok) {
        const data = await res.json()
        setResult(data.message || 'Notification sent successfully')
        setMessage('')
        setLink('')
      } else {
        setResult('Failed to send notification')
      }
    } catch {
      setResult('Network error')
    }
    setSending(false)
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-charcoal mb-2">Push Notifications</h3>
      <p className="text-sm text-charcoal-70 mb-4">
        Compose Notification. This will be sent to all subscribers immediately.
      </p>

      <div className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Type your notification message..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Link (optional)
          </label>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Where to take the user when they tap. Leave blank for the dashboard."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none"
          />
        </div>
        <button
          onClick={sendNotification}
          disabled={sending || !message.trim()}
          className="px-6 py-2.5 bg-slate-blue text-white rounded-lg text-sm font-semibold hover:bg-slate-blue-dark transition-colors disabled:opacity-50"
        >
          {sending ? 'Sending...' : 'Send Notification'}
        </button>
        {result && <p className="text-sm text-growth-green">{result}</p>}
      </div>
    </div>
  )
}

function VideosTab() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-charcoal">YouTube Video Management</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-slate-blue text-white rounded-lg text-sm font-medium hover:bg-slate-blue-dark"
        >
          {showForm ? 'Cancel' : '+ Add Video'}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 rounded-xl p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Title</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">YouTube URL</label>
              <input type="url" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Organization / Creator Name</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Section</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option>Caregiver Regulation</option>
                <option>Kids Regulation</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Category</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Age Group</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option>All Ages</option>
                <option>Younger Kids</option>
                <option>Older Kids</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Duration (seconds)</label>
              <input type="number" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Tone / Style</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option>Clinical</option>
                <option>Coaching</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Level</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option>Beginner</option>
                <option>Intermediate</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Sort Order</label>
              <input type="number" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Review Status</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option>Draft</option>
                <option>Reviewed</option>
                <option>Published</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="active" className="rounded" defaultChecked />
              <label htmlFor="active" className="text-sm font-medium text-charcoal">Active (visible to users)</label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Description (optional)</label>
            <textarea rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Why It Helps</label>
            <textarea rows={2} placeholder="Brief clinical explanation of why this technique works" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Tags (comma-separated)</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Best For (comma-separated)</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Medically Reviewed By</label>
            <input type="text" placeholder="Name or credential" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <button className="px-6 py-2.5 bg-growth-green text-white rounded-lg text-sm font-semibold hover:bg-growth-green/90">
            Save Video
          </button>
        </div>
      )}

      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <Video className="w-8 h-8 text-charcoal-70 mx-auto mb-2" />
        <p className="text-sm text-charcoal-70">No videos added yet. Click "+ Add Video" to get started.</p>
      </div>
    </div>
  )
}
