import { Link } from 'react-router-dom'
import { ArrowLeft, Phone, ExternalLink, Shield, AlertTriangle, Heart } from 'lucide-react'
import SafetyFooter from '../components/SafetyFooter'

const emergencyNumbers = [
  { name: 'Emergency Services', number: '911', description: 'For immediate danger to life' },
  { name: 'Suicide & Crisis Lifeline', number: '988', description: 'Call or text 24/7' },
  { name: 'Crisis Text Line', number: 'Text HOME to 741741', description: 'Free 24/7 text-based support' },
  { name: 'Childhelp National Abuse Hotline', number: '1-800-422-4453', description: '24/7 professional crisis counselors' },
  { name: 'National Domestic Violence Hotline', number: '1-800-799-7233', description: '24/7 advocacy, safety planning' },
  { name: 'SAMHSA Helpline', number: '1-800-662-4357', description: 'Substance abuse and mental health referrals' },
]

const seekHelp = [
  'Your child is expressing thoughts of self-harm or suicide',
  'You feel unsafe or your child is physically aggressive beyond your ability to manage',
  'A child has disclosed abuse or neglect',
  'You are experiencing compassion fatigue, burnout, or feeling unable to continue',
  'Your child\'s behaviors have escalated beyond what psychoeducational tools can address',
  'You or your child are experiencing a psychiatric emergency',
]

export default function SafetyResources() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex flex-col">
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/dashboard" className="text-charcoal hover:text-slate-blue">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2">
            <Phone className="w-5 h-5 text-red-500" />
            Safety &amp; Help Resources
          </h1>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        <div className="bg-red-100 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold font-heading text-red-800 flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5" />
            If someone is in immediate danger, call 911
          </h2>
          <p className="text-sm text-red-800">
            This app is not a crisis intervention tool or substitute for emergency services.
          </p>
        </div>

        <h3 className="text-xl font-bold font-heading text-charcoal mb-4">Emergency &amp; Crisis Contacts</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {emergencyNumbers.map((contact) => (
            <div key={contact.name} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h4 className="font-bold text-charcoal mb-1">{contact.name}</h4>
              <a href={`tel:${contact.number.replace(/[^0-9]/g, '')}`} className="text-lg font-bold text-red-600 hover:text-red-700 flex items-center gap-2 mb-1">
                <Phone className="w-4 h-4" /> {contact.number}
              </a>
              <p className="text-sm text-charcoal-70">{contact.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-8">
          <h3 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-amber-600" />
            When to Seek Professional Help
          </h3>
          <p className="text-sm text-charcoal-80 mb-4">
            This app provides psychoeducational support, not clinical treatment. Contact a mental health professional when:
          </p>
          <ul className="space-y-3">
            {seekHelp.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-charcoal-80">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-8">
          <h3 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-healing-purple" />
            Finding the Right Therapist
          </h3>
          <p className="text-sm text-charcoal-80 mb-4">
            When looking for a therapist for your child or family, consider these specializations:
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {['Trauma-focused CBT (TF-CBT)', 'EMDR for children', 'Trust-Based Relational Intervention (TBRI)', 'Theraplay', 'Play therapy', 'Attachment-focused family therapy', 'Dyadic Developmental Psychotherapy (DDP)', 'Sensory integration therapy'].map((t) => (
              <div key={t} className="bg-healing-purple/5 rounded-lg p-3 text-sm text-charcoal-80">{t}</div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold font-heading text-charcoal mb-4">Helpful Links</h3>
          <div className="space-y-3">
            {[
              { name: 'Child Welfare Information Gateway', url: 'https://www.childwelfare.gov' },
              { name: 'National Child Traumatic Stress Network', url: 'https://www.nctsn.org' },
              { name: 'AdoptUSKids', url: 'https://www.adoptuskids.org' },
              { name: 'Creating a Family', url: 'https://creatingafamily.org' },
            ].map((link) => (
              <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-blue hover:text-slate-blue-dark transition-colors text-sm">
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
