import { Github, Linkedin, Twitter, Mail } from 'lucide-react'
import { siteConfig } from '@/data/site'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--border)] py-10 mt-24">
      <div className="container-main flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-display font-bold text-lg">
            {siteConfig.name.split(' ')[0]}<span className="text-[var(--brand)]">.</span>
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            &copy; {year} {siteConfig.name}. Built with Next.js &amp; Tailwind.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {[
            { href: siteConfig.social.github,   icon: Github,   label: 'GitHub' },
            { href: siteConfig.social.linkedin,  icon: Linkedin, label: 'LinkedIn' },
            { href: siteConfig.social.twitter,   icon: Twitter,  label: 'Twitter' },
            { href: `mailto:${siteConfig.email}`, icon: Mail,    label: 'Email' },
          ].map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
