'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, User, Bot, Loader, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SYSTEM_PROMPT = `You are the AI assistant on Clevis Gikenyi's portfolio website. Clevis is a full-stack software engineer based in Cardiff, UK, specialising in Python, Django REST Framework, and Next.js. He has shipped two production systems: KESWA (a community platform with 25+ modules) and Pontiro (a healthcare data platform with 30+ DRF endpoints). He won the Cardiff Award for Best Applied Software Engineering Project 2025.

Your job: have a friendly, professional conversation with a potential client to understand their project, then output a structured quote.

Clevis's services and pricing:
- Landing page: £600–£1,500, ~2 weeks
- Web application: £2,500–£7,000, ~6 weeks
- API / backend: £1,500–£4,000, ~3 weeks
- Full product build: £6,000–£18,000, ~10 weeks

Add-on costs:
- User authentication: +£500
- Payment integration: +£800
- CMS / admin panel: +£600
- Third-party API integrations: +£400
- Real-time features (WebSockets): +£700
- Email system: +£300
- SEO optimisation: +£200

Rush fee: +15% for 4–8 week delivery, +40% for under 4 weeks.

Conversation rules:
1. Start by warmly greeting them and asking what they want to build in ONE question.
2. Ask follow-up questions ONE AT A TIME. Cover: what the project does, who it's for, key features needed, rough timeline, and budget range.
3. After 4–6 exchanges when you have enough info, produce a structured quote in this exact format:

---QUOTE---
**Project summary:** [1-2 sentence description]
**Recommended service:** [service name]
**Estimated cost:** £[X,XXX] – £[X,XXX]
**Estimated timeline:** [X weeks]
**What's included:**
- [item 1]
- [item 2]
- [item 3]
**Next step:** Book a free 30-minute discovery call to finalise the scope.
---END QUOTE---

4. After the quote, offer to answer any questions.
5. Keep responses concise — no walls of text. Be warm, direct, and human.
6. Never make up capabilities Clevis doesn't have. Stick to web/full-stack.`

const STARTERS = [
  "I need a website for my business",
  "I want to build a web app",
  "I need an API / backend built",
  "I have an idea, not sure where to start",
]

export function AIQuoteAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm here to help you figure out what building your project with Clevis would look like — and give you a rough cost estimate. What are you looking to build?",
    },
  ])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [showQuote, setShowQuote] = useState(false)
  const bottomRef               = useRef<HTMLDivElement>(null)
  const inputRef                = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(text?: string) {
    const content = text ?? input.trim()
    if (!content || loading) return
    setInput('')

    const newMessages: Message[] = [...messages, { role: 'user', content }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await fetch('/api/quote-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      const reply = data.content

      setMessages(prev => [...prev, { role: 'assistant', content: reply }])

      if (reply.includes('---QUOTE---')) setShowQuote(true)
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, something went wrong on my end. Please try again or email clevisgikenyi@gmail.com directly.",
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function reset() {
    setMessages([{
      role: 'assistant',
      content: "Hi! I'm here to help you figure out what building your project with Clevis would look like — and give you a rough cost estimate. What are you looking to build?",
    }])
    setInput('')
    setShowQuote(false)
  }

  // Parse and render the quote block nicely
  function renderMessage(content: string) {
    if (!content.includes('---QUOTE---')) {
      return <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
    }

    const [before, rest]  = content.split('---QUOTE---')
    const [quote, after]  = (rest ?? '').split('---END QUOTE---')

    return (
      <div className="space-y-3">
        {before && <p className="text-sm leading-relaxed">{before.trim()}</p>}

        {/* Quote card */}
        <div className="rounded-xl border border-[var(--accent)] bg-[var(--surface-client)] p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[var(--accent)]" />
            <span className="text-xs font-medium text-[var(--accent)] uppercase tracking-wider">Your estimate</span>
          </div>
          <div className="text-sm leading-relaxed text-[var(--text-primary)] whitespace-pre-wrap">
            {quote?.trim().split('\n').map((line, i) => {
              if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={i} className="font-medium">{line.replace(/\*\*/g, '')}</p>
              }
              if (line.match(/^\*\*.*:\*\*/)) {
                const [label, ...rest] = line.split(':**')
                return (
                  <p key={i}>
                    <span className="font-medium">{label.replace('**', '')}:</span>
                    {rest.join(':**')}
                  </p>
                )
              }
              if (line.startsWith('- ')) {
                return <p key={i} className="pl-3 text-[var(--text-secondary)]">• {line.slice(2)}</p>
              }
              return line ? <p key={i}>{line}</p> : <br key={i} />
            })}
          </div>
          <a
            href="#book"
            className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-all"
          >
            Book a free discovery call
          </a>
        </div>

        {after && <p className="text-sm leading-relaxed">{after.trim()}</p>}
      </div>
    )
  }

  const isFirstMessage = messages.length === 1

  return (
    <div className="flex flex-col rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--bg-secondary)]" style={{ height: 520 }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-[var(--bg-primary)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Project estimator</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-[var(--text-muted)]">AI-powered · usually replies instantly</span>
            </div>
          </div>
        </div>
        <button
          onClick={reset}
          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all"
          title="Start over"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
          >
            {/* Avatar */}
            <div className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
              msg.role === 'user'
                ? 'bg-[var(--brand)] text-white'
                : 'bg-[var(--accent)] text-white'
            )}>
              {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
            </div>

            {/* Bubble */}
            <div className={cn(
              'max-w-[82%] rounded-2xl px-4 py-3',
              msg.role === 'user'
                ? 'bg-[var(--brand)] text-white rounded-tr-sm'
                : 'bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] rounded-tl-sm'
            )}>
              {msg.role === 'assistant'
                ? renderMessage(msg.content)
                : <p className="text-sm leading-relaxed">{msg.content}</p>
              }
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-[var(--accent)] flex items-center justify-center flex-shrink-0">
              <Bot size={12} className="text-white" />
            </div>
            <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick starters (first message only) */}
        <AnimatePresence>
          {isFirstMessage && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-wrap gap-2 mt-2"
            >
              {STARTERS.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
                >
                  {s}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--bg-primary)]">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Describe your project idea..."
            className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            disabled={loading}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-[var(--accent)] text-white disabled:opacity-40 hover:opacity-90 transition-all flex-shrink-0"
          >
            {loading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
        <p className="text-xs text-[var(--text-muted)] text-center mt-2">
          Powered by Claude AI · estimates are indicative, not binding
        </p>
      </div>
    </div>
  )
}
