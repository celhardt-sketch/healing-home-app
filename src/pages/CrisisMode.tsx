import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, Shield, Heart, Phone, Video, X } from 'lucide-react'
import SafetyFooter from '../components/SafetyFooter'
import CrisisBanner from '../components/CrisisBanner'

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

type FlowStep =
  | 'safety-check'
  | 'emergency'
  | 'caregiver-checkin'
  | 'overwhelmed'
  | 'crisis-support'
  | 'first-aid'
  | 'card-view'

const AGE_GROUP_MAP: Record<string, string> = {
  'Ages 4-6': 'Early Childhood (4-6)',
  'Ages 7-10': 'Middle Childhood (7-10)',
  'Ages 11-13': 'Early Adolescence (11-13)',
  'Ages 14-18': 'Adolescence (14-18)',
}

const AGE_GROUP_ORDER = ['Ages 4-6', 'Ages 7-10', 'Ages 11-13', 'Ages 14-18']

interface ParsedCard {
  whatYoureSeing: string
  whatMayBeHappening: string
  yourResponse: string
  beWith: string
  stepByStep: string[]
  whatNotToDo: string[]
  repair: string
  safetyLimits: string
}

function parseCardContent(content: string): ParsedCard {
  const result: ParsedCard = {
    whatYoureSeing: '',
    whatMayBeHappening: '',
    yourResponse: '',
    beWith: '',
    stepByStep: [],
    whatNotToDo: [],
    repair: '',
    safetyLimits: '',
  }

  const observableMatch = content.match(/Observable Behavior:\s*([\s\S]*?)(?=Trauma-Informed Explanation:|$)/)
  if (observableMatch) result.whatYoureSeing = observableMatch[1].trim()

  const traumaMatch = content.match(/Trauma-Informed Explanation:\s*([\s\S]*?)(?=Caregiver Response:|$)/)
  if (traumaMatch) result.whatMayBeHappening = traumaMatch[1].trim()

  const responseMatch = content.match(/Caregiver Response:\s*([\s\S]*?)(?=Step-by-Step Actions:|$)/)
  if (responseMatch) {
    const responseFull = responseMatch[1].trim()
    const beWithPatterns = [
      /Before you act, remember:.*$/ms,
      /Be present without pressure\..*$/ms,
      /Your job right now is simply to be with.*$/ms,
      /Be near.*$/ms,
    ]
    let beWithText = ''
    let responseText = responseFull
    for (const pat of beWithPatterns) {
      const m = responseFull.match(pat)
      if (m) {
        beWithText = m[0].trim()
        responseText = responseFull.slice(0, m.index).trim()
        break
      }
    }
    result.yourResponse = responseText
    result.beWith = beWithText
  }

  const stepsMatch = content.match(/Step-by-Step Actions:\s*([\s\S]*?)(?=What NOT To Do:|$)/)
  if (stepsMatch) {
    result.stepByStep = stepsMatch[1]
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0)
  }

  const notDoMatch = content.match(/What NOT To Do:\s*([\s\S]*?)(?=Repair Guidance:|$)/)
  if (notDoMatch) {
    result.whatNotToDo = notDoMatch[1]
      .split('•')
      .map(s => s.trim())
      .filter(s => s.length > 0)
  }

  const repairMatch = content.match(/Repair Guidance:\s*([\s\S]*?)(?=Safety Limits:|$)/)
  if (repairMatch) result.repair = repairMatch[1].trim()

  const safetyMatch = content.match(/Safety Limits:\s*([\s\S]*?)$/)
  if (safetyMatch) result.safetyLimits = safetyMatch[1].trim()

  return result
}

export default function CrisisMode() {
  const [flowStep, setFlowStep] = useState<FlowStep>('safety-check')
  const [selectedAge, setSelectedAge] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [cards, setCards] = useState<FirstAidCard[]>([])
  const [viewingCardIndex, setViewingCardIndex] = useState(0)

  useEffect(() => {
    fetch(`${API_URL}/api/content/first_aid_cards`)
      .then(r => r.ok ? r.json() : [])
      .then((data: FirstAidCard[]) => setCards(data.filter(c => c.active)))
      .catch(() => {})
  }, [])

  const childCards = useMemo(() => cards.filter(c => c.category !== 'Caregiver Tool' && c.category !== 'Kids Tool'), [cards])

  const categoriesForAge = useMemo(() => {
    if (!selectedAge) return []
    const cats = new Set<string>()
    childCards.filter(c => c.age_group === selectedAge).forEach(c => { if (c.category) cats.add(c.category) })
    return Array.from(cats).sort()
  }, [childCards, selectedAge])

  const filteredCards = useMemo(() => {
    if (!selectedAge || !selectedCategory) return []
    return childCards.filter(c => c.age_group === selectedAge && c.category === selectedCategory)
  }, [childCards, selectedAge, selectedCategory])

  const startOver = () => {
    setFlowStep('safety-check')
    setSelectedAge(null)
    setSelectedCategory(null)
    setViewingCardIndex(0)
  }

  const clearFilters = () => {
    setSelectedAge(null)
    setSelectedCategory(null)
    setViewingCardIndex(0)
  }

  // --- SCREEN: Safety Check ---
  if (flowStep === 'safety-check') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex flex-col">
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center gap-3">
            <Link to="/dashboard" className="text-charcoal hover:text-slate-blue">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              First Aid for Big Feelings &amp; Behaviors
            </h1>
          </div>
        </div>

        <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
          <CrisisBanner className="mb-6" />
          <p className="text-sm text-charcoal-70 text-center mb-6 leading-relaxed">
            This is in-the-moment psychoeducational support, not treatment or a crisis service. If you
            need urgent help, use the numbers above.
          </p>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold font-heading text-charcoal mb-4">
              First: Is Anyone in Immediate Danger?
            </h2>
            <p className="text-charcoal-80 mb-8 leading-relaxed">
              Before we go further, we need to make sure everyone is safe right now.
              If someone is at risk of hurting themselves or others, or if there is a medical emergency,
              please contact emergency services first. Everything else can wait.
            </p>

            <div className="space-y-4">
              <button
                onClick={() => setFlowStep('emergency')}
                className="w-full bg-red-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-red-700 transition-colors text-left"
              >
                <div className="font-bold text-lg">Yes, someone may be in danger</div>
                <div className="text-red-100 text-sm mt-1">There is a safety concern or emergency right now</div>
              </button>

              <button
                onClick={() => setFlowStep('caregiver-checkin')}
                className="w-full bg-slate-blue text-white px-6 py-4 rounded-xl font-semibold hover:bg-slate-blue-dark transition-colors text-left"
              >
                <div className="font-bold text-lg">No, everyone is physically safe</div>
                <div className="text-sky-blue text-sm mt-1">The situation is difficult but no one is in immediate danger</div>
              </button>
            </div>
          </div>
        </main>

        <SafetyFooter />
      </div>
    )
  }

  // --- SCREEN: Emergency Services ---
  if (flowStep === 'emergency') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex flex-col">
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center gap-3">
            <button onClick={startOver} className="text-charcoal hover:text-slate-blue">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2">
              <Phone className="w-6 h-6 text-red-500" />
              Contact Emergency Services
            </h1>
          </div>
        </div>

        <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-charcoal-80 leading-relaxed">
                You are doing the right thing by seeking help. Safety comes first, always.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                <h3 className="font-bold font-heading text-charcoal text-lg mb-1">Emergency Services:</h3>
                <a href="tel:911" className="text-2xl font-bold text-red-600 hover:underline">Call 911</a>
                <p className="text-charcoal-70 text-sm mt-1">If anyone is in immediate physical danger</p>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="font-bold font-heading text-charcoal text-lg mb-1">Suicide &amp; Crisis Lifeline:</h3>
                <a href="tel:988" className="text-2xl font-bold text-blue-600 hover:underline">Call or text 988</a>
                <p className="text-charcoal-70 text-sm mt-1">24/7 support for suicidal thoughts, self-harm, or emotional crisis</p>
              </div>

              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="font-bold font-heading text-charcoal text-lg mb-1">Crisis Text Line:</h3>
                <p className="text-2xl font-bold text-green-700">Text HOME to 741741</p>
                <p className="text-charcoal-70 text-sm mt-1">Free, 24/7 crisis support via text message</p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-200 text-center">
              <p className="text-charcoal-80 text-sm leading-relaxed">
                Once everyone is safe, you can return here for guidance on what happened.
                There is no rush. Take care of safety first.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <button
                onClick={() => setFlowStep('caregiver-checkin')}
                className="w-full bg-slate-blue text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-blue-dark transition-colors"
              >
                Everyone is safe now. Continue to crisis support.
              </button>
              <p className="text-xs text-charcoal-70 text-center">Proceed to caregiver check-in and first aid cards</p>

              <button
                onClick={startOver}
                className="w-full bg-white text-charcoal border border-gray-200 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Start Over
              </button>
            </div>
          </div>
        </main>

        <SafetyFooter />
      </div>
    )
  }

  // --- SCREEN: Caregiver Check-in ---
  if (flowStep === 'caregiver-checkin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex flex-col">
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center gap-3">
            <button onClick={startOver} className="text-charcoal hover:text-slate-blue">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2">
              <Heart className="w-6 h-6 text-healing-purple" />
              Check In With Yourself
            </h1>
          </div>
        </div>

        <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-healing-purple/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-healing-purple" />
            </div>
            <h2 className="text-2xl font-bold font-heading text-charcoal mb-2">
              Your regulation matters.
            </h2>
            <p className="text-charcoal-80 mb-2 leading-relaxed">
              Take a moment to assess where you are right now.
            </p>
            <p className="text-charcoal-70 text-sm mb-8 leading-relaxed">
              We walk alongside you in the toughest moments. But first, let&apos;s make sure you have what you need to support your child effectively.
            </p>

            <h3 className="text-lg font-bold font-heading text-charcoal mb-4">
              How are you feeling right now?
            </h3>

            <div className="space-y-3">
              <button
                onClick={() => setFlowStep('first-aid')}
                className="w-full bg-growth-green text-white px-6 py-4 rounded-xl font-semibold hover:bg-growth-green-dark transition-colors text-left"
              >
                <div className="font-bold text-lg">Calm &amp; Grounded</div>
                <div className="text-green-100 text-sm mt-1">I&apos;m regulated and ready to support my child</div>
              </button>

              <button
                onClick={() => setFlowStep('first-aid')}
                className="w-full bg-slate-blue text-white px-6 py-4 rounded-xl font-semibold hover:bg-slate-blue-dark transition-colors text-left"
              >
                <div className="font-bold text-lg">Stressed but Managing</div>
                <div className="text-sky-blue text-sm mt-1">I&apos;m feeling the pressure but can stay present</div>
              </button>

              <button
                onClick={() => setFlowStep('overwhelmed')}
                className="w-full bg-amber-500 text-white px-6 py-4 rounded-xl font-semibold hover:bg-amber-600 transition-colors text-left"
              >
                <div className="font-bold text-lg">Overwhelmed</div>
                <div className="text-amber-100 text-sm mt-1">I&apos;m struggling to stay calm myself</div>
              </button>

              <button
                onClick={() => setFlowStep('crisis-support')}
                className="w-full bg-red-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-red-700 transition-colors text-left"
              >
                <div className="font-bold text-lg">In Crisis</div>
                <div className="text-red-100 text-sm mt-1">I need immediate support or the situation is unsafe</div>
              </button>
            </div>
          </div>
        </main>

        <SafetyFooter />
      </div>
    )
  }

  // --- SCREEN: Overwhelmed ---
  if (flowStep === 'overwhelmed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex flex-col">
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center gap-3">
            <button onClick={() => setFlowStep('caregiver-checkin')} className="text-charcoal hover:text-slate-blue">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2">
              <Heart className="w-6 h-6 text-amber-500" />
              You Need Support Too
            </h1>
          </div>
        </div>

        <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-6">
              <p className="text-charcoal-80 leading-relaxed">
                When you&apos;re overwhelmed or in crisis, the most compassionate thing you can do is get support for yourself first.
                You cannot pour from an empty cup.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="font-bold font-heading text-charcoal text-lg mb-4">Next steps:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-charcoal-80">
                  <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold text-amber-700">1</span>
                  Contact your child&apos;s therapist or case worker
                </li>
                <li className="flex items-start gap-3 text-charcoal-80">
                  <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold text-amber-700">2</span>
                  Reach out to your support network
                </li>
                <li className="flex items-start gap-3 text-charcoal-80">
                  <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold text-amber-700">3</span>
                  Consider respite care if available
                </li>
                <li className="flex items-start gap-3 text-charcoal-80">
                  <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold text-amber-700">4</span>
                  Return to this app when you&apos;re more regulated
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                <h3 className="font-bold font-heading text-charcoal mb-1">Immediate Crisis Support:</h3>
                <a href="tel:988" className="text-xl font-bold text-blue-600 hover:underline">Call or text 988</a>
                <p className="text-charcoal-70 text-sm mt-1">Suicide &amp; Crisis Lifeline</p>
              </div>

              <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                <h3 className="font-bold font-heading text-charcoal mb-1">Emergency Services:</h3>
                <a href="tel:911" className="text-xl font-bold text-red-600 hover:underline">Call 911</a>
                <p className="text-charcoal-70 text-sm mt-1">If anyone is in immediate danger</p>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={startOver}
                className="w-full bg-white text-charcoal border border-gray-200 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Start Over
              </button>
            </div>
          </div>
        </main>

        <SafetyFooter />
      </div>
    )
  }

  // --- SCREEN: In Crisis ---
  if (flowStep === 'crisis-support') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex flex-col">
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center gap-3">
            <button onClick={() => setFlowStep('caregiver-checkin')} className="text-charcoal hover:text-slate-blue">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2">
              <Phone className="w-6 h-6 text-red-500" />
              Immediate Crisis Support
            </h1>
          </div>
        </div>

        <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="font-bold font-heading text-charcoal text-lg mb-1">Immediate Crisis Support:</h3>
                <a href="tel:988" className="text-2xl font-bold text-blue-600 hover:underline">Call or text 988</a>
                <p className="text-charcoal-70 text-sm mt-1">Suicide &amp; Crisis Lifeline</p>
              </div>

              <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                <h3 className="font-bold font-heading text-charcoal text-lg mb-1">Emergency Services:</h3>
                <a href="tel:911" className="text-2xl font-bold text-red-600 hover:underline">Call 911</a>
                <p className="text-charcoal-70 text-sm mt-1">If anyone is in immediate danger</p>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={startOver}
                className="w-full bg-white text-charcoal border border-gray-200 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Start Over
              </button>
            </div>
          </div>
        </main>

        <SafetyFooter />
      </div>
    )
  }

  // --- SCREEN: Card View (single card detail) ---
  if (flowStep === 'card-view' && filteredCards.length > 0) {
    const card = filteredCards[viewingCardIndex]
    const parsed = parseCardContent(card.content)

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex flex-col">
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center gap-3">
            <button onClick={() => setFlowStep('first-aid')} className="text-charcoal hover:text-slate-blue">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold font-heading text-charcoal">
              First Aid Card
            </h1>
            {filteredCards.length > 1 && (
              <span className="text-sm text-charcoal-70 ml-auto">
                {viewingCardIndex + 1} of {filteredCards.length}
              </span>
            )}
          </div>
        </div>

        <main className="flex-1 container mx-auto px-4 py-6 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-slate-blue to-healing-purple p-6 text-white">
              <h2 className="text-2xl font-bold font-heading mb-2">{card.title}</h2>
              <p className="text-white/80 text-sm">
                {card.category} &bull; {card.age_group ? AGE_GROUP_MAP[card.age_group] || card.age_group : ''}
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Reminder:</strong> This is general psychoeducational guidance, not a clinical recommendation.
                  Always defer to your child&apos;s treating mental health professional.
                  If anyone is in immediate danger, call 911.
                </p>
              </div>

              {/* What You're Seeing */}
              {parsed.whatYoureSeing && (
                <div>
                  <h3 className="text-lg font-bold font-heading text-charcoal mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                    What You&apos;re Seeing:
                  </h3>
                  <p className="text-charcoal-80 leading-relaxed">{parsed.whatYoureSeing}</p>
                </div>
              )}

              {/* What May Be Happening */}
              {parsed.whatMayBeHappening && (
                <div>
                  <h3 className="text-lg font-bold font-heading text-charcoal mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-healing-purple rounded-full" />
                    What May Be Happening:
                  </h3>
                  <p className="text-charcoal-80 leading-relaxed">{parsed.whatMayBeHappening}</p>
                </div>
              )}

              {/* Your Response */}
              {parsed.yourResponse && (
                <div>
                  <h3 className="text-lg font-bold font-heading text-charcoal mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-slate-blue rounded-full" />
                    Your Response:
                  </h3>
                  <p className="text-charcoal-80 leading-relaxed">{parsed.yourResponse}</p>
                </div>
              )}

              {/* Before You Act: Be With */}
              {parsed.beWith && (
                <div className="bg-sky-blue-bg rounded-xl p-5">
                  <h3 className="text-lg font-bold font-heading text-charcoal mb-2 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-healing-purple" />
                    Before You Act: Be With
                  </h3>
                  <p className="text-charcoal-80 leading-relaxed italic">{parsed.beWith}</p>
                </div>
              )}

              {/* Step by Step */}
              {parsed.stepByStep.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold font-heading text-charcoal mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-growth-green rounded-full" />
                    Step by Step:
                  </h3>
                  <ol className="space-y-2">
                    {parsed.stepByStep.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-charcoal-80">
                        <span className="w-6 h-6 bg-growth-green/10 text-growth-green rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* What NOT to Do */}
              {parsed.whatNotToDo.length > 0 && (
                <div className="bg-red-50 rounded-xl p-5">
                  <h3 className="text-lg font-bold font-heading text-charcoal mb-3 flex items-center gap-2">
                    <X className="w-5 h-5 text-red-500" />
                    What NOT to Do:
                  </h3>
                  <ul className="space-y-2">
                    {parsed.whatNotToDo.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-charcoal-80">
                        <span className="text-red-400 mt-1">&bull;</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* After the Storm (Repair) */}
              {parsed.repair && (
                <div>
                  <h3 className="text-lg font-bold font-heading text-charcoal mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full" />
                    After the Storm (Repair):
                  </h3>
                  <p className="text-charcoal-80 leading-relaxed">{parsed.repair}</p>
                </div>
              )}

              {/* Safety Limits */}
              {parsed.safetyLimits && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                  <h3 className="text-lg font-bold font-heading text-charcoal mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-500" />
                    Safety Limits:
                  </h3>
                  <p className="text-charcoal-80 leading-relaxed">{parsed.safetyLimits}</p>
                </div>
              )}

              {/* Video link */}
              {card.video_url && (
                <a href={card.video_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-slate-blue hover:underline font-medium">
                  <Video className="w-5 h-5" /> Watch Video
                </a>
              )}
            </div>

            {/* Card navigation and actions */}
            <div className="border-t border-gray-100 p-6 space-y-3">
              {filteredCards.length > 1 && (
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() => setViewingCardIndex(Math.max(0, viewingCardIndex - 1))}
                    disabled={viewingCardIndex === 0}
                    className="text-sm text-slate-blue hover:underline disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    &larr; Previous Card
                  </button>
                  <button
                    onClick={() => setViewingCardIndex(Math.min(filteredCards.length - 1, viewingCardIndex + 1))}
                    disabled={viewingCardIndex === filteredCards.length - 1}
                    className="text-sm text-slate-blue hover:underline disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Next Card &rarr;
                  </button>
                </div>
              )}

              <button
                onClick={() => setFlowStep('first-aid')}
                className="w-full bg-slate-blue text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-blue-dark transition-colors"
              >
                Back to Options
              </button>

              <Link
                to="/family-plan"
                className="w-full bg-growth-green text-white px-6 py-3 rounded-xl font-semibold hover:bg-growth-green-dark transition-colors block text-center"
              >
                Save to Plan
              </Link>
            </div>
          </div>
        </main>

        <SafetyFooter />
      </div>
    )
  }

  // --- SCREEN: First Aid Card Selection (age + behavior) ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex flex-col">
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => setFlowStep('caregiver-checkin')} className="text-charcoal hover:text-slate-blue">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            First Aid for Big Feelings &amp; Behaviors
          </h1>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Age Group Selection */}
          <div className="mb-8">
            <label className="block text-lg font-bold font-heading text-charcoal mb-4">
              Select the age range that best fits your child:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {AGE_GROUP_ORDER.map((age) => (
                <button
                  key={age}
                  onClick={() => {
                    setSelectedAge(selectedAge === age ? null : age)
                    setSelectedCategory(null)
                    setViewingCardIndex(0)
                  }}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold border-2 transition-colors ${
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

          {/* Behavior/Category Selection */}
          {selectedAge && categoriesForAge.length > 0 && (
            <div className="mb-6">
              <label className="block text-lg font-bold font-heading text-charcoal mb-4">
                What&apos;s happening?
              </label>
              <div className="flex flex-wrap gap-2 justify-center">
                {categoriesForAge.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      const newCat = selectedCategory === cat ? null : cat
                      setSelectedCategory(newCat)
                      setViewingCardIndex(0)
                      if (newCat && selectedAge) {
                        const matching = childCards.filter(c => c.age_group === selectedAge && c.category === newCat)
                        if (matching.length > 0) {
                          setFlowStep('card-view')
                        }
                      }
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-colors ${
                      selectedCategory === cat
                        ? 'bg-healing-purple text-white border-healing-purple'
                        : 'bg-white text-charcoal border-gray-200 hover:border-healing-purple'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Prompt to select age */}
          {!selectedAge && (
            <p className="text-charcoal-70 text-sm mt-4">Select an age range to see available behaviors.</p>
          )}

          {/* Prompt to select behavior */}
          {selectedAge && !selectedCategory && categoriesForAge.length > 0 && (
            <p className="text-charcoal-70 text-sm mt-4">Now select the behavior you&apos;re seeing.</p>
          )}

          {/* Clear filters */}
          {(selectedAge || selectedCategory) && (
            <button
              onClick={clearFilters}
              className="text-sm text-charcoal-70 hover:text-charcoal mt-4 inline-flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Clear selections
            </button>
          )}
        </div>

        {/* Emergency info footer */}
        <div className="mt-6 bg-red-100 rounded-xl p-4 text-center">
          <p className="text-sm text-red-800 flex items-center justify-center gap-2">
            <Phone className="w-4 h-4" />
            If someone is in immediate danger, call <a href="tel:911" className="font-bold underline">911</a>
          </p>
        </div>
      </main>

      <SafetyFooter />
    </div>
  )
}
