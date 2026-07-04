import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Brain, Info } from 'lucide-react'
import SafetyFooter from '../components/SafetyFooter'

// Kid-facing regulation videos. Third-party videos can be removed or renamed by
// their owners — periodic link-check: confirm each still plays and embeds.
// Last verified: 2026-07 (all six confirmed embeddable via YouTube oEmbed).
interface KidsVideo {
  title: string
  source: string
  description: string
  ageTag: string
  embedUrl: string
}

const kidsVideos: KidsVideo[] = [
  {
    title: 'Belly Breathing',
    source: 'Sesame Street (Sesame Workshop)',
    description: 'Elmo, Common & Colbie Caillat sing "Belly Breathe" — deep breathing to calm big feelings.',
    ageTag: 'Ages 3\u20137',
    embedUrl: 'https://www.youtube.com/embed/_mZbzDOpylA',
  },
  {
    title: 'Melting (Guided Calm-Down)',
    source: 'GoNoodle',
    description: 'A guided relaxation to "melt" away the frozen, angry, or scared feeling.',
    ageTag: 'Ages 5\u201310',
    embedUrl: 'https://www.youtube.com/embed/fTzXFPh6CPI',
  },
  {
    title: 'Be the Pond (Mindfulness)',
    source: 'Cosmic Kids Zen Den',
    description: 'Teaches noticing feelings without being swept up by them.',
    ageTag: 'Ages 5\u201310',
    embedUrl: 'https://www.youtube.com/embed/wf5K3pP2IUQ',
  },
  {
    title: 'Body Scan',
    source: 'Smiling Mind (mental-health nonprofit)',
    description: 'A guided head-to-toe body scan to release tension.',
    ageTag: 'Ages 7+',
    embedUrl: 'https://www.youtube.com/embed/VxYC_UcQ0PI',
  },
  {
    title: '5-4-3-2-1 Senses Grounding',
    source: 'The Partnership in Education, Duquesne University (NIH-funded)',
    description: 'The five-senses grounding technique to come back to the present moment.',
    ageTag: 'Ages 7+',
    embedUrl: 'https://www.youtube.com/embed/30VMIEmA114',
  },
  {
    title: 'Five-Finger Breathing',
    source: "CHOC Children's (Children's Hospital of Orange County)",
    description: 'Trace your hand while breathing — a self-contained tool needing only your hands.',
    ageTag: 'Ages 4+',
    embedUrl: 'https://www.youtube.com/embed/67JDaNcX3gE',
  },
]

const ageFilters = ['All ages', 'Ages 3\u20137', 'Ages 5\u201310', 'Ages 7+']

export default function KidsRegulationTools() {
  const [ageFilter, setAgeFilter] = useState('All ages')

  const visibleVideos =
    ageFilter === 'All ages' ? kidsVideos : kidsVideos.filter((v) => v.ageTag === ageFilter)

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-sky-blue-bg to-healing-purple/5 flex flex-col">
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/dashboard" className="text-charcoal hover:text-slate-blue" aria-label="Back to dashboard">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyan-600" />
            Regulation Tools for Kids
          </h1>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold font-heading text-charcoal mb-2">
            Regulation Tools for Kids
          </h2>
          <p className="text-charcoal-80 leading-relaxed">
            Short guided videos to help your child's body and mind settle. Try them together, and let your child pick the ones that feel good. There's no wrong way to use them.
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-cyan-200 flex items-start gap-3 mb-6">
          <Info className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
          <p className="text-sm text-charcoal-80 leading-relaxed">
            These are invitations &mdash; your child can pause, stop, or skip anytime.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filter videos by age">
          {ageFilters.map((f) => (
            <button
              key={f}
              onClick={() => setAgeFilter(f)}
              aria-pressed={ageFilter === f}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                ageFilter === f
                  ? 'bg-cyan-600 text-white'
                  : 'bg-white text-charcoal-80 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {visibleVideos.map((video) => (
            <div key={video.title} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="aspect-video bg-black">
                <iframe
                  src={video.embedUrl}
                  title={`Play ${video.title} video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h3 className="text-lg font-bold font-heading text-charcoal">{video.title}</h3>
                  <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full shrink-0">{video.ageTag}</span>
                </div>
                <p className="text-sm text-charcoal-80 leading-relaxed mb-2">{video.description}</p>
                <p className="text-xs text-charcoal-70">Source: {video.source}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <SafetyFooter />
    </div>
  )
}
