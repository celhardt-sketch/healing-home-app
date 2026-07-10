import { Link, useParams, Navigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, Clock, ChevronRight } from 'lucide-react'
import SafetyFooter from '../components/SafetyFooter'
import { useArticles, readingMinutes, slugify } from '../lib/learning'

export default function LearningCategory() {
  const { categorySlug } = useParams<{ categorySlug: string }>()
  const { categories, loading } = useArticles()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-charcoal-70">
        Loading…
      </div>
    )
  }

  const category = categories.find((c) => c.slug === categorySlug)
  if (!category) {
    return <Navigate to="/learning" replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-healing-purple/5 via-white to-sky-blue-bg flex flex-col">
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/learning" className="text-charcoal hover:text-slate-blue" aria-label="Back to Learning Library">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-healing-purple" />
            {category.name}
          </h1>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold font-heading text-charcoal">
            {category.name} <span className="text-charcoal-70 font-normal text-lg">&middot; {category.articles.length} article{category.articles.length !== 1 ? 's' : ''}</span>
          </h2>
          {category.description && <p className="text-charcoal-80 mt-1">{category.description}</p>}
        </div>

        <div className="space-y-3">
          {category.articles.map((article) => (
            <Link
              key={article.id}
              to={`/learning/${category.slug}/${slugify(article.title)}`}
              className="block bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="font-bold font-heading text-charcoal group-hover:text-slate-blue transition-colors">
                    {article.title}
                  </h3>
                  {article.summary && <p className="text-sm text-charcoal-80 mt-1.5 leading-relaxed">{article.summary}</p>}
                  <div className="flex items-center gap-3 mt-3 text-xs text-charcoal-70">
                    {article.author && <span>By {article.author}</span>}
                    {article.age_group && <span className="bg-sky-blue-bg text-slate-blue px-2 py-0.5 rounded-full">{article.age_group}</span>}
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {readingMinutes(article.content)} min read</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-charcoal-70 group-hover:text-slate-blue transition-colors shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>
      </main>

      <SafetyFooter />
    </div>
  )
}
