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
          <p className="text-sm text-charcoal-70 mb-2">Last Updated: February 9, 2026</p>
          <p className="text-sm text-charcoal-70 mb-8">
            <strong>Company:</strong> Elhardt Family Wellness LLC<br />
            <strong>App:</strong> The Healing Home Approach&#8482;
          </p>

          <p className="text-sm text-charcoal-80 leading-relaxed mb-6">
            Elhardt Family Wellness LLC (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates
            The Healing Home Approach&#8482; application (the &ldquo;Service&rdquo;). This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you use the Service. Please read this
            Privacy Policy carefully. By using the Service, you consent to the data practices described in this policy.
          </p>

          <div className="space-y-6 text-sm text-charcoal-80 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">1. Information We Collect</h2>

              <h3 className="font-bold text-charcoal mt-4 mb-2">1.1 Information You Provide Directly</h3>
              <p className="mb-3">
                When you create an account and use the Service, we may collect the following categories of
                information that you voluntarily provide:
              </p>
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
                      <td className="p-3">Child&rsquo;s first name or nickname, age, developmental notes, behavioral observations, strategies, and caregiver notes entered into the Family Plan feature</td>
                      <td className="p-3">Personalized psychoeducational support and organizational tools for caregivers</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Caregiver Profile Data</td>
                      <td className="p-3">Caregiver name, relationship to child, regulation preferences, and self-care notes</td>
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
              <p>
                When you access the Service, we may automatically collect certain technical information, including
                your IP address, browser type, device type, operating system, referring URLs, and general usage
                patterns. This information is collected through standard web server logs and built-in analytics
                provided by our hosting platform. We do not use third-party tracking cookies, advertising pixels,
                or external analytics services such as Google Analytics.
              </p>

              <h3 className="font-bold text-charcoal mt-4 mb-2">1.3 Information Received from Third Parties</h3>
              <p>
                When you purchase a subscription through Stripe, we receive your email address and subscription
                status for the sole purpose of matching your purchase to your app account and granting access.
                We do not receive or store your payment card information, billing address, or other financial
                details. All payment processing is handled entirely by Stripe.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">2. How We Use Your Information</h2>
              <p className="mb-3">We use the information we collect for the following purposes:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200 rounded">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 border-b font-semibold">Purpose</th>
                      <th className="text-left p-3 border-b font-semibold">Legal Basis</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3">To create and manage your account</td>
                      <td className="p-3">Performance of contract (these Terms)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">To verify your subscription and grant access</td>
                      <td className="p-3">Performance of contract</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">To provide personalized psychoeducational content</td>
                      <td className="p-3">Performance of contract</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">To store your child profiles and caregiver notes</td>
                      <td className="p-3">Performance of contract / your consent</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">To record disclaimer acceptance for compliance</td>
                      <td className="p-3">Legitimate interest (legal compliance)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">To improve the Service based on usage patterns</td>
                      <td className="p-3">Legitimate interest</td>
                    </tr>
                    <tr>
                      <td className="p-3">To communicate service updates or changes</td>
                      <td className="p-3">Legitimate interest / performance of contract</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">3. How We Share Your Information</h2>
              <p>
                We do not sell, rent, or trade your personal information to third parties. We do not share your
                data with advertisers, data brokers, or marketing partners.
              </p>
              <p className="mt-3">
                We may disclose your information only in the following limited circumstances:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li><strong>Service Providers:</strong> We use third-party service providers to host and operate the Service, including Stripe (payment processing), Railway (backend hosting), and Vercel (frontend hosting). These providers have access to your information only to the extent necessary to perform their services and are obligated to protect your information.</li>
                <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law, court order, subpoena, or other legal process, or if we believe in good faith that such disclosure is necessary to comply with applicable law, protect our rights or property, or protect the safety of any person.</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, reorganization, or sale of all or a portion of our assets, your information may be transferred as part of that transaction. We will notify you of any such change in ownership or control of your personal information.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">4. Sensitive Information: Child Data</h2>
              <p>
                We recognize that the Family Plan feature may contain sensitive information about children in your
                care. We treat all child profile data with heightened care and apply the following protections:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Child profile data is accessible only to the account holder who created it</li>
                <li>We do not use child profile data for any purpose other than providing the Family Plan feature to you</li>
                <li>We do not analyze, aggregate, or use child profile data for research, marketing, or any purpose beyond delivering the Service</li>
                <li>We do not share child profile data with any third party except as required by law</li>
              </ul>
              <p className="mt-3 font-semibold text-charcoal">
                Important Notice: Despite these protections, information stored in the Service could potentially be
                subject to legal discovery, subpoena, or court order in custody, dependency, or other legal proceedings.
                We strongly advise you to avoid entering diagnostic language, investigative observations, or information
                that could be misinterpreted outside of its caregiving context.
              </p>
              <p className="mt-3">
                <strong>Children&rsquo;s Privacy (COPPA):</strong> The Service is intended for use by adults aged 18 and older.
                We do not knowingly collect personal information from children under 13. The child profile data
                entered by adult caregivers is about children in their care, not collected from children themselves.
                If we become aware that we have inadvertently collected personal information from a child under 13,
                we will take steps to delete that information promptly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">5. Data Security</h2>
              <p>
                We implement reasonable administrative, technical, and physical security measures to protect your
                personal information from unauthorized access, use, alteration, and disclosure. These measures include
                encrypted data transmission (HTTPS/TLS), secure authentication protocols, and access controls that
                limit data access to authorized personnel only.
              </p>
              <p className="mt-3">
                However, no method of electronic transmission or storage is completely secure. While we strive to
                protect your information, we cannot guarantee its absolute security. You are responsible for
                maintaining the security of your account credentials and for any activity that occurs under your account.
              </p>
              <p className="mt-3">
                <strong>Breach Notification:</strong> In the event of a data breach that compromises your personal
                information, we will notify affected users via the email address associated with their account within
                seventy-two (72) hours of becoming aware of the breach, or as otherwise required by applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">6. Data Retention</h2>
              <p>
                We retain your account information and associated data for as long as your account is active or as
                needed to provide the Service. If you cancel your access, we retain your data in an inactive state
                so that it is available if you choose to resubscribe. Disclaimer acceptance records, including
                timestamps and IP addresses, are retained indefinitely for legal compliance purposes.
              </p>
              <p className="mt-3">
                If you wish to have your data permanently deleted, you may submit a written request to{' '}
                <a href="mailto:info@elhardtfamilywellness.com" className="text-slate-blue hover:underline">info@elhardtfamilywellness.com</a>{' '}
                with the subject line &ldquo;Data Deletion Request.&rdquo; We will process your request within thirty (30) days,
                subject to any legal obligations that require us to retain certain records.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">7. Your Rights and Choices</h2>
              <p className="mb-3">Depending on your jurisdiction, you may have certain rights regarding your personal information:</p>
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
                      <td className="p-3">Email with subject &ldquo;Data Deletion Request&rdquo;</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Portability</td>
                      <td className="p-3">Request your data in a portable format</td>
                      <td className="p-3">Email info@elhardtfamilywellness.com</td>
                    </tr>
                    <tr>
                      <td className="p-3">Opt Out of Marketing</td>
                      <td className="p-3">Unsubscribe from email marketing communications</td>
                      <td className="p-3">Unsubscribe link in emails or email us</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3">We will respond to all legitimate requests within thirty (30) days. We may ask you to verify your identity before processing your request.</p>

              <h3 className="font-bold text-charcoal mt-4 mb-2">7.1 Virginia Consumer Data Protection Act (VCDPA)</h3>
              <p>
                If you are a Virginia resident, you have additional rights under the Virginia Consumer Data Protection
                Act, including the right to access, correct, delete, and obtain a copy of your personal data, as well
                as the right to opt out of the processing of your personal data for targeted advertising, the sale of
                personal data, or profiling. We do not sell personal data, engage in targeted advertising, or profile
                users. To exercise your VCDPA rights, contact us at{' '}
                <a href="mailto:info@elhardtfamilywellness.com" className="text-slate-blue hover:underline">info@elhardtfamilywellness.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">8. Cookies and Tracking Technologies</h2>
              <p>
                The Service uses essential cookies that are strictly necessary for the operation of the Service,
                including session cookies for authentication and maintaining your login state. We do not use
                advertising cookies, tracking pixels, or third-party analytics cookies. We do not track your
                activity across other websites or applications.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">9. Third-Party Services</h2>
              <p className="mb-3">The Service integrates with or relies on the following third-party services:</p>
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
              <p className="mt-3">
                Each third-party service has its own privacy policy governing how it handles your data. We encourage
                you to review those policies. We are not responsible for the privacy practices of third-party services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">10. International Data Transfers</h2>
              <p>
                Your information may be stored and processed in the United States or other countries where our
                service providers maintain facilities. By using the Service, you consent to the transfer of your
                information to these locations, which may have different data protection laws than your jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">11. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of material changes by
                posting the updated Privacy Policy on the Service with an updated &ldquo;Last Updated&rdquo; date. Your
                continued use of the Service after any changes constitutes your acceptance of the revised Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">12. Contact Information</h2>
              <p>
                If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
              </p>
              <p className="mt-3">
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
