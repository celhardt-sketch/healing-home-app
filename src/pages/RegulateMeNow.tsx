import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Heart, Wind, Eye, Music, Hand, Timer } from 'lucide-react'
import SafetyFooter from '../components/SafetyFooter'

const techniques = [
  {
    id: 'box-breathing',
    title: 'Box Breathing',
    icon: Wind,
    color: 'bg-sky-blue/20 text-slate-blue',
    duration: '2 min',
    description: 'A simple, powerful breathing technique used by first responders and therapists to calm the nervous system quickly.',
    steps: [
      'Breathe IN slowly for 4 counts',
      'HOLD your breath for 4 counts',
      'Breathe OUT slowly for 4 counts',
      'HOLD empty for 4 counts',
      'Repeat 4 times',
    ],
    tip: 'Place one hand on your chest and one on your belly. Focus on the belly hand rising and falling.',
  },
  {
    id: '5-4-3-2-1',
    title: '5-4-3-2-1 Grounding',
    icon: Eye,
    color: 'bg-healing-purple/10 text-healing-purple',
    duration: '3 min',
    description: 'Engage your senses to bring you back to the present moment when anxiety or overwhelm takes over.',
    steps: [
      'Name 5 things you can SEE',
      'Name 4 things you can TOUCH',
      'Name 3 things you can HEAR',
      'Name 2 things you can SMELL',
      'Name 1 thing you can TASTE',
    ],
    tip: 'Take your time with each step. Really notice each sensation.',
  },
  {
    id: 'butterfly-hug',
    title: 'Butterfly Hug',
    icon: Heart,
    color: 'bg-growth-green/10 text-growth-green-dark',
    duration: '2 min',
    description: 'A bilateral stimulation technique that calms the nervous system through rhythmic self-touch.',
    steps: [
      'Cross your arms over your chest, hands on shoulders',
      'Alternate tapping: right hand, left hand, right hand, left hand',
      'Keep a slow, steady rhythm',
      'Close your eyes if comfortable',
      'Continue for 1-2 minutes',
    ],
    tip: 'This technique activates bilateral processing, similar to EMDR therapy.',
  },
  {
    id: 'cold-water',
    title: 'Cold Water Reset',
    icon: Hand,
    color: 'bg-sky-blue/20 text-slate-blue',
    duration: '1 min',
    description: 'The mammalian dive reflex immediately lowers heart rate and activates the parasympathetic nervous system.',
    steps: [
      'Hold cold water in cupped hands',
      'Splash cold water on your face',
      'Or hold ice cubes in your hands',
      'Or press a cold cloth to your neck',
      'Breathe slowly while the cold resets your system',
    ],
    tip: 'This is the fastest way to interrupt a fight-or-flight response.',
  },
  {
    id: 'body-scan',
    title: 'Quick Body Scan',
    icon: Timer,
    color: 'bg-healing-purple/10 text-healing-purple',
    duration: '3 min',
    description: 'Notice where you are holding tension and consciously release it, one body part at a time.',
    steps: [
      'Start at the top of your head. Notice any tension. Release it.',
      'Move to your forehead, jaw, neck. Soften.',
      'Notice your shoulders. Drop them away from your ears.',
      'Check your hands. Unclench your fists.',
      'Scan down to your belly, legs, feet. Let go.',
    ],
    tip: 'Caregiver nervous systems matter too. You cannot pour from an empty cup.',
  },
  {
    id: 'music',
    title: 'Music Reset',
    icon: Music,
    color: 'bg-growth-green/10 text-growth-green-dark',
    duration: '5 min',
    description: 'Music directly impacts the nervous system. Use it intentionally to shift your state.',
    steps: [
      'Put on headphones if possible',
      'Choose a song that grounds you (not sad, not high-energy)',
      'Close your eyes',
      'Focus on one instrument or the singer\'s voice',
      'Let the rhythm regulate your breathing',
    ],
    tip: 'Build a "regulation playlist" ahead of time so it\'s ready when you need it.',
  },
]

export default function RegulateMeNow() {
  const [selected, setSelected] = useState<string | null>(null)
  const technique = techniques.find((t) => t.id === selected)

  return (
    <div className="min-h-screen bg-gradient-to-br from-healing-purple/5 via-white to-sky-blue-bg flex flex-col">
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/dashboard" className="text-charcoal hover:text-slate-blue">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2">
            <Heart className="w-5 h-5 text-healing-purple" />
            Regulate Me Now
          </h1>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {!selected ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold font-heading text-charcoal mb-2">
                Choose a Regulation Tool
              </h2>
              <p className="text-charcoal-80">
                When you need support, self-care, and regulation tools. Pick what feels right for you right now.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {techniques.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelected(t.id)}
                  className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all text-left group"
                >
                  <div className={`w-10 h-10 ${t.color} rounded-lg flex items-center justify-center mb-3`}>
                    <t.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-charcoal group-hover:text-slate-blue transition-colors mb-1">
                    {t.title}
                  </h3>
                  <p className="text-xs text-charcoal-70 mb-2">{t.duration}</p>
                  <p className="text-sm text-charcoal-80">{t.description}</p>
                </button>
              ))}
            </div>
          </>
        ) : technique ? (
          <div className="max-w-lg mx-auto">
            <button
              onClick={() => setSelected(null)}
              className="flex items-center gap-2 text-sm text-charcoal-70 hover:text-slate-blue mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to all techniques
            </button>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className={`w-14 h-14 ${technique.color} rounded-xl flex items-center justify-center mb-4`}>
                <technique.icon className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold font-heading text-charcoal mb-2">{technique.title}</h2>
              <p className="text-xs text-charcoal-70 mb-4">{technique.duration}</p>
              <p className="text-charcoal-80 mb-6 leading-relaxed">{technique.description}</p>

              <ol className="space-y-3 mb-6">
                {technique.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-slate-blue text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-charcoal-80">{step}</span>
                  </li>
                ))}
              </ol>

              <div className="bg-sky-blue-bg rounded-xl p-4">
                <p className="text-sm text-slate-blue italic">{technique.tip}</p>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      <SafetyFooter />
    </div>
  )
}
