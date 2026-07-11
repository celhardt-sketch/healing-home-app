import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, FileText, Search, Copy, Check, Filter, Video, AlertTriangle, ChevronDown, ChevronUp, Star } from 'lucide-react'
import SafetyFooter from '../components/SafetyFooter'
import { useFavorites } from '../lib/useFavorites'

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

const defaultCategories = ['All', 'Regulation-First', 'Aggression / Fight Response', 'Flight / Avoidance / Elopement', 'Freeze / Shutdown', 'School / Task Avoidance', 'Attachment Protests', 'Survival Strategies', 'Control Battles', 'Destructive Behavior', 'Sibling Conflict', 'Sexual Behavior Boundaries', 'Public Settings', 'Threat Statements', 'Transitions', 'Repair & Try Again', 'Caregiver Self-Regulation']
const ageGroups = ['All Ages', 'Ages 4-6', 'Ages 7-10', 'Ages 11-13', 'Ages 14-18']

export default function ScriptsLibrary() {
  const [scripts, setScripts] = useState<Script[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [ageGroup, setAgeGroup] = useState('All Ages')
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const { isFavorite, toggleFavorite } = useFavorites('scripts')

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
    const matchFavorite = !favoritesOnly || isFavorite(s.id)
    return matchSearch && matchCategory && matchAge && matchFavorite
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
          <Link to="/dashboard" aria-label="Back to dashboard" className="text-charcoal hover:text-slate-blue">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-blue" />
            Scripts Library
          </h1>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-6">
          <p className="text-charcoal-80 text-sm leading-relaxed">
            Trauma-informed response templates for everyday situations. Copy and adapt these scripts to your family&rsquo;s needs.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-charcoal text-sm mb-1">Psychoeducational Guidance</h3>
              <p className="text-xs text-charcoal-80 leading-relaxed mb-2">
                These scripts are general templates based on trauma-informed principles. They are not therapeutic directives and should be adapted to your child&rsquo;s unique needs. Always defer to your child&rsquo;s treatment team for specific behavioral guidance.
              </p>
              <button
                onClick={() => setShowDisclaimer(!showDisclaimer)}
                className="text-xs text-amber-700 font-medium flex items-center gap-1 hover:underline"
              >
                Please read before using
                {showDisclaimer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              {showDisclaimer && (
                <div className="mt-3 space-y-2 text-xs text-charcoal-80 leading-relaxed">
                  <p><strong>Safety first, within your limits.</strong> These scripts are about creating safety &mdash; staying present, removing others from harm&rsquo;s way, and getting help. They are not instructions to physically restrain a child. Any hands-on response must follow your agency&rsquo;s and state&rsquo;s policies and your own training. When in doubt, create space and call for help rather than physically intervening.</p>
                  <p><strong>Some behaviors are more than behavior.</strong> Sexualized behavior, threats to harm self or others, or disclosures of harm may require more than a script. Document them, bring them to your child&rsquo;s treatment team, and follow your mandated-reporting responsibilities. Redirect without shame &mdash; but do not treat these as fully handled by a calm response.</p>
                  <p><strong>In a crisis, this is not a scripting moment.</strong> If a child expresses intent to harm themselves or someone else, contact your treatment team, call or text 988 (Suicide &amp; Crisis Lifeline), or call 911, and follow your safety plan.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-blue/5 border border-slate-blue/20 rounded-xl p-5 mb-6">
          <h3 className="font-bold text-charcoal text-sm mb-2">How to use these scripts</h3>
          <p className="text-xs text-charcoal-80 leading-relaxed mb-2">
            Most situations have two moments: <strong>In the Moment</strong> (active dysregulation) and <strong>Calm Time</strong> (after regulation has returned).
          </p>
          <ul className="text-xs text-charcoal-80 leading-relaxed space-y-1 list-disc list-inside">
            <li><strong>In the Moment</strong> is only for safety and regulation. Do not teach, investigate, or present consequences while a child is dysregulated.</li>
            <li><strong>Calm Time</strong> is for teaching, repair, and natural consequences &mdash; once both of you are regulated.</li>
            <li>At peak escalation, fewer words and calm presence work better than explanation. Say less, stay close.</li>
          </ul>
        </div>

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
          <div className="mb-3">
            <button
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              aria-pressed={favoritesOnly}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                favoritesOnly ? 'bg-amber-400 text-white' : 'bg-gray-100 text-charcoal-70 hover:bg-gray-200'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-white' : ''}`} /> Favorites
            </button>
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
            <p className="text-sm text-charcoal-70 mb-4">
              {filtered.length} script{filtered.length !== 1 ? 's' : ''} {favoritesOnly ? 'favorited' : 'found'}
            </p>
            {favoritesOnly && filtered.length === 0 && (
              <p className="text-sm text-charcoal-70 mb-4">No favorites yet. Tap the star on any script to save it here.</p>
            )}

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
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => toggleFavorite(s.id)}
                        aria-pressed={isFavorite(s.id)}
                        aria-label={isFavorite(s.id) ? `Remove ${s.title} from favorites` : `Add ${s.title} to favorites`}
                        className="text-charcoal-70 hover:text-amber-500 transition-colors"
                        title={isFavorite(s.id) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Star className={`w-4 h-4 ${isFavorite(s.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                      <button
                        onClick={() => copyScript(s.id, s.content)}
                        className="text-charcoal-70 hover:text-slate-blue transition-colors"
                        title="Copy script"
                        aria-label={`Copy ${s.title}`}
                      >
                        {copiedId === s.id ? <Check className="w-4 h-4 text-growth-green" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
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

        <div className="mt-8 bg-slate-blue/5 border border-slate-blue/20 rounded-xl p-5">
          <h3 className="font-bold text-charcoal text-sm mb-3">Script Guidelines</h3>
          <ul className="text-xs text-charcoal-80 leading-relaxed space-y-1.5 list-disc list-inside">
            <li>Scripts preserve caregiver authority while maintaining connection.</li>
            <li>Scripts never promise non-intervention when safety is at risk.</li>
            <li>Scripts defer consequences to calm time, prioritizing regulation first.</li>
            <li>Scripts avoid investigation or therapy language.</li>
            <li>Scripts communicate belief in growth and redemption.</li>
            <li>Scripts create safety through presence and help &mdash; never through physical restraint.</li>
            <li>At peak escalation, fewer words and calm presence work better than explanation. Say less, stay close.</li>
          </ul>
        </div>
      </main>

      <SafetyFooter />
    </div>
  )
}
