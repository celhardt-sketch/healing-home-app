import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, AlertTriangle, Shield, Heart, Brain, Phone, RotateCcw, Video, ChevronDown, ChevronUp, X } from 'lucide-react'
import SafetyFooter from '../components/SafetyFooter'

const API_URL = import.meta.env.VITE_API_URL || ''

interface FirstAidCard {
  id: number
  title: string
  content: string
  age_group: string
  category: string
  video_url: string | null
  active: number
}

interface PageSection {
  page: string
  section: string
  content: string
  content_type: string
}

interface Step {
  title: string
  instruction: string
  tip: string
}

const AGE_GROUP_MAP: Record<string, string> = {
  'Ages 4-6': 'Early Childhood (4-6)',
  'Ages 7-10': 'Middle Childhood (7-10)',
  'Ages 11-13': 'Early Adolescence (11-13)',
  'Ages 14-18': 'Adolescence (14-18)',
}

const AGE_GROUP_ORDER = ['Ages 4-6', 'Ages 7-10', 'Ages 11-13', 'Ages 14-18']

const DEFAULT_STEPS: Step[] = [
  {
    title: 'Pause and Breathe',
    instruction: 'Before you do anything else, take three slow, deep breaths. You cannot regulate a child from a dysregulated state. Your calm is the intervention.',
    tip: 'Place one hand on your chest. Feel your own heartbeat slow. This is where healing starts.',
  },
  {
    title: 'Assess Safety',
    instruction: 'Is anyone in immediate physical danger? If yes, ensure safety first. Remove dangerous objects, create physical distance if needed, and call for help if the situation requires it.',
    tip: 'Safety is non-negotiable. Everything else can wait until everyone is physically safe.',
  },
  {
    title: 'Get Low and Soft',
    instruction: "Lower your body to the child's level or below. Soften your face, your voice, and your posture. You are communicating safety with your entire body.",
    tip: 'Children read body language before words. A tall, tense adult feels like a threat to a scared child.',
  },
  {
    title: 'Name What You See',
    instruction: 'Use simple, non-judgmental language: "I can see you\'re having a really hard time right now." Do not ask why. Do not lecture. Just name what is visible.',
    tip: "Naming the emotion without judgment tells the child: I see you. I'm not scared of your feelings.",
  },
  {
    title: 'Offer Connection',
    instruction: 'Ask: "Can I sit with you?" or "Would a hug help?" Accept their answer. If they say no, stay nearby. Your presence is the regulation tool.',
    tip: "Some children need space before they can accept connection. That's okay. Stay close enough to be found.",
  },
  {
    title: 'Wait for the Wave to Pass',
    instruction: 'A meltdown is a wave. It will crest and fall. Your job is to be the shore. Stay calm, stay present, stay quiet if needed. The teaching moment comes later.',
    tip: 'Regulation before reason. Connection before correction. There is no learning in the storm.',
  },
  {
    title: 'Repair and Reconnect',
    instruction: 'When calm returns, gently reconnect. "That was really hard. I\'m glad we got through it together." Then, when ready, reflect gently on what happened.',
    tip: 'Repair teaches children that relationships survive hard moments. This is attachment in action.',
  },
]

export default function CrisisMode() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAge, setSelectedAge] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showDeescalation, setShowDeescalation] = useState(false)
  const [cards, setCards] = useState<FirstAidCard[]>([])
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
  const [steps, setSteps] = useState<Step[]>(DEFAULT_STEPS)

  useEffect(() => {
    fetch(`${API_URL}/api/content/first_aid_cards`)
      .then(r => r.ok ? r.json() : [])
      .then((data: FirstAidCard[]) => setCards(data.filter(c => c.active)))
      .catch(() => {})

    fetch(`${API_URL}/api/page-content/crisis_steps`)
      .then(r => r.ok ? r.json() : [])
      .then((sections: PageSection[]) => {
        if (sections.length === 0) return
        const parsed: Step[] = []
        for (let i = 1; i <= 20; i++) {
          const title = sections.find(s => s.section === `step_${i}_title`)?.content
          const instruction = sections.find(s => s.section === `step_${i}_instruction`)?.content
          const tip = sections.find(s => s.section === `step_${i}_tip`)?.content
          if (title && instruction) {
            parsed.push({ title, instruction, tip: tip || '' })
          }
        }
        if (parsed.length > 0) setSteps(parsed)
      })
      .catch(() => {})
  }, [])

  // Separate child cards from caregiver tools
  const childCards = useMemo(() => cards.filter(c => c.category !== 'Caregiver Tool' && c.category !== 'Kids Tool'), [cards])
  const caregiverTools = useMemo(() => cards.filter(c => c.category === 'Caregiver Tool'), [cards])

  // Get unique categories from child cards, sorted
  const availableCategories = useMemo(() => {
    const cats = new Set<string>()
    childCards.forEach(c => { if (c.category) cats.add(c.category) })
    return Array.from(cats).sort()
  }, [childCards])

  // Get categories available for the selected age group
  const categoriesForAge = useMemo(() => {
    if (!selectedAge) return availableCategories
    const cats = new Set<string>()
    childCards.filter(c => c.age_group === selectedAge).forEach(c => { if (c.category) cats.add(c.category) })
    return Array.from(cats).sort()
  }, [childCards, selectedAge, availableCategories])

  // Filter cards based on selection
  const filteredCards = useMemo(() => {
    if (!selectedAge && !selectedCategory) return []
    return childCards.filter(c => {
      if (selectedAge && c.age_group !== selectedAge) return false
      if (selectedCategory && c.category !== selectedCategory) return false
      return true
    })
  }, [childCards, selectedAge, selectedCategory])

  const step = steps[currentStep]

  const reset = () => {
    setCurrentStep(0)
    setShowDeescalation(false)
  }

  const clearFilters = () => {
    setSelectedAge(null)
    setSelectedCategory(null)
    setExpandedCard(null)
  }

  // De-escalation guide view
  if (showDeescalation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex flex-col">
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={reset} className="text-charcoal hover:text-slate-blue">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-bold font-heading text-charcoal">
                De-escalation Guide
              </h1>
            </div>
            <span className="text-sm text-charcoal-70">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <div className="h-1 bg-gray-100">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              {currentStep < 2 ? (
                <Shield className="w-8 h-8 text-red-500" />
              ) : currentStep < 5 ? (
                <Brain className="w-8 h-8 text-slate-blue" />
              ) : (
                <Heart className="w-8 h-8 text-healing-purple" />
              )}
              <h2 className="text-xl font-bold font-heading text-charcoal">Step {currentStep + 1}: {step.title}</h2>
            </div>

            <p className="text-charcoal-80 leading-relaxed mb-6">{step.instruction}</p>

            {step.tip && (
              <div className="bg-sky-blue-bg rounded-xl p-4">
                <p className="text-sm text-slate-blue italic font-heading">{step.tip}</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="flex items-center gap-2 text-charcoal hover:text-slate-blue disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex items-center gap-2 bg-slate-blue text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-blue-dark transition-colors"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={reset}
                className="flex items-center gap-2 bg-growth-green text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-growth-green-dark transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Start Over
              </button>
            )}
          </div>
        </main>

        <SafetyFooter />
      </div>
    )
  }

  // Main First Aid page
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex flex-col">
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-charcoal hover:text-slate-blue">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              First Aid for Big Feelings &amp; Behaviors
            </h1>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-charcoal mb-4">
            Immediate support for challenging moments
          </h2>
          <p className="text-charcoal-80 mb-8 leading-relaxed">
            Before we go further, we need to make sure everyone is safe right now. If someone is at risk of hurting themselves or others, or if there is a medical emergency, please contact emergency services first. Everything else can wait.
          </p>

          {/* Age Group Selection */}
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Select the age range that best fits your child:</label>
              <div className="flex flex-wrap gap-2 justify-center">
                {AGE_GROUP_ORDER.map((age) => (
                  <button
                    key={age}
                    onClick={() => {
                      setSelectedAge(selectedAge === age ? null : age)
                      setExpandedCard(null)
                    }}
                    className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                      selectedAge === age
                        ? 'bg-slate-blue text-white border-slate-blue'
                        : 'bg-white text-charcoal border-gray-200 hover:border-slate-blue'
                    }`}
                  >
                    {AGE_GROUP_MAP[age]}
                  </button>
                ))}
              </div>
            </div>

            {/* Behavior/Category Selection - dynamic based on available cards */}
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">What's happening?</label>
              <div className="flex flex-wrap gap-2 justify-center">
                {categoriesForAge.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(selectedCategory === cat ? null : cat)
                      setExpandedCard(null)
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                      selectedCategory === cat
                        ? 'bg-slate-blue text-white border-slate-blue'
                        : 'bg-white text-charcoal border-gray-200 hover:border-slate-blue'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Clear filters */}
          {(selectedAge || selectedCategory) && (
            <button
              onClick={clearFilters}
              className="text-sm text-charcoal-70 hover:text-charcoal mb-4 inline-flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Clear filters
            </button>
          )}

          {/* De-escalation Guide button - always available */}
          <div className="mt-4">
            <button
              onClick={() => { setCurrentStep(0); setShowDeescalation(true) }}
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Start De-escalation Guide
            </button>
            <p className="text-xs text-charcoal-60 mt-2">Step-by-step crisis de-escalation walkthrough</p>
          </div>
        </div>

        <div className="mt-6 bg-red-100 rounded-xl p-4 text-center">
          <p className="text-sm text-red-800 flex items-center justify-center gap-2">
            <Phone className="w-4 h-4" />
            If someone is in immediate danger, call <a href="tel:911" className="font-bold underline">911</a>
          </p>
        </div>

        {/* Filtered First Aid Cards */}
        {filteredCards.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold font-heading text-charcoal mb-1 text-center">
              {selectedAge && selectedCategory
                ? `${selectedCategory} — ${AGE_GROUP_MAP[selectedAge]}`
                : selectedAge
                  ? `All cards for ${AGE_GROUP_MAP[selectedAge]}`
                  : selectedCategory
                    ? `${selectedCategory} — All ages`
                    : 'Behavior-Specific Cards'}
            </h3>
            <p className="text-sm text-charcoal-60 text-center mb-4">
              {filteredCards.length} card{filteredCards.length !== 1 ? 's' : ''} found
            </p>
            <div className="space-y-3">
              {filteredCards.map((card) => (
                <div key={card.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <button
                    onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-healing-purple flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-charcoal text-sm">{card.title}</h4>
                        <div className="flex gap-2 mt-0.5">
                          {card.category && <span className="text-xs bg-healing-purple/10 text-healing-purple px-2 py-0.5 rounded-full">{card.category}</span>}
                          {card.age_group && <span className="text-xs bg-sky-blue-bg text-slate-blue px-2 py-0.5 rounded-full">{card.age_group}</span>}
                        </div>
                      </div>
                    </div>
                    {expandedCard === card.id ? <ChevronUp className="w-4 h-4 text-charcoal-70" /> : <ChevronDown className="w-4 h-4 text-charcoal-70" />}
                  </button>
                  {expandedCard === card.id && (
                    <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                      <p className="text-sm text-charcoal-80 whitespace-pre-wrap">{card.content}</p>
                      {card.video_url && (
                        <a href={card.video_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-3 text-sm text-slate-blue hover:underline font-medium">
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

        {/* Prompt to select if no filters */}
        {!selectedAge && !selectedCategory && childCards.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-charcoal-60 text-sm">Select an age range and behavior above to see specific First Aid cards.</p>
          </div>
        )}

        {/* Caregiver Tools section */}
        {caregiverTools.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold font-heading text-charcoal mb-1 text-center">
              Caregiver Regulation Tools
            </h3>
            <p className="text-sm text-charcoal-60 text-center mb-4">
              Tools for you — the adult — to regulate in the moment
            </p>
            <div className="space-y-3">
              {caregiverTools.map((card) => (
                <div key={card.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <button
                    onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-healing-purple flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-charcoal text-sm">{card.title}</h4>
                        <div className="flex gap-2 mt-0.5">
                          <span className="text-xs bg-healing-purple/10 text-healing-purple px-2 py-0.5 rounded-full">Caregiver Tool</span>
                        </div>
                      </div>
                    </div>
                    {expandedCard === card.id ? <ChevronUp className="w-4 h-4 text-charcoal-70" /> : <ChevronDown className="w-4 h-4 text-charcoal-70" />}
                  </button>
                  {expandedCard === card.id && (
                    <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                      <p className="text-sm text-charcoal-80 whitespace-pre-wrap">{card.content}</p>
                      {card.video_url && (
                        <a href={card.video_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-3 text-sm text-slate-blue hover:underline font-medium">
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
