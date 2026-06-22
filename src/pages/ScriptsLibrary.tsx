import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, FileText, Search, Copy, Check, Filter } from 'lucide-react'
import SafetyFooter from '../components/SafetyFooter'

const categories = ['All', 'De-escalation', 'Connection', 'Boundaries', 'Transitions', 'Repair', 'Bedtime', 'School']
const ageGroups = ['All Ages', 'Toddler (1-3)', 'Preschool (3-5)', 'School Age (6-11)', 'Preteen/Teen (12+)']

const scripts = [
  {
    id: '1',
    title: 'When a Child Says "I Hate You"',
    category: 'De-escalation',
    ageGroup: 'All Ages',
    script: '"I hear you. You\'re feeling really big feelings right now, and that\'s okay. I\'m not going anywhere. When you\'re ready, I\'m right here."',
    context: 'When children lash out verbally, they are often testing whether the relationship can survive their biggest feelings. This is attachment behavior, not rejection.',
    tip: 'Do not take it personally. Do not mirror the intensity. Your calm, steady presence is the response.',
  },
  {
    id: '2',
    title: 'Before a Difficult Transition',
    category: 'Transitions',
    ageGroup: 'All Ages',
    script: '"In five minutes, we\'re going to be done with this and start something new. I know transitions can feel hard. I\'ll be right there with you when it\'s time."',
    context: 'Children with trauma histories often struggle with transitions because change signals unpredictability. Advance notice and co-regulation reduce the threat response.',
    tip: 'Give time warnings: 5 minutes, 2 minutes, 1 minute. Predictability is safety.',
  },
  {
    id: '3',
    title: 'After a Meltdown (Repair)',
    category: 'Repair',
    ageGroup: 'All Ages',
    script: '"That was really hard. For both of us. But we got through it together. I\'m still here, and I still love you. Would you like to talk about what happened, or do you need more time?"',
    context: 'Repair after rupture is one of the most powerful attachment experiences. It teaches children that relationships survive hard moments.',
    tip: 'Wait until the child is fully regulated before initiating repair. Regulation before reason.',
  },
  {
    id: '4',
    title: 'Setting a Boundary with Warmth',
    category: 'Boundaries',
    ageGroup: 'School Age (6-11)',
    script: '"I love you AND hitting is not okay. I\'m going to help keep everyone safe. Let\'s find another way to show how angry you are."',
    context: 'Boundaries and warmth are not opposites. Children need both. The "and" construction validates the feeling while holding the limit.',
    tip: 'Children need both compassion and accountability. Use AND instead of BUT.',
  },
  {
    id: '5',
    title: 'Bedtime Resistance',
    category: 'Bedtime',
    ageGroup: 'Preschool (3-5)',
    script: '"I know bedtime can feel hard. Your body needs rest so it can grow strong. I\'m going to stay close. You are safe here. Nothing bad is going to happen while you sleep."',
    context: 'For children with trauma, bedtime can trigger fear of abandonment, hypervigilance, or memories of unsafe nighttime experiences.',
    tip: 'Consistent bedtime routines build predictability. Name the safety explicitly.',
  },
  {
    id: '6',
    title: 'When a Child Lies',
    category: 'Connection',
    ageGroup: 'School Age (6-11)',
    script: '"I think what really happened might be different from what you told me. It\'s okay. I\'m not going to be angry. I just want to understand. You\'re safe to tell me the truth."',
    context: 'Lying in trauma-affected children is often a survival strategy, not a character flaw. They learned that truth could be dangerous.',
    tip: 'Create safety for truth-telling. Punishing honesty guarantees more lying.',
  },
  {
    id: '7',
    title: 'First Day of School',
    category: 'School',
    ageGroup: 'All Ages',
    script: '"Today might feel a little scary, and that makes total sense. New things are hard. I will be here when you get back. You can do hard things, and I believe in you."',
    context: 'School transitions activate separation anxiety and fear of the unknown. Naming the fear and affirming the return reduces the threat.',
    tip: 'Consider giving the child a small object (a stone, a keychain) to carry as a reminder of connection.',
  },
  {
    id: '8',
    title: 'When a Child Won\'t Eat',
    category: 'Connection',
    ageGroup: 'Toddler (1-3)',
    script: '"Your body, your choice about eating. The food is here whenever you\'re ready. There will always be enough food in this home."',
    context: 'Food refusal in children from hard places is often about control, trust, or sensory sensitivities. Power struggles around food reinforce scarcity fears.',
    tip: 'For children who experienced food insecurity, having access to a snack basket can reduce hoarding and refusal behaviors.',
  },
]

export default function ScriptsLibrary() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [ageGroup, setAgeGroup] = useState('All Ages')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filtered = scripts.filter((s) => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.script.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === 'All' || s.category === category
    const matchAge = ageGroup === 'All Ages' || s.ageGroup === ageGroup || s.ageGroup === 'All Ages'
    return matchSearch && matchCategory && matchAge
  })

  const copyScript = (id: string, text: string) => {
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

        <p className="text-sm text-charcoal-70 mb-4">{filtered.length} scripts found</p>

        <div className="space-y-4">
          {filtered.map((s) => (
            <div key={s.id} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-charcoal">{s.title}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs bg-slate-blue/10 text-slate-blue px-2 py-0.5 rounded-full">{s.category}</span>
                    <span className="text-xs bg-gray-100 text-charcoal-70 px-2 py-0.5 rounded-full">{s.ageGroup}</span>
                  </div>
                </div>
                <button
                  onClick={() => copyScript(s.id, s.script)}
                  className="text-charcoal-70 hover:text-slate-blue transition-colors"
                  title="Copy script"
                >
                  {copiedId === s.id ? <Check className="w-4 h-4 text-growth-green" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <blockquote className="text-charcoal-80 bg-sky-blue-bg rounded-lg p-4 italic text-sm leading-relaxed mb-3">
                {s.script}
              </blockquote>
              <p className="text-sm text-charcoal-80 mb-2"><strong>Context:</strong> {s.context}</p>
              <p className="text-sm text-growth-green-dark italic">{s.tip}</p>
            </div>
          ))}
        </div>
      </main>

      <SafetyFooter />
    </div>
  )
}
