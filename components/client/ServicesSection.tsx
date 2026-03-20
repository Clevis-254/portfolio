import { Check, ArrowRight } from 'lucide-react'
import { Section, SectionHeading } from '@/components/ui/Section'
import { siteConfig } from '@/data/site'
import { formatCurrencyRange } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function ServicesSection() {
  return (
    <Section id="services" label="What I offer">
      <SectionHeading sub="Whether you need a quick landing page or a full product build, I can help.">
        Services
      </SectionHeading>

      <div className="grid sm:grid-cols-2 gap-6">
        {siteConfig.services.map((service, i) => {
          const isFeatured = service.id === 'webapp'
          return (
            <div
              key={service.id}
              className={cn(
                'rounded-2xl p-7 flex flex-col gap-5 transition-all',
                isFeatured
                  ? 'border-2 border-[var(--accent)] bg-[var(--surface-client)]'
                  : 'glass-card hover:border-[var(--border-strong)]'
              )}
            >
              {isFeatured && (
                <span className="self-start tag-accent tag text-xs">Most popular</span>
              )}

              <div>
                <h3 className="font-display font-bold text-xl text-[var(--text-primary)] capitalize mb-1">
                  {service.name}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">{service.description}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-2xl text-[var(--text-primary)]">
                  {formatCurrencyRange(service.priceFrom, service.priceTo)}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] -mt-3">
                Typical timeline: {service.timelineWeeks} week{service.timelineWeeks !== 1 ? 's' : ''}
              </p>

              <ul className="space-y-2 flex-1">
                {service.includes.map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                    <Check size={14} className="text-[var(--accent)] mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="#estimator"
                className={cn(
                  'mt-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all',
                  isFeatured
                    ? 'bg-[var(--accent)] text-white hover:opacity-90'
                    : 'border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                )}
              >
                Get a quote <ArrowRight size={14} />
              </a>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
