import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, Plus, Star, Calendar, Trash2, BarChart3 } from 'lucide-react'
import SafetyFooter from '../components/SafetyFooter'

const API_URL = import.meta.env.VITE_API_URL || ''

function getToken(): string {
  return localStorage.getItem('auth_token') || ''
}

interface GrowthMoment {
  id: string
  moment_date: string
  title: string
  description: string
  category: string
}

const categories = ['Regulation', 'Social Skills', 'Emotional Growth', 'Attachment', 'Self-Care', 'Academic', 'Communication', 'Other']

const categoryColors: Record<string, string> = {
  'Regulation': '#6ED043',
  'Social Skills': '#90B1F9',
  'Emotional Growth': '#9C70C8',
  'Attachment': '#2A4B84',
  'Self-Care': '#55a833',
  'Academic': '#3a5f9e',
  'Communication': '#b48fd6',
  'Other': '#9ca3af',
}

type RangeKey = '1m' | '3m' | '6m' | '1y' | 'all'

const RANGES: { key: RangeKey; label: string; days: number | null }[] = [
  { key: '1m', label: '1 Month', days: 30 },
  { key: '3m', label: '3 Months', days: 91 },
  { key: '6m', label: '6 Months', days: 182 },
  { key: '1y', label: '1 Year', days: 365 },
  { key: 'all', label: 'Since Start', days: null },
]

function todayStr(): string {
  return new Date().toISOString().split('T')[0]
}

function monthLabel(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

function weekLabel(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function GrowthTracker() {
  const [moments, setMoments] = useState<GrowthMoment[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newMoment, setNewMoment] = useState({ title: '', description: '', category: 'Regulation', moment_date: todayStr() })
  const [range, setRange] = useState<RangeKey>('6m')
  const [saveError, setSaveError] = useState<string | null>(null)

  // Load moments from backend
  useEffect(() => {
    const token = getToken()
    if (!token) return
    let cancelled = false
    fetch(`${API_URL}/api/growth/list`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : [])
      .then((data: (GrowthMoment & { id: number })[]) => {
        if (cancelled) return
        setMoments(data.map(m => ({ ...m, id: String(m.id) })))
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const addMoment = async () => {
    if (!newMoment.title.trim()) return
    setSaveError(null)
    const token = getToken()
    if (!token) {
      setSaveError('Please log in to save growth moments.')
      return
    }
    try {
      const res = await fetch(`${API_URL}/api/growth/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newMoment),
      })
      if (!res.ok) {
        setSaveError('Save failed. Please try again.')
        return
      }
      const { id } = await res.json()
      setMoments([{ id: String(id), ...newMoment }, ...moments])
      setNewMoment({ title: '', description: '', category: 'Regulation', moment_date: todayStr() })
      setShowForm(false)
    } catch {
      setSaveError('Could not connect to server. Please try again.')
    }
  }

  const deleteMoment = async (id: string) => {
    const token = getToken()
    if (token) {
      await fetch(`${API_URL}/api/growth/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {})
    }
    setMoments(moments.filter((m) => m.id !== id))
  }

  // Filter moments by selected range
  const filteredMoments = useMemo(() => {
    const cfg = RANGES.find(r => r.key === range)
    if (!cfg || cfg.days === null) return moments
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - cfg.days)
    return moments.filter(m => new Date(m.moment_date) >= cutoff)
  }, [moments, range])

  // Build time-bucketed data for the bar chart
  const timeSeries = useMemo(() => {
    const cfg = RANGES.find(r => r.key === range)
    const useWeekly = cfg?.key === '1m'
    const now = new Date()

    // Determine start point
    let start: Date
    if (cfg?.days) {
      start = new Date()
      start.setDate(start.getDate() - cfg.days)
    } else if (filteredMoments.length > 0) {
      const earliest = filteredMoments.reduce((min, m) =>
        m.moment_date < min ? m.moment_date : min, filteredMoments[0].moment_date)
      start = new Date(earliest)
    } else {
      start = new Date()
      start.setMonth(start.getMonth() - 5)
    }

    const buckets: { label: string; count: number; key: string }[] = []

    if (useWeekly) {
      // Weekly buckets over ~1 month
      const cursor = new Date(start)
      cursor.setHours(0, 0, 0, 0)
      while (cursor <= now) {
        const bucketStart = new Date(cursor)
        const bucketEnd = new Date(cursor)
        bucketEnd.setDate(bucketEnd.getDate() + 7)
        const count = filteredMoments.filter(m => {
          const d = new Date(m.moment_date)
          return d >= bucketStart && d < bucketEnd
        }).length
        buckets.push({ label: weekLabel(bucketStart), count, key: bucketStart.toISOString() })
        cursor.setDate(cursor.getDate() + 7)
      }
    } else {
      // Monthly buckets
      const cursor = new Date(start.getFullYear(), start.getMonth(), 1)
      const endMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      while (cursor <= endMonth) {
        const y = cursor.getFullYear()
        const mo = cursor.getMonth()
        const count = filteredMoments.filter(m => {
          const d = new Date(m.moment_date)
          return d.getFullYear() === y && d.getMonth() === mo
        }).length
        buckets.push({ label: monthLabel(cursor), count, key: `${y}-${mo}` })
        cursor.setMonth(cursor.getMonth() + 1)
      }
    }
    return buckets
  }, [filteredMoments, range])

  // Category breakdown for the selected range
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {}
    filteredMoments.forEach(m => {
      counts[m.category] = (counts[m.category] || 0) + 1
    })
    return Object.entries(counts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
  }, [filteredMoments])

  const maxBar = Math.max(1, ...timeSeries.map(b => b.count))
  const maxCat = Math.max(1, ...categoryData.map(c => c.count))
  const totalInRange = filteredMoments.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-growth-green/5 via-white to-sky-blue-bg flex flex-col">
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-charcoal hover:text-slate-blue">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-growth-green" />
              Growth Tracker
            </h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-growth-green text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-growth-green-dark transition-colors"
          >
            <Plus className="w-4 h-4" /> Log Growth
          </button>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold font-heading text-charcoal mb-2">
            Celebrate Growth
          </h2>
          <p className="text-charcoal-80">
            Log and celebrate your child's growth moments. Watch progress add up over time — every small step forward matters.
          </p>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
            <h3 className="font-bold text-charcoal mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-growth-green" />
              Log a Growth Moment
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">What happened?</label>
                <input
                  type="text"
                  value={newMoment.title}
                  onChange={(e) => setNewMoment({ ...newMoment, title: e.target.value })}
                  placeholder="e.g., Used words to express frustration"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-growth-green focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Tell me more (optional)</label>
                <textarea
                  value={newMoment.description}
                  onChange={(e) => setNewMoment({ ...newMoment, description: e.target.value })}
                  placeholder="Describe the moment..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-growth-green focus:border-transparent outline-none resize-none"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Date</label>
                  <input
                    type="date"
                    value={newMoment.moment_date}
                    max={todayStr()}
                    onChange={(e) => setNewMoment({ ...newMoment, moment_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-growth-green focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setNewMoment({ ...newMoment, category: c })}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        newMoment.category === c ? 'bg-growth-green text-white' : 'bg-gray-100 text-charcoal-70'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={addMoment}
                  className="bg-growth-green text-white px-6 py-2 rounded-lg font-semibold hover:bg-growth-green-dark transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => { setShowForm(false); setSaveError(null) }}
                  className="border border-gray-200 text-charcoal px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
              {saveError && <p className="text-xs text-red-600">{saveError}</p>}
            </div>
          </div>
        )}

        {/* --- Charts section --- */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <h3 className="font-bold text-charcoal flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-growth-green" />
              Growth Over Time
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {RANGES.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setRange(r.key)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    range === r.key ? 'bg-slate-blue text-white' : 'bg-gray-100 text-charcoal-70 hover:bg-gray-200'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {totalInRange === 0 ? (
            <div className="text-center py-10 text-charcoal-70 text-sm">
              No growth moments in this time range yet. Log a win to start seeing progress.
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-growth-green">{totalInRange}</span>
                  <span className="text-sm text-charcoal-70">growth {totalInRange === 1 ? 'moment' : 'moments'} in this period</span>
                </div>

                {/* Bar chart: moments over time */}
                <div className="flex items-end justify-between gap-1.5 h-40 border-b border-gray-200 pb-0">
                  {timeSeries.map((b) => (
                    <div key={b.key} className="flex-1 flex flex-col items-center justify-end h-full group">
                      <span className="text-xs font-semibold text-charcoal-70 mb-1">
                        {b.count > 0 ? b.count : ''}
                      </span>
                      <div
                        className="w-full max-w-[40px] rounded-t bg-growth-green transition-all group-hover:bg-growth-green-dark"
                        style={{ height: `${(b.count / maxBar) * 100}%`, minHeight: b.count > 0 ? '4px' : '0' }}
                        title={`${b.label}: ${b.count}`}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between gap-1.5 mt-1.5">
                  {timeSeries.map((b) => (
                    <div key={b.key} className="flex-1 text-center">
                      <span className="text-[10px] text-charcoal-70 leading-tight block">{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category breakdown */}
              <div>
                <h4 className="text-sm font-semibold text-charcoal mb-3">By Category</h4>
                <div className="space-y-2">
                  {categoryData.map((c) => (
                    <div key={c.category} className="flex items-center gap-3">
                      <span className="text-xs text-charcoal-80 w-32 shrink-0 truncate">{c.category}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                        <div
                          className="h-full rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${(c.count / maxCat) * 100}%`, backgroundColor: categoryColors[c.category] || '#9ca3af', minWidth: '24px' }}
                        >
                          <span className="text-[10px] font-bold text-white">{c.count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* --- Moment list --- */}
        {moments.length === 0 ? (
          <div className="text-center py-12">
            <Star className="w-12 h-12 text-growth-green/30 mx-auto mb-4" />
            <p className="text-charcoal-70">No growth moments logged yet. Start celebrating the wins!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMoments.map((m) => (
              <div key={m.id} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-growth-green" />
                      <h3 className="font-bold text-charcoal">{m.title}</h3>
                    </div>
                    {m.description && <p className="text-sm text-charcoal-80 mb-2">{m.description}</p>}
                    <div className="flex items-center gap-3 text-xs text-charcoal-70">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {m.moment_date}</span>
                      <span className="bg-growth-green/10 text-growth-green-dark px-2 py-0.5 rounded-full">{m.category}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteMoment(m.id)}
                    className="text-charcoal-70 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <SafetyFooter />
    </div>
  )
}
