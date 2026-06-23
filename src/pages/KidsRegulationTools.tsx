import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Brain, Play, Star, Video, ChevronDown, ChevronUp } from 'lucide-react'
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

const tools = [
  {
    title: 'Belly Breathing for Kids',
    description: 'A fun, guided breathing exercise that helps children calm their nervous system.',
    ageRange: 'Ages 3-8',
    category: 'Breathing',
    color: 'bg-cyan-50 border-cyan-200',
  },
  {
    title: 'The Feelings Check-In',
    description: 'Help children identify and name what they are feeling using simple emotion vocabulary.',
    ageRange: 'Ages 4-10',
    category: 'Emotional Literacy',
    color: 'bg-healing-purple/10 border-healing-purple/20',
  },
  {
    title: 'Body Scan for Kids',
    description: 'A gentle guided scan that helps children notice where they hold tension and practice relaxation.',
    ageRange: 'Ages 5-12',
    category: 'Body Awareness',
    color: 'bg-sky-blue-bg border-sky-blue/30',
  },
  {
    title: 'The Safe Place Visualization',
    description: 'Guide children through imagining their safest, most calming place. Builds an internal resource for self-regulation.',
    ageRange: 'Ages 5-12',
    category: 'Visualization',
    color: 'bg-growth-green/10 border-growth-green/20',
  },
  {
    title: 'Shake It Off',
    description: 'A movement-based regulation tool that helps children release stored physical tension through playful shaking.',
    ageRange: 'Ages 3-10',
    category: 'Movement',
    color: 'bg-orange-50 border-orange-200',
  },
  {
    title: 'The Calm Down Jar',
    description: 'Watch the glitter settle and breathe. A visual metaphor for how big feelings settle with time.',
    ageRange: 'Ages 3-8',
    category: 'Visual',
    color: 'bg-sky-blue-bg border-sky-blue/30',
  },
]

export default function KidsRegulationTools() {
  const [scripts, setScripts] = useState<Script[]>([])
  const [expandedScript, setExpandedScript] = useState<number | null>(null)

  useEffect(() => {
    fetch(`${API_URL}/api/content/scripts`)
      .then(r => r.ok ? r.json() : [])
      .then((data: Script[]) => setScripts(data.filter(s => s.active)))
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-sky-blue-bg to-healing-purple/5 flex flex-col">
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/dashboard" className="text-charcoal hover:text-slate-blue">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyan-600" />
            Kids Regulation Tools
          </h1>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold font-heading text-charcoal mb-2">
            Regulation Tools for Children
          </h2>
          <p className="text-charcoal-80">
            Interactive tools designed to help children build regulation skills, body awareness, and emotional literacy.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {tools.map((tool) => (
            <div
              key={tool.title}
              className={`bg-white rounded-xl p-6 border ${tool.color} hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs font-semibold text-charcoal-70 uppercase tracking-wide">
                    {tool.category}
                  </span>
                  <h3 className="text-lg font-bold font-heading text-charcoal mt-1">{tool.title}</h3>
                </div>
                <span className="text-xs bg-gray-100 text-charcoal-70 px-2 py-1 rounded-full">{tool.ageRange}</span>
              </div>
              <p className="text-sm text-charcoal-80 mb-4">{tool.description}</p>
              <button className="flex items-center gap-2 text-sm text-slate-blue font-medium hover:text-slate-blue-dark transition-colors">
                <Play className="w-4 h-4" /> Start Activity
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-growth-green" />
            <h3 className="font-bold text-charcoal">Tip for Caregivers</h3>
          </div>
          <p className="text-sm text-charcoal-80 leading-relaxed">
            Practice these tools with your child during calm moments, not only during dysregulation.
            Children learn regulation best when their nervous system is already in a regulated state.
            The more they practice when calm, the more accessible these tools become during hard moments.
          </p>
        </div>

        {scripts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold font-heading text-charcoal mb-4">De-escalation Scripts</h2>
            <div className="space-y-3">
              {scripts.map((script) => (
                <div key={script.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setExpandedScript(expandedScript === script.id ? null : script.id)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <h4 className="font-bold text-charcoal">{script.title}</h4>
                      <div className="flex gap-2 mt-1">
                        {script.situation && <span className="text-xs text-charcoal-70 italic">{script.situation}</span>}
                        {script.category && <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full">{script.category}</span>}
                        {script.age_group && <span className="text-xs bg-sky-blue-bg text-slate-blue px-2 py-0.5 rounded-full">{script.age_group}</span>}
                        {script.video_url && <span className="text-xs text-slate-blue flex items-center gap-0.5"><Video className="w-3 h-3" /> Video</span>}
                      </div>
                    </div>
                    {expandedScript === script.id ? <ChevronUp className="w-5 h-5 text-charcoal-70" /> : <ChevronDown className="w-5 h-5 text-charcoal-70" />}
                  </button>
                  {expandedScript === script.id && (
                    <div className="border-t border-gray-100 px-5 pb-5 pt-3">
                      <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-slate-blue">
                        <p className="text-sm text-charcoal whitespace-pre-wrap">{script.content}</p>
                      </div>
                      {script.video_url && (
                        <a href={script.video_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-3 text-sm text-slate-blue hover:underline font-medium">
                          <Video className="w-4 h-4" /> Watch Video
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <SafetyFooter />
    </div>
  )
}
