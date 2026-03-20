'use client'

import { useState } from 'react'
import { Section, SectionHeading } from '@/components/ui/Section'
import { siteConfig } from '@/data/site'
import { useAudience } from '@/lib/audience-context'
import { Send, Github, Linkedin, Twitter, Check, Loader } from 'lucide-react'
import { cn } from '@/lib/utils'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function ContactSection() {
  const { isClient } = useAudience()
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <Section id="contact" label="Get in touch">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <div>
          <SectionHeading
            sub={isClient
              ? "Tell me about your project and I'll get back to you within 24 hours with initial thoughts."
              : "Open to full-time roles and interesting freelance projects. Let's chat."}
          >
            {isClient ? "Start a project" : "Say hello"}
          </SectionHeading>

          <div className="space-y-5 mt-8">
            <div>
              <p className="text-sm text-[var(--text-muted)] mb-1">Email</p>
              <a href={`mailto:${siteConfig.email}`} className="link-underline text-[var(--text-primary)]">
                {siteConfig.email}
              </a>
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)] mb-3">Find me online</p>
              <div className="flex items-center gap-3">
                {[
                  { href: siteConfig.social.github,  icon: Github,   label: 'GitHub' },
                  { href: siteConfig.social.linkedin, icon: Linkedin, label: 'LinkedIn' },
                  { href: siteConfig.social.twitter,  icon: Twitter,  label: 'Twitter' },
                ].map(({ href, icon: Icon, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    <Icon size={16} /> {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-1.5">Name</label>
              <input
                type="text" required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Your name"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-1.5">Email</label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand)] transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-[var(--text-muted)] mb-1.5">Message</label>
            <textarea
              required rows={5}
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder={isClient
                ? "Tell me about your project — what are you building, what problem does it solve, and what's your timeline?"
                : "Hi! I'd love to chat about..."
              }
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand)] transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-medium transition-all',
              status === 'success'
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--brand)] text-white hover:opacity-90 disabled:opacity-60'
            )}
          >
            {status === 'loading' && <Loader size={16} className="animate-spin" />}
            {status === 'success' && <Check size={16} />}
            {status === 'idle'    && <Send size={16} />}
            {status === 'success' ? 'Message sent!' : status === 'loading' ? 'Sending…' : 'Send message'}
          </button>

          {status === 'error' && (
            <p className="text-sm text-red-500 text-center">
              Something went wrong. Please email me directly at {siteConfig.email}
            </p>
          )}
        </form>
      </div>
    </Section>
  )
}
