import { Section, SectionHeading } from '@/components/ui/Section'
import { siteConfig } from '@/data/site'
import { SkillsRadar } from './SkillsRadar'

const skillCategories = [
  { label: 'Languages',  skills: siteConfig.skills.languages,  color: 'var(--brand)' },
  { label: 'Frontend',   skills: siteConfig.skills.frontend,   color: '#8b5cf6' },
  { label: 'Backend',    skills: siteConfig.skills.backend,    color: 'var(--accent)' },
  { label: 'Databases',  skills: siteConfig.skills.databases,  color: '#f59e0b' },
  { label: 'DevOps',     skills: siteConfig.skills.devops,     color: '#ec4899' },
  { label: 'Practices',  skills: siteConfig.skills.practices,  color: '#06b6d4' },
]

export function SkillsSection() {
  return (
    <Section id="skills" label="Skills & stack">
      <SectionHeading sub="Click any skill on the radar to explore my proficiency and the technologies underneath it.">
        My toolkit
      </SectionHeading>

      <div className="mb-16">
        <SkillsRadar />
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--text-muted)] mb-6">
          Full stack breakdown
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillCategories.map(({ label, skills, color }) => (
            <div key={label} className="glass-card p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--text-muted)]">
                  {label}
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skills.map(skill => (
                  <span
                    key={skill}
                    className="text-xs px-2.5 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
