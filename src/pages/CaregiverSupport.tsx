import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Heart, Play, BookOpen, Coffee, Moon, Shield, ChevronDown, ChevronUp, Phone, AlertTriangle } from 'lucide-react'
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

const selfCareItems = [
  {
    title: 'Daily Caregiver Check-In',
    duration: '2 min',
    content: {
      intro: 'A 60-second pulse check. Rate each from 1 (low) to 5 (great).',
      prompts: [
        { label: 'Rest', question: 'How rested do I feel today?' },
        { label: 'Body', question: 'Have I eaten, hydrated, and moved a little?' },
        { label: 'Mood', question: 'What\u2019s my emotional weather right now?' },
        { label: 'Capacity', question: 'How much do I have left in the tank?' },
        { label: 'Connection', question: 'Have I felt supported by anyone today?' },
      ],
      reflection: 'One small thing I can do for myself today:',
      closing: 'If most of your ratings are 1s or 2s, that\u2019s not a failure \u2014 it\u2019s information. Even one small act of care counts. Pick the easiest one and start there.',
    },
  },
  {
    title: 'Weekly Reflection Prompts',
    duration: '10 min',
    content: {
      intro: 'Set aside 5\u201310 minutes. Pick one or two, or answer them all.',
      prompts: [
        'What moment this week felt hardest \u2014 and what got me through it?',
        'When did I feel most like myself?',
        'What did I give more of than I had to give?',
        'Where did I say yes when I wanted to say no?',
        'What\u2019s one thing I\u2019m proud of, even if no one else noticed?',
        'What do I need more of next week? What do I need less of?',
        'Who or what refilled my cup, even a little?',
      ],
      closing: 'You don\u2019t have to fix anything here. Just noticing is enough.\nBefore you close this: name one thing you\u2019ll carry into next week, and one thing you\u2019ll set down.',
    },
  },
  {
    title: 'Compassion Fatigue Check-In',
    duration: '5 min',
    content: {
      intro: 'Compassion fatigue is the cost of caring deeply \u2014 the wear that builds when you absorb another person\u2019s pain day after day. It\u2019s common among caregivers, and it\u2019s not a weakness. This is a moment to check in with yourself, not a test or a diagnosis.',
      scaleIntro: 'Over the past two weeks, how often has each been true? (0 = Never, 1 = Sometimes, 2 = Often, 3 = Almost always)',
      statements: [
        'I feel emotionally drained by the needs of the child I care for.',
        'I have less patience than I used to.',
        'I feel numb, detached, or \u201cchecked out.\u201d',
        'I\u2019m carrying the weight of what this child has been through.',
        'I\u2019m dreading tasks I used to handle easily.',
        'I feel like nothing I do is ever enough.',
        'My sleep is off, or rest doesn\u2019t seem to restore me.',
        'I\u2019ve pulled back from people or activities I used to enjoy.',
      ],
      ranges: [
        { label: 'Lower range', text: 'You\u2019re holding steady. Keep protecting what\u2019s working.' },
        { label: 'Middle range', text: 'Warning signs are showing up. This is a good time to add rest and lean on your support.' },
        { label: 'Higher range', text: 'You\u2019re carrying a lot right now. You deserve support \u2014 reach out to a friend, your doctor, or a counselor this week. You don\u2019t have to do this alone.' },
      ],
      disclaimer: 'This is a self-reflection tool, not clinical care or a diagnosis.',
      resources: 'Want a deeper, validated measure? Foster parents can use the free Professional Quality of Life (ProQOL) measure, designed for people who care for others exposed to trauma. Adoptive and kinship caregivers may prefer the free Caregiver Self-Assessment Questionnaire from the Health in Aging Foundation.',
      crisis: 'If you\u2019re having thoughts of harming yourself, reach out now: call or text 988 (Suicide & Crisis Lifeline, 24/7). You matter.',
    },
  },
  {
    title: 'Burnout Warning Signs',
    duration: 'Reference',
    content: {
      intro: 'Burnout builds slowly. Knowing the signs helps you catch it early. Notice which ones sound familiar.',
      categories: [
        { label: 'In your body', signs: 'Ongoing exhaustion that rest doesn\u2019t fix, headaches or stomach trouble, getting sick more often, changes in sleep or appetite.' },
        { label: 'In your emotions', signs: 'Irritability, feeling overwhelmed, cynicism, hopelessness, crying easily \u2014 or feeling nothing at all.' },
        { label: 'In your thoughts', signs: 'Trouble concentrating, forgetfulness, \u201cI can\u2019t do this anymore,\u201d feeling like a failure no matter what you do.' },
        { label: 'In your behavior', signs: 'Withdrawing from people, snapping at loved ones, letting go of routines or self-care, leaning on food, screens, or substances to cope.' },
      ],
      whenToReach: 'If these signs last more than two weeks, keep getting worse, or you\u2019re having thoughts of hurting yourself, please talk to your doctor, a counselor, or someone you trust. Asking for help is a sign of strength, not weakness.',
      crisis: 'In crisis or thinking about harming yourself? Call or text 988 (Suicide & Crisis Lifeline) anytime, day or night. If someone is in immediate danger, call 911.',
      nextStep: 'One small next step: name one person you could text today, and one thing you can take off your plate this week.',
    },
  },
]

export default function CaregiverSupport() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

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
            You matter too
          </h2>
          <p className="text-charcoal-80">
            You cannot pour from an empty cup. Caring for yourself is not selfish; it is essential to caring for your children. Foster and kinship caregiving involves chronic stress, secondary trauma, and emotional labor that most people cannot imagine. When you feel overwhelmed, dysregulated, or close to your limit, that is your nervous system telling you it needs support.
          </p>
        </div>

        <div className="bg-growth-green/10 rounded-xl p-6 mb-8 flex items-start gap-4">
          <Shield className="w-6 h-6 text-growth-green shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-charcoal mb-1">Your Regulation Matters</h3>
            <p className="text-sm text-charcoal-80 leading-relaxed">
              Regulation is contagious. When you co-regulate by staying calm, you help your child's nervous system settle too.
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

          {/* Self-Care Check-In */}
          <div>
            <h3 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2 mb-2">
              <Coffee className="w-5 h-5 text-healing-purple" />
              Self-Care Check-In
            </h3>
            <p className="text-sm text-charcoal-80 mb-2">
              Regular check-ins help you recognize when your own cup is running low.
            </p>
            <p className="text-sm text-charcoal-80 mb-2 leading-relaxed">
              Caring for a child who has been through hard things asks a lot of you &mdash; often more than anyone sees. These check-ins take a minute or two. They&apos;re not a test, and there are no wrong answers. The goal is simple: notice how you&apos;re really doing, so you can respond to your own needs the way you show up for everyone else&apos;s.
            </p>
            <p className="text-xs text-charcoal-70 italic mb-4">
              These tools are for reflection and self-awareness. They are not medical or mental-health care and are not a diagnosis. If you&apos;re struggling, talking with a professional can help.
            </p>

            <div className="space-y-3">
              {selfCareItems.map((item) => (
                <div key={item.title} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setExpandedItem(expandedItem === item.title ? null : item.title)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-healing-purple/10 rounded-lg flex items-center justify-center">
                        <Coffee className="w-5 h-5 text-healing-purple" />
                      </div>
                      <div>
                        <h4 className="font-bold text-charcoal">{item.title}</h4>
                        <span className="text-xs text-charcoal-70">{item.duration}</span>
                      </div>
                    </div>
                    {expandedItem === item.title
                      ? <ChevronUp className="w-5 h-5 text-charcoal-70" />
                      : <ChevronDown className="w-5 h-5 text-charcoal-70" />
                    }
                  </button>

                  {expandedItem === item.title && (
                    <div className="border-t border-gray-100 px-5 pb-5 pt-3 space-y-4">
                      <p className="text-sm text-charcoal-80 leading-relaxed">{item.content.intro}</p>

                      {/* Daily Check-In: rated prompts */}
                      {'prompts' in item.content && Array.isArray(item.content.prompts) && typeof item.content.prompts[0] === 'object' && 'label' in (item.content.prompts[0] as Record<string, unknown>) && (
                        <div className="space-y-3">
                          {(item.content.prompts as Array<{label: string; question: string}>).map((p) => (
                            <div key={p.label} className="bg-healing-purple/5 rounded-lg p-4 flex items-start gap-3">
                              <span className="font-bold text-healing-purple text-sm min-w-[80px]">{p.label}:</span>
                              <span className="text-sm text-charcoal-80">{p.question}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Weekly Reflection: string prompts */}
                      {'prompts' in item.content && Array.isArray(item.content.prompts) && typeof item.content.prompts[0] === 'string' && (
                        <ul className="space-y-2">
                          {(item.content.prompts as string[]).map((prompt, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-charcoal-80">
                              <span className="text-healing-purple mt-0.5">&#8226;</span>
                              <span className="leading-relaxed">{prompt}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {'reflection' in item.content && (
                        <div className="bg-sky-blue-bg rounded-lg p-4">
                          <p className="text-sm font-medium text-charcoal italic">{(item.content as Record<string, unknown>).reflection as string}</p>
                        </div>
                      )}

                      {/* Compassion Fatigue: scale + statements */}
                      {'scaleIntro' in item.content && (
                        <>
                          <p className="text-sm text-charcoal-80 font-medium">{(item.content as Record<string, unknown>).scaleIntro as string}</p>
                          <div className="space-y-2">
                            {((item.content as Record<string, unknown>).statements as string[]).map((s, idx) => (
                              <div key={idx} className="bg-gray-50 rounded-lg p-3 flex items-start gap-3">
                                <span className="w-6 h-6 bg-healing-purple/10 text-healing-purple rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">{idx + 1}</span>
                                <span className="text-sm text-charcoal-80">{s}</span>
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-charcoal-80 font-medium">Add up your answers &mdash; but hold the number loosely. It&apos;s a nudge, not a verdict.</p>
                          <div className="space-y-3">
                            {((item.content as Record<string, unknown>).ranges as Array<{label: string; text: string}>).map((r) => (
                              <div key={r.label} className={`rounded-lg p-4 ${
                                r.label === 'Lower range' ? 'bg-growth-green/10 border border-growth-green/20' :
                                r.label === 'Middle range' ? 'bg-amber-50 border border-amber-200' :
                                'bg-red-50 border border-red-200'
                              }`}>
                                <p className="text-sm"><strong className="text-charcoal">{r.label}:</strong> <span className="text-charcoal-80">{r.text}</span></p>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-charcoal-70 italic">{(item.content as Record<string, unknown>).disclaimer as string}</p>
                          <p className="text-sm text-charcoal-80 leading-relaxed">{(item.content as Record<string, unknown>).resources as string}</p>
                        </>
                      )}

                      {/* Burnout Warning Signs: categories */}
                      {'categories' in item.content && (
                        <>
                          <div className="space-y-3">
                            {((item.content as Record<string, unknown>).categories as Array<{label: string; signs: string}>).map((cat) => (
                              <div key={cat.label} className="bg-gray-50 rounded-lg p-4">
                                <h5 className="font-bold text-charcoal text-sm mb-1">{cat.label}:</h5>
                                <p className="text-sm text-charcoal-80 leading-relaxed">{cat.signs}</p>
                              </div>
                            ))}
                          </div>
                          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                            <h5 className="font-bold text-charcoal text-sm mb-1 flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-amber-600" />
                              When to reach out for help:
                            </h5>
                            <p className="text-sm text-charcoal-80 leading-relaxed">{(item.content as Record<string, unknown>).whenToReach as string}</p>
                          </div>
                          <p className="text-sm text-charcoal-80 italic leading-relaxed">{(item.content as Record<string, unknown>).nextStep as string}</p>
                        </>
                      )}

                      {/* Crisis line (appears on compassion fatigue and burnout) */}
                      {'crisis' in item.content && (
                        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                          <div className="flex items-start gap-2">
                            <Phone className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                            <p className="text-sm text-red-800 leading-relaxed">{(item.content as Record<string, unknown>).crisis as string}</p>
                          </div>
                        </div>
                      )}

                      {'closing' in item.content && (
                        <div className="bg-healing-purple/5 rounded-lg p-4">
                          <p className="text-sm text-charcoal-80 leading-relaxed whitespace-pre-line">{(item.content as Record<string, unknown>).closing as string}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <SafetyFooter />
    </div>
  )
}
