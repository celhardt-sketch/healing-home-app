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
          <p className="text-sm text-charcoal-70 mb-2">Last Updated: June 22, 2026</p>
          <p className="text-sm text-charcoal-70 mb-8">
            <strong>App:</strong> The Healing Home Approach&#8482;<br />
            <strong>Company:</strong> Elhardt Family Wellness LLC
          </p>

          <p className="text-sm text-charcoal-80 leading-relaxed mb-6">
            By accessing or using the Service, you agree to be bound by these Terms.
          </p>

          <div className="space-y-6 text-sm text-charcoal-80 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">1. Eligibility and Account Requirements</h2>
              <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">2. Nature of the Service: Psychoeducational Content Only</h2>
              <p>The Service does not provide and shall not be construed as providing:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Professional mental health treatment, therapy, or counseling</li>
                <li>Medical advice, diagnosis, or treatment of any kind</li>
                <li>Clinical assessment, psychological evaluation, or diagnostic services</li>
                <li>Crisis intervention or emergency mental health services</li>
                <li>Legal advice or legal representation</li>
                <li>Treatment plans or individualized clinical recommendations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">3. Professional Approval Requirement</h2>
              <p>By using the Service, you represent that, where a child in your care is currently in treatment, you have obtained approval from their treatment team to use psychoeducational regulation tools, or that you are a professional using these tools within your role.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">4. Subscription, Payment, and Cancellation</h2>
              <p>Access to the Service requires a paid subscription at a rate of $9.99 per month, billed through Stripe. You can update your payment method or cancel at any time through the Stripe billing portal (Manage Billing). Cancelling stops future charges and ends access at the close of your current billing period. No Refunds. We reserve the right to change subscription pricing at any time.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">5. Intellectual Property</h2>
              <p>Unauthorized reproduction or distribution of Service content may result in immediate termination of your access and may subject you to civil and criminal penalties.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">7. Emergency Situations and Crisis Services</h2>
              <p>The Service is not an emergency service and is not equipped to handle crisis situations.</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Suicide &amp; Crisis Lifeline at <a href="tel:988" className="text-slate-blue hover:underline">988</a></li>
                <li>Crisis Text Line: Text HOME to 741741</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">9. Family Plan and User Data</h2>
              <p className="font-semibold text-charcoal">Important: Profile data is organizational only and is never used for clinical assessment or shared externally.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">13. Mandatory Binding Arbitration and Class Action Waiver</h2>
              <p className="font-semibold text-charcoal">PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS, INCLUDING YOUR RIGHT TO FILE A LAWSUIT IN COURT.</p>
              <p className="mt-2">Any dispute arising out of or relating to these Terms or the Service shall be resolved by binding arbitration administered by the American Arbitration Association in accordance with its Consumer Arbitration Rules. You agree to waive any right to a jury trial or to participate in a class action lawsuit or class-wide arbitration.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">14. Governing Law and Jurisdiction</h2>
              <p>These Terms shall be governed by and construed in accordance with the laws of the Commonwealth of Virginia, without regard to conflict of law principles.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">17. Severability</h2>
              <p>If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">18. Force Majeure</h2>
              <p>Neither party shall be liable for any failure or delay in performing obligations where such failure or delay results from circumstances beyond the reasonable control of that party.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">19. Entire Agreement</h2>
              <p>These Terms, together with the Privacy Policy, constitute the entire agreement between you and Elhardt Family Wellness LLC regarding the Service.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">20. Contact Information</h2>
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
