import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, RefreshCw, RotateCcw, CheckCircle } from 'lucide-react'
import SafetyFooter from '../components/SafetyFooter'

const tryAgainSteps = [
  {
    title: 'Take a Breath',
    instruction: 'Let\'s start by taking three deep breaths together. In through your nose... out through your mouth. You\'re safe.',
    prompt: 'Can you feel your body getting a little calmer?',
    affirmation: 'Great job noticing how your body feels.',
  },
  {
    title: 'Name What Happened',
    instruction: 'Something happened that didn\'t go the way we wanted. That\'s okay. Everyone makes mistakes. Let\'s think about what happened.',
    prompt: 'Can you tell me (or think about) what happened?',
    affirmation: 'Thank you for being honest. That takes courage.',
  },
  {
    title: 'Check Your Body',
    instruction: 'When big feelings come, our bodies feel them too. Maybe tight fists, a fast heart, a hot face, or a tummy ache.',
    prompt: 'Where do you feel it in your body right now?',
    affirmation: 'Your body is giving you important information. Listening to it is a strength.',
  },
  {
    title: 'Name the Feeling',
    instruction: 'Feelings are not good or bad. They are information. Angry, sad, scared, frustrated, embarrassed, confused: all of these are real and valid.',
    prompt: 'What feeling was biggest for you?',
    affirmation: 'All feelings are welcome here. You are more than your hardest moment.',
  },
  {
    title: 'Think About What You Needed',
    instruction: 'Behind every big behavior is an unmet need. Maybe you needed space, help, fairness, connection, or to feel safe.',
    prompt: 'What did you really need in that moment?',
    affirmation: 'Knowing what you need is a powerful skill. You\'re learning it.',
  },
  {
    title: 'Try Again',
    instruction: 'Now that you know what happened, what you felt, and what you needed, let\'s think about what you could do differently next time.',
    prompt: 'What\'s one thing you could try next time?',
    affirmation: 'That\'s a great plan. Trying again is what brave people do.',
  },
  {
    title: 'Remember Who You Are',
    instruction: 'Mistakes do not define you. You are kind, capable, and growing. This moment does not erase everything good about you.',
    prompt: 'Can you tell me one thing you like about yourself?',
    affirmation: 'You are loved. You are enough. You are more than this moment.',
  },
]

export default function TryAgainTool() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completed, setCompleted] = useState(false)

  const step = tryAgainSteps[currentStep]

  const reset = () => {
    setCurrentStep(0)
    setCompleted(false)
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-growth-green/10 to-white flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-growth-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-growth-green" />
            </div>
            <h2 className="text-2xl font-bold font-heading text-charcoal mb-4">
              You Did It!
            </h2>
            <p className="text-charcoal-80 mb-6 leading-relaxed">
              You showed courage by working through this. Remember: mistakes are not identity.
              Every try-again is proof that you are growing.
            </p>
            <p className="text-healing-purple italic font-heading mb-8">
              "You are more than your hardest moment."
            </p>
            <div className="flex gap-4 justify-center">
              <button onClick={reset} className="flex items-center gap-2 border border-gray-200 text-charcoal px-6 py-2.5 rounded-lg hover:border-slate-blue transition-colors">
                <RotateCcw className="w-4 h-4" /> Do Again
              </button>
              <Link to="/dashboard" className="bg-slate-blue text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-blue-dark transition-colors">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
        <SafetyFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-growth-green/10 to-white flex flex-col">
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-charcoal hover:text-slate-blue">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-growth-green" />
              Try Again Tool
            </h1>
          </div>
          <span className="text-sm text-charcoal-70">
            {currentStep + 1} of {tryAgainSteps.length}
          </span>
        </div>
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-gradient-to-r from-growth-green to-growth-green-dark transition-all duration-300"
            style={{ width: `${((currentStep + 1) / tryAgainSteps.length) * 100}%` }}
          />
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-growth-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-growth-green">{currentStep + 1}</span>
            </div>
            <h2 className="text-xl font-bold font-heading text-charcoal mb-4">{step.title}</h2>
            <p className="text-charcoal-80 mb-6 leading-relaxed">{step.instruction}</p>
            <div className="bg-sky-blue-bg rounded-xl p-4 mb-4">
              <p className="text-sm text-slate-blue font-medium">{step.prompt}</p>
            </div>
            <p className="text-sm text-growth-green italic">{step.affirmation}</p>
          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="flex items-center gap-2 text-charcoal hover:text-slate-blue disabled:opacity-30 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            {currentStep < tryAgainSteps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex items-center gap-2 bg-growth-green text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-growth-green-dark transition-colors"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setCompleted(true)}
                className="flex items-center gap-2 bg-growth-green text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-growth-green-dark transition-colors"
              >
                Finish <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </main>

      <SafetyFooter />
    </div>
  )
}
