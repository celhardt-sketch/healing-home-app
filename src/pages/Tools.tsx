import { Link } from 'react-router-dom'
import {
  Brain, Heart, RefreshCw, FileText, BookOpen, TrendingUp,
  Users, Sparkles, Shield, Printer, Phone, ArrowRight
} from 'lucide-react'
import Navbar from '../components/Navbar'
import SafetyFooter from '../components/SafetyFooter'

const tools = [
  { title: 'First Aid for Big Feelings', description: 'Immediate, step by step support during challenging moments', icon: Shield, href: '/crisis', gradient: 'from-red-500 to-orange-500' },
  { title: 'Regulate Me Now', description: 'Quick regulation exercises for caregivers in the moment', icon: Heart, href: '/regulate-me', gradient: 'from-healing-purple to-healing-purple-dark' },
  { title: 'Try Again Tool', description: 'A guided tool for repair, body awareness, and reinforcing identity', icon: RefreshCw, href: '/try-again', gradient: 'from-growth-green to-growth-green-dark' },
  { title: 'Kids Regulation Tools', description: 'Interactive regulation videos and tools for children', icon: Brain, href: '/kids-regulation', gradient: 'from-cyan-500 to-blue-500' },
  { title: 'Scripts Library', description: 'Trauma informed response templates for everyday situations', icon: FileText, href: '/scripts', gradient: 'from-slate-blue to-slate-blue-dark' },
  { title: 'Learning Library', description: 'Psychoeducational content on trauma, attachment, and regulation', icon: BookOpen, href: '/learning', gradient: 'from-healing-purple to-healing-purple-dark' },
  { title: 'Growth Tracker', description: 'Log and celebrate growth moments with positive reinforcement', icon: TrendingUp, href: '/growth-tracker', gradient: 'from-growth-green to-growth-green-dark' },
  { title: 'My Family Plan', description: 'Personalized profiles and strategies for each child', icon: Users, href: '/family-plan', gradient: 'from-sky-blue to-slate-blue' },
  { title: 'Caregiver Support', description: 'Self care tools and regulation exercises', icon: Sparkles, href: '/caregiver-support', gradient: 'from-growth-green to-growth-green-dark' },
  { title: 'Mandated Reporter Guide', description: 'Guidance for responding to disclosures legally and safely', icon: Shield, href: '/mandated-reporter-guide', gradient: 'from-amber-500 to-red-500' },
  { title: 'Printables Vault', description: 'Downloadable visual schedules, charts, and tools', icon: Printer, href: '/printables', gradient: 'from-orange-500 to-amber-500' },
  { title: 'Safety & Help Resources', description: 'Emergency contacts and professional support guidance', icon: Phone, href: '/safety-resources', gradient: 'from-red-500 to-red-600' },
]

export default function Tools() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-blue-bg via-white to-healing-purple/5 flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold font-heading text-charcoal mb-2">All Tools</h2>
        <p className="text-charcoal-80 mb-8">Everything you need, organized in one place.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.title}
              to={tool.href}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow group"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${tool.gradient} rounded-xl flex items-center justify-center mb-4`}>
                <tool.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold font-heading text-charcoal group-hover:text-slate-blue transition-colors mb-2">
                {tool.title}
              </h3>
              <p className="text-sm text-charcoal-80 mb-3">{tool.description}</p>
              <span className="inline-flex items-center gap-1 text-sm text-slate-blue font-medium">
                Open <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>
      </main>
      <SafetyFooter />
    </div>
  )
}
