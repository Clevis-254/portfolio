'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Section, SectionHeading } from '@/components/ui/Section'
import { siteConfig } from '@/data/site'
import { cn } from '@/lib/utils'
import { ArrowRight, ArrowLeft } from 'lucide-react'

const STEPS = ['Problem', 'Solution', 'Results', 'Tech decisions'] as const

export function CaseStudiesSection() {
  const [activeProject, setActiveProject] = useState(0)
  const [activeStep, setActiveStep] = useState(0)

  const project = siteConfig.projects[activeProject]
  const cs = project.caseStudy

  const stepContent = [
    cs.problem,
    cs.solution,
    cs.results,
    cs.techDecisions.map(d => `${d.decision}: ${d.reason}`).join('\n\n'),
  ]

  return (
    <Section id="case-studies" label="How I work">
      <SectionHeading sub="Click through the story behind each project — the problem, the decisions, and the outcomes.">
        Case studies
      </SectionHeading>

      {/* Project picker */}
      <div className="flex flex-wrap gap-3 mb-10">
        {siteConfig.projects.map((p, i) => (
          <button
            key={p.id}
            onClick={() => { setActiveProject(i); setActiveStep(0) }}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              activeProject === i
                ? 'bg-[var(--accent)] text-white'
                : 'border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
            )}
          >
            {p.title}
          </button>
        ))}
      </div>

      <div className="glass-card p-8">
        {/* Step progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <button
              key={s}
              onClick={() => setActiveStep(i)}
              className="flex items-center gap-2 group"
            >
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all',
                i === activeStep
                  ? 'bg-[var(--accent)] text-white'
                  : i < activeStep
                    ? 'bg-[var(--accent-light)] text-[var(--accent)]'
                    : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'
              )}>
                {i + 1}
              </div>
              <span className={cn(
                'text-sm hidden sm:block transition-colors',
                i === activeStep ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-muted)]'
              )}>
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div className={cn('w-8 h-px mx-1', i < activeStep ? 'bg-[var(--accent)]' : 'bg-[var(--border)]')} />
              )}
            </button>
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeProject}-${activeStep}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="min-h-[120px]"
          >
            <h3 className="font-display font-bold text-xl text-[var(--text-primary)] mb-3">
              {STEPS[activeStep]}
            </h3>
            <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
              {stepContent[activeStep]}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Nav */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--border)]">
          <button
            onClick={() => setActiveStep(s => Math.max(0, s - 1))}
            disabled={activeStep === 0}
            className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ArrowLeft size={14} /> Previous
          </button>
          <span className="text-xs text-[var(--text-muted)]">{activeStep + 1} / {STEPS.length}</span>
          <button
            onClick={() => setActiveStep(s => Math.min(STEPS.length - 1, s + 1))}
            disabled={activeStep === STEPS.length - 1}
            className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Next <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </Section>
  )
}
