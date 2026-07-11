import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, ChevronRight, Info, Search, Clock } from 'lucide-react'
import SafetyFooter from '../components/SafetyFooter'
import { useArticles, readingMinutes, slugify } from '../lib/learning'

const learningLandingIntro =
  'Understanding your own responses helps you show up better for your child.'
const collectionDisclaimer =
  'These articles are educational and reflect the principles of The Healing Home Approach\u2122. They are not a substitute for individualized clinical, medical, or legal advice. Defer to your child\u2019s treatment team for guidance specific to your child.'
const copyrightLine =
  '\u00A9 2026 Elhardt Family Wellness LLC. All rights reserved. The Healing Home Approach\u2122 is a trademark of Elhardt Family Wellness LLC.'

export default function LearningLibrary() {
  const { categories, loading } = useArticles()
  const [search, setSearch] = useState('')

  const query = search.trim().toLowerCase()
  const results = useMemo(() => {
    if (!query) return []
    return categories.flatMap((cat) =>
      cat.articles
        .filter((a) =>
          a.title.toLowerCase().includes(query) ||
          (a.summary || '').toLowerCase().includes(query) ||
          a.content.toLowerCase().includes(query)
        )
        .map((a) => ({ article: a, categoryName: cat.name, categorySlug: cat.slug }))
    )
  }, [categories, query])

  return (
    <div className="min-h-screen bg-gradient-to-br from-healing-purple/5 via-white to-sky-blue-bg flex flex-col">
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/dashboard" className="text-charcoal hover:text-slate-blue" aria-label="Back to dashboard">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-healing-purple" />
            Learning Library
          </h1>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <p className="text-lg text-charcoal-80 leading-relaxed">
            {learningLandingIntro}
          </p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-70" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles…"
            aria-label="Search articles"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-healing-purple focus:border-transparent outline-none"
          />
        </div>

        {loading ? (
          <p className="text-charcoal-70">Loading articles…</p>
        ) : query ? (
          <div className="mb-8">
            <p className="text-sm text-charcoal-70 mb-4">
              {results.length} article{results.length !== 1 ? 's' : ''} matching &ldquo;{search.trim()}&rdquo;
            </p>
            <div className="space-y-3">
              {results.map(({ article, categoryName, categorySlug }) => (
                <Link
                  key={article.id}
                  to={`/learning/${categorySlug}/${slugify(article.title)}`}
                  className="block bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow group"
                >
                  <h3 className="font-bold font-heading text-charcoal group-hover:text-slate-blue transition-colors">
                    {article.title}
                  </h3>
                  {article.summary && <p className="text-sm text-charcoal-80 mt-1.5 leading-relaxed">{article.summary}</p>}
                  <div className="flex items-center gap-3 mt-3 text-xs text-charcoal-70">
                    <span className="bg-healing-purple/10 text-healing-purple px-2 py-0.5 rounded-full">{categoryName}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {readingMinutes(article.content)} min read</span>
                  </div>
                </Link>
              ))}
              {results.length === 0 && (
                <p className="text-sm text-charcoal-70">No articles matched. Try a different word.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/learning/${cat.slug}`}
                className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-11 h-11 bg-healing-purple/10 text-healing-purple rounded-lg flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-charcoal-70 group-hover:text-slate-blue transition-colors" />
                </div>
                <h3 className="font-bold font-heading text-charcoal group-hover:text-slate-blue transition-colors mt-4">
                  {cat.name}
                </h3>
                <p className="text-xs text-charcoal-70 mt-0.5">
                  {cat.articles.length} article{cat.articles.length !== 1 ? 's' : ''}
                </p>
                {cat.description && (
                  <p className="text-sm text-charcoal-80 mt-2 leading-relaxed">{cat.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}

        <div className="bg-sky-blue-bg/60 rounded-xl p-5 border border-sky-blue/20">
          <h4 className="text-sm font-semibold text-slate-blue flex items-center gap-2 mb-2">
            <Info className="w-4 h-4" /> About these articles
          </h4>
          <p className="text-sm text-charcoal-80 leading-relaxed">{collectionDisclaimer}</p>
          <p className="text-xs text-charcoal-70 mt-3">{copyrightLine}</p>
        </div>
      </main>

      <SafetyFooter />
    </div>
  )
}
