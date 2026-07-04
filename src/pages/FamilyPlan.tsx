import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, Users, Plus, Edit3, Trash2, Save, X, ChevronDown, ChevronUp,
  Printer, AlertTriangle, Shield, BookOpen, FileText, Wrench, Download,
  CheckCircle,
} from 'lucide-react'
import SafetyFooter from '../components/SafetyFooter'

const API_URL = import.meta.env.VITE_API_URL || ''

function getToken(): string {
  return localStorage.getItem('auth_token') || ''
}

// --- Section definitions ---

interface SectionDef {
  key: string
  label: string
  instruction: string
  presets: string[]
  color: string
  selectedColor: string
}

const SECTIONS: SectionDef[] = [
  {
    key: 'earlyWarning',
    label: 'A. Early Warning Signs',
    instruction: 'What does this child look like before a full escalation?',
    presets: ['Voice gets louder', 'Withdraws or goes silent', 'Starts arguing', 'Paces or fidgets', 'Clings or pushes away'],
    color: 'bg-white border-gray-200 text-charcoal-70',
    selectedColor: 'bg-amber-50 border-amber-200 text-amber-800',
  },
  {
    key: 'nervousSystem',
    label: 'B. Likely Nervous System State',
    instruction: 'Select all that apply. This is not a diagnosis. This helps you respond with the right strategy.',
    presets: ['Fight', 'Flight', 'Freeze', 'Fawn'],
    color: 'bg-white border-gray-200 text-charcoal-70',
    selectedColor: 'bg-red-50 border-red-200 text-red-700',
  },
  {
    key: 'triggers',
    label: 'C. Common Triggers',
    instruction: "What situations commonly strain this child's nervous system?",
    presets: ['Transitions', 'School mornings', 'Bedtime', 'Being corrected', 'Sibling conflict', 'Public settings', 'Visitations', 'Court-related events'],
    color: 'bg-white border-gray-200 text-charcoal-70',
    selectedColor: 'bg-orange-50 border-orange-200 text-orange-800',
  },
  {
    key: 'whatHelps',
    label: 'D. What Helps Fastest',
    instruction: 'When things escalate, what helps regulate this child most quickly?',
    presets: ['Movement', 'Quiet space', 'Firm boundary', 'Deep pressure', 'Humor', 'Physical proximity', 'Reduced words', 'Structured choices'],
    color: 'bg-white border-gray-200 text-charcoal-70',
    selectedColor: 'bg-sky-blue-bg border-sky-blue/30 text-slate-blue',
  },
  {
    key: 'makesWorse',
    label: 'E. What Makes It Worse',
    instruction: 'What tends to escalate this child further?',
    presets: ['Lecturing', 'Public correction', 'Raised voices', 'Too many words', 'Removing control suddenly'],
    color: 'bg-white border-gray-200 text-charcoal-70',
    selectedColor: 'bg-rose-50 border-rose-200 text-rose-700',
  },
  {
    key: 'growthFocus',
    label: 'F. Calm-Time Growth Focus',
    instruction: 'What skill are we currently building?',
    presets: ['Asking for space', 'Using words instead of hitting', 'Staying in the room', 'Truth-telling', 'Safe body choices'],
    color: 'bg-white border-gray-200 text-charcoal-70',
    selectedColor: 'bg-growth-green/10 border-growth-green/20 text-growth-green-dark',
  },
]

// --- Types ---

interface PlanData {
  [sectionKey: string]: string[]
}

interface SavedItems {
  firstAidCards: string[]
  scripts: string[]
  regulationTools: string[]
  articles: string[]
  printables: string[]
}

interface RegulationPlan {
  id?: number
  child_name: string
  plan_data: PlanData
  saved_items: SavedItems
  created_at?: string
  updated_at?: string
}

const EMPTY_SAVED_ITEMS: SavedItems = {
  firstAidCards: [],
  scripts: [],
  regulationTools: [],
  articles: [],
  printables: [],
}

const EMPTY_PLAN: RegulationPlan = {
  child_name: '',
  plan_data: {},
  saved_items: { ...EMPTY_SAVED_ITEMS },
}

// --- Saved Items Section Labels ---
const SAVED_SECTIONS = [
  { key: 'firstAidCards' as const, label: 'Saved First Aid Cards', icon: Shield, color: 'text-red-500' },
  { key: 'scripts' as const, label: 'Saved Scripts', icon: FileText, color: 'text-slate-blue' },
  { key: 'regulationTools' as const, label: 'Saved Regulation Tools', icon: Wrench, color: 'text-amber-600' },
  { key: 'articles' as const, label: 'Saved Learning Articles', icon: BookOpen, color: 'text-healing-purple' },
  { key: 'printables' as const, label: 'Saved Printables', icon: Download, color: 'text-growth-green' },
]

export default function FamilyPlan() {
  const [plans, setPlans] = useState<RegulationPlan[]>([])
  const [editing, setEditing] = useState<RegulationPlan | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [showPrintFlow, setShowPrintFlow] = useState(false)
  const [printPlan, setPrintPlan] = useState<RegulationPlan | null>(null)
  const [printSections, setPrintSections] = useState<Set<string>>(new Set(SECTIONS.map(s => s.key)))
  const [printConsentAcked, setPrintConsentAcked] = useState(false)
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null)
  const printRef = useRef<HTMLDivElement>(null)

  // Load plans from API
  const loadPlans = useCallback(async () => {
    const token = getToken()
    if (!token) return
    try {
      const res = await fetch(`${API_URL}/api/regulation-plan/list`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return
      const data = await res.json()
      setPlans(data.map((p: RegulationPlan & { plan_data: PlanData & { saved_items?: SavedItems } }) => {
        const { saved_items: si, ...planFields } = p.plan_data as PlanData & { saved_items?: SavedItems }
        return {
          ...p,
          saved_items: si || { ...EMPTY_SAVED_ITEMS },
          plan_data: planFields as PlanData,
        }
      }))
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    const token = getToken()
    if (!token) return
    let cancelled = false
    fetch(`${API_URL}/api/regulation-plan/list`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : [])
      .then((data: (RegulationPlan & { plan_data: PlanData & { saved_items?: SavedItems } })[]) => {
        if (cancelled) return
        setPlans(data.map(p => {
          const { saved_items: si, ...planFields } = p.plan_data as PlanData & { saved_items?: SavedItems }
          return {
            ...p,
            saved_items: si || { ...EMPTY_SAVED_ITEMS },
            plan_data: planFields as PlanData,
          }
        }))
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const completedCount = (plan: RegulationPlan) =>
    SECTIONS.filter(s => (plan.plan_data[s.key] || []).length > 0).length

  const startNew = () => {
    setEditing({ ...EMPTY_PLAN })
    setExpandedSections(new Set())
    setCustomInputs({})
    setShowForm(true)
  }

  const startEdit = (plan: RegulationPlan) => {
    setEditing({ ...plan, plan_data: { ...plan.plan_data }, saved_items: { ...plan.saved_items } })
    setExpandedSections(new Set())
    setCustomInputs({})
    setShowForm(true)
  }

  const toggleSection = (key: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const toggleChip = (sectionKey: string, chip: string) => {
    if (!editing) return
    const current = editing.plan_data[sectionKey] || []
    setEditing({
      ...editing,
      plan_data: {
        ...editing.plan_data,
        [sectionKey]: current.includes(chip) ? current.filter(c => c !== chip) : [...current, chip],
      },
    })
  }

  const addCustomChip = (sectionKey: string) => {
    const value = (customInputs[sectionKey] || '').trim()
    if (!value || !editing) return
    const current = editing.plan_data[sectionKey] || []
    if (!current.includes(value)) {
      setEditing({
        ...editing,
        plan_data: {
          ...editing.plan_data,
          [sectionKey]: [...current, value],
        },
      })
    }
    setCustomInputs({ ...customInputs, [sectionKey]: '' })
  }

  const savePlan = async () => {
    if (!editing || !editing.child_name.trim()) return
    setSaving(true)
    const token = getToken()
    try {
      await fetch(`${API_URL}/api/regulation-plan/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          child_name: editing.child_name.trim(),
          plan_data: { ...editing.plan_data, saved_items: editing.saved_items },
        }),
      })
      await loadPlans()
      setEditing(null)
      setShowForm(false)
    } catch { /* ignore */ }
    setSaving(false)
  }

  const deletePlan = async (plan: RegulationPlan) => {
    if (!plan.id) return
    const token = getToken()
    await fetch(`${API_URL}/api/regulation-plan/${plan.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    loadPlans()
  }

  const openPrintFlow = (plan: RegulationPlan) => {
    setPrintPlan(plan)
    setPrintSections(new Set(SECTIONS.map(s => s.key)))
    setPrintConsentAcked(false)
    setShowPrintFlow(true)
  }

  const handlePrint = () => {
    if (!printConsentAcked) return
    const printContent = printRef.current
    if (!printContent) return
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    printWindow.document.write(`
      <!DOCTYPE html>
      <html><head><title>Regulation Plan</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 700px; margin: 40px auto; color: #333; line-height: 1.5; }
        h1 { font-size: 22px; margin-bottom: 4px; }
        h2 { font-size: 16px; margin: 24px 0 8px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
        .chip { display: inline-block; padding: 4px 12px; margin: 3px; border: 1px solid #ccc; border-radius: 16px; font-size: 13px; }
        .field { border-bottom: 1px solid #999; display: inline-block; width: 250px; margin-left: 8px; }
        .meta { margin-top: 24px; font-size: 13px; color: #666; }
        .disclaimer { margin-top: 32px; font-size: 11px; color: #888; font-style: italic; border-top: 1px solid #ddd; padding-top: 12px; }
        @media print { body { margin: 20px; } }
      </style></head><body>
      ${printContent.innerHTML}
      </body></html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => printWindow.print(), 300)
  }

  // Print flow modal
  const renderPrintFlow = () => {
    if (!showPrintFlow || !printPlan) return null
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-charcoal">Print to Share with Caregivers</h3>
            <button onClick={() => setShowPrintFlow(false)} className="text-charcoal-70 hover:text-charcoal">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Consent notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-charcoal mb-1">Before you share</h4>
                <p className="text-xs text-charcoal-80 leading-relaxed">
                  This plan contains sensitive information about a child. Follow your family&rsquo;s and agency&rsquo;s privacy rules, and get permission from the child&rsquo;s guardian before sharing it with anyone. Foster and kinship caregivers may need agency or guardian sign-off, since you may not hold that authority yourself.
                </p>
              </div>
            </div>
            <label className="flex items-center gap-2 mt-3 cursor-pointer">
              <input
                type="checkbox"
                checked={printConsentAcked}
                onChange={() => setPrintConsentAcked(!printConsentAcked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-xs text-charcoal-80 font-medium">I understand and have appropriate permission to share this plan.</span>
            </label>
          </div>

          {/* Section selection */}
          <div className="mb-4">
            <h4 className="text-sm font-bold text-charcoal mb-2">Select sections to include:</h4>
            <div className="space-y-2">
              {SECTIONS.map(s => (
                <label key={s.key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={printSections.has(s.key)}
                    onChange={() => {
                      setPrintSections(prev => {
                        const next = new Set(prev)
                        if (next.has(s.key)) next.delete(s.key)
                        else next.add(s.key)
                        return next
                      })
                    }}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-charcoal">{s.label}</span>
                  <span className="text-xs text-charcoal-70">({(printPlan.plan_data[s.key] || []).length} selected)</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handlePrint}
            disabled={!printConsentAcked || printSections.size === 0}
            className="w-full flex items-center justify-center gap-2 bg-slate-blue text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-slate-blue-dark disabled:opacity-50 transition-colors"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>

          {/* Hidden printable content */}
          <div className="hidden">
            <div ref={printRef}>
              <h1>Regulation Plan</h1>
              <p>Child&rsquo;s first name or nickname: {printPlan.child_name}</p>
              <p style={{ marginTop: '8px' }}>Full name (optional): <span className="field">&nbsp;</span></p>
              <p>Date of birth (optional): <span className="field">&nbsp;</span></p>
              {SECTIONS.filter(s => printSections.has(s.key)).map(s => {
                const items = printPlan.plan_data[s.key] || []
                if (items.length === 0) return null
                return (
                  <div key={s.key}>
                    <h2>{s.label}</h2>
                    <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>{s.instruction}</p>
                    <div>{items.map(item => <span key={item} className="chip">{item}</span>)}</div>
                  </div>
                )
              })}
              <div className="meta">
                <p>Prepared by caregiver on {new Date().toLocaleDateString()}</p>
              </div>
              <div className="disclaimer">
                <p>This is a caregiver planning tool, not a clinical assessment. Defer to the child&rsquo;s treatment team for clinical guidance.</p>
                <p>The Healing Home Approach &mdash; Elhardt Family Wellness</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render edit form
  const renderEditForm = () => {
    if (!editing) return null
    const completed = completedCount(editing)
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold font-heading text-charcoal">Regulation Plan</h3>
            <p className="text-sm text-charcoal-70">Tap to view and edit</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-charcoal-70 bg-gray-100 px-3 py-1 rounded-full">
              {completed}/6 sections
            </span>
            <button onClick={() => { setShowForm(false); setEditing(null) }} className="text-charcoal-70 hover:text-charcoal">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <p className="text-xs text-charcoal-70 italic mb-4">
          For privacy protection, use first name or nickname only. A printable version includes blank spaces for full name and DOB if needed for professionals.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-charcoal mb-1">Child&rsquo;s first name or nickname</label>
          <input
            type="text"
            value={editing.child_name}
            onChange={(e) => setEditing({ ...editing, child_name: e.target.value })}
            placeholder="First name or nickname only"
            className="w-full max-w-xs px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none"
          />
        </div>

        <p className="text-xs text-charcoal-70 italic mb-6">
          This is a caregiver planning tool, not a clinical assessment. Defer to your child&rsquo;s treatment team for clinical guidance.
        </p>

        {/* Sections A-F */}
        <div className="space-y-3">
          {SECTIONS.map((section) => {
            const selected = editing.plan_data[section.key] || []
            const isExpanded = expandedSections.has(section.key)
            const allChips = [...section.presets, ...selected.filter(c => !section.presets.includes(c))]
            return (
              <div key={section.key} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection(section.key)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  aria-expanded={isExpanded}
                  aria-label={section.label}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-charcoal">{section.label}</span>
                    {selected.length > 0 && (
                      <span className="text-xs bg-slate-blue/10 text-slate-blue px-2 py-0.5 rounded-full">
                        {selected.length} selected
                      </span>
                    )}
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-charcoal-70" /> : <ChevronDown className="w-4 h-4 text-charcoal-70" />}
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                    <p className="text-xs text-charcoal-70 mb-3">{section.instruction}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {allChips.map((chip) => (
                        <button
                          key={chip}
                          onClick={() => toggleChip(section.key, chip)}
                          className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                            selected.includes(chip) ? section.selectedColor : section.color
                          }`}
                          role="checkbox"
                          aria-checked={selected.includes(chip)}
                          aria-label={chip}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={customInputs[section.key] || ''}
                        onChange={(e) => setCustomInputs({ ...customInputs, [section.key]: e.target.value })}
                        onKeyDown={(e) => { if (e.key === 'Enter') addCustomChip(section.key) }}
                        placeholder="Add your own \u2014 please don\u2019t include identifying details"
                        className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none"
                      />
                      <button
                        onClick={() => addCustomChip(section.key)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-blue border border-slate-blue/30 rounded-lg hover:bg-slate-blue/5 transition-colors"
                      >
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Save button */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={savePlan}
            disabled={!editing.child_name.trim() || saving}
            className="flex items-center gap-2 bg-slate-blue text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-blue-dark disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Plan'}
          </button>
        </div>
      </div>
    )
  }

  // Render plan card (view mode)
  const renderPlanCard = (plan: RegulationPlan) => {
    const completed = completedCount(plan)
    const isExpanded = expandedPlan === plan.child_name
    return (
      <div key={plan.child_name} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <button
          onClick={() => setExpandedPlan(isExpanded ? null : plan.child_name)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
        >
          <div>
            <h3 className="text-lg font-bold font-heading text-charcoal">{plan.child_name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-charcoal-70">{completed}/6 sections</span>
              {completed === 6 && <CheckCircle className="w-3.5 h-3.5 text-growth-green" />}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isExpanded ? <ChevronUp className="w-5 h-5 text-charcoal-70" /> : <ChevronDown className="w-5 h-5 text-charcoal-70" />}
          </div>
        </button>

        {isExpanded && (
          <div className="border-t border-gray-100 p-5 space-y-4">
            {/* Section chips summary */}
            {SECTIONS.map(s => {
              const items = plan.plan_data[s.key] || []
              if (items.length === 0) return null
              return (
                <div key={s.key}>
                  <h4 className="text-xs font-semibold text-charcoal-70 uppercase mb-1">{s.label}</h4>
                  <div className="flex flex-wrap gap-1">
                    {items.map(item => (
                      <span key={item} className={`text-xs px-2 py-0.5 rounded-full border ${s.selectedColor}`}>{item}</span>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Saved items (non-printable) */}
            <div className="border-t border-gray-100 pt-4 mt-4">
              {SAVED_SECTIONS.map(({ key, label, icon: Icon, color }) => {
                const items = plan.saved_items?.[key] || []
                return (
                  <div key={key} className="mb-3">
                    <h4 className="text-xs font-semibold text-charcoal-70 uppercase mb-1 flex items-center gap-1.5">
                      <Icon className={`w-3.5 h-3.5 ${color}`} />
                      {label}
                    </h4>
                    {items.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {items.map(item => (
                          <span key={item} className="text-xs bg-gray-50 text-charcoal-80 px-2 py-0.5 rounded-full border border-gray-200">{item}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-charcoal-70 italic">None saved yet</p>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
              <button
                onClick={() => startEdit(plan)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-blue border border-slate-blue/30 rounded-lg hover:bg-slate-blue/5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Plan
              </button>
              <button
                onClick={() => openPrintFlow(plan)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-charcoal-70 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Print to Share with Caregivers
              </button>
              <button
                onClick={() => deletePlan(plan)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        )}
      </div>
    )
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
          {!showForm && (
            <button
              onClick={startNew}
              className="flex items-center gap-2 bg-slate-blue text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-blue-dark transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Child
            </button>
          )}
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Page intro */}
        <div className="text-center mb-4">
          <p className="text-charcoal-80 text-sm leading-relaxed">
            Personalized shortcuts for each child and caregiver in your home
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 text-xs text-charcoal-70 leading-relaxed">
          <p>
            Profiles are organizational tools only, not assessments. No profile data is used for diagnosis, prediction, or shared externally. This system reduces cognitive load, not replaces professional judgment.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-charcoal-80 leading-relaxed">
              <strong>Important:</strong> Information stored in this app, including child profiles and caregiver notes, could potentially be subject to legal discovery or subpoena in custody, dependency, or other legal proceedings. Avoid recording diagnostic language, investigative observations, or information that could be misinterpreted outside of its caregiving context.
            </p>
          </div>
        </div>

        {showForm && editing ? (
          renderEditForm()
        ) : plans.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-slate-blue/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold font-heading text-charcoal mb-2">No Plans Yet</h3>
            <p className="text-charcoal-80 mb-6">
              Create a regulation plan for each child in your care to keep their patterns, strategies, and growth focus organized.
            </p>
            <button
              onClick={startNew}
              className="inline-flex items-center gap-2 bg-slate-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-blue-dark transition-colors"
            >
              <Plus className="w-4 h-4" /> Create First Plan
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {plans.map(renderPlanCard)}
          </div>
        )}
      </main>

      {renderPrintFlow()}
      <SafetyFooter />
    </div>
  )
}
