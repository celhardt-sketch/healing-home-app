import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Menu, X, LogOut, Settings } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { isAuthenticated, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-3">
          <img src="/logo.png" alt="The Healing Home Approach" className="h-10 w-auto" />
          <div>
            <h1 className="text-lg font-bold text-slate-blue leading-tight font-heading">
              The Healing Home Approach
            </h1>
            <p className="text-xs text-charcoal-70">by Elhardt Family Wellness</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-charcoal hover:text-slate-blue transition-colors">
                Dashboard
              </Link>
              <Link to="/tools" className="text-sm font-medium text-charcoal hover:text-slate-blue transition-colors">
                Tools
              </Link>
              <Link to="/account" className="text-sm font-medium text-charcoal hover:text-slate-blue transition-colors">
                <Settings className="w-4 h-4" />
              </Link>
              <button
                onClick={() => { signOut(); navigate('/'); }}
                className="text-sm font-medium text-charcoal hover:text-slate-blue transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/disclaimer')}
                className="text-sm font-medium text-charcoal hover:text-slate-blue transition-colors"
              >
                Sign In
              </button>
              <a
                href="https://elhardtfamilywellness.mykajabi.com/offers/nHp3qkqL"
                className="bg-slate-blue text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-blue-dark transition-colors"
              >
                Get Access
              </a>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-charcoal"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-charcoal">Dashboard</Link>
              <Link to="/tools" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-charcoal">Tools</Link>
              <Link to="/crisis" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-red-600">Crisis Mode</Link>
              <Link to="/scripts" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-charcoal">Scripts Library</Link>
              <Link to="/learning" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-charcoal">Learning Library</Link>
              <Link to="/family-plan" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-charcoal">My Family Plan</Link>
              <Link to="/account" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-charcoal">Account Settings</Link>
              <button onClick={() => { signOut(); navigate('/'); setMenuOpen(false); }} className="block text-sm font-medium text-charcoal">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { navigate('/disclaimer'); setMenuOpen(false); }} className="block text-sm font-medium text-charcoal">
                Sign In
              </button>
              <a href="https://elhardtfamilywellness.mykajabi.com/offers/nHp3qkqL" className="block text-sm font-semibold text-slate-blue">
                Get Access
              </a>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
