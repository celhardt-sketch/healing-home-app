import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight, Shield, BookOpen, Heart, Users, ClipboardList,
  FileText, Phone, Printer, CheckCircle, Sparkles
} from 'lucide-react'
import SafetyFooter from '../components/SafetyFooter'

const features = [
  {
    icon: Shield,
    title: 'First Aid for Big Feelings',
    description: 'Immediate, step by step support during challenging moments with age appropriate guidance tailored to your child\'s needs.',
    color: 'bg-red-50 text-red-600',
  },
  {
    icon: FileText,
    title: 'Scripts Library',
    description: 'Trauma informed response templates for everyday situations, so you always know what to say when it matters most.',
    color: 'bg-slate-blue/10 text-slate-blue',
  },
  {
    icon: BookOpen,
    title: 'Learning Library',
    description: 'Psychoeducational content on trauma, attachment, and regulation that translates clinical insights into practical understanding.',
    color: 'bg-healing-purple/10 text-healing-purple',
  },
  {
    icon: Users,
    title: 'My Family Plan',
    description: 'Personalized profiles and strategies for each child in your care, keeping everything organized in one place.',
    color: 'bg-sky-blue/20 text-slate-blue',
  },
  {
    icon: Heart,
    title: 'Caregiver Support',
    description: 'Self care tools and regulation exercises for when you need to fill your own cup before you can pour into others.',
    color: 'bg-growth-green/10 text-growth-green-dark',
  },
  {
    icon: ClipboardList,
    title: 'Mandated Reporter Guide',
    description: 'Clear, compassionate guidance for responding to disclosures legally and safely, with step by step protocols.',
    color: 'bg-amber-50 text-amber-700',
  },
  {
    icon: Printer,
    title: 'Printables Vault',
    description: 'Downloadable visual schedules, emotion charts, and regulation tools you can print and use at home.',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: Phone,
    title: 'Safety & Help Resources',
    description: 'Emergency contacts, crisis hotlines, and guidance for knowing when to seek professional support.',
    color: 'bg-red-50 text-red-600',
  },
]

const audiences = [
  {
    icon: Users,
    title: 'Foster & Adoptive Parents',
    description: 'Navigating the complexities of caring for children with trauma histories, attachment challenges, and behavioral needs that traditional parenting advice doesn\'t address.',
    color: 'bg-slate-blue',
  },
  {
    icon: Heart,
    title: 'Kinship Caregivers',
    description: 'Family members stepping in to provide stability and love, often with little preparation and needing practical, accessible tools to support the children in their care.',
    color: 'bg-growth-green',
  },
  {
    icon: Sparkles,
    title: 'Professionals & Advocates',
    description: 'Therapists, caseworkers, teachers, and medical providers who serve these families and want clinically grounded resources to recommend and use alongside their work.',
    color: 'bg-healing-purple',
  },
]

const reasons = [
  'Clinically informed tools created by a child development specialist and therapist',
  'Designed specifically for foster, adoptive, and kinship caregivers',
  'Practical, actionable strategies you can use in real time',
  'Grounded in attachment theory and trauma informed principles',
  'Created by someone who has walked this path as a foster and adoptive parent',
  'Continuously updated with new content and resources',
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="The Healing Home Approach" className="h-10 w-auto" />
            <div>
              <h1 className="text-lg font-bold text-slate-blue leading-tight font-heading">
                The Healing Home Approach
              </h1>
              <p className="text-xs text-charcoal-70">by Elhardt Family Wellness</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/disclaimer')}
              className="text-sm font-medium text-charcoal hover:text-slate-blue transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-slate-blue text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-blue-dark transition-colors"
            >
              Open App
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 bg-sky-blue-bg text-slate-blue text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            Trauma Informed Caregiver Support
          </span>
          <h2 className="text-4xl md:text-6xl font-bold font-heading text-charcoal leading-tight mb-6">
            Breaking Cycles.{' '}
            <span className="text-slate-blue">Healing Hearts.</span>
          </h2>
          <p className="text-lg text-charcoal-80 mb-8 max-w-2xl leading-relaxed">
            A comprehensive digital companion for foster, adoptive, and kinship caregivers.
            Practical tools and trauma informed guidance to help you navigate the beautiful,
            complex journey of caring for children who have experienced adversity.
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 bg-slate-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-blue-dark transition-colors"
            >
              Open App <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/disclaimer')}
              className="inline-flex items-center gap-2 border border-gray-300 text-charcoal px-6 py-3 rounded-lg font-semibold hover:border-slate-blue hover:text-slate-blue transition-colors"
            >
              Sign In
            </button>
          </div>
          <p className="text-sm text-charcoal-70">
            Created by Courtney Snyder Elhardt, M.S., M.A. &mdash; Child Development Specialist, Therapist, and Foster/Adoptive Parent
          </p>
        </div>
      </section>

      {/* Built for Caregivers */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold font-heading text-charcoal mb-4">
              Built for Caregivers Who Need More Than Generic Advice
            </h3>
            <p className="text-charcoal-80 max-w-2xl mx-auto">
              Parenting children who have experienced trauma requires a different approach.
              This app was designed for the unique challenges you face every day.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {audiences.map((a) => (
              <div key={a.title} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                <div className={`w-14 h-14 ${a.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <a.icon className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-xl font-bold font-heading text-charcoal mb-3">{a.title}</h4>
                <p className="text-sm text-charcoal-80 leading-relaxed">{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold font-heading text-charcoal mb-4">
              Everything You Need, Right When You Need It
            </h3>
            <p className="text-charcoal-80 max-w-2xl mx-auto">
              From crisis moments to quiet learning, this app walks alongside you through every part of the caregiving journey.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 ${f.color} rounded-lg flex items-center justify-center mb-4`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold font-heading text-charcoal mb-2">{f.title}</h4>
                <p className="text-sm text-charcoal-80 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold font-heading text-charcoal mb-6">
                Why The Healing Home Approach?
              </h3>
              <p className="text-charcoal-80 mb-8 leading-relaxed">
                This isn't another generic parenting app. Every tool, script, and resource was created
                from the intersection of clinical expertise and lived experience as a foster and adoptive parent.
                We understand the weight you carry, and we built this to lighten it.
              </p>
              <ul className="space-y-3">
                {reasons.map((r) => (
                  <li key={r} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-growth-green shrink-0 mt-0.5" />
                    <span className="text-sm text-charcoal-80">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-sky-blue-bg rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-slate-blue" />
                </div>
                <h4 className="font-heading font-bold text-charcoal">Courtney Snyder Elhardt</h4>
                <p className="text-sm text-charcoal-70">M.S., M.A.</p>
              </div>
              <blockquote className="text-charcoal-80 text-sm italic leading-relaxed border-l-2 border-growth-green pl-4">
                "I created this app because I know what it's like to be in the thick of it &mdash; holding
                a dysregulated child, wondering if you're doing enough, searching for answers at 2 AM.
                You deserve tools that meet you where you are, with compassion and clinical depth.
                This is the resource I wish I'd had from day one."
              </blockquote>
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {['Child Development Specialist', 'Therapist', 'Psychoeducator', 'Foster/Adoptive Parent'].map((t) => (
                  <span key={t} className="text-xs bg-sky-blue-bg text-slate-blue px-3 py-1 rounded-full font-medium">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <h3 className="text-3xl font-bold font-heading text-charcoal mb-4">
            You Don't Have to Do This Alone
          </h3>
          <p className="text-charcoal-80 mb-8 leading-relaxed">
            The children in your care need you at your best. The Healing Home Approach gives you the tools,
            scripts, and knowledge to show up with confidence and compassion, even on the hardest days.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 bg-slate-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-blue-dark transition-colors"
            >
              Open App <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/disclaimer')}
              className="inline-flex items-center gap-2 border border-gray-300 text-charcoal px-6 py-3 rounded-lg font-semibold hover:border-slate-blue hover:text-slate-blue transition-colors"
            >
              Already Have Access? Sign In
            </button>
          </div>
        </div>
      </section>

      <SafetyFooter />
    </div>
  )
}
