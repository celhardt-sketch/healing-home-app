import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, Plus, Star, Calendar, Trash2 } from 'lucide-react'
import SafetyFooter from '../components/SafetyFooter'

interface GrowthMoment {
  id: string
  date: string
  title: string
  description: string
  category: string
}

const categories = ['Regulation', 'Social Skills', 'Emotional Growth', 'Attachment', 'Self-Care', 'Academic', 'Communication', 'Other']

export default function GrowthTracker() {
  const [moments, setMoments] = useState<GrowthMoment[]>([
    {
      id: '1',
      date: new Date().toISOString().split('T')[0],
      title: 'Used breathing technique independently',
      description: 'During a frustrating homework moment, they stopped, took three breaths, and then asked for help instead of shutting down.',
      category: 'Regulation',
    },
  ])
  const [showForm, setShowForm] = useState(false)
  const [newMoment, setNewMoment] = useState({ title: '', description: '', category: 'Regulation' })

  const addMoment = () => {
    if (!newMoment.title.trim()) return
    setMoments([
      {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        ...newMoment,
      },
      ...moments,
    ])
    setNewMoment({ title: '', description: '', category: 'Regulation' })
    setShowForm(false)
  }

  const deleteMoment = (id: string) => {
    setMoments(moments.filter((m) => m.id !== id))
  }

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
            Log and celebrate your child's growth moments with positive reinforcement and weekly reflections.
            Every small step forward matters.
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
                  onClick={() => setShowForm(false)}
                  className="border border-gray-200 text-charcoal px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {moments.length === 0 ? (
          <div className="text-center py-12">
            <Star className="w-12 h-12 text-growth-green/30 mx-auto mb-4" />
            <p className="text-charcoal-70">No growth moments logged yet. Start celebrating the wins!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {moments.map((m) => (
              <div key={m.id} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-growth-green" />
                      <h3 className="font-bold text-charcoal">{m.title}</h3>
                    </div>
                    {m.description && <p className="text-sm text-charcoal-80 mb-2">{m.description}</p>}
                    <div className="flex items-center gap-3 text-xs text-charcoal-70">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {m.date}</span>
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
