import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Shield, BookOpen, Heart, Users,
  AlertTriangle, Sparkles, TrendingUp,
  Settings, RefreshCw, Brain, FileText, Printer,
  ChevronDown, ExternalLink, ArrowUpRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Navbar from '../components/Navbar'
import SafetyFooter from '../components/SafetyFooter'
import InstallAppModal from '../components/InstallAppModal'

interface DashboardCard {
  title: string
  description: string
  icon: LucideIcon
  href: string
  gradient: string
  // 'dark' renders the icon in charcoal for contrast on light (yellow) chips.
  iconTone?: 'light' | 'dark'
}

interface DashboardSection {
  section: string
  blurb: string
  icon: LucideIcon
  gradient: string
  iconTone?: 'light' | 'dark'
  cards: DashboardCard[]
}

const dashboardSections: DashboardSection[] = [
  {
    section: 'In the moment',
    blurb: 'Right-now tools for hard moments',
    icon: AlertTriangle,
    gradient: 'from-yellow-400 to-amber-500',
    iconTone: 'dark',
    cards: [
      {
        title: 'First Aid for Big Feelings & Behaviors',
        description: 'Immediate support for challenging moments with age-appropriate guidance',
        icon: AlertTriangle,
        href: '/crisis',
        gradient: 'from-yellow-400 to-amber-500',
        iconTone: 'dark',
      },
      {
        title: 'Scripts Library',
        description: 'Trauma-informed response templates for everyday situations',
        icon: FileText,
        href: '/scripts',
        gradient: 'from-slate-blue to-slate-blue-dark',
      },
      {
        title: 'The Try Again Reset',
        description: 'A calm-time tool for practicing repair, building body awareness, and reinforcing identity',
        icon: RefreshCw,
        href: '/try-again',
        gradient: 'from-growth-green to-growth-green-dark',
      },
      {
        title: 'Kids Regulation Tools',
        description: 'Short guided regulation videos your child can use with you',
        icon: Brain,
        href: '/kids-regulation',
        gradient: 'from-cyan-500 to-blue-500',
      },
    ],
  },
  {
    section: 'Plan & track',
    blurb: 'Profiles and progress for each child',
    icon: Users,
    gradient: 'from-sky-blue to-slate-blue',
    cards: [
      {
        title: 'My Family Plan',
        description: 'Personalized profiles and strategies for each child',
        icon: Users,
        href: '/family-plan',
        gradient: 'from-sky-blue to-slate-blue',
      },
      {
        title: 'Growth Tracker',
        description: 'Log and celebrate your child\'s growth moments with positive reinforcement and weekly reflections',
        icon: TrendingUp,
        href: '/growth-tracker',
        gradient: 'from-growth-green to-growth-green-dark',
      },
    ],
  },
  {
    section: 'Learn',
    blurb: 'Articles, videos, and printables',
    icon: BookOpen,
    gradient: 'from-healing-purple to-healing-purple-dark',
    cards: [
      {
        title: 'Learning Library',
        description: 'Psychoeducational content on trauma, attachment, and regulation',
        icon: BookOpen,
        href: '/learning',
        gradient: 'from-healing-purple to-healing-purple-dark',
      },
      {
        title: 'Printables Vault',
        description: 'Downloadable visual schedules, charts, and tools',
        icon: Printer,
        href: '/printables',
        gradient: 'from-orange-500 to-amber-500',
      },
    ],
  },
  {
    section: 'You',
    blurb: 'Care and regulation for you',
    icon: Heart,
    gradient: 'from-growth-green to-growth-green-dark',
    cards: [
      {
        title: 'Caregiver Support',
        description: 'When you need support, self-care, and regulation tools',
        icon: Heart,
        href: '/caregiver-support',
        gradient: 'from-healing-purple to-healing-purple-dark',
      },
    ],
  },
  {
    section: 'Safety',
    blurb: 'Reporting and emergency resources',
    icon: Shield,
    gradient: 'from-slate-blue to-slate-blue-dark',
    cards: [
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
    ],
  },
]

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams()
  // Show the install card only after a successful Stripe payment (return from checkout).
  const [showInstall, setShowInstall] = useState(() => searchParams.get('subscription') === 'success')
  // Accordion: sections are collapsed on open; tapping one reveals its tools.
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = (name: string) =>
    setOpenSection((current) => (current === name ? null : name))

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

        {/* Five collapsible sections — tap a button to reveal its tools. */}
        <div className="space-y-4 mb-8 max-w-3xl">
          {dashboardSections.map((group) => {
            const isOpen = openSection === group.section
            const panelId = `section-panel-${group.section.replace(/\s+/g, '-').toLowerCase()}`
            return (
              <section key={group.section}>
                <button
                  onClick={() => toggleSection(group.section)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="w-full flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-left"
                >
                  <div className={`w-14 h-14 bg-gradient-to-r ${group.gradient} rounded-2xl flex items-center justify-center shrink-0`}>
                    <group.icon className={`w-7 h-7 ${group.iconTone === 'dark' ? 'text-charcoal' : 'text-white'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold font-heading text-charcoal">{group.section}</h3>
                    <p className="text-sm text-charcoal-80 truncate">{group.blurb}</p>
                  </div>
                  <ChevronDown
                    className={`w-6 h-6 text-charcoal-70 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div id={panelId} className="grid sm:grid-cols-2 gap-4 mt-4 px-1">
                    {group.cards.map((card) => (
                      <Link
                        key={card.title}
                        to={card.href}
                        className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow group"
                      >
                        <div className={`w-12 h-12 bg-gradient-to-r ${card.gradient} rounded-xl flex items-center justify-center mb-4`}>
                          <card.icon className={`w-6 h-6 ${card.iconTone === 'dark' ? 'text-charcoal' : 'text-white'}`} />
                        </div>
                        <h4 className="text-lg font-bold font-heading text-charcoal group-hover:text-slate-blue transition-colors mb-1">
                          {card.title}
                        </h4>
                        <p className="text-sm text-charcoal-80">{card.description}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            )
          })}
        </div>

        {/* For More Resources — external learning site */}
        <a
          href="https://learn.elhardtfamilywellness.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 max-w-3xl bg-gradient-to-r from-slate-blue to-healing-purple text-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow mb-6"
        >
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <ExternalLink className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold font-heading">For More Resources</h3>
            <p className="text-sm text-white/85">Explore courses and deeper learning at learn.elhardtfamilywellness.com</p>
          </div>
          <ArrowUpRight className="w-5 h-5 shrink-0" />
        </a>

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
