import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import SafetyFooter from '../components/SafetyFooter'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-4xl mx-auto px-4 py-12 w-full">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-blue hover:text-slate-blue-dark mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="bg-white rounded-xl shadow-sm border p-8 md:p-12 max-w-none">
          <h1 className="text-3xl font-bold font-heading text-slate-blue mb-2">Terms of Service</h1>
          <p className="text-sm text-charcoal-70 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>

          <div className="space-y-6 text-sm text-charcoal-80 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">1. Acceptance of Terms</h2>
              <p>By accessing and using The Healing Home Approach application, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the application.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">2. Eligibility</h2>
              <p>This application is intended for use by adults 18 years of age or older. By using this application, you represent that you are at least 18 years old and are a caregiver, foster parent, adoptive parent, or professional working with children.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">3. Nature of Content</h2>
              <p>The Healing Home Approach provides general psychoeducational content only. It is NOT:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>A substitute for professional mental health treatment, diagnosis, or emergency services</li>
                <li>A crisis intervention tool</li>
                <li>A replacement for therapy or clinical treatment</li>
                <li>A diagnostic tool</li>
              </ul>
              <p className="mt-2">Always consult with your child's treating mental health professional before implementing new strategies. App guidance is always subordinate to professional, legal, and caregiver judgment.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">4. User Responsibilities</h2>
              <p>You agree to:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Use the application in accordance with all applicable laws</li>
                <li>Keep your account credentials confidential</li>
                <li>Not share your account access with others</li>
                <li>Not reproduce, distribute, or create derivative works from the content</li>
                <li>Seek professional help in crisis situations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">5. Intellectual Property</h2>
              <p>All content, including but not limited to text, scripts, educational materials, graphics, and design elements, is the property of Elhardt Family Wellness LLC and is protected by copyright and trademark laws. The Healing Home Approach is a trademark of Elhardt Family Wellness LLC.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">6. Disclaimer of Warranties</h2>
              <p>The application is provided "as is" without warranties of any kind. We do not warrant that the application will be uninterrupted, error-free, or that the content will be accurate or complete.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">7. Limitation of Liability</h2>
              <p>To the fullest extent permitted by law, Elhardt Family Wellness LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the application.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">8. Changes to Terms</h2>
              <p>We reserve the right to modify these terms at any time. Continued use of the application after changes constitutes acceptance of the modified terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">9. Contact</h2>
              <p>For questions about these Terms of Service, contact:</p>
              <p className="mt-2">
                <strong>Elhardt Family Wellness LLC</strong><br />
                Email: <a href="mailto:info@elhardtfamilywellness.com" className="text-slate-blue hover:underline">info@elhardtfamilywellness.com</a>
              </p>
            </section>
          </div>
        </div>
      </div>
      <SafetyFooter />
    </div>
  )
}
