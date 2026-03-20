import { Section, SectionHeading } from '@/components/ui/Section'
import { siteConfig } from '@/data/site'

export function TestimonialsSection() {
  return (
    <Section id="testimonials" label="Kind words">
      <SectionHeading>What people say</SectionHeading>
      <div className="grid sm:grid-cols-3 gap-6">
        {siteConfig.testimonials.map(t => (
          <div key={t.id} className="glass-card p-6 flex flex-col gap-4">
            <p className="text-[var(--text-secondary)] leading-relaxed text-sm flex-1">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-[var(--border)]">
              <div className="w-9 h-9 rounded-full bg-[var(--brand-light)] flex items-center justify-center text-xs font-bold text-[var(--brand)]">
                {t.avatar}
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">{t.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
