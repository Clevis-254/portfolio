'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Download, Sparkles, MapPin, Circle } from 'lucide-react'
import { useAudience } from '@/lib/audience-context'
import { siteConfig } from '@/data/site'
import { cn } from '@/lib/utils'

const fadeUp = (delay = 0) => ({
  initial:  { opacity: 0, y: 24 },
  animate:  { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
})

export function Hero() {
  const { isClient } = useAudience()

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">

      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Blob — changes colour based on audience */}
      <div
        className={cn(
          'absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full opacity-20 dark:opacity-10 blur-3xl transition-colors duration-700 pointer-events-none',
          isClient ? 'bg-emerald-400' : 'bg-indigo-500'
        )}
        style={{ transform: 'translate(30%, -20%)' }}
      />

      <div className="container-main relative z-10 py-24">
        <div className="max-w-3xl">

          {/* Status badge */}
          <motion.div {...fadeUp(0)} className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] text-sm">
              <span className="relative flex h-2 w-2">
                <span className={cn(
                  'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                  siteConfig.availability ? 'bg-emerald-400' : 'bg-amber-400'
                )} />
                <span className={cn(
                  'relative inline-flex rounded-full h-2 w-2',
                  siteConfig.availability ? 'bg-emerald-400' : 'bg-amber-400'
                )} />
              </span>
              <span className="text-[var(--text-secondary)]">{siteConfig.availabilityNote}</span>
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.h1 {...fadeUp(0.1)} className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.08] tracking-tight mb-6">
            {isClient ? (
              <>
                Let&apos;s build your{' '}
                <span className="gradient-text">next product</span>
                {' '}together.
              </>
            ) : (
              <>
                Full-stack dev.<br />
                <span className="gradient-text">React &amp; Node.</span><br />
                Based in Wales.
              </>
            )}
          </motion.h1>

          {/* Subheading */}
          <motion.p {...fadeUp(0.2)} className="text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed mb-10 max-w-xl">
            {isClient
              ? "I work with founders and teams to turn ideas into polished, production-ready web products. From MVP to scale."
              : siteConfig.tagline
            }
          </motion.p>

          {/* Location */}
          <motion.div {...fadeUp(0.25)} className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-10">
            <MapPin size={14} />
            <span>{siteConfig.location} · Remote-friendly</span>
          </motion.div>

          {/* CTAs */}
          <motion.div {...fadeUp(0.3)} className="flex flex-wrap items-center gap-4">
            {isClient ? (
              <>
                <a href="#estimator"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--accent)] text-white font-medium hover:opacity-90 transition-all active:scale-95"
                >
                  <Sparkles size={16} />
                  Get a free estimate
                </a>
                <a href="#projects"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--border)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-secondary)] transition-all"
                >
                  See my work
                  <ArrowRight size={16} />
                </a>
              </>
            ) : (
              <>
                <a href="#projects"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--brand)] text-white font-medium hover:opacity-90 transition-all active:scale-95"
                >
                  View projects
                  <ArrowRight size={16} />
                </a>
                <a href="/cv.pdf" download
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--border)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-secondary)] transition-all"
                >
                  <Download size={16} />
                  Download CV
                </a>
                <a href="#contact"
                  className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] underline underline-offset-4 transition-colors"
                >
                  or say hello
                </a>
              </>
            )}
          </motion.div>

          {/* Skill tags */}
          <motion.div {...fadeUp(0.4)} className="flex flex-wrap gap-2 mt-12">
            {['Python', 'Django', 'Next.js', 'React', 'TypeScript', 'Docker'].map(skill => (
              <span key={skill} className="tag text-xs">{skill}</span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--text-muted)]"
      >
        <div className="w-px h-10 bg-gradient-to-b from-transparent to-[var(--border-strong)]" />
        <span className="text-xs tracking-widest uppercase">Scroll</span>
      </motion.div>
    </section>
  )
}
