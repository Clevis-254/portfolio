'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { siteConfig } from '@/data/site'

const SKILLS = siteConfig.skillLevels

// Extra granular breakdown for the detail panel
const SKILL_DETAILS: Record<string, { tags: string[]; note: string }> = {
  'Python / Django': {
    tags: ['Django REST Framework', 'Django Channels', 'pytest', 'JWT', 'RBAC'],
    note: 'Primary backend language. Built 30+ DRF endpoints on Pontiro with GDPR-aligned access control.',
  },
  'REST API design': {
    tags: ['OpenAPI', 'JWT Auth', 'RBAC', 'Rate limiting', 'Audit trails'],
    note: 'Designed full request lifecycle APIs with approval workflows, audit trails, and role-based access.',
  },
  'Next.js / React': {
    tags: ['App Router', 'SSR', 'Tailwind CSS', 'Framer Motion', 'Vite'],
    note: 'Built the full KESWA public site and admin portal. Uses SSR for SEO-critical pages.',
  },
  'Databases': {
    tags: ['MariaDB', 'MongoDB', 'PostgreSQL', 'Schema design', 'Migrations'],
    note: 'Designed schemas for both relational (MariaDB) and document (MongoDB) workloads.',
  },
  'TypeScript': {
    tags: ['Strict mode', 'Zod', 'Type inference', 'React types'],
    note: 'Used throughout the KESWA frontend and this portfolio. Strict mode enabled.',
  },
  'Docker / CI/CD': {
    tags: ['Docker', 'GitLab CI/CD', 'pytest gates', 'Linux VPS', 'Deployment'],
    note: 'Set up the full GitLab pipeline on Pontiro — automated test runs, Docker builds, and deployment gates.',
  },
}

export function SkillsRadar() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [active, setActive] = useState<string>(SKILLS[0].skill)
  const [drawn, setDrawn] = useState(false)

  const SIZE   = 320
  const CX     = SIZE / 2
  const CY     = SIZE / 2
  const RADIUS = 120
  const N      = SKILLS.length

  // Polygon point for a given skill index at a given radius fraction
  function pt(i: number, fraction: number) {
    const angle = (Math.PI * 2 * i) / N - Math.PI / 2
    return {
      x: CX + RADIUS * fraction * Math.cos(angle),
      y: CY + RADIUS * fraction * Math.sin(angle),
    }
  }

  // Build SVG polygon points string
  function polyPoints(fractions: number[]) {
    return fractions.map((f, i) => { const p = pt(i, f); return `${p.x},${p.y}` }).join(' ')
  }

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1]

  // Skill data polygon
  const dataPoints = polyPoints(SKILLS.map(s => s.level / 100))

  // Axis label positions (slightly outside RADIUS)
  const labelOffset = 1.28

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 300)
    return () => clearTimeout(t)
  }, [])

  const activeSkill = SKILLS.find(s => s.skill === active)!
  const activeDetail = SKILL_DETAILS[active]

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">

      {/* Radar SVG */}
      <div className="flex flex-col items-center">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          width="100%"
          style={{ maxWidth: 340 }}
          className="overflow-visible"
        >
          {/* Grid rings */}
          {rings.map(r => (
            <polygon
              key={r}
              points={polyPoints(Array(N).fill(r))}
              fill="none"
              stroke="var(--border-strong, rgba(0,0,0,0.12))"
              strokeWidth={0.5}
              opacity={0.6}
            />
          ))}

          {/* Axis spokes */}
          {SKILLS.map((_, i) => {
            const outer = pt(i, 1)
            return (
              <line
                key={i}
                x1={CX} y1={CY}
                x2={outer.x} y2={outer.y}
                stroke="var(--border-strong, rgba(0,0,0,0.12))"
                strokeWidth={0.5}
                opacity={0.5}
              />
            )
          })}

          {/* Data polygon — animated */}
          <motion.polygon
            points={dataPoints}
            fill="var(--brand, #4f46e5)"
            fillOpacity={0.15}
            stroke="var(--brand, #4f46e5)"
            strokeWidth={2}
            strokeLinejoin="round"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={drawn ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: `${CX}px ${CY}px` }}
          />

          {/* Skill dots — clickable */}
          {SKILLS.map((s, i) => {
            const p = pt(i, s.level / 100)
            const isActive = s.skill === active
            return (
              <motion.circle
                key={s.skill}
                cx={p.x} cy={p.y} r={isActive ? 6 : 4}
                fill={isActive ? 'var(--brand, #4f46e5)' : 'var(--bg-primary, #fff)'}
                stroke="var(--brand, #4f46e5)"
                strokeWidth={2}
                className="cursor-pointer"
                onClick={() => setActive(s.skill)}
                initial={{ opacity: 0, scale: 0 }}
                animate={drawn ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.4 + i * 0.06, duration: 0.3 }}
                whileHover={{ scale: 1.5 }}
              />
            )
          })}

          {/* Axis labels */}
          {SKILLS.map((s, i) => {
            const p    = pt(i, labelOffset)
            const isActive = s.skill === active
            // anchor: left side → start, right → end, top/bottom → middle
            const angle = (360 * i) / N - 90
            const anchor =
              angle > 20 && angle < 160   ? 'start'
              : angle > 200 && angle < 340 ? 'end'
              : 'middle'
            return (
              <text
                key={s.skill}
                x={p.x} y={p.y}
                textAnchor={anchor}
                dominantBaseline="central"
                fontSize={10}
                fontWeight={isActive ? 600 : 400}
                fill={isActive ? 'var(--brand, #4f46e5)' : 'var(--text-secondary, #4a4a45)'}
                className="cursor-pointer select-none transition-all"
                onClick={() => setActive(s.skill)}
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {s.skill}
              </text>
            )
          })}
        </svg>

        {/* Ring legend */}
        <div className="flex items-center gap-4 mt-2">
          {[25, 50, 75, 100].map(v => (
            <span key={v} className="text-xs text-[var(--text-muted)]">{v}%</span>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      <motion.div
        key={active}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-5"
      >
        {/* Skill name + level bar */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <h3 className="font-display font-bold text-xl text-[var(--text-primary)]">{active}</h3>
            <span className="font-display font-bold text-2xl text-[var(--brand)]">{activeSkill.level}%</span>
          </div>
          <div className="h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-[var(--brand)]"
              initial={{ width: 0 }}
              animate={{ width: `${activeSkill.level}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        {/* Note */}
        {activeDetail && (
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {activeDetail.note}
          </p>
        )}

        {/* Sub-skill tags */}
        {activeDetail && (
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-2 uppercase tracking-wider">Related technologies</p>
            <div className="flex flex-wrap gap-2">
              {activeDetail.tags.map(tag => (
                <span key={tag} className="tag-brand tag text-xs">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* All skills quick list */}
        <div className="pt-4 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--text-muted)] mb-3 uppercase tracking-wider">All skills</p>
          <div className="space-y-2">
            {SKILLS.map(s => (
              <button
                key={s.skill}
                onClick={() => setActive(s.skill)}
                className="w-full flex items-center gap-3 group"
              >
                <span className={`text-sm w-36 text-left transition-colors ${s.skill === active ? 'text-[var(--brand)] font-medium' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`}>
                  {s.skill}
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${s.level}%`,
                      background: s.skill === active ? 'var(--brand)' : 'var(--border-strong)',
                    }}
                  />
                </div>
                <span className="text-xs text-[var(--text-muted)] w-8 text-right">{s.level}%</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
