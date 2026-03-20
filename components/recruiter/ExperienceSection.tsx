import { Section, SectionHeading } from '@/components/ui/Section'
import { CVTimeline } from './CVTimeline'
import { siteConfig } from '@/data/site'

export function ExperienceSection() {
  return (
    <Section id="experience" label="Career history">
      <SectionHeading sub="Click any role to expand the full detail — what I built, what I shipped, and what I learned.">
        Experience
      </SectionHeading>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Timeline — takes up 2/3 */}
        <div className="lg:col-span-2">
          <CVTimeline />
        </div>

        {/* Sidebar stats — 1/3 */}
        <div className="space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--text-muted)]">
            By the numbers
          </p>
          {[
            { value: '2',     label: 'Production systems shipped' },
            { value: '25+',   label: 'Feature modules built' },
            { value: '30+',   label: 'REST API endpoints written' },
            { value: '1st',   label: 'Cardiff Best Project 2025' },
            { value: '2:1',   label: 'BSc Applied Software Eng.' },
            { value: '100%',  label: 'Remote capable' },
          ].map(({ value, label }) => (
            <div key={label} className="glass-card p-4 flex items-center gap-4">
              <p className="font-display font-bold text-2xl text-[var(--brand)] w-16 flex-shrink-0">{value}</p>
              <p className="text-sm text-[var(--text-secondary)]">{label}</p>
            </div>
          ))}

          {/* Download CV CTA */}
          <a
            href="/cv.pdf"
            download
            className="mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-secondary)] transition-all"
          >
            Download full CV (PDF)
          </a>
        </div>
      </div>
    </Section>
  )
}
