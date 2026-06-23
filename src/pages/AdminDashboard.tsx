import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, Bell, Video, Mail, Webhook, FileText, BookOpen, Printer, Heart, Plus, Trash2, Edit2, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || ''

type Tab = 'first-aid' | 'scripts' | 'learning' | 'printables' | 'users' | 'webhooks' | 'videos' | 'pre-auth' | 'notifications' | 'pages'

const tabs: { id: Tab; label: string; icon: typeof Heart }[] = [
  { id: 'first-aid', label: 'First Aid Cards', icon: Heart },
  { id: 'scripts', label: 'Scripts', icon: FileText },
  { id: 'learning', label: 'Learning', icon: BookOpen },
  { id: 'printables', label: 'Printables', icon: Printer },
  { id: 'videos', label: 'Videos', icon: Video },
  { id: 'pages', label: 'Pages', icon: FileText },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'webhooks', label: 'Webhooks', icon: Webhook },
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
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      navigate('/disclaimer')
      return
    }
    apiGet('/api/me/admin-status')
      .then((data) => setIsAdmin(data.is_admin))
      .catch(() => setIsAdmin(false))
  }, [isAuthenticated, navigate])

  if (isAdmin === null) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-sm text-charcoal-70">Loading...</p></div>
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center max-w-md">
          <h2 className="text-xl font-bold font-heading text-charcoal mb-2">Access Denied</h2>
          <p className="text-sm text-charcoal-70 mb-4">This page is restricted to administrators only.</p>
          <Link to="/dashboard" className="text-slate-blue hover:underline text-sm font-medium">Back to Dashboard</Link>
        </div>
      </div>
    )
  }

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
          {activeTab === 'first-aid' && <ContentTab table="first_aid_cards" label="First Aid Card" fields={firstAidFields} previewType="first-aid" />}
          {activeTab === 'scripts' && <ContentTab table="scripts" label="Script" fields={scriptFields} previewType="script" />}
          {activeTab === 'learning' && <ContentTab table="articles" label="Article" fields={articleFields} previewType="article" />}
          {activeTab === 'printables' && <ContentTab table="printables" label="Printable" fields={printableFields} previewType="printable" />}
          {activeTab === 'videos' && <ContentTab table="videos" label="Video" fields={videoFields} previewType="video" />}
          {activeTab === 'pages' && <PagesTab />}
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
  { name: 'video_url', label: 'Video Link (YouTube or MP4 URL)', type: 'text', placeholder: 'https://youtube.com/watch?v=... or uploaded MP4 URL' },
  { name: 'sort_order', label: 'Sort Order', type: 'number' },
  { name: 'active', label: 'Active (visible to users)', type: 'checkbox' },
]

const scriptFields: FieldDef[] = [
  { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'e.g., When Your Child Says "I Hate You"' },
  { name: 'content', label: 'Script Content', type: 'textarea', required: true, placeholder: 'The full script text...' },
  { name: 'category', label: 'Category', type: 'text', placeholder: 'e.g., Defiance, Boundaries, Transitions' },
  { name: 'age_group', label: 'Age Group', type: 'select', options: ['All Ages', 'Early Childhood', 'Middle Childhood', 'Pre-Adolescence', 'Adolescence'] },
  { name: 'situation', label: 'Situation', type: 'text', placeholder: 'When to use this script' },
  { name: 'video_url', label: 'Video Link (YouTube or MP4 URL)', type: 'text', placeholder: 'https://youtube.com/watch?v=...' },
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
  { name: 'video_url', label: 'Video Link (YouTube or MP4 URL)', type: 'text', placeholder: 'https://youtube.com/watch?v=...' },
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

function ContentPreview({ item, type }: { item: Record<string, unknown>; type: string }) {
  const videoUrl = item.video_url as string
  return (
    <div className="border border-blue-200 rounded-xl p-4 bg-blue-50/30">
      <p className="text-xs text-slate-blue font-semibold mb-2 uppercase tracking-wide">App Preview</p>
      {type === 'first-aid' && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-healing-purple" />
            <h4 className="font-bold text-charcoal font-heading text-sm">{String(item.title || 'Card Title')}</h4>
          </div>
          {!!item.category && <span className="text-xs bg-healing-purple/10 text-healing-purple px-2 py-0.5 rounded-full">{String(item.category)}</span>}
          {!!item.age_group && <span className="text-xs bg-sky-blue-bg text-slate-blue px-2 py-0.5 rounded-full ml-1">{String(item.age_group)}</span>}
          <p className="text-xs text-charcoal-80 mt-2 whitespace-pre-wrap line-clamp-4">{String(item.content || 'Card content will appear here...')}</p>
          {videoUrl && <p className="text-xs text-slate-blue mt-2 flex items-center gap-1"><Video className="w-3 h-3" /> Video attached</p>}
        </div>
      )}
      {type === 'script' && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <h4 className="font-bold text-charcoal font-heading text-sm mb-1">{String(item.title || 'Script Title')}</h4>
          {!!item.situation && <p className="text-xs text-charcoal-70 italic mb-2">Situation: {String(item.situation)}</p>}
          <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-slate-blue">
            <p className="text-xs text-charcoal whitespace-pre-wrap line-clamp-4">{String(item.content || 'Script content...')}</p>
          </div>
          {videoUrl && <p className="text-xs text-slate-blue mt-2 flex items-center gap-1"><Video className="w-3 h-3" /> Video attached</p>}
        </div>
      )}
      {type === 'article' && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <h4 className="font-bold text-charcoal font-heading text-sm">{String(item.title || 'Article Title')}</h4>
          {!!item.author && <p className="text-xs text-charcoal-70 mt-0.5">by {String(item.author)}</p>}
          {!!item.summary && <p className="text-xs text-charcoal-80 mt-2 italic">{String(item.summary)}</p>}
          <p className="text-xs text-charcoal-80 mt-2 whitespace-pre-wrap line-clamp-3">{String(item.content || 'Article content...')}</p>
          {videoUrl && <p className="text-xs text-slate-blue mt-2 flex items-center gap-1"><Video className="w-3 h-3" /> Video attached</p>}
        </div>
      )}
      {type === 'printable' && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h4 className="font-bold text-charcoal text-sm">{String(item.title || 'Printable Title')}</h4>
            <p className="text-xs text-charcoal-70">{String(item.description || 'Description...')}</p>
          </div>
        </div>
      )}
      {type === 'video' && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center mb-2">
            <Video className="w-8 h-8 text-white/70" />
          </div>
          <h4 className="font-bold text-charcoal text-sm">{String(item.title || 'Video Title')}</h4>
          {!!item.creator_name && <p className="text-xs text-charcoal-70">{String(item.creator_name)}</p>}
          {!!item.why_it_helps && <p className="text-xs text-charcoal-80 mt-1 italic">{String(item.why_it_helps)}</p>}
        </div>
      )}
    </div>
  )
}

function ContentTab({ table, label, fields, previewType }: { table: string; label: string; fields: FieldDef[]; previewType: string }) {
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
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
                            <span className="text-xs text-growth-green">Uploaded</span>
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
            <div className="lg:col-span-1">
              <ContentPreview item={formData} type={previewType} />
            </div>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-sm text-charcoal-70">No {label.toLowerCase()}s yet. Click "+ Add {label}" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id as number} className="relative group">
              <ContentPreview item={item} type={previewType} />
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {item.active ? 'Active' : 'Hidden'}
                </span>
                <button onClick={() => openEdit(item)} className="p-1 bg-white rounded shadow text-slate-blue hover:text-slate-blue-dark">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(item.id as number)} className="p-1 bg-white rounded shadow text-red-500 hover:text-red-700">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
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

// --- Pages Tab (editable static content) ---

const PAGE_DEFINITIONS: { page: string; label: string; sections: { section: string; label: string; type: string }[] }[] = [
  {
    page: 'landing', label: 'Landing Page', sections: [
      { section: 'hero_title', label: 'Hero Title', type: 'text' },
      { section: 'hero_subtitle', label: 'Hero Subtitle', type: 'text' },
      { section: 'hero_description', label: 'Hero Description', type: 'textarea' },
      { section: 'features_heading', label: 'Features Heading', type: 'text' },
      { section: 'features_list', label: 'Features List (one per line)', type: 'textarea' },
    ]
  },
  {
    page: 'dashboard', label: 'Dashboard Page', sections: [
      { section: 'welcome_title', label: 'Welcome Title', type: 'text' },
      { section: 'welcome_message', label: 'Welcome Message', type: 'textarea' },
      { section: 'quick_links_heading', label: 'Quick Links Heading', type: 'text' },
    ]
  },
  {
    page: 'crisis', label: 'Crisis / First Aid Page', sections: [
      { section: 'page_title', label: 'Page Title', type: 'text' },
      { section: 'page_description', label: 'Page Description', type: 'textarea' },
      { section: 'emergency_note', label: 'Emergency Contact Note', type: 'textarea' },
    ]
  },
  {
    page: 'caregiver', label: 'Caregiver Support Page', sections: [
      { section: 'page_title', label: 'Page Title', type: 'text' },
      { section: 'page_description', label: 'Page Description', type: 'textarea' },
      { section: 'intro_text', label: 'Intro Text', type: 'textarea' },
    ]
  },
  {
    page: 'learning', label: 'Learning Library Page', sections: [
      { section: 'page_title', label: 'Page Title', type: 'text' },
      { section: 'page_description', label: 'Page Description', type: 'textarea' },
    ]
  },
  {
    page: 'kids_tools', label: 'Kids Regulation Tools Page', sections: [
      { section: 'page_title', label: 'Page Title', type: 'text' },
      { section: 'page_description', label: 'Page Description', type: 'textarea' },
    ]
  },
]

function PagesTab() {
  const [activePage, setActivePage] = useState(PAGE_DEFINITIONS[0].page)
  const [content, setContent] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(true)

  const pageDef = PAGE_DEFINITIONS.find(p => p.page === activePage)!

  function switchPage(page: string) {
    setActivePage(page)
    setContent({})
    setMsg('')
    setLoading(true)
  }

  useEffect(() => {
    let cancelled = false
    apiGet(`/api/page-content/${activePage}`)
      .then((data: Array<{ section: string; content: string }>) => {
        if (cancelled) return
        const map: Record<string, string> = {}
        data.forEach(d => { map[d.section] = d.content })
        setContent(map)
      })
      .catch(() => { if (!cancelled) setContent({}) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [activePage])

  async function saveSection(section: string) {
    setSaving(true)
    setMsg('')
    try {
      await apiPost('/api/admin/page-content', {
        page: activePage,
        section,
        content: content[section] || '',
        content_type: 'text',
      })
      setMsg(`Saved: ${section}`)
    } catch {
      setMsg('Error saving')
    }
    setSaving(false)
  }

  async function saveAll() {
    setSaving(true)
    setMsg('')
    try {
      for (const sec of pageDef.sections) {
        await apiPost('/api/admin/page-content', {
          page: activePage,
          section: sec.section,
          content: content[sec.section] || '',
          content_type: sec.type === 'textarea' ? 'richtext' : 'text',
        })
      }
      setMsg('All sections saved!')
    } catch {
      setMsg('Error saving')
    }
    setSaving(false)
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-charcoal mb-2">Page Content Editor</h3>
      <p className="text-sm text-charcoal-70 mb-4">Edit the text content on each page of the app. Changes show up immediately.</p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {PAGE_DEFINITIONS.map(p => (
          <button
            key={p.page}
            onClick={() => switchPage(p.page)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activePage === p.page ? 'bg-slate-blue text-white' : 'bg-gray-100 text-charcoal-70 hover:bg-gray-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading ? <p className="text-sm text-charcoal-70">Loading...</p> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-charcoal text-sm">Edit Sections</h4>
            {pageDef.sections.map(sec => (
              <div key={sec.section} className="border border-gray-200 rounded-lg p-3">
                <label className="block text-sm font-medium text-charcoal mb-1">{sec.label}</label>
                {sec.type === 'textarea' ? (
                  <textarea
                    value={content[sec.section] || ''}
                    onChange={(e) => setContent(prev => ({ ...prev, [sec.section]: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none resize-none"
                    placeholder={`Enter ${sec.label.toLowerCase()}...`}
                  />
                ) : (
                  <input
                    type="text"
                    value={content[sec.section] || ''}
                    onChange={(e) => setContent(prev => ({ ...prev, [sec.section]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none"
                    placeholder={`Enter ${sec.label.toLowerCase()}...`}
                  />
                )}
                <button
                  onClick={() => saveSection(sec.section)}
                  disabled={saving}
                  className="mt-1 text-xs text-slate-blue hover:underline disabled:opacity-50"
                >
                  Save this section
                </button>
              </div>
            ))}
            <button onClick={saveAll} disabled={saving} className="px-6 py-2.5 bg-growth-green text-white rounded-lg text-sm font-semibold hover:bg-growth-green/90 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save All Sections'}
            </button>
            {msg && <p className="text-sm text-growth-green">{msg}</p>}
          </div>

          <div>
            <h4 className="font-semibold text-charcoal text-sm mb-2">Page Preview</h4>
            <div className="border border-blue-200 rounded-xl p-4 bg-blue-50/30">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-3">
                {pageDef.sections.map(sec => {
                  const val = content[sec.section]
                  if (!val) return null
                  if (sec.section.includes('title') || sec.section.includes('heading')) {
                    return <h3 key={sec.section} className="font-bold font-heading text-charcoal text-lg">{val}</h3>
                  }
                  if (sec.section.includes('subtitle')) {
                    return <p key={sec.section} className="text-sm text-charcoal-80 font-medium">{val}</p>
                  }
                  return <p key={sec.section} className="text-sm text-charcoal-70 whitespace-pre-wrap">{val}</p>
                })}
                {Object.values(content).every(v => !v) && (
                  <p className="text-sm text-charcoal-70 italic">Enter content on the left to see a preview here.</p>
                )}
              </div>
            </div>
          </div>
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
