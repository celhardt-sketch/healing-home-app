import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Heart, Play, BookOpen, Coffee, Moon, Shield, ChevronDown, ChevronUp, Phone, AlertTriangle, Pen, Save, Calendar, Trash2, Check } from 'lucide-react'
import SafetyFooter from '../components/SafetyFooter'

const API_URL = import.meta.env.VITE_API_URL || ''

function getToken(): string {
  return localStorage.getItem('auth_token') || ''
}

const regulationVideos = [
  {
    title: 'Box Breathing for Caregivers',
    duration: '3 min',
    source: 'Sunnybrook Hospital (Dr. Joanna Mansfield, Women\u2019s Mood & Anxiety Clinic)',
    caption: 'A simple breath pattern to steady yourself in a stressful moment.',
    embedUrl: 'https://www.youtube.com/embed/tEmt1Znux58',
    embedType: 'youtube' as const,
  },
  {
    title: 'Progressive Muscle Relaxation',
    duration: '7 min',
    source: 'Therapist Aid',
    caption: 'Tense and release each muscle group to let go of stored tension. If tensing feels uncomfortable, just breathe slowly instead.',
    embedUrl: 'https://www.youtube.com/embed/1nZEdqcGVzo',
    embedType: 'youtube' as const,
  },
  {
    title: 'Guided Body Scan',
    duration: '15 min',
    source: 'UCLA Health, Simms/Mann Center for Integrative Oncology (Shiori Lange, LCSW)',
    caption: 'Slowly move your attention through your body, noticing without judging. If a sensation feels too intense, return to your breath.',
    embedUrl: 'https://player.vimeo.com/video/1092920047',
    embedType: 'vimeo' as const,
  },
  {
    title: 'Mindful Grounding Exercise',
    duration: '5 min',
    source: 'The Partnership in Education, Duquesne University (NIH-funded)',
    caption: 'The 5-4-3-2-1 method uses your five senses to bring you back to the present moment.',
    embedUrl: 'https://www.youtube.com/embed/30VMIEmA114',
    embedType: 'youtube' as const,
  },
]

const sections = [
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
]

const eveningWindDownItems = [
  {
    title: 'Gratitude & Wins Reflection',
    duration: '5 min',
    content: {
      intro: 'Small moments count. You don\u2019t need a good day to find one good thing.',
      prompts: [
        'Name one thing that went right today, however small.',
        'Name one thing you handled better than you would have a year ago.',
        'Name one person or moment you\u2019re grateful for.',
        'Finish this sentence: Today, I showed up by ______.',
      ],
      closing: 'Hard days still have wins. \u201cI kept everyone fed and safe\u201d is enough.',
    },
  },
  {
    title: 'Body Release Sequence',
    duration: '7 min',
    content: {
      intro: 'This guided practice helps your body let go of the day\u2019s tension. Follow along with the video below.',
      note: 'A gentle note before you start: this is an invitation, not a rule. You can keep your eyes open, skip any step, or stop at any time. If tensing your muscles feels uncomfortable, simply breathe slowly instead \u2014 inhale for 4, exhale for 6. The goal is comfort, not doing it perfectly.',
      videoUrl: 'https://www.youtube.com/watch?v=1nZEdqcGVzo',
      videoTitle: 'How to do Progressive Muscle Relaxation \u2014 Therapist Aid, 6:33',
      closing: 'Afterward, take one slow breath and notice any place that feels a little lighter.',
    },
  },
  {
    title: 'Journaling Prompts for Caregivers',
    duration: '10 min',
    content: {
      intro: 'Write freely \u2014 no one else will read this. Pick one prompt or a few.',
      prompts: [
        'What did I carry today that wasn\u2019t mine to carry?',
        'Where did I feel most stretched, and what did I need in that moment?',
        'What did my child teach me today, even in a hard moment?',
        'What am I still holding onto that I could set down before sleep?',
        'If I could tell myself one kind thing right now, what would it be?',
        'What do I want tomorrow to feel like?',
      ],
      closing: 'You don\u2019t have to resolve anything on the page. Getting it out of your head is the point. And if a prompt brings up more than you want to sit with tonight, set it down \u2014 you can come back to it another time.',
    },
  },
  {
    title: 'Sleep Preparation Ritual',
    duration: '5 min',
    content: {
      intro: 'A short, repeatable routine that tells your body the day is done.',
      steps: [
        'Dim the lights and put screens away if you can \u2014 even 30 minutes helps.',
        'Set down tomorrow: jot any lingering to-dos on paper so your mind can release them.',
        'Warm and calm: a warm drink, a shower, or soft socks \u2014 one small comfort.',
        'One slow breath cycle: inhale for 4, exhale for 6, three times.',
        'Close the day: silently tell yourself, I did what I could today. That\u2019s enough.',
      ],
      closing: 'If your mind races once you\u2019re in bed, that\u2019s normal \u2014 return to the slow exhale and let the thoughts drift by. If sleep trouble lasts for weeks or leaves you exhausted during the day, it\u2019s worth checking in with your doctor.',
    },
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

/* ---------- Gratitude Journal types ---------- */

interface MorningEntries {
  grateful1: string
  grateful2: string
  grateful3: string
  grateful4: string
  grateful5: string
  obstacle1: string
  learning1: string
  obstacle2: string
  learning2: string
  obstacle3: string
  learning3: string
}

interface EveningEntries {
  beautiful1: string
  beautiful2: string
  beautiful3: string
  beautiful4: string
  beautiful5: string
  person1: string
  person2: string
  person3: string
  bestPart: string
}

interface SavedEntry {
  id: number
  entry_date: string
  entry_type: 'morning' | 'evening'
  entries: MorningEntries | EveningEntries
  created_at: string
  updated_at: string
}

const emptyMorning: MorningEntries = {
  grateful1: '', grateful2: '', grateful3: '', grateful4: '', grateful5: '',
  obstacle1: '', learning1: '', obstacle2: '', learning2: '', obstacle3: '', learning3: '',
}

const emptyEvening: EveningEntries = {
  beautiful1: '', beautiful2: '', beautiful3: '', beautiful4: '', beautiful5: '',
  person1: '', person2: '', person3: '',
  bestPart: '',
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

export default function CaregiverSupport() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [expandedEvening, setExpandedEvening] = useState<string | null>(null)
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null)
  const [journalTab, setJournalTab] = useState<'morning' | 'evening' | 'past'>('morning')
  const [morning, setMorning] = useState<MorningEntries>({ ...emptyMorning })
  const [evening, setEvening] = useState<EveningEntries>({ ...emptyEvening })
  const [selectedDate, setSelectedDate] = useState(todayStr())
  const [pastEntries, setPastEntries] = useState<SavedEntry[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState<string | null>(null)
  const [journalOpen, setJournalOpen] = useState(false)
  const [expandedPast, setExpandedPast] = useState<number | null>(null)

  useEffect(() => {
    const token = getToken()
    if (!token) return
    let cancelled = false
    fetch(`${API_URL}/api/journal/entries?entry_date=${selectedDate}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data: SavedEntry[]) => {
        if (cancelled) return
        const m = data.find((e) => e.entry_type === 'morning')
        const ev = data.find((e) => e.entry_type === 'evening')
        setMorning(m ? (m.entries as MorningEntries) : { ...emptyMorning })
        setEvening(ev ? (ev.entries as EveningEntries) : { ...emptyEvening })
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [selectedDate])

  const loadPastEntries = useCallback(async () => {
    const token = getToken()
    if (!token) return
    try {
      const res = await fetch(`${API_URL}/api/journal/entries?limit=60`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return
      setPastEntries(await res.json())
    } catch { /* ignore */ }
  }, [])

  const saveEntry = async (entryType: 'morning' | 'evening') => {
    const token = getToken()
    if (!token) return
    setSaving(true)
    try {
      await fetch(`${API_URL}/api/journal/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          entry_date: selectedDate,
          entry_type: entryType,
          entries: entryType === 'morning' ? morning : evening,
        }),
      })
      setSaved(entryType)
      setTimeout(() => setSaved(null), 2000)
    } catch { /* ignore */ }
    setSaving(false)
  }

  const deleteEntry = async (id: number) => {
    const token = getToken()
    if (!token) return
    await fetch(`${API_URL}/api/journal/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    loadPastEntries()
  }

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
          {/* Regulation Videos */}
          <div>
            <h3 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2 mb-2">
              <Play className="w-5 h-5 text-growth-green" />
              Regulation Videos
            </h3>
            <p className="text-sm text-charcoal-80 mb-4">
              Follow along with these guided videos to help calm your nervous system. Each is an invitation &mdash; you can pause, skip, or stop anytime, and keep your eyes open if that feels more comfortable.
            </p>
            <div className="space-y-3">
              {regulationVideos.map((video) => (
                <div key={video.title} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setExpandedVideo(expandedVideo === video.title ? null : video.title)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-growth-green/10 rounded-lg flex items-center justify-center">
                        <Play className="w-5 h-5 text-growth-green" />
                      </div>
                      <div>
                        <h4 className="font-bold text-charcoal">{video.title}</h4>
                        <span className="text-xs text-charcoal-70">{video.duration} &middot; {video.source}</span>
                      </div>
                    </div>
                    {expandedVideo === video.title
                      ? <ChevronUp className="w-5 h-5 text-charcoal-70" />
                      : <ChevronDown className="w-5 h-5 text-charcoal-70" />
                    }
                  </button>

                  {expandedVideo === video.title && (
                    <div className="border-t border-gray-100 px-5 pb-5 pt-3 space-y-4">
                      <p className="text-sm text-charcoal-80 italic leading-relaxed">{video.caption}</p>
                      <div className="rounded-lg overflow-hidden">
                        <iframe
                          src={video.embedUrl}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full aspect-video"
                        />
                      </div>
                      <p className="text-xs text-charcoal-70">Source: {video.source}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

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

          {/* ---------- Evening Wind-Down ---------- */}
          <div>
            <h3 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2 mb-2">
              <Moon className="w-5 h-5 text-sky-blue" />
              Evening Wind-Down
            </h3>
            <p className="text-sm text-charcoal-80 mb-2">
              End your day with intentional practices that support nervous system recovery.
            </p>
            <p className="text-sm text-charcoal-80 mb-4 leading-relaxed">
              After a full day of caring for others, your body and mind need a signal that it&apos;s safe to rest. These practices are invitations, not requirements &mdash; do the ones that help tonight and skip the rest. There&apos;s no wrong way to wind down.
            </p>

            <div className="space-y-3">
              {eveningWindDownItems.map((item) => (
                <div key={item.title} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setExpandedEvening(expandedEvening === item.title ? null : item.title)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-sky-blue/10 rounded-lg flex items-center justify-center">
                        <Moon className="w-5 h-5 text-sky-blue" />
                      </div>
                      <div>
                        <h4 className="font-bold text-charcoal">{item.title}</h4>
                        <span className="text-xs text-charcoal-70">{item.duration}</span>
                      </div>
                    </div>
                    {expandedEvening === item.title
                      ? <ChevronUp className="w-5 h-5 text-charcoal-70" />
                      : <ChevronDown className="w-5 h-5 text-charcoal-70" />
                    }
                  </button>

                  {expandedEvening === item.title && (
                    <div className="border-t border-gray-100 px-5 pb-5 pt-3 space-y-4">
                      <p className="text-sm text-charcoal-80 leading-relaxed">{item.content.intro}</p>

                      {/* Prompts list */}
                      {'prompts' in item.content && (
                        <ul className="space-y-2">
                          {(item.content.prompts as string[]).map((prompt, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-charcoal-80">
                              <span className="text-sky-blue mt-0.5">&#8226;</span>
                              <span className="leading-relaxed">{prompt}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Video embed (Body Release) */}
                      {'videoUrl' in item.content && (
                        <>
                          <p className="text-sm text-charcoal-80 italic leading-relaxed">{(item.content as Record<string, unknown>).note as string}</p>
                          <div className="rounded-lg overflow-hidden">
                            <iframe
                              src={`https://www.youtube.com/embed/${((item.content as Record<string, unknown>).videoUrl as string).split('v=')[1]}`}
                              title={(item.content as Record<string, unknown>).videoTitle as string}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full aspect-video"
                            />
                          </div>
                          <p className="text-xs text-charcoal-70 italic">{(item.content as Record<string, unknown>).videoTitle as string}</p>
                        </>
                      )}

                      {/* Steps list (Sleep Preparation) */}
                      {'steps' in item.content && (
                        <ol className="space-y-2">
                          {((item.content as Record<string, unknown>).steps as string[]).map((step, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-charcoal-80">
                              <span className="w-6 h-6 bg-sky-blue/10 text-sky-blue rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">{idx + 1}</span>
                              <span className="leading-relaxed">{step}</span>
                            </li>
                          ))}
                        </ol>
                      )}

                      {'closing' in item.content && (
                        <div className="bg-sky-blue/5 rounded-lg p-4">
                          <p className="text-sm text-charcoal-80 leading-relaxed">{(item.content as Record<string, unknown>).closing as string}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ---------- Daily Gratitude Journal ---------- */}
          <div>
            <button
              onClick={() => setJournalOpen(!journalOpen)}
              className="w-full flex items-center justify-between mb-2"
            >
              <h3 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2">
                <Pen className="w-5 h-5 text-amber-500" />
                Daily Gratitude Journal
              </h3>
              {journalOpen
                ? <ChevronUp className="w-5 h-5 text-charcoal-70" />
                : <ChevronDown className="w-5 h-5 text-charcoal-70" />
              }
            </button>
            <p className="text-sm text-charcoal-80 mb-4">
              Gratitude rewires your brain toward hope. Save your entries and revisit them whenever you need a reminder of the good.
            </p>

            {journalOpen && (
              <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-5">
                {/* Date picker */}
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-charcoal-70" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
                  />
                </div>

                {/* Tabs */}
                <div className="flex gap-2">
                  {(['morning', 'evening', 'past'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => { setJournalTab(tab); if (tab === 'past') loadPastEntries() }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        journalTab === tab
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-charcoal-70 hover:bg-gray-200'
                      }`}
                    >
                      {tab === 'morning' ? 'Morning Gratitude' : tab === 'evening' ? 'Evening Gratitude' : 'Past Entries'}
                    </button>
                  ))}
                </div>

                {/* Morning form */}
                {journalTab === 'morning' && (
                  <div className="space-y-5">
                    <div>
                      <h4 className="font-bold text-charcoal mb-1">Morning Gratitude</h4>
                      <p className="text-sm text-charcoal-80 mb-3">Before you begin your day, list 5 things you&apos;re grateful for.</p>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <div key={n} className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xs font-bold">{n}</span>
                          <input
                            type="text"
                            value={morning[`grateful${n}` as keyof MorningEntries]}
                            onChange={(e) => setMorning({ ...morning, [`grateful${n}`]: e.target.value })}
                            placeholder={`I'm grateful for...`}
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <h4 className="font-bold text-charcoal mb-1">What I&apos;m Learning from My Challenges</h4>
                      <p className="text-sm text-charcoal-80 mb-3">List three obstacles and what you&apos;re learning from them.</p>
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="mb-3 bg-amber-50 rounded-lg p-3">
                          <input
                            type="text"
                            value={morning[`obstacle${n}` as keyof MorningEntries]}
                            onChange={(e) => setMorning({ ...morning, [`obstacle${n}`]: e.target.value })}
                            placeholder={`Obstacle ${n}...`}
                            className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm mb-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none bg-white"
                          />
                          <input
                            type="text"
                            value={morning[`learning${n}` as keyof MorningEntries]}
                            onChange={(e) => setMorning({ ...morning, [`learning${n}`]: e.target.value })}
                            placeholder="What I'm learning..."
                            className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none bg-white"
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => saveEntry('morning')}
                      disabled={saving}
                      className="flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50"
                    >
                      {saved === 'morning' ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Morning Entry</>}
                    </button>
                  </div>
                )}

                {/* Evening form */}
                {journalTab === 'evening' && (
                  <div className="space-y-5">
                    <div>
                      <h4 className="font-bold text-charcoal mb-1">Beautiful Things I Saw Today</h4>
                      <p className="text-sm text-charcoal-80 mb-3">List 5 beautiful things you noticed today.</p>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <div key={n} className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 bg-sky-blue-bg text-slate-blue rounded-full flex items-center justify-center text-xs font-bold">{n}</span>
                          <input
                            type="text"
                            value={evening[`beautiful${n}` as keyof EveningEntries]}
                            onChange={(e) => setEvening({ ...evening, [`beautiful${n}`]: e.target.value })}
                            placeholder={`Beautiful thing ${n}...`}
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <h4 className="font-bold text-charcoal mb-1">People I&apos;m Grateful For</h4>
                      <p className="text-sm text-charcoal-80 mb-3">List 3 people who made your life a little happier today. These could be friends, family or strangers!</p>
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xs font-bold">{n}</span>
                          <input
                            type="text"
                            value={evening[`person${n}` as keyof EveningEntries]}
                            onChange={(e) => setEvening({ ...evening, [`person${n}`]: e.target.value })}
                            placeholder={`Person ${n}...`}
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <h4 className="font-bold text-charcoal mb-1">The Best Part of My Day</h4>
                      <p className="text-sm text-charcoal-80 mb-3">Choose one moment of your day that made you happy and focus on it for 5 minutes before bed.</p>
                      <textarea
                        value={evening.bestPart}
                        onChange={(e) => setEvening({ ...evening, bestPart: e.target.value })}
                        placeholder="The best part of my day was..."
                        rows={3}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none resize-none"
                      />
                    </div>

                    <button
                      onClick={() => saveEntry('evening')}
                      disabled={saving}
                      className="flex items-center gap-2 bg-slate-blue text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-slate-blue-dark transition-colors disabled:opacity-50"
                    >
                      {saved === 'evening' ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Evening Entry</>}
                    </button>
                  </div>
                )}

                {/* Past entries */}
                {journalTab === 'past' && (
                  <div className="space-y-3">
                    {pastEntries.length === 0 && (
                      <p className="text-sm text-charcoal-70 text-center py-4">No journal entries yet. Start writing today!</p>
                    )}
                    {/* Group by date */}
                    {Array.from(new Set(pastEntries.map((e) => e.entry_date))).map((dateStr) => {
                      const dayEntries = pastEntries.filter((e) => e.entry_date === dateStr)
                      return (
                        <div key={dateStr} className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                          <button
                            onClick={() => setExpandedPast(expandedPast === dayEntries[0].id ? null : dayEntries[0].id)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-amber-500" />
                              <span className="font-bold text-charcoal text-sm">
                                {new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                              </span>
                              <span className="text-xs text-charcoal-70">
                                ({dayEntries.map((e) => e.entry_type).join(' & ')})
                              </span>
                            </div>
                            {expandedPast === dayEntries[0].id
                              ? <ChevronUp className="w-4 h-4 text-charcoal-70" />
                              : <ChevronDown className="w-4 h-4 text-charcoal-70" />
                            }
                          </button>

                          {expandedPast === dayEntries[0].id && (
                            <div className="border-t border-gray-200 p-4 space-y-4">
                              {dayEntries.map((entry) => (
                                <div key={entry.id}>
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="font-bold text-charcoal text-sm capitalize">
                                      {entry.entry_type === 'morning' ? 'Morning Gratitude' : 'Evening Gratitude'}
                                    </h5>
                                    <button
                                      onClick={() => deleteEntry(entry.id)}
                                      className="text-red-400 hover:text-red-600 transition-colors"
                                      title="Delete entry"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>

                                  {entry.entry_type === 'morning' && (() => {
                                    const m = entry.entries as MorningEntries
                                    return (
                                      <div className="space-y-2 text-sm text-charcoal-80">
                                        <p className="font-medium text-charcoal">Grateful for:</p>
                                        {[1, 2, 3, 4, 5].map((n) => {
                                          const val = m[`grateful${n}` as keyof MorningEntries]
                                          return val ? <p key={n} className="pl-4">&#8226; {val}</p> : null
                                        })}
                                        {(m.obstacle1 || m.obstacle2 || m.obstacle3) && (
                                          <>
                                            <p className="font-medium text-charcoal mt-2">Challenges & Learnings:</p>
                                            {[1, 2, 3].map((n) => {
                                              const ob = m[`obstacle${n}` as keyof MorningEntries]
                                              const le = m[`learning${n}` as keyof MorningEntries]
                                              return (ob || le) ? (
                                                <div key={n} className="pl-4">
                                                  {ob && <p>Obstacle: {ob}</p>}
                                                  {le && <p className="italic">Learning: {le}</p>}
                                                </div>
                                              ) : null
                                            })}
                                          </>
                                        )}
                                      </div>
                                    )
                                  })()}

                                  {entry.entry_type === 'evening' && (() => {
                                    const ev = entry.entries as EveningEntries
                                    return (
                                      <div className="space-y-2 text-sm text-charcoal-80">
                                        {(ev.beautiful1 || ev.beautiful2 || ev.beautiful3 || ev.beautiful4 || ev.beautiful5) && (
                                          <>
                                            <p className="font-medium text-charcoal">Beautiful things:</p>
                                            {[1, 2, 3, 4, 5].map((n) => {
                                              const val = ev[`beautiful${n}` as keyof EveningEntries]
                                              return val ? <p key={n} className="pl-4">&#8226; {val}</p> : null
                                            })}
                                          </>
                                        )}
                                        {(ev.person1 || ev.person2 || ev.person3) && (
                                          <>
                                            <p className="font-medium text-charcoal">People I&apos;m grateful for:</p>
                                            {[1, 2, 3].map((n) => {
                                              const val = ev[`person${n}` as keyof EveningEntries]
                                              return val ? <p key={n} className="pl-4">&#8226; {val}</p> : null
                                            })}
                                          </>
                                        )}
                                        {ev.bestPart && (
                                          <>
                                            <p className="font-medium text-charcoal mt-2">Best part of the day:</p>
                                            <p className="pl-4 whitespace-pre-wrap">{ev.bestPart}</p>
                                          </>
                                        )}
                                      </div>
                                    )
                                  })()}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <SafetyFooter />
    </div>
  )
}
