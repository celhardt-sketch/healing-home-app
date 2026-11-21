import { AlertTriangle } from 'lucide-react'

interface CrisisBannerProps {
  className?: string
}

const bannerButtonClass =
  'inline-flex items-center justify-center min-h-[44px] px-3.5 rounded-lg bg-white text-[#B23A32] text-sm font-bold hover:brightness-95 transition whitespace-nowrap'

/**
 * Reusable crisis banner. 911 and 988 are real buttons so a caregiver
 * can reach help with a comfortable tap. White text on the brick band,
 * and brick text on the white buttons, both meet WCAG AA.
 */
export default function CrisisBanner({ className = '' }: CrisisBannerProps) {
  return (
    <div
      role="region"
      aria-label="Crisis support contacts"
      className={`bg-[#B23A32] text-white rounded-xl px-4 py-3 shadow-sm ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="text-sm leading-snug m-0">
            If someone is in immediate danger, call 911. For crisis support, call or text 988
            (Suicide &amp; Crisis Lifeline).
          </p>
          <div className="flex flex-wrap gap-2 mt-2.5">
            <a
              href="tel:911"
              aria-label="Call 9 1 1 for immediate danger"
              className={bannerButtonClass}
            >
              Call 911
            </a>
            <a
              href="tel:988"
              aria-label="Call 9 8 8 Suicide and Crisis Lifeline"
              className={bannerButtonClass}
            >
              Call 988
            </a>
            <a
              href="sms:988"
              aria-label="Text 9 8 8 Suicide and Crisis Lifeline"
              className={bannerButtonClass}
            >
              Text 988
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
