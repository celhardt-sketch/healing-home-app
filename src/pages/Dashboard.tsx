import { Link } from 'react-router-dom'
import {
  Shield, BookOpen, Heart, Users, FileText, Phone,
  Printer, AlertTriangle, Sparkles, TrendingUp,
  Settings, Brain, RefreshCw
} from 'lucide-react'
import Navbar from '../components/Navbar'
import SafetyFooter from '../components/SafetyFooter'

const quickActions = [
  {
    title: 'Crisis Mode',
    description: 'Immediate support for challenging moments',
    icon: AlertTriangle,
    href: '/crisis',
    gradient: 'from-red-500 to-orange-500',
  },
  {
    title: 'Regulate Me Now',
    description: 'When you need support, self-care, and regulation tools',
    icon: Heart,
    href: '/regulate-me',
    gradient: 'from-healing-purple to-healing-purple-dark',
  },
  {
    title: 'Try Again Tool',
    description: 'A calm-time tool for practicing repair, building body awareness, and reinforcing identity',
    icon: RefreshCw,
    href: '/try-again',
    gradient: 'from-growth-green to-growth-green-dark',
  },
]

const tools = [
  {
    title: 'Kids Regulation Tools',
    description: 'Interactive tools to help children build regulation skills',
    icon: Brain,
    href: '/kids-regulation',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    title: 'Scripts Library',
    description: 'Trauma informed response templates for everyday situations',
    icon: FileText,
    href: '/scripts',
    gradient: 'from-slate-blue to-slate-blue-dark',
  },
  {
    title: 'Learning Library',
    description: 'Psychoeducational content on trauma, attachment, and regulation',
    icon: BookOpen,
    href: '/learning',
    gradient: 'from-healing-purple to-healing-purple-dark',
  },
  {
    title: 'Growth Tracker',
    description: 'Log and celebrate your child\'s growth moments with positive reinforcement and weekly reflections',
    icon: TrendingUp,
    href: '/growth-tracker',
    gradient: 'from-growth-green to-growth-green-dark',
  },
  {
    title: 'My Family Plan',
    description: 'Personalized profiles and strategies for each child',
    icon: Users,
    href: '/family-plan',
    gradient: 'from-sky-blue to-slate-blue',
  },
  {
    title: 'Caregiver Support',
    description: 'Self care tools and regulation exercises for you',
    icon: Sparkles,
    href: '/caregiver-support',
    gradient: 'from-growth-green to-growth-green-dark',
  },
  {
    title: 'Mandated Reporter Guide',
    description: 'Essential guidance for responding to disclosures legally and safely',
    icon: Shield,
    href: '/mandated-reporter-guide',
    gradient: 'from-amber-500 to-red-500',
  },
  {
    title: 'Printables Vault',
    description: 'Downloadable visual schedules, emotion charts, and tools',
    icon: Printer,
    href: '/printables',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    title: 'Safety & Help',
    description: 'Emergency resources and when to seek professional support',
    icon: Phone,
    href: '/safety-resources',
    gradient: 'from-red-500 to-red-600',
  },
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-blue-bg via-white to-healing-purple/5 flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold font-heading text-charcoal mb-2">
            Welcome to Your Healing Home
          </h2>
          <p className="text-charcoal-80">
            Your trauma-informed toolkit. Choose where you need to start today.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.href}
              className={`bg-gradient-to-r ${action.gradient} text-white rounded-xl p-6 hover:shadow-lg transition-shadow`}
            >
              <action.icon className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-bold font-heading mb-1">{action.title}</h3>
              <p className="text-sm text-white/90">{action.description}</p>
            </Link>
          ))}
        </div>

        {/* Tools Grid */}
        <h3 className="text-xl font-bold font-heading text-charcoal mb-4">Your Tools</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {tools.map((tool) => (
            <Link
              key={tool.title}
              to={tool.href}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow group"
            >
              <div className={`w-10 h-10 bg-gradient-to-r ${tool.gradient} rounded-lg flex items-center justify-center mb-3`}>
                <tool.icon className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-bold text-charcoal group-hover:text-slate-blue transition-colors mb-1">
                {tool.title}
              </h4>
              <p className="text-sm text-charcoal-80">{tool.description}</p>
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
