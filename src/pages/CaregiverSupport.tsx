import { Link } from 'react-router-dom'
import { ArrowLeft, Heart, Play, BookOpen, Coffee, Moon, Shield } from 'lucide-react'
import SafetyFooter from '../components/SafetyFooter'

const sections = [
  {
    title: 'Regulation Videos',
    icon: Play,
    description: 'Follow along with these guided videos to help calm your nervous system.',
    color: 'text-growth-green',
    items: [
      { title: 'Box Breathing for Caregivers', duration: '3 min' },
      { title: 'Progressive Muscle Relaxation', duration: '8 min' },
      { title: 'Guided Body Scan', duration: '10 min' },
      { title: 'Mindful Grounding Exercise', duration: '5 min' },
    ],
  },
  {
    title: 'Self-Care Check-In',
    icon: Coffee,
    description: 'Regular check-ins help you recognize when your own cup is running low.',
    color: 'text-healing-purple',
    items: [
      { title: 'Daily Caregiver Check-In', duration: '2 min' },
      { title: 'Weekly Reflection Prompts', duration: '10 min' },
      { title: 'Compassion Fatigue Assessment', duration: '5 min' },
      { title: 'Burnout Warning Signs', duration: 'Reference' },
    ],
  },
  {
    title: 'Caregiver Education',
    icon: BookOpen,
    description: 'Understanding your own responses helps you show up better for your child.',
    color: 'text-slate-blue',
    items: [
      { title: 'Understanding Blocked Care', duration: 'Article' },
      { title: 'Secondary Trauma in Caregivers', duration: 'Article' },
      { title: 'The Biology of Caregiver Stress', duration: 'Article' },
      { title: 'Repair After Caregiver Rupture', duration: 'Article' },
    ],
  },
  {
    title: 'Evening Wind-Down',
    icon: Moon,
    description: 'End your day with intentional practices that support nervous system recovery.',
    color: 'text-sky-blue',
    items: [
      { title: 'Gratitude & Wins Reflection', duration: '5 min' },
      { title: 'Body Release Sequence', duration: '7 min' },
      { title: 'Journaling Prompts for Caregivers', duration: '10 min' },
      { title: 'Sleep Preparation Ritual', duration: '5 min' },
    ],
  },
]

export default function CaregiverSupport() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-growth-green/5 via-white to-healing-purple/5 flex flex-col">
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/dashboard" className="text-charcoal hover:text-slate-blue">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2">
            <Heart className="w-5 h-5 text-growth-green" />
            Caregiver Support
          </h1>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold font-heading text-charcoal mb-2">
            Your Well-Being Matters
          </h2>
          <p className="text-charcoal-80">
            Caregiver nervous systems matter too. You cannot pour from an empty cup.
            These tools are designed to help you regulate, reflect, and recharge.
          </p>
        </div>

        <div className="bg-growth-green/10 rounded-xl p-6 mb-8 flex items-start gap-4">
          <Shield className="w-6 h-6 text-growth-green shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-charcoal mb-1">A Reminder</h3>
            <p className="text-sm text-charcoal-80 leading-relaxed">
              Seeking support is a growth skill. Taking care of yourself is not selfish.
              It is the foundation that everything else rests on. Children borrow regulation
              from regulated adults.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2 mb-2">
                <section.icon className={`w-5 h-5 ${section.color}`} />
                {section.title}
              </h3>
              <p className="text-sm text-charcoal-80 mb-4">{section.description}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {section.items.map((item) => (
                  <div
                    key={item.title}
                    className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-sm transition-shadow flex items-center justify-between cursor-pointer"
                  >
                    <span className="text-sm font-medium text-charcoal">{item.title}</span>
                    <span className="text-xs text-charcoal-70 bg-gray-50 px-2 py-1 rounded">{item.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <SafetyFooter />
    </div>
  )
}
