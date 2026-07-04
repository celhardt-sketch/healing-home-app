import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Lock, Eye, Trash2, Home } from 'lucide-react'

interface DataNoticeGateProps {
  featureKey: string
  title: string
  children: ReactNode
}

function ackKey(featureKey: string): string {
  return `thha_data_notice_ack_${featureKey}`
}

/**
 * Gates first-time access to a data-entry feature behind a plain-language data
 * notice and an acknowledgement checkbox. Once acknowledged, the choice is
 * remembered in localStorage so the notice only shows on first entry.
 */
export default function DataNoticeGate({ featureKey, title, children }: DataNoticeGateProps) {
  const [acknowledged, setAcknowledged] = useState<boolean>(
    () => localStorage.getItem(ackKey(featureKey)) === 'true'
  )
  const [checked, setChecked] = useState(false)

  if (acknowledged) return <>{children}</>

  const accept = () => {
    if (!checked) return
    localStorage.setItem(ackKey(featureKey), 'true')
    setAcknowledged(true)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-6 h-6 text-slate-blue shrink-0" aria-hidden="true" />
          <h2 className="text-xl font-bold font-heading text-charcoal m-0">Before you use {title}</h2>
        </div>

        <p className="text-sm text-charcoal-80 leading-relaxed mb-5">
          {title} lets you save information about your family. Please read how that information is
          handled before you enter anything.
        </p>

        <ul className="space-y-4 mb-5">
          <li className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-slate-blue shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-charcoal m-0">What is stored, and where</p>
              <p className="text-sm text-charcoal-80 leading-relaxed m-0">
                What you type here (such as a child's first name or nickname, patterns, and notes) is
                saved to your account on our secured hosting provider. We recommend using a first
                name or nickname only.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Eye className="w-5 h-5 text-slate-blue shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-charcoal m-0">Who can see it</p>
              <p className="text-sm text-charcoal-80 leading-relaxed m-0">
                Only you, when you are signed in to your account, plus the limited service providers
                that host the app. It is not shown to other users, not used for advertising, and not
                shared externally. See our{' '}
                <Link to="/privacy" className="text-slate-blue underline">Privacy Policy</Link> for details.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Trash2 className="w-5 h-5 text-slate-blue shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-charcoal m-0">How to delete it</p>
              <p className="text-sm text-charcoal-80 leading-relaxed m-0">
                You can delete individual entries here at any time. To request full deletion of your
                data, email{' '}
                <a href="mailto:info@elhardtfamilywellness.com" className="text-slate-blue underline">
                  info@elhardtfamilywellness.com
                </a>{' '}
                with the subject "Data Deletion Request."
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Home className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-charcoal m-0">If this child is in foster care</p>
              <p className="text-sm text-charcoal-80 leading-relaxed m-0">
                If this child is in foster care, check your agency's policy before entering their
                information.
              </p>
            </div>
          </li>
        </ul>

        <label className="flex items-start gap-2.5 mb-5 cursor-pointer">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
            className="w-4 h-4 rounded border-gray-300 mt-0.5"
          />
          <span className="text-sm text-charcoal-80 font-medium">
            I have read this notice and understand how my information is stored and shared.
          </span>
        </label>

        <button
          onClick={accept}
          disabled={!checked}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-blue text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-blue-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Continue to {title}
        </button>
      </div>
    </div>
  )
}
