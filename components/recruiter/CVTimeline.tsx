'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { siteConfig } from '@/data/site'
import { cn } from '@/lib/utils'
import {
  Briefcase, GraduationCap, Award, ExternalLink,
  ChevronDown, Code2, GitBranch, Zap,
} from 'lucide-react'

type TimelineItem =
  | { kind: 'job';       data: typeof siteConfig.experience[0] }
  | { kind: 'edu';       data: typeof siteConfig.education[0]  }
  | { kind: 'award';     label: string; sub: string; year: string }

const items: TimelineItem[] = [
  { kind: 'job',   data: siteConfig.experience[0] },
  { kind: 'job',   data: siteConfig.experience[1] },
  { kind: 'award', label: 'Best Applied Software Engineering Project', sub: 'Cardiff University · Class of 2025', year: '2025' },
  { kind: 'edu',   data: siteConfig.education[0]  },
]

function TimelineNode({ active, kind }: { active: boolean; kind: string }) {
  const Icon = kind === 'job' ? Briefcase : kind === 'award' ? Award : GraduationCap
  return (
    <div className={cn(
      'relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 flex-shrink-0',
      active
        ? 'bg-[var(--brand)] border-[var(--brand)] text-white scale-110'
        : kind === 'award'
          ? 'bg-[var(--brand-light)] border-[var(--brand)] text-[var(--brand)]'
          : 'bg-[var(--bg-primary)] border-[var(--border-strong)] text-[var(--text-muted)]'
    )}>
      <Icon size={16} />
    </div>
  )
}

function JobCard({ data, active, onToggle }: {
  data: typeof siteConfig.experience[0]
  active: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'w-full text-left rounded-2xl border p-6 transition-all duration-300',
        active
          ? 'border-[var(--brand)] bg-[var(--surface-recruiter)] shadow-sm'
          : 'border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--border-strong)]'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-full">
              {data.period}
            </span>
          </div>
          <h3 className="font-display font-bold text-lg text-[var(--text-primary)] leading-tight">
            {data.role}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-sm text-[var(--text-secondary)]">{data.company}</span>
            {data.companyUrl && (
              <a
                href={data.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors"
              >
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
        <ChevronDown
          size={16}
          className={cn('text-[var(--text-muted)] transition-transform flex-shrink-0 mt-1', active && 'rotate-180')}
        />
      </div>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-4 mb-4">
              {data.description}
            </p>

            {/* Bullet points */}
            <ul className="space-y-2.5 mb-5">
              {data.bullets.map((b, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]"
                >
                  <span className="text-[var(--brand)] font-bold mt-0.5 flex-shrink-0">–</span>
                  <span>{b}</span>
                </motion.li>
              ))}
            </ul>

            {/* Stats row for KESWA */}
            {data.id === 'job-1' && (
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { icon: Code2,     value: '25+',   label: 'modules' },
                  { icon: GitBranch, value: '1',     label: 'live platform' },
                  { icon: Zap,       value: 'Jan 26', label: 'launched' },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={label} className="text-center py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)]">
                    <Icon size={14} className="mx-auto mb-1 text-[var(--brand)]" />
                    <p className="font-display font-bold text-base text-[var(--brand)]">{value}</p>
                    <p className="text-xs text-[var(--text-muted)]">{label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Stats row for Pontiro */}
            {data.id === 'job-2' && (
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { icon: Code2,     value: '30+',    label: 'API endpoints' },
                  { icon: GitBranch, value: 'CI/CD',  label: 'automated pipeline' },
                  { icon: Award,     value: '1st',    label: 'best project' },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={label} className="text-center py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)]">
                    <Icon size={14} className="mx-auto mb-1 text-[var(--brand)]" />
                    <p className="font-display font-bold text-base text-[var(--brand)]">{value}</p>
                    <p className="text-xs text-[var(--text-muted)]">{label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {data.tags.map(tag => (
                <span key={tag} className="tag-brand tag text-xs">{tag}</span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}

function AwardCard() {
  return (
    <div className="rounded-2xl border border-[var(--brand)] bg-[var(--surface-recruiter)] p-5 flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-[var(--brand)] flex items-center justify-center flex-shrink-0">
        <Award size={18} className="text-white" />
      </div>
      <div>
        <p className="text-xs text-[var(--text-muted)] mb-1">Cardiff University · 2025</p>
        <p className="font-display font-bold text-base text-[var(--text-primary)]">
          Best Applied Software Engineering Project
        </p>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Recognised for backend architecture, Agile leadership, and real-world problem solving on the Pontiro healthcare data platform.
        </p>
      </div>
    </div>
  )
}

function EduCard({ data }: { data: typeof siteConfig.education[0] }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5 flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
        <GraduationCap size={18} className="text-[var(--text-muted)]" />
      </div>
      <div>
        <p className="text-xs text-[var(--text-muted)] mb-1">{data.institution} · {data.period}</p>
        <p className="font-display font-bold text-base text-[var(--text-primary)]">{data.degree}</p>
        <p className="text-sm text-[var(--accent)] font-medium mt-1">Grade: {data.grade}</p>
      </div>
    </div>
  )
}

// Individual timeline row — animates in when scrolled into view
function TimelineRow({ item, index, activeJob, onJobToggle }: {
  item: TimelineItem
  index: number
  activeJob: string
  onJobToggle: (id: string) => void
}) {
  const ref  = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="flex gap-5"
    >
      {/* Left — node + connector */}
      <div className="flex flex-col items-center">
        <TimelineNode
          active={item.kind === 'job' && item.data.id === activeJob}
          kind={item.kind}
        />
        {index < items.length - 1 && (
          <div className="w-px flex-1 mt-2 bg-[var(--border)]" style={{ minHeight: 24 }} />
        )}
      </div>

      {/* Right — card */}
      <div className="flex-1 pb-6">
        {item.kind === 'job'   && <JobCard data={item.data} active={item.data.id === activeJob} onToggle={() => onJobToggle(item.data.id)} />}
        {item.kind === 'award' && <AwardCard />}
        {item.kind === 'edu'   && <EduCard data={item.data} />}
      </div>
    </motion.div>
  )
}

export function CVTimeline() {
  const [activeJob, setActiveJob] = useState(siteConfig.experience[0].id)

  function handleJobToggle(id: string) {
    setActiveJob(prev => prev === id ? '' : id)
  }

  return (
    <div className="max-w-2xl">
      {/* Year marker — present */}
      <div className="flex items-center gap-3 mb-6 ml-0">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
          </span>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Present</span>
        </div>
      </div>

      {items.map((item, i) => (
        <TimelineRow
          key={i}
          item={item}
          index={i}
          activeJob={activeJob}
          onJobToggle={handleJobToggle}
        />
      ))}

      {/* Year marker — start */}
      <div className="flex items-center gap-2 ml-12 mt-2 text-xs text-[var(--text-muted)]">
        <div className="w-2 h-2 rounded-full bg-[var(--border-strong)]" />
        <span>2021 — started writing real code</span>
      </div>
    </div>
  )
}
