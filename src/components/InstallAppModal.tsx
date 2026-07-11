import { X } from 'lucide-react'
import InstallInstructions from './InstallInstructions'

interface Props {
  open: boolean
  onClose: () => void
  /** Optional label for the dismiss button (e.g. "Continue to app"). */
  closeLabel?: string
}

export default function InstallAppModal({ open, onClose, closeLabel = 'Done' }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between p-6 pb-3">
          <div>
            <h2 className="text-xl font-bold font-heading text-slate-blue">Install the App</h2>
            <p className="text-sm text-charcoal-70 mt-1">
              Add The Healing Home Approach to your Home Screen for quick access.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-charcoal-70 hover:text-charcoal p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pb-6">
          <InstallInstructions />
          <button
            onClick={onClose}
            className="mt-5 w-full bg-slate-blue text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-blue-dark transition-colors"
          >
            {closeLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
