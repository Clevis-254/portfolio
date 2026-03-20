'use client'

import { useRef, useEffect, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionProps {
  id?: string
  className?: string
  children: ReactNode
  label?: string
}

export function Section({ id, className, children, label }: SectionProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); observer.disconnect() } },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} id={id} className={cn('section-reveal py-20', className)}>
      <div className="container-main">
        {label && (
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--text-muted)] mb-4">
            {label}
          </p>
        )}
        {children}
      </div>
    </section>
  )
}

export function SectionHeading({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <div className="mb-12">
      <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-[var(--text-primary)] mb-3">
        {children}
      </h2>
      {sub && <p className="text-[var(--text-secondary)] text-lg max-w-xl">{sub}</p>}
    </div>
  )
}
