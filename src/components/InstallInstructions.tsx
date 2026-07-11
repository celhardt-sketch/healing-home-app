import { useState } from 'react'
import { Smartphone, Apple } from 'lucide-react'

type Platform = 'android' | 'ios'

const APP_URL = 'https://healing-home-app.vercel.app'

const androidSteps = [
  <>Open <strong>Google Chrome</strong> and go to the app's website.</>,
  <>Tap the <strong>three-dot menu</strong> in the upper-right corner.</>,
  <>Select <strong>Install app</strong> or <strong>Add to Home screen</strong>.</>,
  <>Confirm the app name, then tap <strong>Install</strong> or <strong>Add</strong>.</>,
  <>The app icon will appear on your Home Screen.</>,
]

const iosSteps = [
  <>Open <strong>Safari</strong> and go to the app's website.</>,
  <>Tap the <strong>Share button</strong>, the square with an upward-pointing arrow.</>,
  <>Scroll down and select <strong>Add to Home Screen</strong>.</>,
  <>Confirm the app name, then tap <strong>Add</strong> in the upper-right corner.</>,
  <>The app icon will appear on your Home Screen.</>,
]

interface Props {
  /** Which platform tab is selected initially. Defaults to detecting the device. */
  initialPlatform?: Platform
}

function detectPlatform(): Platform {
  if (typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent)) {
    return 'ios'
  }
  return 'android'
}

export default function InstallInstructions({ initialPlatform }: Props) {
  const [platform, setPlatform] = useState<Platform>(initialPlatform ?? detectPlatform())

  const steps = platform === 'android' ? androidSteps : iosSteps

  return (
    <div className="space-y-4">
      <p className="text-sm text-charcoal-80">
        This app is a Progressive Web App (PWA). You do not need to visit an app store,
        simply add it to your phone's Home Screen using the steps below.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setPlatform('android')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
            platform === 'android'
              ? 'bg-slate-blue text-white border-slate-blue'
              : 'bg-white text-charcoal border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Smartphone className="w-4 h-4" /> Android
        </button>
        <button
          onClick={() => setPlatform('ios')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
            platform === 'ios'
              ? 'bg-slate-blue text-white border-slate-blue'
              : 'bg-white text-charcoal border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Apple className="w-4 h-4" /> iPhone / iPad
        </button>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-charcoal mb-2">
          {platform === 'android'
            ? 'Android — using Google Chrome'
            : 'iPhone or iPad — using Safari'}
        </p>
        <ol className="text-sm text-charcoal-80 space-y-1.5 ml-4 list-decimal">
          {steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
        {platform === 'ios' && (
          <p className="mt-3 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2">
            <strong>Important for Apple users:</strong> You must open the website in Safari.
            The "Add to Home Screen" option may not appear in Chrome or another browser.
          </p>
        )}
      </div>

      <div className="text-sm text-charcoal-80">
        App link:{' '}
        <a href={APP_URL} className="text-slate-blue font-medium hover:underline break-all">
          {APP_URL}
        </a>
      </div>
    </div>
  )
}
