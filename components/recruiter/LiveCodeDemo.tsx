'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Code2, Play, Square, RotateCcw, Terminal } from 'lucide-react'
import { cn } from '@/lib/utils'

const SNIPPETS = [
  {
    id: 'drf-endpoint',
    label: 'DRF endpoint',
    lang: 'python',
    description: 'Research access request endpoint from Pontiro — RBAC, audit trail, JWT auth.',
    code: `# Pontiro — research dataset access request
# Python · Django REST Framework · JWT auth

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import DatasetRequest
from .serializers import DatasetRequestSerializer
from .permissions import IsResearcher

class RequestDatasetAccessView(APIView):
    """
    POST /api/datasets/{id}/request/
    Researcher submits an access request.
    Admin receives a notification via WebSocket.
    """
    permission_classes = [IsAuthenticated, IsResearcher]

    def post(self, request, dataset_id):
        serializer = DatasetRequestSerializer(
            data=request.data,
            context={"request": request, "dataset_id": dataset_id}
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        access_request = serializer.save(
            researcher=request.user,
            dataset_id=dataset_id,
            status="pending",
        )

        notify_admins_ws(access_request)

        AuditLog.objects.create(
            actor=request.user,
            action="REQUEST_SUBMITTED",
            target_id=access_request.id,
        )

        return Response(
            DatasetRequestSerializer(access_request).data,
            status=status.HTTP_201_CREATED,
        )`,
  },
  {
    id: 'ci-pipeline',
    label: 'CI/CD pipeline',
    lang: 'yaml',
    description: 'GitLab CI pipeline from Pontiro — automated pytest, Docker build, and deployment gate.',
    code: `# Pontiro — GitLab CI/CD pipeline
stages:
  - test
  - build
  - deploy

variables:
  DOCKER_IMAGE: registry.gitlab.com/clevis/pontiro

run_tests:
  stage: test
  image: python:3.11-slim
  services:
    - name: mariadb:10.11
      alias: db
  variables:
    DB_HOST: db
    DB_NAME: pontiro_test
    SECRET_KEY: ci-test-secret
  script:
    - pip install -r requirements.txt
    - pytest --cov=. --cov-report=term-missing --cov-fail-under=80
  coverage: '/TOTAL.*\\s+(\\d+%)$/'

build_image:
  stage: build
  image: docker:24
  services: [docker:dind]
  script:
    - docker build -t $DOCKER_IMAGE:$CI_COMMIT_SHA .
    - docker push $DOCKER_IMAGE:$CI_COMMIT_SHA
  only: [main]

deploy_production:
  stage: deploy
  script:
    - ssh deploy@$VPS_HOST
        "docker pull $DOCKER_IMAGE:$CI_COMMIT_SHA &&
         docker-compose up -d --no-deps api"
  environment:
    name: production
  only: [main]
  when: on_success`,
  },
  {
    id: 'next-api',
    label: 'Next.js API route',
    lang: 'typescript',
    description: 'Member approval API route from KESWA — server-side auth check, DB update, email notification.',
    code: `// KESWA — member approval endpoint
// Next.js App Router · TypeScript · JWT session

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { sendApprovalEmail } from "@/lib/email"

export async function POST(
  req: NextRequest,
  { params }: { params: { memberId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { memberId } = params
  const { action } = await req.json()

  const member = await db.member.findUnique({
    where: { id: memberId },
  })
  if (!member) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const updated = await db.member.update({
    where: { id: memberId },
    data: {
      status: action === "approve" ? "active" : "rejected",
      reviewedBy: session.user.id,
      reviewedAt: new Date(),
    },
  })

  await sendApprovalEmail({
    to: member.email,
    name: member.name,
    approved: action === "approve",
  })

  return NextResponse.json({ ok: true, member: updated })
}`,
  },
]

const PLAYGROUND_DEFAULTS = {
  javascript: `// JavaScript playground — edit and run
// This runs live in your browser

function fibonacci(n) {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}

// Print the first 10 Fibonacci numbers
for (let i = 0; i < 10; i++) {
  console.log(\`fib(\${i}) = \${fibonacci(i)}\`)
}

// You can also work with arrays, objects, etc.
const skills = ['Python', 'Django', 'Next.js', 'TypeScript']
console.log('\\nMy stack:')
skills.forEach((s, i) => console.log(\`  \${i + 1}. \${s}\`))`,

  python: `# Python playground — edit and run
# Powered by Pyodide (Python in WebAssembly)

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Print the first 10 Fibonacci numbers
for i in range(10):
    print(f"fib({i}) = {fibonacci(i)}")

# You can use most of the Python standard library
skills = ['Python', 'Django', 'Next.js', 'TypeScript']
print("\\nMy stack:")
for i, s in enumerate(skills, 1):
    print(f"  {i}. {s}")`,
}

// Lightweight syntax highlighter
function highlight(code: string, lang: string): string {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  let s = esc(code)
  if (lang === 'python') {
    s = s
      .replace(/(#[^\n]*)/g, '<span style="color:#6A9955">$1</span>')
      .replace(/"""[\s\S]*?"""/g, m => `<span style="color:#CE9178">${m}</span>`)
      .replace(/\b(def|class|import|from|return|if|else|elif|not|and|or|in|for|with|as|True|False|None|self|range|print)\b/g, '<span style="color:#569CD6">$1</span>')
      .replace(/"([^"]*)"/g, '<span style="color:#CE9178">"$1"</span>')
      .replace(/'([^']*)'/g, "<span style='color:#CE9178'>'$1'</span>")
      .replace(/\b(\d+)\b/g, '<span style="color:#B5CEA8">$1</span>')
  }
  if (lang === 'yaml') {
    s = s
      .replace(/(#[^\n]*)/g, '<span style="color:#6A9955">$1</span>')
      .replace(/^(\s*)([\w-]+)(:)/gm, '$1<span style="color:#9CDCFE">$2</span>$3')
      .replace(/\b(true|false|on|off|yes|no)\b/g, '<span style="color:#569CD6">$1</span>')
      .replace(/"([^"]*)"/g, '<span style="color:#CE9178">"$1"</span>')
  }
  if (lang === 'typescript') {
    s = s
      .replace(/(\/\/[^\n]*)/g, '<span style="color:#6A9955">$1</span>')
      .replace(/\b(export|import|from|const|let|async|await|return|if|else|new|function|type|interface)\b/g, '<span style="color:#569CD6">$1</span>')
      .replace(/"([^"]*)"/g, '<span style="color:#CE9178">"$1"</span>')
      .replace(/'([^']*)'/g, "<span style='color:#CE9178'>'$1'</span>")
      .replace(/\b(\d+)\b/g, '<span style="color:#B5CEA8">$1</span>')
      .replace(/\b(NextRequest|NextResponse|string|number|boolean|void|null|undefined)\b/g, '<span style="color:#4EC9B0">$1</span>')
  }
  return s
}

// ─── Playground component ────────────────────────────────────────────────────

function Playground() {
  const [lang, setLang]           = useState<'javascript' | 'python'>('javascript')
  const [code, setCode]           = useState(PLAYGROUND_DEFAULTS.javascript)
  const [output, setOutput]       = useState<string[]>([])
  const [running, setRunning]     = useState(false)
  const [pyodideReady, setPyodideReady] = useState(false)
  const [pyodideLoading, setPyodideLoading] = useState(false)
  const pyodideRef                = useRef<any>(null)
  const textareaRef               = useRef<HTMLTextAreaElement>(null)

  // Load Pyodide lazily when Python tab is first selected
  async function loadPyodide() {
    if (pyodideRef.current || pyodideLoading) return
    setPyodideLoading(true)
    setOutput(['Loading Python (Pyodide)... ~5MB, one-time download'])
    try {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js'
      document.head.appendChild(script)
      await new Promise(res => { script.onload = res })
      const py = await (window as any).loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
      })
      pyodideRef.current = py
      setPyodideReady(true)
      setOutput(['Python ready. Click Run to execute your code.'])
    } catch {
      setOutput(['Failed to load Python. Check your internet connection.'])
    } finally {
      setPyodideLoading(false)
    }
  }

  function switchLang(l: 'javascript' | 'python') {
    setLang(l)
    setCode(PLAYGROUND_DEFAULTS[l])
    setOutput([])
    if (l === 'python' && !pyodideRef.current) loadPyodide()
  }

  async function runCode() {
    setRunning(true)
    setOutput([])
    const logs: string[] = []

    try {
      if (lang === 'javascript') {
        // Capture console.log output
        const origLog = console.log
        console.log = (...args) => {
          logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '))
        }
        try {
          // eslint-disable-next-line no-new-func
          const fn = new Function(code)
          fn()
        } catch (e: any) {
          logs.push(`Error: ${e.message}`)
        } finally {
          console.log = origLog
        }
      } else {
        // Python via Pyodide
        if (!pyodideRef.current) {
          setOutput(['Python not loaded yet — please wait'])
          setRunning(false)
          return
        }
        const py = pyodideRef.current
        // Redirect stdout
        py.runPython(`
import sys
import io
sys.stdout = io.StringIO()
        `)
        try {
          py.runPython(code)
          const out = py.runPython('sys.stdout.getvalue()')
          if (out) logs.push(...out.split('\n').filter((l: string) => l !== ''))
        } catch (e: any) {
          logs.push(`Error: ${e.message}`)
        } finally {
          py.runPython('sys.stdout = sys.__stdout__')
        }
      }
    } finally {
      setRunning(false)
    }

    setOutput(logs.length ? logs : ['(no output)'])
  }

  function reset() {
    setCode(PLAYGROUND_DEFAULTS[lang])
    setOutput([])
  }

  // Tab key inserts spaces instead of switching focus
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Tab') {
      e.preventDefault()
      const ta = textareaRef.current!
      const start = ta.selectionStart
      const end   = ta.selectionEnd
      const spaces = '  '
      setCode(code.substring(0, start) + spaces + code.substring(end))
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + spaces.length
      })
    }
    // Ctrl+Enter or Cmd+Enter to run
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      runCode()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#252526] border-b border-[#3d3d3d]">
        {/* Language switcher */}
        <div className="flex gap-1 p-0.5 rounded-md bg-[#1e1e1e]">
          {(['javascript', 'python'] as const).map(l => (
            <button
              key={l}
              onClick={() => switchLang(l)}
              className={cn(
                'px-3 py-1 text-xs rounded transition-colors font-mono',
                lang === l ? 'bg-[#4f46e5] text-white' : 'text-[#6d6d6d] hover:text-[#ccc]'
              )}
            >
              {l === 'javascript' ? 'JavaScript' : 'Python'}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <span className="text-xs text-[#4d4d4d] font-mono">
          {lang === 'javascript' ? 'Ctrl+Enter to run' : pyodideLoading ? 'Loading Python...' : pyodideReady ? 'Ctrl+Enter to run' : 'Python loading on first run'}
        </span>

        <button onClick={reset} className="p-1.5 rounded text-[#6d6d6d] hover:text-[#ccc] transition-colors" title="Reset">
          <RotateCcw size={13} />
        </button>

        <button
          onClick={runCode}
          disabled={running || (lang === 'python' && !pyodideReady)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#4f46e5] text-white text-xs font-medium hover:bg-[#4338ca] disabled:opacity-40 transition-colors"
        >
          {running ? <Square size={11} /> : <Play size={11} />}
          {running ? 'Running' : 'Run'}
        </button>
      </div>

      {/* Editor + Output split */}
      <div className="flex flex-1 min-h-0">
        {/* Editor */}
        <div className="flex-1 relative" style={{ minWidth: 0 }}>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className="absolute inset-0 w-full h-full resize-none bg-transparent text-[#d4d4d4] text-xs leading-relaxed p-4 outline-none font-mono z-10"
            style={{ fontFamily: 'var(--font-mono)', caretColor: '#fff', tabSize: 2 }}
          />
          {/* Syntax highlighted backdrop */}
          <pre
            aria-hidden
            className="absolute inset-0 w-full h-full text-xs leading-relaxed p-4 pointer-events-none font-mono overflow-hidden"
            style={{ fontFamily: 'var(--font-mono)', color: 'transparent' }}
            dangerouslySetInnerHTML={{ __html: highlight(code, lang === 'javascript' ? 'typescript' : lang) }}
          />
        </div>

        {/* Divider */}
        <div className="w-px bg-[#3d3d3d]" />

        {/* Output panel */}
        <div className="w-64 flex flex-col bg-[#1a1a1a]">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[#3d3d3d]">
            <Terminal size={12} className="text-[#6d6d6d]" />
            <span className="text-xs text-[#6d6d6d] font-mono">Output</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 font-mono text-xs text-[#d4d4d4] space-y-1">
            <AnimatePresence mode="wait">
              {output.length === 0 ? (
                <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#4d4d4d]">
                  Run your code to see output
                </motion.p>
              ) : (
                output.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={cn(
                      'leading-relaxed whitespace-pre-wrap break-words',
                      line.startsWith('Error:') ? 'text-[#f48771]' : 'text-[#d4d4d4]'
                    )}
                  >
                    {line}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

type Tab = typeof SNIPPETS[0]['id'] | 'playground'

export function LiveCodeDemo() {
  const [active, setActive] = useState<Tab>(SNIPPETS[0].id)
  const [copied, setCopied] = useState(false)

  const snippet = SNIPPETS.find(s => s.id === active)

  function copy() {
    if (!snippet) return
    navigator.clipboard.writeText(snippet.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isPlayground = active === 'playground'

  return (
    <div className="rounded-2xl border border-[var(--border)] overflow-hidden bg-[#1e1e1e]" style={{ height: isPlayground ? 520 : 'auto' }}>

      {/* Window chrome */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#2d2d2d] border-b border-[#3d3d3d]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <Code2 size={13} className="text-[#6d6d6d] ml-2" />
          <span className="text-xs text-[#6d6d6d] font-mono">
            {isPlayground ? 'playground' : snippet?.label}
          </span>
        </div>
        {!isPlayground && (
          <button
            onClick={copy}
            className="flex items-center gap-1.5 text-xs text-[#6d6d6d] hover:text-[#ccc] transition-colors"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-[#3d3d3d] bg-[#252526] overflow-x-auto">
        {SNIPPETS.map(s => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={cn(
              'px-4 py-2 text-xs font-mono transition-colors border-b-2 whitespace-nowrap flex-shrink-0',
              active === s.id
                ? 'text-white border-[#4f46e5] bg-[#1e1e1e]'
                : 'text-[#6d6d6d] border-transparent hover:text-[#ccc]'
            )}
          >
            {s.label}
          </button>
        ))}
        {/* Playground tab */}
        <button
          onClick={() => setActive('playground')}
          className={cn(
            'px-4 py-2 text-xs font-mono transition-colors border-b-2 whitespace-nowrap flex-shrink-0 flex items-center gap-1.5',
            active === 'playground'
              ? 'text-white border-emerald-500 bg-[#1e1e1e]'
              : 'text-[#6d6d6d] border-transparent hover:text-[#ccc]'
          )}
        >
          <Play size={10} />
          Playground
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {isPlayground ? (
          <motion.div
            key="playground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col"
            style={{ height: 'calc(520px - 84px)' }}
          >
            <Playground />
          </motion.div>
        ) : (
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Description bar */}
            <div className="px-4 py-2 bg-[#252526] border-b border-[#3d3d3d]">
              <p className="text-xs text-[#6d6d6d]">{snippet?.description}</p>
            </div>
            <pre
              className="p-5 text-xs leading-relaxed overflow-x-auto font-mono text-[#d4d4d4]"
              style={{ maxHeight: 420, fontFamily: 'var(--font-mono)' }}
              dangerouslySetInnerHTML={{ __html: highlight(snippet?.code ?? '', snippet?.lang ?? '') }}
            />
            <div className="px-4 py-3 bg-[#252526] border-t border-[#3d3d3d] flex items-center justify-between">
              <span className="text-xs text-[#6d6d6d]">Real code from my projects</span>
              <button
                onClick={() => setActive('playground')}
                className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <Play size={10} /> Try the playground
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}