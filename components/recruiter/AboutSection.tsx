import { Section, SectionHeading } from '@/components/ui/Section'
import { siteConfig } from '@/data/site'
import { Award } from 'lucide-react'

export function AboutSection() {
  return (
    <Section id="about" label="About me">
      <SectionHeading sub="Cardiff University graduate. Award-winning engineer. Two shipped production systems.">
        Hi, I&apos;m Clevis.
      </SectionHeading>
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
          <p>
            I&apos;m a full-stack software engineer based in Cardiff, UK. I graduated with a 2:1 in Applied 
            Software Engineering from Cardiff University in 2025 and won the Cardiff Award for Best 
            Applied Software Engineering Project for building a privacy-preserving healthcare data platform.
          </p>
          <p>
            I specialise in Python and Django on the backend, Next.js and React on the frontend, and 
            I care about building things that actually work in production — with proper auth, CI/CD, 
            test coverage, and GDPR-aware design where it matters.
          </p>
          <p>
            I&apos;ve shipped two production systems for real clients and I&apos;m looking for my next 
            challenge — whether that&apos;s a full-time role or an interesting freelance project.
          </p>

          {/* Award callout */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--surface-recruiter)] border border-[var(--brand)] border-opacity-30 mt-2">
            <Award size={18} className="text-[var(--brand)] mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Cardiff Award — Best Applied Software Engineering Project</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Cardiff University · Class of 2025</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 space-y-0">
          <h3 className="font-display font-bold text-base mb-4">Quick facts</h3>
          {[
            { label: 'Location',      value: siteConfig.location },
            { label: 'Degree',        value: 'BSc Applied Software Engineering, 2:1' },
            { label: 'University',    value: 'Cardiff University, 2025' },
            { label: 'Speciality',    value: 'Python · Django · Next.js' },
            { label: 'Available',     value: siteConfig.availabilityNote },
            { label: 'Email',         value: siteConfig.email },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-start gap-4 text-sm py-3 border-b border-[var(--border)] last:border-0">
              <span className="text-[var(--text-muted)] shrink-0">{label}</span>
              <span className="text-[var(--text-primary)] text-right">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
