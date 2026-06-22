import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, AlertTriangle, FileText, Phone, ChevronDown, ChevronUp, Heart } from 'lucide-react'
import SafetyFooter from '../components/SafetyFooter'

const sections = [
  {
    id: 'what',
    title: 'What is a Mandated Reporter?',
    icon: Shield,
    content: `A mandated reporter is a person required by law to report suspected child abuse or neglect to the appropriate authorities. In most states, this includes teachers, medical professionals, social workers, counselors, and childcare providers. Many states have expanded this to include coaches, clergy, and other community members.\n\nAs a caregiver of children who have experienced trauma, you may witness disclosures or behaviors that indicate past or ongoing abuse. Understanding your responsibilities protects both you and the children in your care.`,
  },
  {
    id: 'when',
    title: 'When to Report',
    icon: AlertTriangle,
    content: `You should make a report when you have reasonable suspicion (not certainty) that a child has been abused or neglected. This includes:\n\n\u2022 A child directly tells you about abuse or neglect\n\u2022 You observe physical signs (bruises, burns, unexplained injuries)\n\u2022 You notice behavioral indicators (sudden changes, age-inappropriate sexual behavior, extreme withdrawal)\n\u2022 A third party tells you about abuse to a child\n\u2022 A child's behavior during visits or interactions raises concern\n\nYou do not need proof. You need reasonable suspicion. The investigation is not your job. The report is.`,
  },
  {
    id: 'how',
    title: 'How to Respond to a Disclosure',
    icon: Heart,
    content: `When a child discloses abuse, your response matters enormously. Follow these steps:\n\n1. Stay calm. Your reaction sets the tone for whether the child feels safe to continue.\n2. Listen without interrupting. Let them share at their own pace.\n3. Believe them. "I believe you. Thank you for telling me."\n4. Reassure them. "This is not your fault. You are not in trouble."\n5. Do not ask leading questions. Do not investigate.\n6. Do not promise confidentiality. Instead say: "I need to tell someone who can help keep you safe."\n7. Document what the child said using their exact words as soon as possible.\n8. Report immediately.\n\nNo one can do this work alone.`,
  },
  {
    id: 'report',
    title: 'How to Make a Report',
    icon: Phone,
    content: `Contact your state's child protective services agency or call the Childhelp National Child Abuse Hotline at 1-800-422-4453.\n\nWhen making a report, be prepared to provide:\n\u2022 The child's name, age, and address (if known)\n\u2022 The parent or caregiver's name and address\n\u2022 The nature of the concern or disclosure\n\u2022 Any evidence of harm or risk\n\u2022 Your name and relationship to the child (confidentiality is protected in most states)\n\nMake the report as soon as possible. In most states, you must report within 24-48 hours. Delays can put children at risk and may have legal consequences.`,
  },
  {
    id: 'after',
    title: 'After Making a Report',
    icon: FileText,
    content: `After making a report:\n\n\u2022 Document everything: date, time, who you spoke with, what you reported, and the reference number\n\u2022 Do not inform the alleged abuser about the report\n\u2022 Continue to provide the child with normal, supportive care\n\u2022 Follow up with CPS if you have additional information\n\u2022 Take care of yourself. Making a report is emotionally heavy work.\n\nRemember: Making a report in good faith protects you legally. Failing to report when mandated can result in criminal penalties in many states. Your obligation is to the child's safety above all else.`,
  },
]

export default function MandatedReporterGuide() {
  const [expandedSection, setExpandedSection] = useState<string | null>('what')

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
              Mandated Reporter Guide
            </h1>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-amber-100 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold font-heading text-amber-800 mb-2">
            Essential Guidance for Caregivers
          </h2>
          <p className="text-sm text-amber-800">
            Understanding your responsibilities as a mandated reporter is essential for protecting the
            children in your care. This guide provides clear, compassionate guidance for responding to
            disclosures legally and safely.
          </p>
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

        <div className="mt-8 bg-red-50 rounded-xl p-6 text-center">
          <h3 className="font-bold text-red-800 mb-2">Childhelp National Child Abuse Hotline</h3>
          <a href="tel:18004224453" className="text-2xl font-bold text-red-600 hover:text-red-700">
            1-800-422-4453
          </a>
          <p className="text-sm text-red-800 mt-2">Available 24/7. Professional crisis counselors.</p>
        </div>
      </main>

      <SafetyFooter />
    </div>
  )
}
