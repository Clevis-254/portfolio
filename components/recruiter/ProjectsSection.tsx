'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, ArrowRight } from 'lucide-react'
import { Section, SectionHeading } from '@/components/ui/Section'
import { siteConfig } from '@/data/site'
import { LiveCodeDemo } from './LiveCodeDemo'
import { cn } from '@/lib/utils'

const FILTERS = ['all', 'fullstack', 'backend', 'frontend'] as const
type Filter = typeof FILTERS[number]

export function ProjectsSection() {
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = siteConfig.projects.filter(
    p => filter === 'all' || p.category === filter
  )

  return (
    <Section id="projects" label="Selected work">
      <SectionHeading sub="Two shipped production systems. Real clients, real users, real code.">
        Projects
      </SectionHeading>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all',
              filter === f
                ? 'bg-[var(--brand)] text-white'
                : 'border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Project cards */}
      <div className="grid sm:grid-cols-2 gap-6 mb-16">
        <AnimatePresence mode="popLayout">
          {filtered.map(project => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="glass-card p-6 flex flex-col gap-4 hover:border-[var(--brand)] transition-colors"
            >
              {/* Image placeholder */}
              <div className="w-full h-36 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-muted)] text-sm border border-[var(--border)]">
                {project.image
                  ? <img src={project.image} alt={project.title} className="w-full h-full object-cover rounded-lg" />
                  : <span className="text-xs">{project.title} — add screenshot to /public/projects/</span>
                }
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">{project.title}</h3>
                  {project.featured && <span className="tag-brand tag text-xs shrink-0">Featured</span>}
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{project.description}</p>
              </div>

              {/* Stats */}
              <div className="flex gap-4 py-3 border-y border-[var(--border)]">
                {Object.entries(project.stats).slice(0, 3).map(([k, v]) => (
                  <div key={k} className="text-center">
                    <p className="font-display font-bold text-sm text-[var(--brand)]">{v}</p>
                    <p className="text-xs text-[var(--text-muted)] capitalize">{k}</p>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map(tag => (
                  <span key={tag} className="tag text-xs">{tag}</span>
                ))}
              </div>

              {/* Links */}
              <div className="flex items-center gap-3 pt-1">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors">
                    <ExternalLink size={12} /> Live site
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors">
                    <Github size={12} /> Code
                  </a>
                )}
                <a href="#case-studies"
                  className="ml-auto flex items-center gap-1 text-xs text-[var(--brand)] font-medium hover:gap-2 transition-all">
                  Case study <ArrowRight size={11} />
                </a>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Live code demo */}
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--text-muted)] mb-5">
          Real code from these projects
        </p>
        <LiveCodeDemo />
      </div>

      {/* GitHub CTA */}
      <div className="mt-8 text-center">
        <a
          href={siteConfig.social.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <Github size={16} />
          See all projects on GitHub
          <ArrowRight size={14} />
        </a>
      </div>
    </Section>
  )
}
