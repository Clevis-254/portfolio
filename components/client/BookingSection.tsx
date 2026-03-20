'use client'

import { Calendar, Clock, Video } from 'lucide-react'
import { Section, SectionHeading } from '@/components/ui/Section'

// ✅ Your Calendly URL — already configured
const CALENDLY_URL = 'https://calendly.com/clevisgikenyi/30min'

export function BookingSection() {
  return (
    <Section id="book" label="Book a call">
      <SectionHeading sub="Free 30-minute discovery call — no commitment, no sales pitch. Just a conversation about your project.">
        Let&apos;s talk
      </SectionHeading>

      <div className="grid lg:grid-cols-2 gap-12 items-start">

        {/* Left — what to expect */}
        <div className="space-y-6">
          <div className="space-y-4">
            {[
              {
                icon: Clock,
                title: '30 minutes',
                desc: "We'll cover your project idea, timeline, budget, and whether we're a good fit.",
              },
              {
                icon: Video,
                title: 'Google Meet or Zoom',
                desc: 'Your choice. Link sent automatically on booking confirmation.',
              },
              {
                icon: Calendar,
                title: 'You pick the time',
                desc: 'Available weekdays 10am–5pm GMT. Usually available within 2–3 days.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--surface-client)] border border-[var(--accent)] border-opacity-30 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-[var(--accent)]" />
                </div>
                <div>
                  <p className="font-medium text-sm text-[var(--text-primary)]">{title}</p>
                  <p className="text-sm text-[var(--text-secondary)] mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card p-5">
            <p className="text-sm font-medium text-[var(--text-primary)] mb-2">What happens after the call?</p>
            <ol className="space-y-2">
              {[
                "I'll send a detailed written proposal within 48 hours",
                "You review scope, timeline, and pricing — ask anything",
                "If we're aligned, I'll send a simple contract and we start",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                  <span className="w-5 h-5 rounded-full bg-[var(--accent)] text-white text-xs flex items-center justify-center flex-shrink-0 font-medium mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Right — Calendly iframe embed (most reliable in Next.js) */}
        <div className="rounded-2xl overflow-hidden border border-[var(--border)]">
          <iframe
            src={`${CALENDLY_URL}?hide_landing_page_details=1&hide_gdpr_banner=1&background_color=ffffff&text_color=0f0f0f&primary_color=4f46e5`}
            width="100%"
            height="660"
            frameBorder="0"
            title="Book a discovery call with Clevis"
            loading="lazy"
          />
        </div>
      </div>
    </Section>
  )
}
