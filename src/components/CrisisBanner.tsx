import { AlertTriangle } from 'lucide-react'

interface CrisisBannerProps {
  className?: string
}

/**
 * Reusable crisis banner. Renders the 911 / 988 crisis line with tappable
 * tel: / sms: links so a caregiver in a hard moment can reach help immediately.
 * White text on the brand red band meets WCAG AA contrast for normal text.
 */
export default function CrisisBanner({ className = '' }: CrisisBannerProps) {
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
