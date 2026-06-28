import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, FileText, Search, Copy, Check, Filter, Video } from 'lucide-react'
import SafetyFooter from '../components/SafetyFooter'

const API_URL = import.meta.env.VITE_API_URL || ''

interface Script {
  id: number
  title: string
  content: string
  category: string
  age_group: string
  situation: string
  video_url: string | null
  active: number
}

const defaultCategories = ['All', 'De-escalation', 'Connection', 'Boundaries', 'Transitions', 'Repair', 'Bedtime', 'School']
const ageGroups = ['All Ages', 'Toddler (1-3)', 'Preschool (3-5)', 'School Age (6-11)', 'Preteen/Teen (12+)']

export default function ScriptsLibrary() {
  const [scripts, setScripts] = useState<Script[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [ageGroup, setAgeGroup] = useState('All Ages')
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/api/content/scripts`)
      .then(r => r.ok ? r.json() : [])
      .then((data: Script[]) => setScripts(data.filter(s => s.active)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const categories = (() => {
    const cats = new Set(defaultCategories)
    scripts.forEach(s => { if (s.category) cats.add(s.category) })
    return Array.from(cats)
  })()

  const filtered = scripts.filter((s) => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.content.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === 'All' || s.category === category
    const matchAge = ageGroup === 'All Ages' || s.age_group === ageGroup || s.age_group === 'All Ages'
    return matchSearch && matchCategory && matchAge
  })

  const copyScript = (id: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-blue-bg via-white to-healing-purple/5 flex flex-col">
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/dashboard" className="text-charcoal hover:text-slate-blue">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-blue" />
            Scripts Library
          </h1>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-70" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search scripts..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <Filter className="w-4 h-4 text-charcoal-70 mt-1.5" />
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  category === c ? 'bg-slate-blue text-white' : 'bg-gray-100 text-charcoal-70 hover:bg-gray-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {ageGroups.map((a) => (
              <button
                key={a}
                onClick={() => setAgeGroup(a)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  ageGroup === a ? 'bg-healing-purple text-white' : 'bg-gray-100 text-charcoal-70 hover:bg-gray-200'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-charcoal-70">Loading scripts...</p>
        ) : (
          <>
            <p className="text-sm text-charcoal-70 mb-4">{filtered.length} scripts found</p>

            <div className="space-y-4">
              {filtered.map((s) => (
                <div key={s.id} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-charcoal">{s.title}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs bg-slate-blue/10 text-slate-blue px-2 py-0.5 rounded-full">{s.category}</span>
                        <span className="text-xs bg-gray-100 text-charcoal-70 px-2 py-0.5 rounded-full">{s.age_group}</span>
                        {s.video_url && <span className="text-xs text-slate-blue flex items-center gap-0.5"><Video className="w-3 h-3" /> Video</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => copyScript(s.id, s.content)}
                      className="text-charcoal-70 hover:text-slate-blue transition-colors"
                      title="Copy script"
                    >
                      {copiedId === s.id ? <Check className="w-4 h-4 text-growth-green" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <blockquote className="text-charcoal-80 bg-sky-blue-bg rounded-lg p-4 italic text-sm leading-relaxed mb-3">
                    {s.content}
                  </blockquote>
                  {s.situation && (
                    <p className="text-sm text-charcoal-80 whitespace-pre-wrap">{s.situation}</p>
                  )}
                  {s.video_url && (
                    <a href={s.video_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-3 text-sm text-slate-blue hover:underline font-medium">
                      <Video className="w-4 h-4" /> Watch Video
                    </a>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <SafetyFooter />
    </div>
  )
}
