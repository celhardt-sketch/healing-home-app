import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Search, ChevronDown, ChevronUp, Video } from 'lucide-react'
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

export default function LearningLibrary() {
  const [search, setSearch] = useState('')
  const [articles, setArticles] = useState<Article[]>([])
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/api/content/articles`)
      .then(r => r.ok ? r.json() : [])
      .then((data: Article[]) => {
        setArticles(data.filter(a => a.active))
        const cats = [...new Set(data.filter(a => a.active).map(a => a.category).filter(Boolean))]
        if (cats.length > 0) setExpandedCategory(cats[0])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const categories = [...new Set(articles.map(a => a.category).filter(Boolean))]

  const filteredArticles = articles.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.summary?.toLowerCase().includes(search.toLowerCase()) ||
    a.content?.toLowerCase().includes(search.toLowerCase())
  )

  const groupedByCategory = categories.map(cat => ({
    category: cat,
    articles: filteredArticles.filter(a => a.category === cat),
  })).filter(g => g.articles.length > 0)

  const uncategorized = filteredArticles.filter(a => !a.category)

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

        {loading ? (
          <p className="text-sm text-charcoal-70">Loading articles...</p>
        ) : (
          <div className="space-y-4">
            {groupedByCategory.map((group) => (
              <div key={group.category} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setExpandedCategory(expandedCategory === group.category ? null : group.category)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-healing-purple/10 text-healing-purple rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-charcoal">{group.category}</h3>
                      <p className="text-xs text-charcoal-70">{group.articles.length} article{group.articles.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  {expandedCategory === group.category ? (
                    <ChevronUp className="w-5 h-5 text-charcoal-70" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-charcoal-70" />
                  )}
                </button>
                {expandedCategory === group.category && (
                  <div className="border-t border-gray-100 px-6 pb-6 space-y-4">
                    {group.articles.map((article) => (
                      <div key={article.id} className="pt-4">
                        <button
                          onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
                          className="w-full text-left"
                        >
                          <h4 className="font-bold text-slate-blue hover:text-slate-blue-dark transition-colors">
                            {article.title}
                          </h4>
                          <div className="flex gap-2 mt-1">
                            {article.author && <span className="text-xs text-charcoal-70">by {article.author}</span>}
                            {article.age_group && <span className="text-xs bg-sky-blue-bg text-slate-blue px-2 py-0.5 rounded-full">{article.age_group}</span>}
                            {article.video_url && <span className="text-xs text-slate-blue flex items-center gap-0.5"><Video className="w-3 h-3" /> Video</span>}
                          </div>
                        </button>
                        {expandedArticle === article.id && (
                          <div className="mt-3 space-y-3">
                            {article.summary && <p className="text-sm text-charcoal-80 leading-relaxed">{article.summary}</p>}
                            <div className="bg-sky-blue-bg rounded-lg p-4">
                              <h5 className="text-sm font-semibold text-slate-blue mb-2">Key Points</h5>
                              <div className="space-y-1">
                                {article.content.split('\n').filter(Boolean).map((point, idx) => (
                                  <p key={idx} className="text-sm text-charcoal-80 flex items-start gap-2">
                                    <span className="text-growth-green mt-0.5">&#8226;</span>
                                    <span>{point.replace(/^[•-]\s*/, '')}</span>
                                  </p>
                                ))}
                              </div>
                            </div>
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
                )}
              </div>
            ))}

            {uncategorized.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-bold font-heading text-charcoal mb-3">Other Articles</h3>
                <div className="space-y-3">
                  {uncategorized.map((article) => (
                    <div key={article.id} className="bg-white rounded-xl border border-gray-100 p-5">
                      <button
                        onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
                        className="w-full text-left"
                      >
                        <h4 className="font-bold text-slate-blue">{article.title}</h4>
                        <div className="flex gap-2 mt-1">
                          {article.author && <span className="text-xs text-charcoal-70">by {article.author}</span>}
                          {article.video_url && <span className="text-xs text-slate-blue flex items-center gap-0.5"><Video className="w-3 h-3" /> Video</span>}
                        </div>
                      </button>
                      {expandedArticle === article.id && (
                        <div className="mt-3 space-y-3">
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

            {filteredArticles.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-charcoal-70">No articles found.</p>
              </div>
            )}
          </div>
        )}
      </main>

      <SafetyFooter />
    </div>
  )
}
