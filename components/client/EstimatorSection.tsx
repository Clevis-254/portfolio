'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Section, SectionHeading } from '@/components/ui/Section'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Sparkles, ChevronRight, Calendar } from 'lucide-react'
import { ProjectTimeline } from './ProjectTimeline'
import { AIQuoteAssistant } from './AIQuoteAssistant'

type ProjectType = 'landing' | 'webapp' | 'api' | 'fullstack' | null

const PROJECT_TYPES = [
  { id: 'landing',   label: 'Landing page',  base: 600,  weeks: 2,  icon: '🌐' },
  { id: 'webapp',    label: 'Web app',        base: 2500, weeks: 6,  icon: '⚡' },
  { id: 'api',       label: 'API / backend',  base: 1500, weeks: 3,  icon: '🔌' },
  { id: 'fullstack', label: 'Full product',   base: 6000, weeks: 10, icon: '🚀' },
] as const

const FEATURES = [
  { id: 'auth',     label: 'User authentication',            cost: 500 },
  { id: 'payments', label: 'Payment integration',            cost: 800 },
  { id: 'cms',      label: 'CMS / admin panel',              cost: 600 },
  { id: 'api',      label: 'Third-party API integrations',   cost: 400 },
  { id: 'realtime', label: 'Real-time features (WebSockets)',cost: 700 },
  { id: 'email',    label: 'Email system',                   cost: 300 },
  { id: 'mobile',   label: 'Mobile responsive',              cost: 0   },
  { id: 'seo',      label: 'SEO optimisation',               cost: 200 },
]

const TIMELINES = [
  { id: 'relaxed', label: 'Relaxed',  multiplier: 1,    weeksMult: 1.3 },
  { id: 'normal',  label: 'Standard', multiplier: 1,    weeksMult: 1   },
  { id: 'urgent',  label: 'Urgent',   multiplier: 1.4,  weeksMult: 0.6 },
]

type Tab = 'configurator' | 'ai'

export function EstimatorSection() {
  const [tab, setTab]               = useState<Tab>('configurator')
  const [projectType, setProjectType] = useState<ProjectType>(null)
  const [features, setFeatures]       = useState<string[]>([])
  const [timeline, setTimeline]       = useState('normal')
  const [step, setStep]               = useState(1)

  const ptData       = PROJECT_TYPES.find(p => p.id === projectType)
  const basePrice    = ptData?.base ?? 0
  const baseWeeks    = ptData?.weeks ?? 0
  const featuresTotal = features.reduce((sum, fId) => sum + (FEATURES.find(f => f.id === fId)?.cost ?? 0), 0)
  const tlData       = TIMELINES.find(t => t.id === timeline)!
  const estimate     = Math.round((basePrice + featuresTotal) * tlData.multiplier)
  const totalWeeks   = Math.max(1, Math.round(baseWeeks * tlData.weeksMult))

  function toggleFeature(id: string) {
    setFeatures(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])
  }

  return (
    <Section id="estimator" label="Get a quote">
      <SectionHeading sub="Use the configurator for an instant estimate, or chat with the AI assistant to describe your idea in plain English.">
        What will your project cost?
      </SectionHeading>

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] self-start inline-flex mb-8 w-fit">
        {[
          { id: 'configurator' as Tab, label: 'Project configurator', icon: '⚙️' },
          { id: 'ai'           as Tab, label: 'AI quote assistant',   icon: '✨' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              tab === t.id
                ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            )}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'configurator' ? (
          <motion.div
            key="configurator"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid lg:grid-cols-5 gap-8">

              {/* Configurator — left 3 cols */}
              <div className="lg:col-span-3 space-y-8">

                {/* Step 1 */}
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)] mb-3">1. What are you building?</p>
                  <div className="grid grid-cols-2 gap-3">
                    {PROJECT_TYPES.map(pt => (
                      <button key={pt.id}
                        onClick={() => { setProjectType(pt.id as ProjectType); setStep(Math.max(step, 2)) }}
                        className={cn(
                          'flex items-center gap-3 p-4 rounded-xl border text-left transition-all',
                          projectType === pt.id
                            ? 'border-[var(--accent)] bg-[var(--surface-client)]'
                            : 'border-[var(--border)] hover:border-[var(--border-strong)]'
                        )}
                      >
                        <span className="text-xl">{pt.icon}</span>
                        <div>
                          <p className="text-sm font-medium text-[var(--text-primary)]">{pt.label}</p>
                          <p className="text-xs text-[var(--text-muted)]">from {formatCurrency(pt.base)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2 */}
                <AnimatePresence>
                  {step >= 2 && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                      <p className="text-sm font-medium text-[var(--text-primary)] mb-3">2. Which features do you need?</p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {FEATURES.map(f => (
                          <label key={f.id}
                            className={cn(
                              'flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all',
                              features.includes(f.id)
                                ? 'border-[var(--accent)] bg-[var(--surface-client)]'
                                : 'border-[var(--border)] hover:border-[var(--border-strong)]'
                            )}
                          >
                            <input type="checkbox"
                              className="accent-[var(--accent)] w-4 h-4"
                              checked={features.includes(f.id)}
                              onChange={() => { toggleFeature(f.id); setStep(Math.max(step, 3)) }}
                            />
                            <span className="text-sm text-[var(--text-primary)] flex-1">{f.label}</span>
                            {f.cost > 0 && <span className="text-xs text-[var(--text-muted)]">+{formatCurrency(f.cost)}</span>}
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Step 3 */}
                <AnimatePresence>
                  {step >= 3 && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                      <p className="text-sm font-medium text-[var(--text-primary)] mb-3">3. What&apos;s your timeline?</p>
                      <div className="grid grid-cols-3 gap-3">
                        {TIMELINES.map(t => (
                          <button key={t.id}
                            onClick={() => setTimeline(t.id)}
                            className={cn(
                              'p-4 rounded-xl border text-center transition-all',
                              timeline === t.id
                                ? 'border-[var(--accent)] bg-[var(--surface-client)]'
                                : 'border-[var(--border)] hover:border-[var(--border-strong)]'
                            )}
                          >
                            <p className="text-sm font-medium text-[var(--text-primary)]">{t.label}</p>
                            {t.multiplier > 1 && (
                              <p className="text-xs text-amber-500 mt-1">+{Math.round((t.multiplier - 1) * 100)}% fee</p>
                            )}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Timeline visualiser */}
                <AnimatePresence>
                  {projectType && step >= 2 && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                      <ProjectTimeline
                        projectType={projectType}
                        features={features}
                        timeline={timeline}
                        totalWeeks={totalWeeks}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Estimate panel — right 2 cols */}
              <div className="lg:col-span-2">
                <div className="sticky top-28 glass-card p-6 space-y-5">
                  <h3 className="font-display font-bold text-lg">Your estimate</h3>

                  {projectType ? (
                    <>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-[var(--text-secondary)]">
                          <span>Base ({ptData?.label})</span>
                          <span>{formatCurrency(basePrice)}</span>
                        </div>
                        {features.length > 0 && (
                          <div className="flex justify-between text-[var(--text-secondary)]">
                            <span>Features ({features.length})</span>
                            <span>+{formatCurrency(featuresTotal)}</span>
                          </div>
                        )}
                        {timeline === 'urgent' && (
                          <div className="flex justify-between text-amber-500">
                            <span>Rush fee (+40%)</span>
                            <span>×1.4</span>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-[var(--border)] pt-4">
                        <p className="text-xs text-[var(--text-muted)] mb-1">Rough estimate</p>
                        <p className="font-display font-bold text-4xl text-[var(--accent)]">
                          {formatCurrency(estimate)}
                        </p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                          Delivery in ~{totalWeeks} week{totalWeeks !== 1 ? 's' : ''}. Indicative only.
                        </p>
                      </div>

                      <a href="#book"
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-all">
                        <Calendar size={14} />
                        Book a discovery call
                      </a>

                      <button
                        onClick={() => setTab('ai')}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-full border border-[var(--border)] text-[var(--text-secondary)] text-sm font-medium hover:bg-[var(--bg-tertiary)] transition-all">
                        <Sparkles size={14} />
                        Refine with AI assistant
                      </button>
                    </>
                  ) : (
                    <div className="py-8 text-center text-[var(--text-muted)]">
                      <p className="text-sm">Select a project type to see your estimate</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

        ) : (
          <motion.div
            key="ai"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="max-w-2xl">
              <AIQuoteAssistant />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  )
}
