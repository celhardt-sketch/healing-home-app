import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Search, ChevronDown, ChevronUp, Brain, Heart, Shield, Users, Video } from 'lucide-react'
import SafetyFooter from '../components/SafetyFooter'

const API_URL = import.meta.env.VITE_API_URL || ''

interface Article {
  id: number
  title: string
  content: string
  summary: string
  category: string
  age_group: string
  author: string
  video_url: string | null
  active: number
}

const topics = [
  {
    id: 'trauma-basics',
    title: 'Understanding Trauma',
    icon: Brain,
    color: 'text-red-600 bg-red-50',
    articles: [
      {
        title: 'What is Developmental Trauma?',
        summary: 'Developmental trauma occurs when a child experiences chronic, repeated adverse experiences during critical periods of brain development. Unlike single-incident trauma, it reshapes the very architecture of the developing brain.',
        keyPoints: ['Trauma impacts brain development, not just behavior', 'The stress response system becomes overactive', 'Behaviors that look "defiant" are often survival responses', 'Healing is possible through safe, repeated relational experiences'],
      },
      {
        title: 'The ACE Study and What It Means',
        summary: 'The Adverse Childhood Experiences study revealed a direct, dose-response relationship between childhood adversity and long-term health outcomes. Understanding ACEs helps caregivers contextualize behaviors and advocate for appropriate support.',
        keyPoints: ['Higher ACE scores correlate with increased health and behavioral challenges', 'Protective factors (like a stable caregiver) buffer the impact of ACEs', 'ACE scores do not define a child\'s future', 'Knowing a child\'s history informs, but should not limit, expectations'],
      },
    ],
  },
  {
    id: 'attachment',
    title: 'Attachment Theory',
    icon: Heart,
    color: 'text-healing-purple bg-healing-purple/10',
    articles: [
      {
        title: 'Attachment Styles in Children from Hard Places',
        summary: 'Children who have experienced disrupted early relationships often develop insecure or disorganized attachment patterns. Understanding these patterns is the first step toward building new relational templates.',
        keyPoints: ['Secure attachment is earned through consistent, responsive caregiving', 'Insecure patterns are adaptations, not deficits', 'Disorganized attachment reflects the impossibility of the child\'s early environment', 'New attachment patterns can develop at any age'],
      },
      {
        title: 'Building Attachment: Practical Strategies',
        summary: 'Attachment is not built through grand gestures. It is built through thousands of small, repeated moments of attunement, repair, and co-regulation.',
        keyPoints: ['Follow the child\'s lead in play and interaction', 'Narrate your own emotional states', 'Practice repair quickly and consistently after rupture', 'Create predictable rhythms and rituals'],
      },
    ],
  },
  {
    id: 'regulation',
    title: 'Regulation and the Nervous System',
    icon: Shield,
    color: 'text-slate-blue bg-sky-blue-bg',
    articles: [
      {
        title: 'The Brain in Crisis: What Happens During a Meltdown',
        summary: 'When a child\'s amygdala fires, the prefrontal cortex goes offline. The child literally cannot think, reason, or learn. Understanding this neurobiology changes how we respond.',
        keyPoints: ['The amygdala activates within milliseconds of perceived threat', 'Cortisol floods the body, preparing for fight, flight, or freeze', 'Reasoning and learning are impossible in this state', 'Co-regulation (your calm) is the bridge back to safety'],
      },
      {
        title: 'Co-Regulation: Your Calm Is the Intervention',
        summary: 'Children borrow regulation from regulated adults. Before a child can learn to self-regulate, they must first experience being regulated by someone else. This is the foundation of all behavior change.',
        keyPoints: ['Your nervous system speaks to theirs', 'Calm body, soft voice, slow movements', 'Regulation before reason, always', 'Self-regulation develops from repeated experiences of co-regulation'],
      },
    ],
  },
  {
    id: 'behavior',
    title: 'Understanding Behavior',
    icon: Users,
    color: 'text-growth-green-dark bg-growth-green/10',
    articles: [
      {
        title: 'Behavior Is Communication',
        summary: 'Every behavior serves a function. When children act in ways that puzzle or frustrate adults, they are expressing fear, confusion, or unmet need through the only language their nervous system has access to.',
        keyPoints: ['Ask "What is this behavior telling me?" not "How do I stop this?"', 'The behavior is the symptom, not the problem', 'Punishing the behavior without addressing the need guarantees it will return', 'Understanding the function unlocks the intervention'],
      },
      {
        title: 'Identity-Informed Parenting\u2122',
        summary: 'Trauma impacts behavior, but it does not define identity. Identity-Informed Parenting separates the child\'s actions from their core self, reinforcing who they are becoming rather than labeling what they have done.',
        keyPoints: ['Mistakes are not identity', 'Name the behavior, not the child', '"You made a hurtful choice" vs. "You are a bad kid"', 'Belonging is rooted in inherent value'],
      },
    ],
  },
]

export default function LearningLibrary() {
  const [search, setSearch] = useState('')
  const [expandedTopic, setExpandedTopic] = useState<string | null>('trauma-basics')
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null)
  const [dynamicArticles, setDynamicArticles] = useState<Article[]>([])
  const [expandedDynamic, setExpandedDynamic] = useState<number | null>(null)

  useEffect(() => {
    fetch(`${API_URL}/api/content/articles`)
      .then(r => r.ok ? r.json() : [])
      .then((data: Article[]) => setDynamicArticles(data.filter(a => a.active)))
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-healing-purple/5 via-white to-sky-blue-bg flex flex-col">
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/dashboard" className="text-charcoal hover:text-slate-blue">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-healing-purple" />
            Learning Library
          </h1>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold font-heading text-charcoal mb-2">
            Psychoeducational Library
          </h2>
          <p className="text-charcoal-80">
            Clinical insights translated into practical understanding. Knowledge is power.
          </p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-70" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search topics..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none"
          />
        </div>

        <div className="space-y-4">
          {topics.map((topic) => (
            <div key={topic.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <button
                onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${topic.color} rounded-lg flex items-center justify-center`}>
                    <topic.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal">{topic.title}</h3>
                    <p className="text-xs text-charcoal-70">{topic.articles.length} articles</p>
                  </div>
                </div>
                {expandedTopic === topic.id ? (
                  <ChevronUp className="w-5 h-5 text-charcoal-70" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-charcoal-70" />
                )}
              </button>
              {expandedTopic === topic.id && (
                <div className="border-t border-gray-100 px-6 pb-6 space-y-4">
                  {topic.articles.map((article) => (
                    <div key={article.title} className="pt-4">
                      <button
                        onClick={() => setExpandedArticle(expandedArticle === article.title ? null : article.title)}
                        className="w-full text-left"
                      >
                        <h4 className="font-bold text-slate-blue hover:text-slate-blue-dark transition-colors">
                          {article.title}
                        </h4>
                      </button>
                      {expandedArticle === article.title && (
                        <div className="mt-3 space-y-3">
                          <p className="text-sm text-charcoal-80 leading-relaxed">{article.summary}</p>
                          <div className="bg-sky-blue-bg rounded-lg p-4">
                            <h5 className="text-sm font-semibold text-slate-blue mb-2">Key Points</h5>
                            <ul className="space-y-1">
                              {article.keyPoints.map((point) => (
                                <li key={point} className="text-sm text-charcoal-80 flex items-start gap-2">
                                  <span className="text-growth-green mt-1">&#8226;</span>
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {dynamicArticles.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold font-heading text-charcoal mb-4">More Articles</h2>
            <div className="space-y-3">
              {dynamicArticles.map((article) => (
                <div key={article.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setExpandedDynamic(expandedDynamic === article.id ? null : article.id)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <h4 className="font-bold text-slate-blue">{article.title}</h4>
                      <div className="flex gap-2 mt-1">
                        {article.author && <span className="text-xs text-charcoal-70">by {article.author}</span>}
                        {article.category && <span className="text-xs bg-healing-purple/10 text-healing-purple px-2 py-0.5 rounded-full">{article.category}</span>}
                        {article.age_group && <span className="text-xs bg-sky-blue-bg text-slate-blue px-2 py-0.5 rounded-full">{article.age_group}</span>}
                        {article.video_url && <span className="text-xs text-slate-blue flex items-center gap-0.5"><Video className="w-3 h-3" /> Video</span>}
                      </div>
                    </div>
                    {expandedDynamic === article.id ? <ChevronUp className="w-5 h-5 text-charcoal-70" /> : <ChevronDown className="w-5 h-5 text-charcoal-70" />}
                  </button>
                  {expandedDynamic === article.id && (
                    <div className="border-t border-gray-100 px-5 pb-5 pt-3 space-y-3">
                      {article.summary && <p className="text-sm text-charcoal-80 italic">{article.summary}</p>}
                      <p className="text-sm text-charcoal-80 leading-relaxed whitespace-pre-wrap">{article.content}</p>
                      {article.video_url && (
                        <a href={article.video_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-slate-blue hover:underline font-medium">
                          <Video className="w-4 h-4" /> Watch Video
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <SafetyFooter />
    </div>
  )
}
