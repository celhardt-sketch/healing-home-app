import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, Printer } from 'lucide-react'
import SafetyFooter from '../components/SafetyFooter'

interface StateHotline {
  number: string
  tel: string
  label: string
}

const STATE_HOTLINES: Record<string, StateHotline> = {
  VA: {
    number: '1-800-552-7096',
    tel: '18005527096',
    label: 'Virginia Child Abuse & Neglect Hotline — suspected abuse or neglect',
  },
}

export default function MandatedReporterGuide() {
  const [stateCode, setStateCode] = useState<string>('VA')
  const hotline = STATE_HOTLINES[stateCode]

  return (
    <div className="min-h-screen bg-[#F6F1E9] text-[#2E3A33] flex flex-col">
      {/* App nav bar (kept for in-app navigation) */}
      <div className="bg-white border-b shadow-sm print:hidden">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/dashboard" className="text-charcoal hover:text-slate-blue" aria-label="Back to dashboard">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#B23A32]" />
            Mandated Reporter Quick Guide
          </h1>
        </div>
      </div>

      <main className="flex-1 w-full max-w-[760px] mx-auto px-[18px] pb-16">
        {/* Title block */}
        <header className="pt-7 pb-4 text-center">
          <h1 className="font-heading text-[30px] leading-tight font-bold mb-1.5">
            Mandated Reporter Quick Guide
          </h1>
          <p className="text-[#55635B] text-base font-medium m-0">For Foster &amp; Kinship Caregivers</p>
        </header>

        {/* Sticky emergency band */}
        <div
          role="region"
          aria-label="Emergency contacts"
          className="sticky top-0 z-50 bg-[#FBEDEB] border border-[#F0D6D2] rounded-[14px] shadow-[0_2px_10px_rgba(46,58,51,0.06)] p-3.5 mt-1.5 mb-[22px]"
        >
          <h2 className="uppercase tracking-[0.06em] text-[12.5px] font-bold text-[#B23A32] mb-2.5">
            If the child is in immediate danger
          </h2>
          <div className="flex flex-wrap gap-2.5">
            <a
              href="tel:911"
              aria-label="Call 9 1 1 for immediate danger"
              className="flex-1 basis-[150px] flex flex-col justify-center rounded-xl px-3.5 py-3 min-h-[60px] bg-[#B23A32] text-white active:scale-[0.98] transition-transform"
            >
              <span className="text-[19px] font-bold">Call 911</span>
              <span className="text-[13px] font-medium opacity-90">Immediate danger</span>
            </a>
            <a
              href="tel:988"
              aria-label="Call or text 9 8 8 Suicide and Crisis Lifeline"
              className="flex-1 basis-[150px] flex flex-col justify-center rounded-xl px-3.5 py-3 min-h-[60px] bg-white text-[#B23A32] border-[1.5px] border-[#B23A32] active:scale-[0.98] transition-transform"
            >
              <span className="text-[19px] font-bold">Call or text 988</span>
              <span className="text-[13px] font-medium opacity-90">Self-harm / crisis · 24/7</span>
            </a>
            {hotline ? (
              <a
                href={`tel:${hotline.tel}`}
                aria-label={hotline.label}
                className="basis-full flex flex-col justify-center rounded-xl px-3.5 py-3 min-h-[60px] bg-white text-[#2E3A33] border-[1.5px] border-[#E4DCCE] active:scale-[0.98] transition-transform"
              >
                <span className="text-[19px] font-bold text-[#4E6B5B]">{hotline.number}</span>
                <span className="text-[13px] font-medium opacity-90">{hotline.label}</span>
              </a>
            ) : (
              <div className="basis-full flex flex-col justify-center rounded-xl px-3.5 py-3 min-h-[60px] bg-white text-[#2E3A33] border-[1.5px] border-[#E4DCCE]">
                <span className="text-[19px] font-bold text-[#4E6B5B]">Your state's Child Abuse Hotline / CPS</span>
                <span className="text-[13px] font-medium opacity-90">
                  Look up and call your state's hotline — know your state's law.
                </span>
              </div>
            )}
          </div>
          <p className="text-[12.5px] text-[#55635B] mt-2">
            Showing:
            <select
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value)}
              aria-label="Select your state for the correct hotline"
              className="font-sans text-[13px] px-2 py-1 rounded-lg border border-[#E4DCCE] bg-white text-[#2E3A33] ml-1"
            >
              <option value="VA">Virginia</option>
              <option value="OTHER">Other state</option>
            </select>
            &nbsp;State-specific links may be provided where available. Always confirm your own state's hotline and law.
          </p>
        </div>

        {/* Important Legal Notice */}
        <Card className="bg-[#FCFAF5] border-[#EFE7D6]">
          <CardHeading className="text-[18px]">Important Legal Notice</CardHeading>
          <p className="mb-3">
            This guide is based primarily on Virginia mandated reporting laws and general best practices. Mandated
            reporting requirements, definitions of abuse and neglect, reporting timelines, and penalties for failure to
            report vary significantly by state.
          </p>
          <p className="mb-2">
            <strong>You must:</strong>
          </p>
          <Bullets
            items={[
              'Know and follow the mandated reporting laws in your specific state.',
              'Complete any state-required mandated reporter training.',
              'Consult with your caseworker, agency, or legal counsel for state-specific guidance.',
            ]}
          />
          <p className="m-0">
            This guide does not constitute legal advice. Elhardt Family Wellness LLC is not responsible for actions taken
            based on this general guidance in jurisdictions where different laws apply.
          </p>
        </Card>

        {/* First: What This Is (And Is Not) */}
        <Card>
          <CardHeading>First: What This Is (And Is Not)</CardHeading>
          <p className="mb-3 text-[#55635B]">
            This guide is psychoeducational. It is designed to help caregivers respond appropriately and legally when a
            child shares information that must be reported.
          </p>
          <p className="mb-2">
            <strong>This guide does NOT:</strong>
          </p>
          <Bullets
            items={[
              'Help you determine whether abuse "really happened."',
              'Teach you how to investigate or question a child.',
              'Replace professional or legal guidance.',
            ]}
          />
          <Callout>Your role is not to decide. Your role is to report and protect.</Callout>
        </Card>

        {/* What Counts as a Reportable Disclosure */}
        <Card>
          <CardHeading>What Counts as a Reportable Disclosure</CardHeading>
          <p className="mb-3">You must report when a child discloses, or you reasonably suspect:</p>
          <Bullets
            items={[
              'Physical abuse',
              'Sexual abuse or exploitation',
              'Neglect',
              'Unsafe supervision',
              'Exposure to sexual activity',
              'Coercive or harmful sexual behavior',
              'Ongoing or imminent risk of harm',
            ]}
          />
          <Callout>You do NOT need proof, certainty, or multiple disclosures. Reasonable suspicion is enough.</Callout>
          <p className="mb-3">
            <strong>It doesn't matter who the concern is about.</strong> The duty to report is the same whether the
            person is a birth parent (including during visitation), another child in the home, someone outside the
            family, or someone in your own household. If you reasonably suspect harm, you report — full stop.
          </p>
          <p className="m-0">
            <strong>You are protected for reporting in good faith.</strong> In Virginia and most states, a mandated
            reporter who makes a report in good faith is granted legal immunity, even if the concern turns out to be
            unfounded. You do not have to be certain, and you do not have to be right. You have to report.
          </p>
        </Card>

        {/* Your Role in the Moment */}
        <Card>
          <CardHeading>Your Role in the Moment</CardHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="border border-[#E4DCCE] rounded-xl p-3.5">
              <h4 className="m-0 mb-2 text-[14px] uppercase tracking-[0.04em] text-[#4E6B5B] font-bold">
                Your job IS to
              </h4>
              <Bullets
                className="mb-0"
                items={['Stay calm', 'Listen without reacting', 'Protect the child', 'Follow reporting obligations']}
              />
            </div>
            <div className="border border-[#E4DCCE] rounded-xl p-3.5">
              <h4 className="m-0 mb-2 text-[14px] uppercase tracking-[0.04em] text-[#B23A32] font-bold">
                Your job is NOT to
              </h4>
              <Bullets
                className="mb-0"
                items={[
                  'Investigate',
                  'Interview',
                  'Verify details',
                  'Decide credibility',
                  'Promise secrecy',
                  'Confront anyone involved',
                ]}
              />
            </div>
          </div>
        </Card>

        {/* What to Say / What NOT to Say */}
        <Card>
          <CardHeading>What to Say to the Child (Simple &amp; Safe)</CardHeading>
          <ul className="list-none p-0 m-0 mb-2.5">
            {[
              '"Thank you for telling me."',
              '"You didn\'t do anything wrong."',
              '"My job is to help keep kids safe."',
              '"I can\'t keep this a secret, but I will stay with you."',
            ].map((t) => (
              <li key={t} className="bg-[#EAF0EB] rounded-[10px] px-3 py-2.5 my-1.5 italic">
                {t}
              </li>
            ))}
          </ul>
          <p className="text-[#55635B] mb-0">Say only what is needed to maintain safety and trust.</p>

          <h3 className="font-heading text-[21px] font-bold leading-[1.25] mt-[18px] mb-2.5">What NOT to Say</h3>
          <ul className="list-none p-0 m-0">
            {[
              'Ask "why"',
              'Ask leading questions',
              'Ask for timelines or details',
              'Express shock, anger, or disbelief',
              'Make promises about outcomes',
              'Say you will "handle it yourself"',
            ].map((t) => (
              <li key={t} className="relative pl-[26px] my-[7px]">
                <span className="absolute left-0 top-0 text-[#B23A32] font-bold" aria-hidden="true">
                  ✗
                </span>
                {t}
              </li>
            ))}
          </ul>
        </Card>

        {/* Step-by-Step */}
        <Card>
          <CardHeading>Step-by-Step: What to Do Next</CardHeading>
          <ol className="list-none p-0 m-0 mt-1.5">
            <Step num={1}>
              <span className="font-semibold">Pause the conversation</span> once the concern is clear.
            </Step>
            <Step num={2}>
              <span className="font-semibold">Document only the child's exact words</span> (no interpretations).
            </Step>
            <Step num={3}>
              <span className="font-semibold">Make the mandated report immediately</span> — to Child Protective
              Services (CPS) or your state hotline.
              <ul className="list-disc pl-[22px] mt-1.5 space-y-1.5">
                <li>
                  <strong>Your duty to report is personal.</strong> Telling your supervisor, caseworker, or agency does{' '}
                  <strong>not</strong> satisfy your legal obligation. In most states, you — the person who received the
                  disclosure or formed the suspicion — must make the report yourself.
                </li>
                <li>
                  Some states also require a <strong>follow-up written report</strong> within a set timeframe after the
                  initial call. Check your state's rule.
                </li>
              </ul>
            </Step>
            <Step num={4}>
              <span className="font-semibold">Notify required parties</span> (after the report is made):
              <ul className="list-disc pl-[22px] mt-1.5 space-y-1">
                <li>Caseworker</li>
                <li>Supervisor (if applicable)</li>
                <li>Child's therapist (per protocol)</li>
              </ul>
            </Step>
            <Step num={5}>
              <span className="font-semibold">Return to regulation and routine.</span> Let professionals handle next
              steps.
            </Step>
          </ol>
        </Card>

        {/* Documentation Rules */}
        <Card>
          <CardHeading>Documentation Rules (VERY IMPORTANT)</CardHeading>
          <ul className="list-disc pl-[22px] m-0 space-y-1.5">
            <li>
              <strong>Do document</strong> — write down what was said, using quotation marks for the child's exact
              words.
            </li>
            <li>Stick to facts and exact words only. Do not include opinions, theories, or conclusions.</li>
            <li>Do not share your notes beyond required reporting channels.</li>
            <li>
              Keep records factual because they may be requested by courts or DSS. The goal is not to avoid writing
              things down — it's to make sure what you write is accurate, quoted, and free of interpretation.
            </li>
          </ul>
        </Card>

        {/* After the Report */}
        <Card>
          <CardHeading>After the Report</CardHeading>
          <p className="mb-3">You may notice:</p>
          <Bullets items={['Increased anxiety', 'Anger toward you', 'Withdrawal or clinginess', 'Fear of consequences']} />
          <p className="mb-3">These are normal trauma responses, not signs you did the wrong thing.</p>
          <p className="mb-2">
            <strong>Your role after reporting is to:</strong>
          </p>
          <Bullets
            className="mb-0"
            items={['Maintain safety', 'Keep routines predictable', 'Stay emotionally available', 'Avoid discussing details']}
          />
        </Card>

        {/* When to Seek Immediate Support */}
        <Card className="bg-[#FBF2E2] border-[#EFD9AE]">
          <h3 className="font-heading text-[21px] font-bold leading-[1.25] mb-2.5 text-[#B9791F]">
            When to Seek Immediate Support
          </h3>
          <p className="mb-2">Stop relying on this guide and seek professional or emergency support if:</p>
          <ul className="list-none p-0 m-0 mb-3">
            {[
              'The child expresses fear of going home now',
              'The child reports ongoing access to the alleged person',
              'The child shows signs of acute distress or self-harm',
              'You feel unsure how to maintain safety',
            ].map((t) => (
              <li key={t} className="relative pl-7 my-2 font-medium">
                <span
                  className="absolute left-0 top-px w-5 h-5 rounded-full bg-[#B9791F] text-white font-extrabold text-[13px] flex items-center justify-center"
                  aria-hidden="true"
                >
                  !
                </span>
                {t}
              </li>
            ))}
          </ul>
          <p className="m-0">
            For immediate danger, call <strong>911</strong>. For a mental-health crisis or self-harm, call or text{' '}
            <strong>988</strong>.
          </p>
        </Card>

        {/* One Core Principle */}
        <div className="bg-[#4E6B5B] text-white text-center rounded-[14px] shadow-[0_2px_10px_rgba(46,58,51,0.06)] p-5 mb-4">
          <p className="font-heading text-[20px] leading-[1.4] font-semibold m-0">
            Protecting a child is never betrayal. Reporting is an act of care, not punishment. You do not have to carry
            this alone.
          </p>
        </div>

        {/* Print / Save */}
        <div className="flex justify-center my-2 mb-[22px] print:hidden">
          <button
            onClick={() => window.print()}
            aria-label="Print or save this guide"
            className="flex items-center gap-2 font-sans text-[15px] font-semibold text-[#4E6B5B] bg-white border-[1.5px] border-[#4E6B5B] rounded-xl px-[22px] py-[11px] active:scale-[0.98] transition-transform"
          >
            <Printer className="w-4 h-4" /> Print / Save this guide
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-[22px] text-center text-[#55635B] text-[13px] leading-[1.55]">
          <p className="mb-2.5">
            This guide provides general psychoeducational information based on Virginia law and is not legal advice.
            Always consult with your caseworker, agency, or attorney for guidance specific to your state and situation.
          </p>
          <p className="mb-2.5">
            © 2026 Elhardt Family Wellness LLC. All rights reserved. The Healing Home Approach™ is a trademark of Elhardt
            Family Wellness LLC.
          </p>
          <Link
            to="/dashboard"
            className="inline-block mt-1.5 font-semibold text-[15px] text-white bg-[#2E3A33] rounded-xl px-[22px] py-[11px] print:hidden"
          >
            Return to Dashboard
          </Link>
        </footer>
      </main>

      <SafetyFooter />
    </div>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`bg-white border border-[#E4DCCE] rounded-[14px] shadow-[0_2px_10px_rgba(46,58,51,0.06)] px-5 pt-5 pb-4 mb-4 break-inside-avoid ${className}`}
    >
      {children}
    </section>
  )
}

function CardHeading({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`font-heading text-[21px] font-bold leading-[1.25] mb-2.5 ${className}`}>{children}</h3>
}

function Bullets({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <ul className={`list-disc pl-[22px] my-2 mb-3 space-y-1.5 ${className}`}>
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  )
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-semibold bg-[#EAF0EB] border-l-4 border-[#4E6B5B] px-3.5 py-3 rounded-lg my-3">{children}</div>
  )
}

function Step({ num, children }: { num: number; children: React.ReactNode }) {
  return (
    <li className="relative pl-11 mb-4">
      <span className="absolute left-0 top-0 w-[30px] h-[30px] rounded-full bg-[#4E6B5B] text-white font-bold flex items-center justify-center text-[15px]">
        {num}
      </span>
      {children}
    </li>
  )
}
