'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TimelineProps {
  projectType: string | null
  features: string[]
  timeline: string
  totalWeeks: number
}

interface Phase {
  label: string
  description: string
  startWeek: number
  durationWeeks: number
  color: string
}

function buildPhases(projectType: string, features: string[], totalWeeks: number): Phase[] {
  const hasAuth     = features.includes('auth')
  const hasPayments = features.includes('payments')
  const hasCMS      = features.includes('cms')
  const hasRealtime = features.includes('realtime')

  if (projectType === 'landing') {
    return [
      { label: 'Design & planning', description: 'Wireframes, content structure, design system', startWeek: 1, durationWeeks: Math.ceil(totalWeeks * 0.3), color: '#4f46e5' },
      { label: 'Development',        description: 'Next.js build, responsive layouts, animations',  startWeek: Math.ceil(totalWeeks * 0.3) + 1, durationWeeks: Math.ceil(totalWeeks * 0.5), color: '#10b981' },
      { label: 'Review & launch',    description: 'Client review, revisions, deployment',           startWeek: Math.ceil(totalWeeks * 0.8) + 1, durationWeeks: Math.floor(totalWeeks * 0.2) || 1, color: '#f59e0b' },
    ]
  }

  if (projectType === 'api') {
    return [
      { label: 'Architecture',   description: 'Schema design, API contract, auth strategy',     startWeek: 1, durationWeeks: 1, color: '#4f46e5' },
      { label: 'Core API',       description: 'Endpoints, business logic, database layer',       startWeek: 2, durationWeeks: Math.ceil(totalWeeks * 0.5), color: '#10b981' },
      { label: 'Auth & security',description: 'JWT, RBAC, rate limiting',                        startWeek: Math.ceil(totalWeeks * 0.4), durationWeeks: Math.ceil(totalWeeks * 0.3), color: '#8b5cf6' },
      { label: 'Docs & testing', description: 'OpenAPI docs, pytest suite, CI/CD pipeline',      startWeek: Math.ceil(totalWeeks * 0.7), durationWeeks: Math.ceil(totalWeeks * 0.2), color: '#f59e0b' },
      { label: 'Deployment',     description: 'Docker, VPS deployment, handover',                startWeek: totalWeeks, durationWeeks: 1, color: '#ec4899' },
    ]
  }

  // webapp / fullstack
  const phases: Phase[] = [
    { label: 'Discovery & design', description: 'Requirements, wireframes, data model',         startWeek: 1, durationWeeks: Math.max(1, Math.round(totalWeeks * 0.15)), color: '#4f46e5' },
    { label: 'Backend / API',      description: 'Django/Node API, database, business logic',    startWeek: Math.max(1, Math.round(totalWeeks * 0.15)), durationWeeks: Math.round(totalWeeks * 0.35), color: '#10b981' },
    { label: 'Frontend',           description: 'Next.js UI, responsive design, API wiring',    startWeek: Math.round(totalWeeks * 0.3), durationWeeks: Math.round(totalWeeks * 0.35), color: '#8b5cf6' },
  ]

  if (hasAuth) phases.push(
    { label: 'Auth & RBAC', description: 'JWT authentication, role-based access control', startWeek: Math.round(totalWeeks * 0.25), durationWeeks: Math.round(totalWeeks * 0.2), color: '#06b6d4' }
  )
  if (hasPayments) phases.push(
    { label: 'Payments', description: 'Payment gateway integration, webhooks', startWeek: Math.round(totalWeeks * 0.5), durationWeeks: Math.round(totalWeeks * 0.2), color: '#f97316' }
  )
  if (hasCMS) phases.push(
    { label: 'Admin / CMS', description: 'Admin dashboard, content management', startWeek: Math.round(totalWeeks * 0.55), durationWeeks: Math.round(totalWeeks * 0.2), color: '#ec4899' }
  )
  if (hasRealtime) phases.push(
    { label: 'Real-time', description: 'WebSocket integration, live updates', startWeek: Math.round(totalWeeks * 0.6), durationWeeks: Math.round(totalWeeks * 0.15), color: '#a855f7' }
  )

  phases.push(
    { label: 'Testing & QA', description: 'Test suite, bug fixes, performance', startWeek: Math.round(totalWeeks * 0.75), durationWeeks: Math.round(totalWeeks * 0.15), color: '#f59e0b' },
    { label: 'Deployment',   description: 'CI/CD, Docker, VPS, go-live',        startWeek: Math.round(totalWeeks * 0.9), durationWeeks: Math.max(1, Math.round(totalWeeks * 0.1)), color: '#64748b' }
  )

  return phases
}

export function ProjectTimeline({ projectType, features, timeline, totalWeeks }: TimelineProps) {
  if (!projectType) return null

  const phases = buildPhases(projectType, features, totalWeeks)
  const weeks  = Array.from({ length: totalWeeks }, (_, i) => i + 1)

  // Month labels
  const monthLabels: { label: string; startWeek: number }[] = []
  const monthNames = ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5']
  for (let w = 1; w <= totalWeeks; w += 4) {
    monthLabels.push({ label: monthNames[Math.floor((w - 1) / 4)], startWeek: w })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--text-muted)]">
          Delivery plan — {totalWeeks} week{totalWeeks !== 1 ? 's' : ''}
        </p>
        {timeline === 'urgent' && (
          <span className="text-xs text-amber-500 font-medium">Rush delivery (+40%)</span>
        )}
        {timeline === 'normal' && (
          <span className="text-xs text-[var(--text-muted)]">Standard delivery</span>
        )}
      </div>

      {/* Gantt chart */}
      <div className="rounded-xl border border-[var(--border)] overflow-hidden">

        {/* Week header */}
        <div className="grid border-b border-[var(--border)] bg-[var(--bg-tertiary)]"
          style={{ gridTemplateColumns: `140px repeat(${totalWeeks}, 1fr)` }}>
          <div className="px-3 py-2 text-xs text-[var(--text-muted)]">Phase</div>
          {weeks.map(w => (
            <div key={w} className="py-2 text-center text-xs text-[var(--text-muted)] border-l border-[var(--border)]">
              {w}
            </div>
          ))}
        </div>

        {/* Month spans */}
        <div className="grid border-b border-[var(--border)] bg-[var(--bg-secondary)]"
          style={{ gridTemplateColumns: `140px repeat(${totalWeeks}, 1fr)` }}>
          <div className="px-3 py-1.5 text-xs text-[var(--text-muted)]">Week</div>
          {weeks.map(w => {
            const ml = monthLabels.find(m => m.startWeek === w)
            return (
              <div key={w} className={cn(
                'py-1.5 text-center text-xs font-medium border-l border-[var(--border)]',
                ml ? 'text-[var(--text-secondary)]' : 'text-transparent'
              )}>
                {ml?.label ?? '·'}
              </div>
            )
          })}
        </div>

        {/* Phase rows */}
        {phases.map((phase, pi) => (
          <div
            key={pi}
            className="grid items-center border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-secondary)] transition-colors group"
            style={{ gridTemplateColumns: `140px repeat(${totalWeeks}, 1fr)` }}
          >
            {/* Phase label */}
            <div className="px-3 py-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: phase.color }} />
                <span className="text-xs font-medium text-[var(--text-primary)] leading-tight">{phase.label}</span>
              </div>
            </div>

            {/* Week cells */}
            {weeks.map(w => {
              const inPhase = w >= phase.startWeek && w < phase.startWeek + phase.durationWeeks
              const isStart = w === phase.startWeek
              const isEnd   = w === phase.startWeek + phase.durationWeeks - 1

              return (
                <div key={w} className="py-3 px-0.5 border-l border-[var(--border)]">
                  {inPhase && (
                    <motion.div
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{ delay: pi * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        background: phase.color,
                        height: 22,
                        borderRadius: isStart && isEnd ? 6 : isStart ? '6px 0 0 6px' : isEnd ? '0 6px 6px 0' : 0,
                        opacity: 0.85,
                        transformOrigin: 'left',
                      }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Phase descriptions */}
      <div className="grid sm:grid-cols-2 gap-2 mt-3">
        {phases.map((phase, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
            <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: phase.color }} />
            <span><span className="font-medium text-[var(--text-primary)]">{phase.label}:</span> {phase.description}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
