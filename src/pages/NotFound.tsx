import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-sky-blue-bg rounded-full flex items-center justify-center mx-auto mb-6">
          <Home className="w-10 h-10 text-slate-blue" />
        </div>
        <h1 className="text-4xl font-bold font-heading text-charcoal mb-4">Page Not Found</h1>
        <p className="text-charcoal-80 mb-8">
          The page you're looking for doesn't exist. Let's get you back to a safe place.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-slate-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-blue-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
