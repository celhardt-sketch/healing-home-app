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
          <p className="text-sm text-charcoal-70 mb-2">Last Updated: June 22, 2026</p>
          <p className="text-sm text-charcoal-70 mb-8">
            <strong>Company:</strong> Elhardt Family Wellness LLC<br />
            <strong>App:</strong> The Healing Home Approach&#8482;
          </p>

          <div className="space-y-6 text-sm text-charcoal-80 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">1. Information We Collect</h2>

              <h3 className="font-bold text-charcoal mt-4 mb-2">1.1 Information You Provide Directly</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200 rounded">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 border-b font-semibold">Category</th>
                      <th className="text-left p-3 border-b font-semibold">Examples</th>
                      <th className="text-left p-3 border-b font-semibold">Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3">Account Information</td>
                      <td className="p-3">Name, email address</td>
                      <td className="p-3">Account creation, authentication, and access management</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Child Profile Data</td>
                      <td className="p-3">Child's nickname, triggers, nervous system patterns</td>
                      <td className="p-3">Personalized psychoeducational support and organizational tools for caregivers</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Caregiver Profile Data</td>
                      <td className="p-3">Caregiver name, stress points, regulation preferences</td>
                      <td className="p-3">Personalized caregiver support and regulation tools</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Usage Preferences</td>
                      <td className="p-3">Favorited first aid cards, saved resources, disclaimer acceptance records</td>
                      <td className="p-3">Personalized experience and compliance tracking</td>
                    </tr>
                    <tr>
                      <td className="p-3">Cancellation Feedback</td>
                      <td className="p-3">Optional reason provided when cancelling access</td>
                      <td className="p-3">Service improvement</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="font-bold text-charcoal mt-4 mb-2">1.2 Information Collected Automatically</h3>
              <p>When you use the Service, we may automatically collect limited technical information such as device type, browser type, general activity within the app, and information needed to keep you signed in. We use this information to operate, secure, and improve the Service. We do not use it to track you across other websites or services.</p>

              <h3 className="font-bold text-charcoal mt-4 mb-2">1.3 Information Received from Third Parties</h3>
              <p>When you subscribe, our payment processor, Stripe, provides us your email address and subscription status so we can match your purchase to your account and grant access. We do not receive or store your card details. If you join our email list, your email address is managed directly by Elhardt Family Wellness; we do not use a third-party email marketing platform.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">2. How We Use Your Information</h2>
              <ul className="list-disc ml-6 space-y-1">
                <li>To create and manage your account</li>
                <li>To verify your subscription and grant access</li>
                <li>To provide personalized psychoeducational content</li>
                <li>To store your child profiles and caregiver notes</li>
                <li>To record disclaimer acceptance for compliance</li>
                <li>To improve the Service based on usage patterns</li>
                <li>To communicate service updates or changes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">3. How We Share Your Information</h2>
              <p>We do not sell, rent, or trade your personal information to third parties. We may disclose your information only in the following limited circumstances: Service Providers, Legal Requirements, Business Transfers.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">4. Sensitive Information: Child Data</h2>
              <p>We recognize that the Family Plan feature may contain sensitive information about children in your care. We treat all child profile data with heightened care.</p>
              <p className="mt-2 font-semibold text-charcoal">Important Notice: Children's profile data is never shared externally, used for advertising, or linked to any child-facing content or records.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">5. Data Security</h2>
              <p>No method of electronic transmission or storage is completely secure. While we strive to protect your information, we cannot guarantee its absolute security.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">6. Data Retention</h2>
              <p>Contact <a href="mailto:info@elhardtfamilywellness.com" className="text-slate-blue hover:underline">info@elhardtfamilywellness.com</a> to request data deletion.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">7. Your Rights and Choices</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200 rounded">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 border-b font-semibold">Right</th>
                      <th className="text-left p-3 border-b font-semibold">Description</th>
                      <th className="text-left p-3 border-b font-semibold">How to Exercise</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3">Access</td>
                      <td className="p-3">Request a copy of the personal information we hold about you</td>
                      <td className="p-3">Email info@elhardtfamilywellness.com</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Correction</td>
                      <td className="p-3">Request correction of inaccurate personal information</td>
                      <td className="p-3">Edit directly in the app or email us</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Deletion</td>
                      <td className="p-3">Request permanent deletion of your personal information</td>
                      <td className="p-3">Email with subject "Data Deletion Request"</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Portability</td>
                      <td className="p-3">Request your data in a portable format</td>
                      <td className="p-3">Email us</td>
                    </tr>
                    <tr>
                      <td className="p-3">Opt Out of Marketing</td>
                      <td className="p-3">Unsubscribe from email marketing communications</td>
                      <td className="p-3">Unsubscribe link in emails or email us</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3">We will respond to all legitimate requests within thirty (30) days.</p>
              <p className="mt-2"><strong>7.1 Virginia Consumer Data Protection Act (VCDPA):</strong> Rights apply to Virginia residents.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">9. Third-Party Services</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200 rounded">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 border-b font-semibold">Service</th>
                      <th className="text-left p-3 border-b font-semibold">Purpose</th>
                      <th className="text-left p-3 border-b font-semibold">Data Shared</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3">Stripe</td>
                      <td className="p-3">Payment processing and subscription management</td>
                      <td className="p-3">Email address and billing details (handled by Stripe; we do not store card data)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Railway</td>
                      <td className="p-3">Backend hosting, database, and authentication</td>
                      <td className="p-3">Application data stored in the Service</td>
                    </tr>
                    <tr>
                      <td className="p-3">Vercel</td>
                      <td className="p-3">Front-end application hosting</td>
                      <td className="p-3">Standard request/usage data</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">13. Contact Information</h2>
              <p>
                <strong>Elhardt Family Wellness LLC</strong><br />
                <a href="https://www.elhardtfamilywellness.com" className="text-slate-blue hover:underline">www.elhardtfamilywellness.com</a><br />
                <a href="mailto:info@elhardtfamilywellness.com" className="text-slate-blue hover:underline">info@elhardtfamilywellness.com</a>
              </p>
            </section>
          </div>
        </div>
      </div>
      <SafetyFooter />
    </div>
  )
}
