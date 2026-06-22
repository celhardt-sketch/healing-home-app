import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import SafetyFooter from '../components/SafetyFooter'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-4xl mx-auto px-4 py-12 w-full">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-blue hover:text-slate-blue-dark mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="bg-white rounded-xl shadow-sm border p-8 md:p-12 max-w-none">
          <h1 className="text-3xl font-bold font-heading text-slate-blue mb-2">Privacy Policy</h1>
          <p className="text-sm text-charcoal-70 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>

          <div className="space-y-6 text-sm text-charcoal-80 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">1. Information We Collect</h2>
              <p>We collect information you provide directly to us, including your name, email address, and any content you create within the application (such as family plan profiles, growth tracker entries, and account preferences).</p>
              <p className="mt-2">We do not collect information about the children in your care beyond what you voluntarily enter into the Family Plan feature. This data is stored securely and is accessible only to you.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Provide and maintain the application</li>
                <li>Personalize your experience</li>
                <li>Send you updates about new content and features (if you opt in)</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Monitor and improve the application</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">3. Data Security</h2>
              <p>We implement appropriate technical and organizational measures to protect the security of your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">4. Data Retention</h2>
              <p>We retain your personal information for as long as your account is active or as needed to provide you services. You may request deletion of your account and associated data at any time by contacting us.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">5. Children's Privacy</h2>
              <p>This application is intended for use by adults (18 years of age or older) only. We do not knowingly collect personal information from children under 18. The application is designed for caregivers, not for use by the children in their care.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">6. Third-Party Services</h2>
              <p>We may use third-party services for authentication, payment processing, analytics, and hosting. These services have their own privacy policies governing the use of your information.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">7. Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal data. You may also opt out of email communications at any time. To exercise these rights, contact us at info@elhardtfamilywellness.com.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">8. Contact Us</h2>
              <p>For questions about this Privacy Policy, contact:</p>
              <p className="mt-2">
                <strong>Elhardt Family Wellness LLC</strong><br />
                Email: <a href="mailto:info@elhardtfamilywellness.com" className="text-slate-blue hover:underline">info@elhardtfamilywellness.com</a><br />
                Website: <a href="https://www.elhardtfamilywellness.com" className="text-slate-blue hover:underline">www.elhardtfamilywellness.com</a>
              </p>
            </section>
          </div>
        </div>
      </div>
      <SafetyFooter />
    </div>
  )
}
