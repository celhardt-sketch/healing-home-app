import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Printer, Search, Download, FileText, Filter } from 'lucide-react'
import SafetyFooter from '../components/SafetyFooter'

const categories = ['All', 'Emotion Charts', 'Visual Schedules', 'Regulation Tools', 'Social Stories', 'Worksheets', 'Checklists']

const printables = [
  { id: '1', title: 'Feelings Check-In Chart', description: 'A visual tool for children to identify and communicate their current emotional state using faces and colors.', category: 'Emotion Charts', ageRange: 'Ages 3-10' },
  { id: '2', title: 'Morning Routine Visual Schedule', description: 'Step by step visual schedule for morning routines. Predictability reduces anxiety and supports regulation.', category: 'Visual Schedules', ageRange: 'Ages 3-8' },
  { id: '3', title: 'Calm Down Corner Poster', description: 'A visual guide for the calm down corner showing available regulation tools and how to use them.', category: 'Regulation Tools', ageRange: 'Ages 3-10' },
  { id: '4', title: 'Bedtime Routine Cards', description: 'Visual sequence cards for bedtime routine. Each card shows one step with a simple illustration.', category: 'Visual Schedules', ageRange: 'Ages 3-8' },
  { id: '5', title: 'Emotion Thermometer', description: 'A visual scale from 1-5 showing escalation levels with body cues and matching strategies.', category: 'Regulation Tools', ageRange: 'Ages 5-12' },
  { id: '6', title: 'Social Story: Going to a New Place', description: 'A simple social story template for preparing a child for new environments and transitions.', category: 'Social Stories', ageRange: 'Ages 3-8' },
  { id: '7', title: 'My Body Map', description: 'An outline of a body for children to color where they feel different emotions. Builds interoception and body awareness.', category: 'Worksheets', ageRange: 'Ages 5-12' },
  { id: '8', title: 'Daily Caregiver Self-Check', description: 'A simple checklist for caregivers to assess their own regulation, energy, and needs throughout the day.', category: 'Checklists', ageRange: 'For Caregivers' },
  { id: '9', title: 'Trigger Tracking Log', description: 'A structured log for tracking behavioral triggers, antecedents, and outcomes to identify patterns.', category: 'Worksheets', ageRange: 'For Caregivers' },
  { id: '10', title: 'Growth Celebration Certificate', description: 'A printable certificate to celebrate growth moments and progress, reinforcing positive identity.', category: 'Worksheets', ageRange: 'Ages 3-12' },
  { id: '11', title: 'Safety Plan Template', description: 'A structured safety plan for when a child is in crisis, including contacts, strategies, and escalation steps.', category: 'Checklists', ageRange: 'For Caregivers' },
  { id: '12', title: 'Breathing Exercise Cards', description: 'Visual cards demonstrating different breathing techniques: box breathing, belly breathing, flower breathing.', category: 'Regulation Tools', ageRange: 'Ages 3-10' },
]

export default function PrintablesVault() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = printables.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === 'All' || p.category === category
    return matchSearch && matchCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col">
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/dashboard" className="text-charcoal hover:text-slate-blue">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2">
            <Printer className="w-5 h-5 text-orange-500" />
            Printables Vault
          </h1>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold font-heading text-charcoal mb-2">
            Downloadable Resources
          </h2>
          <p className="text-charcoal-80">
            Visual schedules, emotion charts, regulation tools, and more. Print and use at home.
          </p>
        </div>

        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-70" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search printables..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Filter className="w-4 h-4 text-charcoal-70 mt-1.5" />
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  category === c ? 'bg-orange-500 text-white' : 'bg-gray-100 text-charcoal-70 hover:bg-gray-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-charcoal-70 mb-4">{filtered.length} printables</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-bold text-charcoal text-sm">{p.title}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">{p.category}</span>
                    <span className="text-xs text-charcoal-70">{p.ageRange}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-charcoal-80 mb-4 flex-1">{p.description}</p>
              <button className="flex items-center gap-2 text-sm text-orange-600 font-medium hover:text-orange-700 transition-colors">
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          ))}
        </div>
      </main>

      <SafetyFooter />
    </div>
  )
}
