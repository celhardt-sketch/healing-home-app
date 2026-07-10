import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, Clock, ChevronDown, ChevronUp, ArrowRight, Sparkles } from 'lucide-react'
import SafetyFooter from '../components/SafetyFooter'
import RichText from '../components/RichText'
import ArticleBody from '../components/ArticleBody'
import { useArticles, readingMinutes, slugify, splitLines } from '../lib/learning'

export default function LearningArticle() {
  const { categorySlug, articleSlug } = useParams<{ categorySlug: string; articleSlug: string }>()
  const { categories, loading } = useArticles()
  const [refsOpen, setRefsOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-charcoal-70">
        Loading…
      </div>
    )
  }

  const category = categories.find((c) => c.slug === categorySlug)
  const article = category?.articles.find((a) => slugify(a.title) === articleSlug)

  if (!category || !article) {
    return <Navigate to="/learning" replace />
  }

  const takeaways = splitLines(article.key_takeaways)
  const references = splitLines(article.further_reading)

  const idx = category.articles.findIndex((a) => a.id === article.id)
  const nextArticle = idx >= 0 && idx < category.articles.length - 1 ? category.articles[idx + 1] : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-healing-purple/5 via-white to-sky-blue-bg flex flex-col">
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link to={`/learning/${category.slug}`} className="text-charcoal hover:text-slate-blue" aria-label={`Back to ${category.name}`}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-sm font-medium text-charcoal-70 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-healing-purple" />
            {category.name}
          </span>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <article>
          <h1 className="text-3xl font-bold font-heading text-charcoal leading-tight">{article.title}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-charcoal-70">
            {article.author && <span>By {article.author}</span>}
            {article.age_group && <span className="bg-sky-blue-bg text-slate-blue px-2 py-0.5 rounded-full text-xs">{article.age_group}</span>}
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {readingMinutes(article.content)} min read</span>
          </div>

          {/* Key Takeaways strip */}
          {takeaways.length > 0 && (
            <div className="bg-white rounded-xl border border-healing-purple/20 shadow-sm p-5 mt-6">
              <h2 className="text-sm font-semibold text-healing-purple flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4" /> Key Takeaways
              </h2>
              <ul className="space-y-2">
                {takeaways.map((tk, i) => (
                  <li key={i} className="text-sm text-charcoal-80 leading-relaxed flex items-start gap-2">
                    <span className="text-healing-purple mt-1.5 w-1.5 h-1.5 rounded-full bg-healing-purple shrink-0" />
                    <span><RichText text={tk} /></span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Body */}
          <ArticleBody content={article.content} />

          {/* References & Further Reading (accessible, collapsible) */}
          {references.length > 0 && (
            <div className="mt-10 bg-white rounded-xl border border-gray-100 overflow-hidden">
              <button
                onClick={() => setRefsOpen((o) => !o)}
                aria-expanded={refsOpen}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold font-heading text-charcoal">References &amp; Further Reading</span>
                {refsOpen ? <ChevronUp className="w-5 h-5 text-charcoal-70" /> : <ChevronDown className="w-5 h-5 text-charcoal-70" />}
              </button>
              {refsOpen && (
                <ul className="border-t border-gray-100 px-6 py-4 space-y-2 list-disc pl-9">
                  {references.map((ref, i) => (
                    <li key={i} className="text-sm text-charcoal-80 leading-relaxed">
                      <RichText text={ref} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </article>

        {nextArticle && (
          <Link
            to={`/learning/${category.slug}/${slugify(nextArticle.title)}`}
            className="mt-8 flex items-center justify-between gap-3 bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow group"
          >
            <div>
              <p className="text-xs text-charcoal-70">Next in {category.name}</p>
              <p className="font-bold text-charcoal group-hover:text-slate-blue transition-colors">{nextArticle.title}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-charcoal-70 group-hover:text-slate-blue transition-colors shrink-0" />
          </Link>
        )}
      </main>

      <SafetyFooter />
    </div>
  )
}
