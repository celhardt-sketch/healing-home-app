import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Users, Plus, Edit3, Trash2, Save, X } from 'lucide-react'
import SafetyFooter from '../components/SafetyFooter'

interface ChildProfile {
  id: string
  name: string
  age: string
  triggers: string[]
  calmingStrategies: string[]
  strengths: string[]
  notes: string
}

const triggerOptions = ['Loud noises', 'Transitions', 'Being told no', 'Hunger', 'Fatigue', 'New people', 'Separation', 'Feeling misunderstood', 'Loss of control', 'Surprises', 'Physical touch', 'Criticism']
const strategyOptions = ['Deep breathing', 'Quiet space', 'Physical activity', 'Music', 'Weighted blanket', 'Fidget tools', 'Drawing/art', 'Co-regulation with adult', 'Stuffed animal/comfort item', 'Water/cold sensation', 'Rocking/swinging', 'Counting']
const strengthOptions = ['Creativity', 'Empathy', 'Humor', 'Resilience', 'Curiosity', 'Loyalty', 'Physical energy', 'Problem-solving', 'Helpfulness', 'Artistic talent', 'Love of animals', 'Musical ability', 'Truth-telling', 'Safe body choices']

export default function FamilyPlan() {
  const [profiles, setProfiles] = useState<ChildProfile[]>([])
  const [editing, setEditing] = useState<ChildProfile | null>(null)
  const [showForm, setShowForm] = useState(false)

  const emptyProfile: ChildProfile = {
    id: '', name: '', age: '', triggers: [], calmingStrategies: [], strengths: [], notes: '',
  }

  const startNew = () => {
    setEditing({ ...emptyProfile, id: Date.now().toString() })
    setShowForm(true)
  }

  const startEdit = (profile: ChildProfile) => {
    setEditing({ ...profile })
    setShowForm(true)
  }

  const toggleItem = (field: 'triggers' | 'calmingStrategies' | 'strengths', item: string) => {
    if (!editing) return
    const current = editing[field]
    setEditing({
      ...editing,
      [field]: current.includes(item) ? current.filter((i) => i !== item) : [...current, item],
    })
  }

  const saveProfile = () => {
    if (!editing || !editing.name.trim()) return
    const exists = profiles.find((p) => p.id === editing.id)
    if (exists) {
      setProfiles(profiles.map((p) => (p.id === editing.id ? editing : p)))
    } else {
      setProfiles([...profiles, editing])
    }
    setEditing(null)
    setShowForm(false)
  }

  const deleteProfile = (id: string) => {
    setProfiles(profiles.filter((p) => p.id !== id))
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
              <Users className="w-5 h-5 text-slate-blue" />
              My Family Plan
            </h1>
          </div>
          <button
            onClick={startNew}
            className="flex items-center gap-2 bg-slate-blue text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-blue-dark transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Child
          </button>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {showForm && editing ? (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold font-heading text-charcoal">
                {profiles.find((p) => p.id === editing.id) ? 'Edit Profile' : 'New Child Profile'}
              </h3>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-charcoal-70 hover:text-charcoal">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Child's Name</label>
                  <input
                    type="text"
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Age</label>
                  <input
                    type="text"
                    value={editing.age}
                    onChange={(e) => setEditing({ ...editing, age: e.target.value })}
                    placeholder="e.g., 7"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Known Triggers</label>
                <div className="flex flex-wrap gap-2">
                  {triggerOptions.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleItem('triggers', t)}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                        editing.triggers.includes(t) ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-gray-200 text-charcoal-70'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Calming Strategies That Work</label>
                <div className="flex flex-wrap gap-2">
                  {strategyOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleItem('calmingStrategies', s)}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                        editing.calmingStrategies.includes(s) ? 'bg-sky-blue-bg border-sky-blue/30 text-slate-blue' : 'bg-white border-gray-200 text-charcoal-70'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Strengths</label>
                <div className="flex flex-wrap gap-2">
                  {strengthOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleItem('strengths', s)}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                        editing.strengths.includes(s) ? 'bg-growth-green/10 border-growth-green/20 text-growth-green-dark' : 'bg-white border-gray-200 text-charcoal-70'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Additional Notes</label>
                <textarea
                  value={editing.notes}
                  onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none resize-none"
                />
              </div>

              <button
                onClick={saveProfile}
                disabled={!editing.name.trim()}
                className="flex items-center gap-2 bg-slate-blue text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-blue-dark disabled:opacity-50 transition-colors"
              >
                <Save className="w-4 h-4" /> Save Profile
              </button>
            </div>
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-slate-blue/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold font-heading text-charcoal mb-2">No Profiles Yet</h3>
            <p className="text-charcoal-80 mb-6">
              Create a profile for each child in your care to keep their triggers, strategies, and strengths organized.
            </p>
            <button
              onClick={startNew}
              className="inline-flex items-center gap-2 bg-slate-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-blue-dark transition-colors"
            >
              <Plus className="w-4 h-4" /> Create First Profile
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {profiles.map((profile) => (
              <div key={profile.id} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold font-heading text-charcoal">{profile.name}</h3>
                    {profile.age && <p className="text-sm text-charcoal-70">Age: {profile.age}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(profile)} className="text-charcoal-70 hover:text-slate-blue transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteProfile(profile.id)} className="text-charcoal-70 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {profile.triggers.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-xs font-semibold text-charcoal-70 uppercase mb-1">Triggers</h4>
                    <div className="flex flex-wrap gap-1">
                      {profile.triggers.map((t) => (
                        <span key={t} className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.calmingStrategies.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-xs font-semibold text-charcoal-70 uppercase mb-1">Calming Strategies</h4>
                    <div className="flex flex-wrap gap-1">
                      {profile.calmingStrategies.map((s) => (
                        <span key={s} className="text-xs bg-sky-blue-bg text-slate-blue px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.strengths.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-xs font-semibold text-charcoal-70 uppercase mb-1">Strengths</h4>
                    <div className="flex flex-wrap gap-1">
                      {profile.strengths.map((s) => (
                        <span key={s} className="text-xs bg-growth-green/10 text-growth-green-dark px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.notes && <p className="text-sm text-charcoal-80 mt-3 border-t border-gray-100 pt-3">{profile.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </main>

      <SafetyFooter />
    </div>
  )
}
