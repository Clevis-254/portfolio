'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Menu, X, Briefcase, Code2 } from 'lucide-react'
import { useAudience, type Audience } from '@/lib/audience-context'
import { siteConfig } from '@/data/site'
import { cn } from '@/lib/utils'

const recruiterLinks = [
  { href: '#about',    label: 'About' },
  { href: '#skills',   label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact',  label: 'Contact' },
]

const clientLinks = [
  { href: '#services',  label: 'Services' },
  { href: '#estimator', label: 'Get a quote' },
  { href: '#projects',  label: 'Work' },
  { href: '#contact',   label: 'Contact' },
]

export function Navbar() {
  const { audience, setAudience } = useAudience()
  const { theme, setTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = audience === 'recruiter' ? recruiterLinks : clientLinks

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'py-3 bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border)]'
          : 'py-5 bg-transparent'
      )}
    >
      <div className="container-main flex items-center justify-between gap-4">

        {/* Logo */}
        <a href="#top" className="font-display font-bold text-xl tracking-tight text-[var(--text-primary)] hover:text-[var(--brand)] transition-colors">
          {siteConfig.name.split(' ')[0]}<span className="text-[var(--brand)]">.</span>
        </a>

        {/* Center — audience toggle */}
        <div
          className="hidden sm:flex items-center gap-1 p-1 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)]"
          role="group"
          aria-label="Select your role"
        >
          <AudienceButton
            active={audience === 'recruiter'}
            onClick={() => setAudience('recruiter')}
            icon={<Code2 size={13} />}
            label="I'm hiring"
          />
          <AudienceButton
            active={audience === 'client'}
            onClick={() => setAudience('client')}
            icon={<Briefcase size={13} />}
            label="I need a project"
          />
        </div>

        {/* Right — nav links + theme */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-5">
            {links.map(link => (
              <a key={link.href} href={link.href} className="link-underline text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}

            <a
              href="#contact"
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                audience === 'client'
                  ? 'bg-[var(--accent)] text-white hover:opacity-90'
                  : 'bg-[var(--brand)] text-white hover:opacity-90'
              )}
            >
              {audience === 'client' ? 'Start a project' : 'Hire me'}
            </a>
          </div>
        </div>

        {/* Mobile — theme + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-muted)]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-[var(--border)] bg-[var(--bg-primary)]"
          >
            <div className="container-main py-4 flex flex-col gap-4">

              {/* Audience toggle mobile */}
              <div className="flex items-center gap-2 p-1 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] self-start">
                <AudienceButton active={audience === 'recruiter'} onClick={() => { setAudience('recruiter'); setMenuOpen(false) }} icon={<Code2 size={13} />} label="I'm hiring" />
                <AudienceButton active={audience === 'client'}    onClick={() => { setAudience('client');    setMenuOpen(false) }} icon={<Briefcase size={13} />} label="I need a project" />
              </div>

              <nav className="flex flex-col gap-3">
                {links.map(link => (
                  <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1 transition-colors">
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function AudienceButton({
  active, onClick, icon, label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
        active
          ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm border border-[var(--border)]'
          : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
      )}
    >
      {icon}
      {label}
    </button>
  )
}
