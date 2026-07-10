import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, ChevronRight, Info } from 'lucide-react'
import SafetyFooter from '../components/SafetyFooter'
import { useArticles } from '../lib/learning'

const learningLandingIntro =
  'Understanding your own responses helps you show up better for your child.'
const collectionDisclaimer =
  'These articles are educational and reflect the principles of The Healing Home Approach\u2122. They are not a substitute for individualized clinical, medical, or legal advice. Defer to your child\u2019s treatment team for guidance specific to your child.'
const copyrightLine =
  '\u00A9 2026 Elhardt Family Wellness LLC. All rights reserved. The Healing Home Approach\u2122 is a trademark of Elhardt Family Wellness LLC.'

export default function LearningLibrary() {
  const { categories, loading } = useArticles()

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
        <div className="mb-8">
          <p className="text-lg text-charcoal-80 leading-relaxed">
            {learningLandingIntro}
          </p>
        </div>

        {loading ? (
          <p className="text-charcoal-70">Loading articles…</p>
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
