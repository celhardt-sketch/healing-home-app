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
          <p className="text-sm text-charcoal-70 mb-2">Last Updated: February 9, 2026</p>
          <p className="text-sm text-charcoal-70 mb-8">
            <strong>App:</strong> The Healing Home Approach&#8482;<br />
            <strong>Company:</strong> Elhardt Family Wellness LLC
          </p>

          <p className="text-sm text-charcoal-80 leading-relaxed mb-6">
            Welcome to The Healing Home Approach&#8482;, a web application operated by Elhardt Family Wellness LLC
            (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), a Virginia limited liability company.
            These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of The Healing Home Approach&#8482;
            application, including all content, features, and services available through the application
            (collectively, the &ldquo;Service&rdquo;). By accessing or using the Service, you agree to be bound by these
            Terms. If you do not agree to these Terms, you must not access or use the Service.
          </p>

          <div className="space-y-6 text-sm text-charcoal-80 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">1. Eligibility and Account Requirements</h2>
              <p>
                The Service is intended exclusively for adults who are eighteen (18) years of age or older.
                By using the Service, you represent and warrant that you are at least eighteen years old and
                that you are a caregiver, foster parent, adoptive parent, kinship caregiver, or professional
                working with children. The Service is not designed for, marketed to, or intended for use by minors.
              </p>
              <p className="mt-3">
                You are responsible for maintaining the confidentiality of your account credentials and for all
                activities that occur under your account. You agree to notify us immediately of any unauthorized
                use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">2. Nature of the Service: Psychoeducational Content Only</h2>
              <p>
                The Service provides general psychoeducational content designed to inform, support, and empower
                caregivers by offering evidence-based education on trauma, attachment, parenting strategies,
                emotional regulation techniques, and related topics. All content is educational in nature and is
                intended to complement, never replace, professional services.
              </p>
              <p className="mt-3">The Service does not provide and shall not be construed as providing:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Professional mental health treatment, therapy, or counseling</li>
                <li>Medical advice, diagnosis, or treatment of any kind</li>
                <li>Clinical assessment, psychological evaluation, or diagnostic services</li>
                <li>Crisis intervention or emergency mental health services</li>
                <li>Legal advice or legal representation</li>
                <li>Treatment plans or individualized clinical recommendations</li>
              </ul>
              <p className="mt-3">
                You acknowledge and agree that all content provided through the Service reflects general
                psychoeducational principles and may not be appropriate for every child, family, or situation.
                The use of language such as &ldquo;may,&rdquo; &ldquo;could,&rdquo; or &ldquo;might&rdquo; throughout the Service reflects
                the inherently variable nature of child behavior and development. No content within the Service
                should be interpreted as a definitive clinical statement about any individual child.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">3. Professional Approval Requirement</h2>
              <p>
                By using the Service, you represent that you have obtained approval from your child&rsquo;s treating
                mental health professional to use psychoeducational regulation and connection tools at home, or
                that you are using the Service for your own professional development. You agree to follow the
                hierarchy of authority established within the Service, which places the guidance of your child&rsquo;s
                treating mental health professional, court or Department of Social Services directives, and your
                own caregiver judgment above the general guidance provided by this application.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">4. Subscription, Payment, and Cancellation</h2>
              <p>
                Access to the Service requires a paid subscription at a rate of $9.99 per month, billed on a
                recurring monthly basis through Stripe, our third-party payment processor. By subscribing, you
                authorize recurring monthly charges to your selected payment method until you cancel your subscription.
              </p>
              <p className="mt-3">
                <strong>No Refunds.</strong> All subscription payments are final and non-refundable. You may cancel
                your subscription at any time, and cancellation will take effect at the end of your current billing
                period. You will retain access to the Service until the end of the period for which you have already
                paid. You may also cancel your access directly through the application&rsquo;s Account Settings via the
                Manage Billing portal.
              </p>
              <p className="mt-3">
                We reserve the right to change subscription pricing at any time. Any price changes will be
                communicated to you in advance and will apply to the next billing cycle following the notice period.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">5. Intellectual Property</h2>
              <p>
                All content available through the Service, including but not limited to first aid cards, scripts,
                learning library articles, guides, text, graphics, logos, images, and software, is the original
                work of Elhardt Family Wellness LLC and is protected by United States copyright law, trademark law,
                and other intellectual property laws. &ldquo;The Healing Home Approach&rdquo; is a trademark of Elhardt Family Wellness LLC.
              </p>
              <p className="mt-3">
                Your subscription grants you a limited, non-exclusive, non-transferable, revocable license to
                access and use the Service for your personal, non-commercial caregiving or professional development
                purposes only. You may verbally share concepts and strategies learned through the Service with other
                caregivers, professionals, and support networks. Designated printable resources available in the
                Printables Vault are provided specifically for personal, non-commercial home use and may be printed
                for use within your own household only.
              </p>
              <p className="mt-3">
                Aside from these designated printable resources, you may not reproduce, distribute, print,
                screenshot, copy, modify, publicly display, create derivative works from, or commercially exploit
                any content from the Service without prior written consent from Elhardt Family Wellness LLC.
                Printable resources may not be redistributed, shared digitally, uploaded to other platforms, or
                used in any commercial, training, or institutional setting without written permission.
              </p>
              <p className="mt-3">
                Unauthorized reproduction or distribution of Service content may result in immediate termination
                of your access and may subject you to civil and criminal penalties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">6. User Conduct</h2>
              <p>
                You agree to use the Service only for its intended purpose and in compliance with all applicable
                laws. You shall not: (a) use the Service for any unlawful purpose; (b) attempt to gain unauthorized
                access to any portion of the Service or its related systems; (c) share your account credentials
                with others or allow others to access the Service through your account; (d) use the Service to
                harm, exploit, or endanger any child; (e) misrepresent the content of this Service as professional
                clinical advice, therapy, or treatment; or (f) use automated systems, bots, or scripts to access
                or interact with the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">7. Emergency Situations and Crisis Services</h2>
              <p>
                The Service is not an emergency service and is not equipped to handle crisis situations. If you or
                anyone in your care is in immediate danger, you must call 911. For mental health crisis support:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Suicide &amp; Crisis Lifeline at <a href="tel:988" className="text-slate-blue hover:underline font-semibold">988</a> (call or text)</li>
                <li>Crisis Text Line: Text HOME to <span className="font-semibold">741741</span></li>
              </ul>
              <p className="mt-3">
                You acknowledge that the Company is not responsible for any harm that results from reliance on the
                Service during an emergency in lieu of contacting appropriate emergency services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">8. Mandated Reporter Guide Disclaimer</h2>
              <p>
                The Mandated Reporter Guide within the Service is based primarily on Virginia mandated reporting
                laws and general best practices. Mandated reporting requirements, definitions of abuse and neglect,
                reporting timelines, and penalties for failure to report vary significantly by state and jurisdiction.
                The Mandated Reporter Guide does not constitute legal advice. You are solely responsible for knowing
                and complying with the mandated reporting laws in your specific state or jurisdiction. Elhardt Family
                Wellness LLC is not responsible for any actions taken or not taken based on the general guidance
                provided in the Mandated Reporter Guide.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">9. Family Plan and User Data</h2>
              <p>
                The Family Plan feature allows you to create profiles for children in your care. These profiles
                are organizational tools designed to reduce cognitive load and are not clinical assessments,
                diagnostic tools, or treatment records. You are solely responsible for the information you enter
                into child profiles and caregiver notes.
              </p>
              <p className="mt-3 font-semibold text-charcoal">
                Important: Information stored in the Service, including child profiles, caregiver notes, and usage
                data, could potentially be subject to legal discovery, subpoena, or court order in custody,
                dependency, or other legal proceedings. You are advised to avoid recording diagnostic language,
                investigative observations, or information that could be misinterpreted outside of its caregiving context.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">10. Disclaimer of Warranties</h2>
              <p className="uppercase font-semibold text-charcoal">
                THE SERVICE IS PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT WARRANTIES OF ANY KIND,
                EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. THE COMPANY DOES NOT WARRANT THAT THE
                SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
              </p>
              <p className="mt-3 uppercase font-semibold text-charcoal">
                THE COMPANY MAKES NO REPRESENTATIONS OR WARRANTIES REGARDING THE ACCURACY, COMPLETENESS, OR
                APPLICABILITY OF ANY CONTENT PROVIDED THROUGH THE SERVICE TO YOUR SPECIFIC SITUATION. YOU
                ACKNOWLEDGE THAT EVERY CHILD AND FAMILY SITUATION IS UNIQUE AND THAT GENERAL PSYCHOEDUCATIONAL
                CONTENT MAY NOT ADDRESS THE SPECIFIC NEEDS OF YOUR FAMILY.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">11. Limitation of Liability</h2>
              <p className="uppercase font-semibold text-charcoal">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, ELHARDT FAMILY WELLNESS LLC, ITS OWNERS,
                OFFICERS, EMPLOYEES, AGENTS, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF
                PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATED TO YOUR USE
                OF OR INABILITY TO USE THE SERVICE.
              </p>
              <p className="mt-3 uppercase font-semibold text-charcoal">
                WITHOUT LIMITING THE FOREGOING, THE COMPANY SHALL NOT BE LIABLE FOR ANY DAMAGES ARISING FROM:
                (A) YOUR RELIANCE ON ANY CONTENT PROVIDED THROUGH THE SERVICE; (B) ANY DECISIONS YOU MAKE REGARDING
                THE CARE OF CHILDREN BASED ON SERVICE CONTENT; (C) YOUR FAILURE TO SEEK APPROPRIATE PROFESSIONAL
                HELP; (D) ANY UNAUTHORIZED ACCESS TO OR USE OF YOUR ACCOUNT; OR (E) ANY INTERRUPTION OR CESSATION
                OF THE SERVICE.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">12. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Elhardt Family Wellness LLC, its owners, officers,
                employees, agents, and affiliates from and against any and all claims, damages, obligations, losses,
                liabilities, costs, and expenses arising from: (a) your use of or inability to use the Service;
                (b) your violation of these Terms; (c) your violation of any rights of a third party; or (d) any
                content you provide through the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">13. Mandatory Binding Arbitration and Class Action Waiver</h2>
              <p className="font-semibold text-charcoal">
                PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS, INCLUDING YOUR RIGHT TO FILE
                A LAWSUIT IN COURT.
              </p>
              <p className="mt-3">
                Any dispute arising out of or relating to these Terms or the Service shall be resolved by binding
                arbitration administered by the American Arbitration Association in accordance with its Consumer
                Arbitration Rules. The arbitration shall be conducted in the Commonwealth of Virginia.
              </p>
              <p className="mt-3">
                You agree to waive any right to a jury trial or to participate in a class action lawsuit or
                class-wide arbitration. You may only bring claims in your individual capacity and not as a
                plaintiff or class member in any purported class or representative proceeding.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">14. Governing Law and Jurisdiction</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the Commonwealth of
                Virginia, without regard to conflict of law principles. Any legal proceedings not subject to
                arbitration shall be brought exclusively in the state or federal courts located in Virginia.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">15. Modifications to the Service and Terms</h2>
              <p>
                We reserve the right to modify, suspend, or discontinue the Service at any time without notice.
                We may revise these Terms at any time by posting updated Terms on the Service. Your continued use
                of the Service after any changes constitutes your acceptance of the revised Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">16. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your access to the Service at any time, with or
                without cause, and with or without notice. Upon termination, your right to use the Service will
                immediately cease. All provisions of these Terms that by their nature should survive termination
                shall survive, including but not limited to intellectual property provisions, warranty disclaimers,
                indemnification, and limitations of liability.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">17. Severability</h2>
              <p>
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be
                limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain
                in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">18. Force Majeure</h2>
              <p>
                Neither party shall be liable for any failure or delay in performing obligations where such failure
                or delay results from circumstances beyond the reasonable control of that party, including but not
                limited to natural disasters, acts of government, internet service disruptions, or other events
                beyond reasonable control.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-3">19. Entire Agreement</h2>
              <p>
                These Terms, together with the Privacy Policy, constitute the entire agreement between you and
                Elhardt Family Wellness LLC regarding the Service and supersede all prior agreements, understandings,
                and communications, whether written or oral.
              </p>
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
