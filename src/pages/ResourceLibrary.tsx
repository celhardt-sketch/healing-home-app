import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Library,
  ChevronDown,
  ChevronUp,
  Upload,
  FileText,
  Trash2,
  Download,
  X,
  Briefcase,
  Users,
  Heart,
  Home,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import SafetyFooter from '../components/SafetyFooter'

const API_URL = import.meta.env.VITE_API_URL || ''

interface Resource {
  id: number
  section: string
  category: string
  title: string
  original_filename: string
  uploaded_at: string
}

const SECTIONS = [
  {
    id: 'professionals',
    label: 'For Professionals',
    icon: Briefcase,
    gradient: 'from-slate-blue to-slate-blue-dark',
    color: 'text-slate-blue bg-sky-blue-bg',
  },
  {
    id: 'foster-adoptive',
    label: 'For Foster & Adoptive Parents',
    icon: Users,
    gradient: 'from-healing-purple to-healing-purple-dark',
    color: 'text-healing-purple bg-healing-purple/10',
  },
  {
    id: 'kinship',
    label: 'For Kinship Parents',
    icon: Heart,
    gradient: 'from-growth-green to-growth-green-dark',
    color: 'text-growth-green-dark bg-growth-green/10',
  },
  {
    id: 'biological',
    label: 'For Biological Parents',
    icon: Home,
    gradient: 'from-sky-blue to-slate-blue',
    color: 'text-sky-blue bg-sky-blue-bg',
  },
]

const CATEGORIES = [
  { id: 'articles', label: 'Articles' },
  { id: 'behavior-support', label: 'Behavior Support' },
  { id: 'mental-health', label: 'Mental Health' },
  { id: 'policy', label: 'Policy' },
  { id: 'research', label: 'Research' },
  { id: 'resources', label: 'Resources' },
]

export default function ResourceLibrary() {
  const { isAuthenticated } = useAuth()
  const [resources, setResources] = useState<Resource[]>([])
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadSection, setUploadSection] = useState('')
  const [uploadCategory, setUploadCategory] = useState('')
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`${API_URL}/api/resources`)
        if (res.ok && !cancelled) {
          const data = await res.json()
          setResources(data)
        }
      } catch {
        // Network error — resources just won't load
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  async function fetchResources() {
    try {
      const res = await fetch(`${API_URL}/api/resources`)
      if (res.ok) {
        const data = await res.json()
        setResources(data)
      }
    } catch {
      // Network error
    }
  }

  function getResourcesFor(sectionId: string, categoryId: string): Resource[] {
    return resources.filter(
      (r) => r.section === sectionId && r.category === categoryId
    )
  }

  function openUploadModal(sectionId: string, categoryId: string) {
    setUploadSection(sectionId)
    setUploadCategory(categoryId)
    setUploadTitle('')
    setUploadFile(null)
    setUploadError('')
    setShowUploadModal(true)
  }

  async function handleUpload() {
    if (!uploadFile || !uploadTitle.trim()) {
      setUploadError('Please provide a title and select a PDF file.')
      return
    }

    setUploading(true)
    setUploadError('')

    const token = localStorage.getItem('auth_token')
    const formData = new FormData()
    formData.append('section', uploadSection)
    formData.append('category', uploadCategory)
    formData.append('title', uploadTitle.trim())
    formData.append('file', uploadFile)

    try {
      const res = await fetch(`${API_URL}/api/resources`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (res.ok) {
        setShowUploadModal(false)
        await fetchResources()
      } else {
        const err = await res.json()
        setUploadError(err.detail || 'Upload failed')
      }
    } catch {
      setUploadError('Network error — please try again')
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(resourceId: number) {
    if (!confirm('Are you sure you want to delete this resource?')) return

    const token = localStorage.getItem('auth_token')
    try {
      const res = await fetch(`${API_URL}/api/resources/${resourceId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        await fetchResources()
      }
    } catch {
      // Network error
    }
  }

  function toggleSection(sectionId: string) {
    if (expandedSection === sectionId) {
      setExpandedSection(null)
      setExpandedCategory(null)
    } else {
      setExpandedSection(sectionId)
      setExpandedCategory(null)
    }
  }

  function toggleCategory(key: string) {
    setExpandedCategory(expandedCategory === key ? null : key)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-healing-purple/5 via-white to-sky-blue-bg flex flex-col">
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/dashboard" className="text-charcoal hover:text-slate-blue">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2">
            <Library className="w-5 h-5 text-slate-blue" />
            Resource Library
          </h1>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold font-heading text-charcoal mb-2">
            Resource Library
          </h2>
          <p className="text-charcoal-80">
            Downloadable PDFs organized by audience and topic. Upload new resources as you go.
          </p>
        </div>

        <div className="space-y-4">
          {SECTIONS.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 bg-gradient-to-r ${section.gradient} rounded-lg flex items-center justify-center`}
                  >
                    <section.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal">{section.label}</h3>
                    <p className="text-xs text-charcoal-70">
                      {resources.filter((r) => r.section === section.id).length}{' '}
                      resource
                      {resources.filter((r) => r.section === section.id).length !== 1
                        ? 's'
                        : ''}
                    </p>
                  </div>
                </div>
                {expandedSection === section.id ? (
                  <ChevronUp className="w-5 h-5 text-charcoal-70" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-charcoal-70" />
                )}
              </button>

              {expandedSection === section.id && (
                <div className="border-t border-gray-100 px-6 pb-6 space-y-2">
                  {CATEGORIES.map((cat) => {
                    const catKey = `${section.id}__${cat.id}`
                    const catResources = getResourcesFor(section.id, cat.id)
                    return (
                      <div key={catKey} className="pt-2">
                        <button
                          onClick={() => toggleCategory(catKey)}
                          className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-charcoal">
                              {cat.label}
                            </span>
                            <span className="text-xs text-charcoal-70 bg-gray-100 rounded-full px-2 py-0.5">
                              {catResources.length}
                            </span>
                          </div>
                          {expandedCategory === catKey ? (
                            <ChevronUp className="w-4 h-4 text-charcoal-70" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-charcoal-70" />
                          )}
                        </button>

                        {expandedCategory === catKey && (
                          <div className="mt-2 space-y-2 pl-4">
                            {catResources.length === 0 && (
                              <p className="text-sm text-charcoal-70 italic py-2">
                                No resources uploaded yet.
                              </p>
                            )}
                            {catResources.map((resource) => (
                              <div
                                key={resource.id}
                                className="flex items-center justify-between bg-sky-blue-bg rounded-lg px-4 py-3"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <FileText className="w-5 h-5 text-slate-blue shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-charcoal truncate">
                                      {resource.title}
                                    </p>
                                    <p className="text-xs text-charcoal-70 truncate">
                                      {resource.original_filename}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0 ml-2">
                                  <a
                                    href={`${API_URL}/api/resources/${resource.id}/download`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-slate-blue hover:text-slate-blue-dark transition-colors"
                                    title="Download"
                                  >
                                    <Download className="w-4 h-4" />
                                  </a>
                                  {isAuthenticated && (
                                    <button
                                      onClick={() => handleDelete(resource.id)}
                                      className="p-2 text-red-400 hover:text-red-600 transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}

                            {isAuthenticated && (
                              <button
                                onClick={() => openUploadModal(section.id, cat.id)}
                                className="flex items-center gap-2 text-sm text-slate-blue hover:text-slate-blue-dark transition-colors py-2"
                              >
                                <Upload className="w-4 h-4" />
                                Upload PDF
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-heading text-charcoal">
                Upload PDF Resource
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-charcoal-70 hover:text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-sm text-charcoal-70">
              <span className="font-medium text-charcoal">
                {SECTIONS.find((s) => s.id === uploadSection)?.label}
              </span>
              {' \u2192 '}
              <span className="font-medium text-charcoal">
                {CATEGORIES.find((c) => c.id === uploadCategory)?.label}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Title
              </label>
              <input
                type="text"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="e.g. Trauma-Informed Care Overview"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                PDF File
              </label>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-charcoal-70 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-slate-blue file:text-white hover:file:bg-slate-blue-dark file:cursor-pointer"
              />
            </div>

            {uploadError && (
              <p className="text-sm text-red-600">{uploadError}</p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-charcoal hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 px-4 py-2 bg-slate-blue text-white rounded-lg text-sm font-semibold hover:bg-slate-blue-dark transition-colors disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      <SafetyFooter />
    </div>
  )
}
