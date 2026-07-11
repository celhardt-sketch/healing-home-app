import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Shield, BookOpen, Heart, Users,
  AlertTriangle, Sparkles, TrendingUp,
  Settings, RefreshCw, Brain, FileText, Printer
} from 'lucide-react'
import Navbar from '../components/Navbar'
import SafetyFooter from '../components/SafetyFooter'
import InstallAppModal from '../components/InstallAppModal'

const dashboardCards = [
  {
    title: 'First Aid for Big Feelings & Behaviors',
    description: 'Immediate support for challenging moments with age-appropriate guidance',
    icon: AlertTriangle,
    href: '/crisis',
    gradient: 'from-red-500 to-orange-500',
  },
  {
    title: 'Caregiver Support',
    description: 'When you need support, self-care, and regulation tools',
    icon: Heart,
    href: '/caregiver-support',
    gradient: 'from-healing-purple to-healing-purple-dark',
  },
  {
    title: 'My Family Plan',
    description: 'Personalized profiles and strategies for each child',
    icon: Users,
    href: '/family-plan',
    gradient: 'from-sky-blue to-slate-blue',
  },
  {
    title: 'The Try Again Reset',
    description: 'A calm-time tool for practicing repair, building body awareness, and reinforcing identity',
    icon: RefreshCw,
    href: '/try-again',
    gradient: 'from-growth-green to-growth-green-dark',
  },
  {
    title: 'Growth Tracker',
    description: 'Log and celebrate your child\'s growth moments with positive reinforcement and weekly reflections',
    icon: TrendingUp,
    href: '/growth-tracker',
    gradient: 'from-growth-green to-growth-green-dark',
  },
  {
    title: 'Kids Regulation Tools',
    description: 'Short guided regulation videos your child can use with you',
    icon: Brain,
    href: '/kids-regulation',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    title: 'Scripts Library',
    description: 'Trauma-informed response templates for everyday situations',
    icon: FileText,
    href: '/scripts',
    gradient: 'from-slate-blue to-slate-blue-dark',
  },
  {
    title: 'Printables Vault',
    description: 'Downloadable visual schedules, charts, and tools',
    icon: Printer,
    href: '/printables',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    title: 'Learning Library',
    description: 'Psychoeducational content on trauma, attachment, and regulation',
    icon: BookOpen,
    href: '/learning',
    gradient: 'from-healing-purple to-healing-purple-dark',
  },
  {
    title: 'Mandated Reporter Guide',
    description: 'Essential guidance for responding to disclosures legally and safely',
    icon: Shield,
    href: '/mandated-reporter-guide',
    gradient: 'from-amber-500 to-red-500',
  },
  {
    title: 'Safety & Help',
    description: 'Emergency resources and when to seek professional support',
    icon: Sparkles,
    href: '/safety-resources',
    gradient: 'from-red-500 to-red-600',
  },
]

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams()
  // Show the install card only after a successful Stripe payment (return from checkout).
  const [showInstall, setShowInstall] = useState(() => searchParams.get('subscription') === 'success')

  // Strip the checkout query params so the card doesn't reappear on refresh.
  useEffect(() => {
    if (searchParams.get('subscription') === 'success') {
      searchParams.delete('subscription')
      searchParams.delete('session_id')
      setSearchParams(searchParams, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-blue-bg via-white to-healing-purple/5 flex flex-col">
      <InstallAppModal
        open={showInstall}
        closeLabel="Continue to app"
        onClose={() => setShowInstall(false)}
      />
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold font-heading text-charcoal mb-2">
            Welcome back
          </h2>
          <p className="text-charcoal-80">
            We walk alongside you as you navigate trauma, attachment, and emotional growth with the children in your care.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {dashboardCards.map((card) => (
            <Link
              key={card.title}
              to={card.href}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow group"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${card.gradient} rounded-xl flex items-center justify-center mb-4`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold font-heading text-charcoal group-hover:text-slate-blue transition-colors mb-1">
                {card.title}
              </h3>
              <p className="text-sm text-charcoal-80">{card.description}</p>
            </Link>
          ))}
        </div>

        {/* Account */}
        <Link
          to="/account"
          className="inline-flex items-center gap-2 text-sm text-charcoal-70 hover:text-slate-blue transition-colors"
        >
          <Settings className="w-4 h-4" /> Account Settings
        </Link>
      </main>

      <SafetyFooter />
    </div>
  )
}
