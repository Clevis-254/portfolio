'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Code2 } from 'lucide-react'
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

        # Notify admin in real-time via Django Channels
        notify_admins_ws(access_request)

        # Audit trail entry
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
# Runs on every merge request

stages:
  - test
  - build
  - deploy

variables:
  DOCKER_IMAGE: registry.gitlab.com/clevis/pontiro

# ── Tests ──────────────────────────────────────────
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
  coverage: '/TOTAL.*\s+(\d+%)$/'

# ── Build ──────────────────────────────────────────
build_image:
  stage: build
  image: docker:24
  services: [docker:dind]
  script:
    - docker build -t $DOCKER_IMAGE:$CI_COMMIT_SHA .
    - docker push $DOCKER_IMAGE:$CI_COMMIT_SHA
  only: [main]

# ── Deploy ─────────────────────────────────────────
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
  // Only admins can approve members
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { memberId } = params
  const { action } = await req.json() // "approve" | "reject"

  const member = await db.member.findUnique({
    where: { id: memberId },
  })
  if (!member) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // Update status + record who approved and when
  const updated = await db.member.update({
    where: { id: memberId },
    data: {
      status: action === "approve" ? "active" : "rejected",
      reviewedBy: session.user.id,
      reviewedAt: new Date(),
    },
  })

  // Email the member with their status
  await sendApprovalEmail({
    to: member.email,
    name: member.name,
    approved: action === "approve",
  })

  return NextResponse.json({ ok: true, member: updated })
}`,
  },
]

// Very lightweight syntax highlighter (no external deps)
function highlight(code: string, lang: string): string {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  let s = esc(code)

  if (lang === 'python') {
    s = s
      .replace(/(#[^\n]*)/g,           '<span style="color:#6A9955">$1</span>')
      .replace(/"""[\s\S]*?"""/g,       m => `<span style="color:#CE9178">${m}</span>`)
      .replace(/\b(def|class|import|from|return|if|else|elif|not|and|or|in|for|with|as|True|False|None|self)\b/g,
                                        '<span style="color:#569CD6">$1</span>')
      .replace(/"([^"]*)"/g,            '<span style="color:#CE9178">"$1"</span>')
      .replace(/'([^']*)'/g,            "<span style='color:#CE9178'>'$1'</span>")
      .replace(/\b(\d+)\b/g,           '<span style="color:#B5CEA8">$1</span>')
  }

  if (lang === 'yaml') {
    s = s
      .replace(/(#[^\n]*)/g,  '<span style="color:#6A9955">$1</span>')
      .replace(/^(\s*)([\w-]+)(:)/gm, '$1<span style="color:#9CDCFE">$2</span>$3')
      .replace(/\b(true|false|on|off|yes|no)\b/g, '<span style="color:#569CD6">$1</span>')
      .replace(/"([^"]*)"/g,  '<span style="color:#CE9178">"$1"</span>')
      .replace(/'([^']*)'/g,  "<span style='color:#CE9178'>'$1'</span>")
  }

  if (lang === 'typescript') {
    s = s
      .replace(/(\/\/[^\n]*)/g, '<span style="color:#6A9955">$1</span>')
      .replace(/\b(export|import|from|const|let|async|await|return|if|else|new|function|type|interface|extends|implements)\b/g,
               '<span style="color:#569CD6">$1</span>')
      .replace(/"([^"]*)"/g, '<span style="color:#CE9178">"$1"</span>')
      .replace(/'([^']*)'/g, "<span style='color:#CE9178'>'$1'</span>")
      .replace(/\b(\d+)\b/g, '<span style="color:#B5CEA8">$1</span>')
      .replace(/\b(NextRequest|NextResponse|string|number|boolean|void|null|undefined)\b/g,
               '<span style="color:#4EC9B0">$1</span>')
  }

  return s
}

export function LiveCodeDemo() {
  const [active, setActive]   = useState(SNIPPETS[0].id)
  const [copied, setCopied]   = useState(false)

  const snippet = SNIPPETS.find(s => s.id === active)!

  function copy() {
    navigator.clipboard.writeText(snippet.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] overflow-hidden bg-[#1e1e1e]">

      {/* Window chrome */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#2d2d2d] border-b border-[#3d3d3d]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <Code2 size={13} className="text-[#6d6d6d] ml-2" />
          <span className="text-xs text-[#6d6d6d] font-mono">{snippet.label}</span>
        </div>

        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs text-[#6d6d6d] hover:text-[#ccc] transition-colors"
        >
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-[#3d3d3d] bg-[#252526]">
        {SNIPPETS.map(s => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={cn(
              'px-4 py-2 text-xs font-mono transition-colors border-b-2',
              active === s.id
                ? 'text-white border-[var(--brand)] bg-[#1e1e1e]'
                : 'text-[#6d6d6d] border-transparent hover:text-[#ccc]'
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Description bar */}
      <div className="px-4 py-2 bg-[#252526] border-b border-[#3d3d3d]">
        <p className="text-xs text-[#6d6d6d]">{snippet.description}</p>
      </div>

      {/* Code */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <pre
            className="p-5 text-xs leading-relaxed overflow-x-auto font-mono text-[#d4d4d4]"
            style={{ maxHeight: 420, fontFamily: 'var(--font-mono)' }}
            dangerouslySetInnerHTML={{ __html: highlight(snippet.code, snippet.lang) }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Footer — Phase 3 teaser */}
      <div className="px-4 py-3 bg-[#252526] border-t border-[#3d3d3d] flex items-center justify-between">
        <span className="text-xs text-[#6d6d6d]">Real code from my projects</span>
        <span className="text-xs text-[var(--brand)] opacity-70">
          Full interactive editor coming in Phase 3
        </span>
      </div>
    </div>
  )
}
