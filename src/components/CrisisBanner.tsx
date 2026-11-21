import { AlertTriangle } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

interface CrisisBannerProps {
  className?: string
  /**
   * `card` is the in-page red notice. `strip` is the compact public header
   * with one-tap 911, 988, and Crisis tools. Use only one per screen.
   */
  variant?: 'card' | 'strip'
}

const stripLinkClass =
  'inline-flex h-11 shrink-0 items-center justify-center rounded-lg px-2 text-[13px] font-semibold whitespace-nowrap text-white underline decoration-white/70 underline-offset-4 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-3 sm:text-sm'

/**
 * Compact help strip for public pages. Stays at the top while the page
 * scrolls. Slate blue bar; rust is used only for the 911 button.
 */
function CrisisHelpStrip({ className = '' }: { className?: string }) {
  const { pathname } = useLocation()

  return (
    <div
      role="region"
      aria-label="Crisis support contacts"
      className={`sticky top-0 z-[60] bg-slate-blue text-white print:hidden pt-[env(safe-area-inset-top,0px)] shadow-sm ${className}`}
    >
      <div className="mx-auto flex h-11 max-w-5xl items-center justify-center gap-1 px-1.5 sm:gap-2 sm:px-4">
        <p className="m-0 hidden text-sm font-medium text-white/90 md:block">Need help now?</p>
        <a
          href="tel:911"
          aria-label="Call 9 1 1 for immediate danger"
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-lg bg-[#B23A32] px-2.5 text-[13px] font-semibold whitespace-nowrap text-white no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-3 sm:text-sm"
        >
          Call 911
        </a>
        <a href="tel:988" aria-label="Call 9 8 8 Suicide and Crisis Lifeline" className={stripLinkClass}>
          Call 988
        </a>
        <a href="sms:988" aria-label="Text 9 8 8 Suicide and Crisis Lifeline" className={stripLinkClass}>
          Text 988
        </a>
        <Link
          to="/crisis"
          aria-current={pathname === '/crisis' ? 'page' : undefined}
          className={stripLinkClass}
        >
          Crisis tools
        </Link>
      </div>
    </div>
  )
}

/**
 * Reusable crisis banner. Renders the 911 / 988 crisis line with tappable
 * tel: / sms: links so a caregiver in a hard moment can reach help immediately.
 * White text on the brand red band meets WCAG AA contrast for normal text.
 */
export default function CrisisBanner({ className = '', variant = 'card' }: CrisisBannerProps) {
  if (variant === 'strip') {
    return <CrisisHelpStrip className={className} />
  }

  return (
    <div
      role="region"
      aria-label="Crisis support contacts"
      className={`bg-[#B23A32] text-white rounded-xl px-4 py-3.5 shadow-sm ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm leading-relaxed m-0">
          If someone is in immediate danger, call{' '}
          <a
            href="tel:911"
            aria-label="Call 9 1 1 for immediate danger"
            className="font-bold text-white underline underline-offset-2 whitespace-nowrap"
          >
            911
          </a>
          . For crisis support,{' '}
          <a
            href="tel:988"
            aria-label="Call 9 8 8 Suicide and Crisis Lifeline"
            className="font-bold text-white underline underline-offset-2"
          >
            call
          </a>{' '}
          or{' '}
          <a
            href="sms:988"
            aria-label="Text 9 8 8 Suicide and Crisis Lifeline"
            className="font-bold text-white underline underline-offset-2"
          >
            text
          </a>{' '}
          <span className="font-bold whitespace-nowrap">988</span> (Suicide &amp; Crisis Lifeline).
        </p>
      </div>
    </div>
  )
}
