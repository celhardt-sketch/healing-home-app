import { Link } from 'react-router-dom'

export default function SafetyFooter() {
  return (
    <footer className="bg-slate-blue text-white py-8 mt-auto">
      <div className="max-w-4xl mx-auto px-4 text-center text-sm space-y-4">
        <div className="space-y-1">
          <p className="text-white/80">
            If someone is in immediate danger, call{' '}
            <a href="tel:911" className="font-semibold text-white underline">911</a>.
            For crisis support, call or text{' '}
            <a href="tel:988" className="font-semibold text-white underline">988</a>{' '}
            (Suicide &amp; Crisis Lifeline).
          </p>
        </div>

        <div className="border-t border-white/20 pt-4">
          <div className="flex items-center justify-center gap-3 mb-3">
            <img src="/logo.png" alt="The Healing Home Approach" className="h-8 w-auto brightness-0 invert" />
            <span className="font-heading font-bold">The Healing Home Approach&#8482;</span>
          </div>
          <p className="text-white/70 text-xs">by Elhardt Family Wellness LLC</p>
        </div>

        <div className="flex items-center justify-center gap-4 text-xs text-white/70">
          <a href="https://www.elhardtfamilywellness.com" className="hover:text-white transition-colors">Website</a>
          <a href="mailto:info@elhardtfamilywellness.com" className="hover:text-white transition-colors">Contact</a>
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>

        <p className="text-white/50 text-xs max-w-2xl mx-auto">
          &copy; {new Date().getFullYear()} Elhardt Family Wellness LLC. All rights reserved.
          This application provides general psychoeducational content only and is not a substitute for
          professional mental health treatment, diagnosis, or emergency services. Always consult with
          your child's treating mental health professional before implementing new strategies.
        </p>

        <p className="text-white/50 text-xs">
          For adults 18+ only. Intended for caregivers, foster parents, adoptive parents,
          and professionals working with children.
        </p>
      </div>
    </footer>
  )
}
