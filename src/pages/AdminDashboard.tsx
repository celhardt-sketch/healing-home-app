import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, Bell, Video, Mail, Webhook, FileText, BookOpen, Printer, Heart, Plus, Trash2, Edit2, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || ''

type Tab = 'first-aid' | 'scripts' | 'learning' | 'printables' | 'users' | 'webhooks' | 'videos' | 'pre-auth' | 'notifications'

const tabs: { id: Tab; label: string; icon: typeof Heart }[] = [
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

function getToken() {
  return localStorage.getItem('auth_token') || ''
}

async function apiGet(path: string) {
  const res = await fetch(`${API_URL}${path}`, { headers: { Authorization: `Bearer ${getToken()}` } })
  if (!res.ok) throw new Error(`${res.status}`)
  return res.json()
}

async function apiPost(path: string, body?: unknown) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(`${res.status}`)
  return res.json()
}

async function apiPut(path: string, body: unknown) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`${res.status}`)
  return res.json()
}

async function apiDelete(path: string) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  if (!res.ok) throw new Error(`${res.status}`)
  return res.json()
}

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(`${API_URL}/api/admin/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  })
  if (!res.ok) throw new Error('Upload failed')
  const data = await res.json()
  return data.file_url
}

export default function AdminDashboard() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('first-aid')

  useEffect(() => {
    if (!isAuthenticated) navigate('/disclaimer')
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/dashboard" className="text-charcoal hover:text-slate-blue">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold font-heading text-charcoal">The Healing Home Approach Admin</h1>
            <p className="text-xs text-charcoal-70">Create, edit, and manage all app content from this dashboard</p>
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex overflow-x-auto gap-1 mb-6 bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id ? 'bg-slate-blue text-white' : 'text-charcoal-70 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          {activeTab === 'first-aid' && <ContentTab table="first_aid_cards" label="First Aid Card" fields={firstAidFields} />}
          {activeTab === 'scripts' && <ContentTab table="scripts" label="Script" fields={scriptFields} />}
          {activeTab === 'learning' && <ContentTab table="articles" label="Article" fields={articleFields} />}
          {activeTab === 'printables' && <ContentTab table="printables" label="Printable" fields={printableFields} />}
          {activeTab === 'videos' && <ContentTab table="videos" label="Video" fields={videoFields} />}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'webhooks' && <WebhooksTab />}
          {activeTab === 'pre-auth' && <PreAuthTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
        </div>
      </div>
    </div>
  )
}

// --- Field definitions for content types ---

interface FieldDef {
  name: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'number' | 'file' | 'checkbox'
  options?: string[]
  required?: boolean
  placeholder?: string
}

const firstAidFields: FieldDef[] = [
  { name: 'title', label: 'Title (Behavior)', type: 'text', required: true, placeholder: 'e.g., Hitting, Running Away, Screaming' },
  { name: 'content', label: 'Card Content', type: 'textarea', required: true, placeholder: 'De-escalation steps, what to say, what to do...' },
  { name: 'age_group', label: 'Age Group', type: 'select', options: ['All Ages', 'Early Childhood', 'Middle Childhood', 'Pre-Adolescence', 'Adolescence'] },
  { name: 'category', label: 'Category', type: 'text', placeholder: 'e.g., Aggression, Flight, Shutdown, Defiance' },
  { name: 'sort_order', label: 'Sort Order', type: 'number' },
  { name: 'active', label: 'Active (visible to users)', type: 'checkbox' },
]

const scriptFields: FieldDef[] = [
  { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'e.g., When Your Child Says "I Hate You"' },
  { name: 'content', label: 'Script Content', type: 'textarea', required: true, placeholder: 'The full script text...' },
  { name: 'category', label: 'Category', type: 'text', placeholder: 'e.g., Defiance, Boundaries, Transitions' },
  { name: 'age_group', label: 'Age Group', type: 'select', options: ['All Ages', 'Early Childhood', 'Middle Childhood', 'Pre-Adolescence', 'Adolescence'] },
  { name: 'situation', label: 'Situation', type: 'text', placeholder: 'When to use this script' },
  { name: 'sort_order', label: 'Sort Order', type: 'number' },
  { name: 'active', label: 'Active (visible to users)', type: 'checkbox' },
]

const articleFields: FieldDef[] = [
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'content', label: 'Article Content', type: 'textarea', required: true, placeholder: 'Full article text...' },
  { name: 'summary', label: 'Summary', type: 'text', placeholder: 'Brief description shown in list view' },
  { name: 'category', label: 'Category', type: 'text', placeholder: 'e.g., Attachment, Regulation, Trauma' },
  { name: 'age_group', label: 'Age Group', type: 'select', options: ['All Ages', 'Early Childhood', 'Middle Childhood', 'Pre-Adolescence', 'Adolescence'] },
  { name: 'author', label: 'Author', type: 'text' },
  { name: 'sort_order', label: 'Sort Order', type: 'number' },
  { name: 'active', label: 'Active (visible to users)', type: 'checkbox' },
]

const printableFields: FieldDef[] = [
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'text', placeholder: 'Brief description' },
  { name: 'file_url', label: 'File', type: 'file', required: true },
  { name: 'file_type', label: 'File Type', type: 'select', options: ['pdf', 'png', 'jpg'] },
  { name: 'category', label: 'Category', type: 'text', placeholder: 'e.g., Worksheets, Charts, Trackers' },
  { name: 'age_group', label: 'Age Group', type: 'select', options: ['All Ages', 'Early Childhood', 'Middle Childhood', 'Pre-Adolescence', 'Adolescence'] },
  { name: 'sort_order', label: 'Sort Order', type: 'number' },
  { name: 'active', label: 'Active (visible to users)', type: 'checkbox' },
]

const videoFields: FieldDef[] = [
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'youtube_url', label: 'YouTube URL', type: 'text', placeholder: 'https://youtube.com/watch?v=...' },
  { name: 'file_url', label: 'MP4 Upload (or use YouTube URL above)', type: 'file' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'creator_name', label: 'Organization / Creator Name', type: 'text' },
  { name: 'section', label: 'Section', type: 'select', options: ['Caregiver Regulation', 'Kids Regulation'] },
  { name: 'category', label: 'Category', type: 'text' },
  { name: 'age_group', label: 'Age Group', type: 'select', options: ['All Ages', 'Younger Kids', 'Older Kids'] },
  { name: 'duration_seconds', label: 'Duration (seconds)', type: 'number' },
  { name: 'tone', label: 'Tone / Style', type: 'select', options: ['Clinical', 'Coaching'] },
  { name: 'level', label: 'Level', type: 'select', options: ['Beginner', 'Intermediate'] },
  { name: 'why_it_helps', label: 'Why It Helps', type: 'textarea', placeholder: 'Brief clinical explanation' },
  { name: 'tags', label: 'Tags (comma-separated)', type: 'text' },
  { name: 'best_for', label: 'Best For (comma-separated)', type: 'text' },
  { name: 'medically_reviewed_by', label: 'Medically Reviewed By', type: 'text' },
  { name: 'review_status', label: 'Review Status', type: 'select', options: ['Draft', 'Reviewed', 'Published'] },
  { name: 'sort_order', label: 'Sort Order', type: 'number' },
  { name: 'active', label: 'Active (visible to users)', type: 'checkbox' },
]

// --- Generic Content CRUD Tab ---

function ContentTab({ table, label, fields }: { table: string; label: string; fields: FieldDef[] }) {
  const [items, setItems] = useState<Array<Record<string, unknown>>>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const fetchItems = useCallback(() => {
    apiGet(`/api/content/${table}`).then(setItems).catch(() => {}).finally(() => setLoading(false))
  }, [table])

  useEffect(() => { fetchItems() }, [fetchItems])

  function openCreate() {
    setEditingId(null)
    const defaults: Record<string, unknown> = {}
    fields.forEach(f => {
      if (f.type === 'checkbox') defaults[f.name] = 1
      else if (f.type === 'number') defaults[f.name] = 0
      else defaults[f.name] = ''
    })
    setFormData(defaults)
    setShowForm(true)
    setMsg('')
  }

  function openEdit(item: Record<string, unknown>) {
    setEditingId(item.id as number)
    setFormData({ ...item })
    setShowForm(true)
    setMsg('')
  }

  async function handleSave() {
    setSaving(true)
    setMsg('')
    try {
      const payload = { ...formData }
      delete payload.id
      delete payload.created_at
      delete payload.updated_at

      // Convert tags/best_for from comma-separated to JSON array strings
      if (typeof payload.tags === 'string' && payload.tags) {
        payload.tags = JSON.stringify((payload.tags as string).split(',').map(s => s.trim()))
      }
      if (typeof payload.best_for === 'string' && payload.best_for) {
        payload.best_for = JSON.stringify((payload.best_for as string).split(',').map(s => s.trim()))
      }

      if (editingId) {
        await apiPut(`/api/admin/content/${table}/${editingId}`, payload)
        setMsg(`${label} updated`)
      } else {
        await apiPost(`/api/admin/content/${table}`, payload)
        setMsg(`${label} created`)
      }
      setShowForm(false)
      fetchItems()
    } catch {
      setMsg('Error saving')
    }
    setSaving(false)
  }

  async function handleDelete(id: number) {
    if (!confirm(`Delete this ${label.toLowerCase()}?`)) return
    try {
      await apiDelete(`/api/admin/content/${table}/${id}`)
      fetchItems()
      setMsg(`${label} deleted`)
    } catch {
      setMsg('Error deleting')
    }
  }

  async function handleFileUpload(fieldName: string, file: File) {
    try {
      const url = await uploadFile(file)
      setFormData(prev => ({ ...prev, [fieldName]: url }))
      setMsg('File uploaded')
    } catch {
      setMsg('Upload failed')
    }
  }

  if (loading) return <p className="text-sm text-charcoal-70">Loading...</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-charcoal">{label} Management</h3>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-4 py-2 bg-slate-blue text-white rounded-lg text-sm font-medium hover:bg-slate-blue-dark">
          <Plus className="w-4 h-4" /> Add {label}
        </button>
      </div>

      {msg && <p className="text-sm text-growth-green mb-4">{msg}</p>}

      {showForm && (
        <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-charcoal">{editingId ? 'Edit' : 'New'} {label}</h4>
            <button onClick={() => setShowForm(false)} className="text-charcoal-70 hover:text-charcoal"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                {field.type === 'checkbox' ? (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!formData[field.name]}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.checked ? 1 : 0 }))}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-charcoal">{field.label}</span>
                  </label>
                ) : field.type === 'file' ? (
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">{field.label}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        onChange={(e) => { if (e.target.files?.[0]) handleFileUpload(field.name, e.target.files[0]) }}
                        className="text-sm"
                      />
                      {formData[field.name] ? (
                        <span className="text-xs text-growth-green">✓ {String(formData[field.name]).split('/').pop()}</span>
                      ) : null}
                    </div>
                  </div>
                ) : field.type === 'textarea' ? (
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">{field.label}</label>
                    <textarea
                      value={String(formData[field.name] || '')}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                      rows={4}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none resize-none"
                    />
                  </div>
                ) : field.type === 'select' ? (
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">{field.label}</label>
                    <select
                      value={String(formData[field.name] || '')}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none"
                    >
                      <option value="">Select...</option>
                      {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">{field.label}</label>
                    <input
                      type={field.type === 'number' ? 'number' : 'text'}
                      value={String(formData[field.name] || '')}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: field.type === 'number' ? Number(e.target.value) : e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-growth-green text-white rounded-lg text-sm font-semibold hover:bg-growth-green/90 disabled:opacity-50">
              {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
            <button onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-gray-200 text-charcoal rounded-lg text-sm font-medium hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-sm text-charcoal-70">No {label.toLowerCase()}s yet. Click "+ Add {label}" to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 font-semibold">Title</th>
                <th className="text-left p-3 font-semibold">Category</th>
                <th className="text-left p-3 font-semibold">Age Group</th>
                <th className="text-left p-3 font-semibold">Status</th>
                <th className="text-left p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id as number} className="border-t border-gray-100">
                  <td className="p-3 font-medium">{String(item.title || '')}</td>
                  <td className="p-3 text-charcoal-70">{String(item.category || '—')}</td>
                  <td className="p-3 text-charcoal-70">{String(item.age_group || '—')}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {item.active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(item)} className="text-slate-blue hover:text-slate-blue-dark">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id as number)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// --- Users Tab ---

function UsersTab() {
  const [users, setUsers] = useState<Array<{ id: number; name: string; email: string; subscription_status: string; created_at: string }>>([])
  const [loading, setLoading] = useState(true)
  const [actionEmail, setActionEmail] = useState('')
  const [actionMsg, setActionMsg] = useState('')

  useEffect(() => {
    apiGet('/api/admin/users').then(setUsers).catch(() => {}).finally(() => setLoading(false))
  }, [])

  async function grantAccess() {
    if (!actionEmail) return
    try {
      await apiPost(`/api/admin/grant-access?email=${encodeURIComponent(actionEmail)}`)
      setActionMsg(`Access granted to ${actionEmail}`)
      setActionEmail('')
      apiGet('/api/admin/users').then(setUsers)
    } catch { setActionMsg('Failed') }
  }

  async function revokeAccess() {
    if (!actionEmail) return
    try {
      await apiPost(`/api/admin/revoke-access?email=${encodeURIComponent(actionEmail)}`)
      setActionMsg(`Access revoked from ${actionEmail}`)
      setActionEmail('')
      apiGet('/api/admin/users').then(setUsers)
    } catch { setActionMsg('Failed') }
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-charcoal mb-4">User Access Management</h3>
      <p className="text-sm text-charcoal-70 mb-4">Stripe Integration: Webhook-based access granting</p>

      <div className="flex gap-2 mb-4">
        <input type="email" value={actionEmail} onChange={(e) => setActionEmail(e.target.value)} placeholder="user@email.com"
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none" />
        <button onClick={grantAccess} className="px-4 py-2 bg-growth-green text-white rounded-lg text-sm font-medium hover:bg-growth-green/90">Grant Access</button>
        <button onClick={revokeAccess} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600">Revoke Access</button>
      </div>

      {actionMsg && <p className="text-sm text-growth-green mb-4">{actionMsg}</p>}

      {loading ? <p className="text-sm text-charcoal-70">Loading...</p> : (
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
                    }`}>{u.subscription_status || 'none'}</span>
                  </td>
                  <td className="p-3 text-charcoal-70">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan={4} className="p-3 text-center text-charcoal-70">No users yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// --- Webhooks Tab ---

function WebhooksTab() {
  const [events, setEvents] = useState<Array<{ event_id: string; event_type: string; processed_at: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiGet('/api/admin/webhook-events').then(setEvents).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h3 className="text-lg font-bold text-charcoal mb-2">Webhook Monitoring</h3>
      <p className="text-sm text-charcoal-70 mb-4">Webhook events will appear here when Stripe sends purchase and subscription notifications.</p>

      {loading ? <p className="text-sm text-charcoal-70">Loading...</p> :
        events.length === 0 ? (
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
        )
      }
    </div>
  )
}

// --- Pre-Auth Tab ---

function PreAuthTab() {
  const [emails, setEmails] = useState<Array<{ email: string; added_at: string; consumed_at: string | null }>>([])
  const [newEmail, setNewEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    apiGet('/api/admin/pre-authorized').then(setEmails).catch(() => {}).finally(() => setLoading(false))
  }, [])

  async function addEmail() {
    if (!newEmail) return
    try {
      await apiPost(`/api/admin/pre-authorize?email=${encodeURIComponent(newEmail)}`)
      setMsg(`Pre-authorized: ${newEmail}`)
      setNewEmail('')
      apiGet('/api/admin/pre-authorized').then(setEmails)
    } catch { setMsg('Failed') }
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-charcoal mb-2">Pre-Authorized Emails</h3>
      <p className="text-sm text-charcoal-70 mb-4">Add emails to pre-authorize access before a user signs up.</p>

      <div className="flex gap-2 mb-4">
        <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="email@example.com"
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none" />
        <button onClick={addEmail} className="px-4 py-2 bg-slate-blue text-white rounded-lg text-sm font-medium hover:bg-slate-blue-dark">Pre-Authorize</button>
      </div>

      {msg && <p className="text-sm text-growth-green mb-4">{msg}</p>}

      {loading ? <p className="text-sm text-charcoal-70">Loading...</p> : (
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
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${e.consumed_at ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {e.consumed_at ? 'Consumed (user signed up)' : 'Waiting for signup'}
                    </span>
                  </td>
                  <td className="p-3 text-charcoal-70">{new Date(e.added_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {emails.length === 0 && <tr><td colSpan={3} className="p-3 text-center text-charcoal-70">No pre-authorized emails yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// --- Notifications Tab ---

function NotificationsTab() {
  const [message, setMessage] = useState('')
  const [link, setLink] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState('')

  async function sendNotification() {
    if (!message.trim()) return
    setSending(true)
    setResult('')
    try {
      const data = await apiPost('/api/admin/notifications/send', { message: message.trim(), link: link.trim() || null })
      setResult(data.message || 'Sent')
      setMessage('')
      setLink('')
    } catch { setResult('Failed') }
    setSending(false)
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-charcoal mb-2">Push Notifications</h3>
      <p className="text-sm text-charcoal-70 mb-4">Compose Notification. This will be sent to all subscribers immediately.</p>

      <div className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">Message</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Type your notification message..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">Link (optional)</label>
          <input type="text" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Leave blank for the dashboard."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none" />
        </div>
        <button onClick={sendNotification} disabled={sending || !message.trim()}
          className="px-6 py-2.5 bg-slate-blue text-white rounded-lg text-sm font-semibold hover:bg-slate-blue-dark transition-colors disabled:opacity-50">
          {sending ? 'Sending...' : 'Send Notification'}
        </button>
        {result && <p className="text-sm text-growth-green">{result}</p>}
      </div>
    </div>
  )
}
