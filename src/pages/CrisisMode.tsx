import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, AlertTriangle, Shield, Heart, Brain, Phone, RotateCcw, Video, ChevronDown, ChevronUp } from 'lucide-react'
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

type AgeGroup = 'toddler' | 'preschool' | 'school-age' | 'preteen-teen' | null
type BehaviorType = 'aggression' | 'meltdown' | 'shutting-down' | 'defiance' | 'overwhelmed' | null

interface Step {
  title: string
  instruction: string
  tip: string
}

const steps: Record<string, Step[]> = {
  default: [
    {
      title: 'Step 1: Pause and Breathe',
      instruction: 'Before you do anything else, take three slow, deep breaths. You cannot regulate a child from a dysregulated state. Your calm is the intervention.',
      tip: 'Place one hand on your chest. Feel your own heartbeat slow. This is where healing starts.',
    },
    {
      title: 'Step 2: Assess Safety',
      instruction: 'Is anyone in immediate physical danger? If yes, ensure safety first. Remove dangerous objects, create physical distance if needed, and call for help if the situation requires it.',
      tip: 'Safety is non-negotiable. Everything else can wait until everyone is physically safe.',
    },
    {
      title: 'Step 3: Get Low and Soft',
      instruction: 'Lower your body to the child\'s level or below. Soften your face, your voice, and your posture. You are communicating safety with your entire body.',
      tip: 'Children read body language before words. A tall, tense adult feels like a threat to a scared child.',
    },
    {
      title: 'Step 4: Name What You See',
      instruction: 'Use simple, non-judgmental language: "I can see you\'re having a really hard time right now." Do not ask why. Do not lecture. Just name what is visible.',
      tip: 'Naming the emotion without judgment tells the child: I see you. I\'m not scared of your feelings.',
    },
    {
      title: 'Step 5: Offer Connection',
      instruction: 'Ask: "Can I sit with you?" or "Would a hug help?" Accept their answer. If they say no, stay nearby. Your presence is the regulation tool.',
      tip: 'Some children need space before they can accept connection. That\'s okay. Stay close enough to be found.',
    },
    {
      title: 'Step 6: Wait for the Wave to Pass',
      instruction: 'A meltdown is a wave. It will crest and fall. Your job is to be the shore. Stay calm, stay present, stay quiet if needed. The teaching moment comes later.',
      tip: 'Regulation before reason. Connection before correction. There is no learning in the storm.',
    },
    {
      title: 'Step 7: Repair and Reconnect',
      instruction: 'When calm returns, gently reconnect. "That was really hard. I\'m glad we got through it together." Then, when ready, reflect gently on what happened.',
      tip: 'Repair teaches children that relationships survive hard moments. This is attachment in action.',
    },
  ],
}

export default function CrisisMode() {
  const [currentStep, setCurrentStep] = useState(0)
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(null)
  const [behaviorType, setBehaviorType] = useState<BehaviorType>(null)
  const [started, setStarted] = useState(false)
  const [cards, setCards] = useState<FirstAidCard[]>([])
  const [expandedCard, setExpandedCard] = useState<number | null>(null)

  useEffect(() => {
    fetch(`${API_URL}/api/content/first_aid_cards`)
      .then(r => r.ok ? r.json() : [])
      .then((data: FirstAidCard[]) => setCards(data.filter(c => c.active)))
      .catch(() => {})
  }, [])

  const currentSteps = steps.default
  const step = currentSteps[currentStep]

  const reset = () => {
    setCurrentStep(0)
    setAgeGroup(null)
    setBehaviorType(null)
    setStarted(false)
  }

  if (!started) {
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

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Select the age range that best fits your child:</label>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    { value: 'toddler' as AgeGroup, label: 'Early Childhood' },
                    { value: 'preschool' as AgeGroup, label: 'Middle Childhood' },
                    { value: 'school-age' as AgeGroup, label: 'Early Adolescence' },
                    { value: 'preteen-teen' as AgeGroup, label: 'Adolescence' },
                  ].map((ag) => (
                    <button
                      key={ag.value}
                      onClick={() => setAgeGroup(ag.value)}
                      className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                        ageGroup === ag.value
                          ? 'bg-slate-blue text-white border-slate-blue'
                          : 'bg-white text-charcoal border-gray-200 hover:border-slate-blue'
                      }`}
                    >
                      {ag.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">What's happening? (optional)</label>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    { value: 'aggression' as BehaviorType, label: 'Aggression' },
                    { value: 'meltdown' as BehaviorType, label: 'Meltdown' },
                    { value: 'shutting-down' as BehaviorType, label: 'Shutting Down' },
                    { value: 'defiance' as BehaviorType, label: 'Defiance' },
                    { value: 'overwhelmed' as BehaviorType, label: 'Overwhelmed' },
                  ].map((bt) => (
                    <button
                      key={bt.value}
                      onClick={() => setBehaviorType(bt.value)}
                      className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                        behaviorType === bt.value
                          ? 'bg-slate-blue text-white border-slate-blue'
                          : 'bg-white text-charcoal border-gray-200 hover:border-slate-blue'
                      }`}
                    >
                      {bt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setStarted(true)}
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Start De-escalation Guide
            </button>
          </div>

          <div className="mt-6 bg-red-100 rounded-xl p-4 text-center">
            <p className="text-sm text-red-800 flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              If someone is in immediate danger, call <a href="tel:911" className="font-bold underline">911</a>
            </p>
          </div>

          {cards.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-bold font-heading text-charcoal mb-4 text-center">Behavior-Specific Cards</h3>
              <div className="space-y-3">
                {cards.map((card) => (
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
        </main>

        <SafetyFooter />
      </div>
    )
  }

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
            Step {currentStep + 1} of {currentSteps.length}
          </span>
        </div>
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / currentSteps.length) * 100}%` }}
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
            <h2 className="text-xl font-bold font-heading text-charcoal">{step.title}</h2>
          </div>

          <p className="text-charcoal-80 leading-relaxed mb-6">{step.instruction}</p>

          <div className="bg-sky-blue-bg rounded-xl p-4">
            <p className="text-sm text-slate-blue italic font-heading">{step.tip}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-2 text-charcoal hover:text-slate-blue disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          {currentStep < currentSteps.length - 1 ? (
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
