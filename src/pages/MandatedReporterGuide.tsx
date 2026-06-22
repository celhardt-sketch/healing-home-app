import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, AlertTriangle, FileText, Phone, ChevronDown, ChevronUp, Heart } from 'lucide-react'
import SafetyFooter from '../components/SafetyFooter'

const sections = [
  {
    id: 'what-this-is',
    title: 'First: What This Is (And Is Not)',
    icon: Shield,
    content: `This guide is psychoeducational. It is based primarily on Virginia mandated reporting laws, which vary significantly by state.

This guide does NOT:
• Help you determine whether abuse occurred
• Teach you how to investigate or question a child
• Replace professional or legal guidance

You must know and follow the mandated reporting laws in your specific state. Complete any state-required mandated reporter training. Consult with your caseworker, agency, or legal counsel for state-specific guidance.

This guide does not constitute legal advice. Elhardt Family Wellness LLC is not responsible for actions taken based on this general guidance in jurisdictions where different laws apply.

Your role is not to decide. Your role is to report and protect.`,
  },
  {
    id: 'reportable',
    title: 'What Counts as a Reportable Disclosure',
    icon: AlertTriangle,
    content: `You must report when a child discloses or you reasonably suspect:

• Physical abuse
• Sexual abuse or exploitation
• Neglect
• Unsafe supervision
• Exposure to sexual activity
• Coercive or harmful sexual behavior
• Ongoing or imminent risk of harm

You do NOT need:
• Proof
• Certainty
• Multiple disclosures

Reasonable suspicion is enough.`,
  },
  {
    id: 'your-role',
    title: 'Your Role in the Moment',
    icon: Heart,
    content: `Your job IS to:
• Stay calm
• Listen without reacting
• Protect the child
• Follow reporting obligations

Your job is NOT to:
• Investigate
• Interview
• Verify details
• Decide credibility
• Promise secrecy
• Confront anyone involved

What to Say to the Child (Simple & Safe):
Say only what is needed to maintain safety and trust.

"Thank you for telling me."
"My job is to help keep kids safe."

What NOT to Say:
• Ask leading questions
• Ask for timelines or details
• Express shock, anger, or disbelief
• Make promises about outcomes
• Say you will keep it a secret`,
  },
  {
    id: 'steps',
    title: 'Step-by-Step: What to Do Next',
    icon: FileText,
    content: `1. Document only what the child said, using quotation marks when possible
2. Make the mandated report immediately to Child Protective Services (CPS) or your state hotline
3. Notify required parties: caseworker, supervisor (if applicable), child's therapist
4. Return to regulation and routine. Let professionals handle next steps`,
  },
  {
    id: 'documentation',
    title: 'Documentation Rules (VERY IMPORTANT)',
    icon: FileText,
    content: `• Write only what was said, using quotation marks when possible
• Do not include opinions, theories, or conclusions
• Do not share notes beyond required reporting channels
• Be cautious with written records that could be requested by courts or DSS`,
  },
  {
    id: 'after',
    title: 'After the Report',
    icon: Heart,
    content: `You may notice:
• Increased anxiety
• Anger toward you
• Withdrawal or clinginess
• Fear of consequences

These are normal trauma responses, not signs you did the wrong thing.

Your role after reporting is to:
• Maintain safety
• Keep routines predictable
• Stay emotionally available
• Avoid discussing details`,
  },
  {
    id: 'seek-support',
    title: 'When to Seek Immediate Support',
    icon: Phone,
    content: `Stop using this app and seek professional or emergency support if:

• The child expresses fear of going home now
• The child reports ongoing access to the alleged person
• You feel unsure how to maintain safety`,
  },
]

export default function MandatedReporterGuide() {
  const [expandedSection, setExpandedSection] = useState<string | null>('what-this-is')

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex flex-col">
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-charcoal hover:text-slate-blue">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-600" />
              Mandated Reporter Quick Guide
            </h1>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <p className="text-charcoal-80 mb-6">For Foster &amp; Kinship Caregivers</p>

        <div className="bg-red-100 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <Phone className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-800">
                Call <a href="tel:911" className="underline">911</a> for immediate danger
              </p>
              <p className="text-sm text-red-800 mt-1">
                For suspected abuse or neglect, contact your state-specific reporting line.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
              <button
                onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <section.icon className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-charcoal">{section.title}</h3>
                </div>
                {expandedSection === section.id ? (
                  <ChevronUp className="w-5 h-5 text-charcoal-70" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-charcoal-70" />
                )}
              </button>
              {expandedSection === section.id && (
                <div className="border-t border-gray-100 p-6">
                  <div className="text-sm text-charcoal-80 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-growth-green/10 rounded-xl p-6 text-center">
          <h3 className="font-bold text-charcoal mb-2">One Core Principle to Remember</h3>
          <p className="text-charcoal-80 italic">
            Protecting a child is never betrayal. Reporting is an act of care, not punishment. You do not have to carry this alone.
          </p>
        </div>
      </main>

      <SafetyFooter />
    </div>
  )
}
