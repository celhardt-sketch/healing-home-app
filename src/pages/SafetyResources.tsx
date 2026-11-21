import { Phone, ExternalLink, Shield, AlertTriangle, Heart } from 'lucide-react'
import SafetyFooter from '../components/SafetyFooter'
import CrisisBanner from '../components/CrisisBanner'
import PublicBackLink from '../components/PublicBackLink'

const urgentContacts = [
  {
    name: 'Emergency Services',
    description: 'For immediate danger to life',
    actions: [{ label: 'Call 911', href: 'tel:911', aria: 'Call 9 1 1 for immediate danger' }],
  },
  {
    name: 'Suicide & Crisis Lifeline',
    description: 'Call or text 24/7',
    actions: [
      { label: 'Call 988', href: 'tel:988', aria: 'Call 9 8 8 Suicide and Crisis Lifeline' },
      { label: 'Text 988', href: 'sms:988', aria: 'Text 9 8 8 Suicide and Crisis Lifeline' },
    ],
  },
]

const otherHotlines = [
  {
    name: 'Crisis Text Line',
    description: 'Free 24/7 text-based support',
    actions: [{ label: 'Text HOME to 741741', href: 'sms:741741?&body=HOME', aria: 'Text HOME to 7 4 1 7 4 1' }],
  },
  {
    name: 'Childhelp National Abuse Hotline',
    description: '24/7 professional crisis counselors',
    actions: [{ label: '1-800-422-4453', href: 'tel:18004224453', aria: 'Call 1 800 422 4453 Childhelp National Abuse Hotline' }],
  },
  {
    name: 'National Domestic Violence Hotline',
    description: '24/7 advocacy, safety planning',
    actions: [{ label: '1-800-799-7233', href: 'tel:18007997233', aria: 'Call 1 800 799 7233 National Domestic Violence Hotline' }],
  },
  {
    name: 'SAMHSA Helpline',
    description: 'Substance abuse and mental health referrals',
    actions: [{ label: '1-800-662-4357', href: 'tel:18006624357', aria: 'Call 1 800 662 4357 SAMHSA Helpline' }],
  },
]

const seekHelp = [
  'Your child is expressing thoughts of self-harm or suicide',
  'You feel unsafe or your child is physically aggressive beyond your ability to manage',
  'A child has disclosed abuse or neglect',
  'You are experiencing compassion fatigue, burnout, or feeling unable to continue',
  'Your child\'s behaviors have escalated beyond what psychoeducational tools can address',
  'You or your child are experiencing a psychiatric emergency',
]

const actionButtonClass =
  'inline-flex w-full items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl text-base font-bold text-center transition hover:brightness-95'

export default function SafetyResources() {
  return (
    <div className="min-h-screen bg-[#FBEDEB] flex flex-col">
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <PublicBackLink />
          <h1 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2 leading-tight">
            <Phone className="w-5 h-5 text-[#B23A32] shrink-0" />
            Safety &amp; Help Resources
          </h1>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-6 w-full">
        <CrisisBanner className="mb-6" />

        <h2 className="text-xl font-bold font-heading text-charcoal mb-4">Emergency &amp; Crisis Contacts</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {urgentContacts.map((contact) => (
            <div key={contact.name} className="bg-white rounded-xl p-5 border border-[#B23A32]/15 shadow-sm">
              <h3 className="font-bold font-heading text-charcoal mb-1">{contact.name}</h3>
              <p className="text-sm text-charcoal-70 mb-3">{contact.description}</p>
              <div className="flex flex-col gap-2">
                {contact.actions.map((action) => (
                  <a
                    key={action.href}
                    href={action.href}
                    aria-label={action.aria}
                    className={`${actionButtonClass} bg-[#B23A32] text-white`}
                  >
                    <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
                    {action.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold font-heading text-charcoal mb-4">More support lines</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {otherHotlines.map((contact) => (
            <div key={contact.name} className="bg-white rounded-xl p-5 border border-slate-blue/15 shadow-sm">
              <h3 className="font-bold font-heading text-charcoal mb-1">{contact.name}</h3>
              <p className="text-sm text-charcoal-70 mb-3">{contact.description}</p>
              <div className="flex flex-col gap-2">
                {contact.actions.map((action) => (
                  <a
                    key={action.href}
                    href={action.href}
                    aria-label={action.aria}
                    className={`${actionButtonClass} bg-slate-blue text-white hover:bg-slate-blue-dark`}
                  >
                    {action.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-blue/10 shadow-sm mb-8">
          <h2 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-slate-blue" />
            When to Seek Professional Help
          </h2>
          <p className="text-sm text-charcoal-80 mb-4">
            This app provides psychoeducational support, not clinical treatment. Contact a mental health professional when:
          </p>
          <ul className="space-y-3">
            {seekHelp.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-charcoal-80">
                <AlertTriangle className="w-4 h-4 text-slate-blue shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-blue/10 shadow-sm mb-8">
          <h2 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-healing-purple" />
            Finding the Right Therapist
          </h2>
          <p className="text-sm text-charcoal-80 mb-4">
            When looking for a therapist for your child or family, consider these specializations:
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {['Trauma-focused CBT (TF-CBT)', 'EMDR for children', 'Trust-Based Relational Intervention (TBRI)', 'Theraplay', 'Play therapy', 'Attachment-focused family therapy', 'Dyadic Developmental Psychotherapy (DDP)', 'Sensory integration therapy'].map((t) => (
              <div key={t} className="bg-healing-purple/5 rounded-lg p-3 text-sm text-charcoal-80">{t}</div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-blue/10 shadow-sm">
          <h2 className="text-xl font-bold font-heading text-charcoal mb-4">Helpful Links</h2>
          <div className="space-y-3">
            {[
              { name: 'Child Welfare Information Gateway', url: 'https://www.childwelfare.gov' },
              { name: 'National Child Traumatic Stress Network', url: 'https://www.nctsn.org' },
            ].map((link) => (
              <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 min-h-[44px] text-slate-blue hover:text-slate-blue-dark transition-colors text-sm">
                <ExternalLink className="w-4 h-4" /> {link.name}
              </a>
            ))}
          </div>
        </div>
      </main>

      <SafetyFooter />
    </div>
  )
}
