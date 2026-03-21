'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Audience = 'recruiter' | 'client'

interface AudienceContextType {
  audience: Audience
  setAudience: (a: Audience) => void
  isRecruiter: boolean
  isClient: boolean
}

const AudienceContext = createContext<AudienceContextType>({
  audience: 'recruiter',
  setAudience: () => {},
  isRecruiter: true,
  isClient: false,
})

// Keywords in the referrer URL or page search query that indicate a client
const CLIENT_KEYWORDS = [
  'cost', 'price', 'quote', 'cheap',
  'need', 'want', 'looking for', 'website developer','website developer in cardiff','web developer in wales','web developer in uk',
  'hire developer', 'hire software engineer', 'hire web developer', 'hire full-stack developer', 'hire python developer', 'hire django developer', 'hire next.js developer', 'hire react developer', 'hire typescript developer',
  'build website', 'build web app', 'build software', 'build application', 'build project',
  'freelance developer', 'freelance web developer', 'freelance software developer', 'freelance application developer',
  'freelance project', 'freelance work', 'freelance contract', 'freelance job',
  'website development', 'web development', 'software development', 'application development', 'project development', 'website design', 'web design', 'software design', 'application design', 'project design', 'website builder', 'web builder', 'software builder', 'application builder', 'project builder',
]

// Keywords that indicate a recruiter
const RECRUITER_KEYWORDS = [
  'cv', 'resume', 'portfolio',
  'job', 'role', 'position', 'vacancy',
  'engineer', 'candidate', 'talent',
  'linkedin', 'github',
  'salary', 'experience', 'skills',
  'hiring', 'recruiting', 'recruitment',
  'interview', 'application', 'apply',
]

function detectAudienceFromContext(): Audience | null {
  if (typeof window === 'undefined') return null

  // 1. Explicit URL param — highest priority
  //    clevisgikenyi.dev?for=client  or  ?for=recruiter
  const params = new URLSearchParams(window.location.search)
  const forParam = params.get('for')
  if (forParam === 'client')    return 'client'
  if (forParam === 'recruiter') return 'recruiter'

  // Also support ?mode=client / ?mode=recruiter
  const modeParam = params.get('mode')
  if (modeParam === 'client')    return 'client'
  if (modeParam === 'recruiter') return 'recruiter'

  // 2. Referrer keyword detection
  //    Checks the page the visitor came FROM (e.g. Google search results page)
  const referrer = document.referrer.toLowerCase()
  const searchQuery = decodeURIComponent(
    // Extract q= from Google/Bing/DuckDuckGo referrer URLs
    referrer.match(/[?&]q=([^&]+)/)?.[1] ?? ''
  ).toLowerCase()

  // Combine referrer URL + extracted search query for matching
  const searchContext = `${referrer} ${searchQuery}`

  // Check client keywords first (more specific use case)
  if (CLIENT_KEYWORDS.some(kw => searchContext.includes(kw))) {
    return 'client'
  }

  // Check recruiter keywords
  if (RECRUITER_KEYWORDS.some(kw => searchContext.includes(kw))) {
    return 'recruiter'
  }

  return null // No signal — use saved preference or default
}

export function AudienceProvider({ children }: { children: ReactNode }) {
  const [audience, setAudienceState] = useState<Audience>('recruiter')

  useEffect(() => {
    // Priority order:
    // 1. URL param (?for=client)
    // 2. Referrer keyword detection
    // 3. Previously saved preference (localStorage)
    // 4. Default: recruiter

    const detected = detectAudienceFromContext()

    if (detected) {
      // URL param or referrer signal wins — save it too
      setAudienceState(detected)
      localStorage.setItem('portfolio-audience', detected)
    } else {
      // Fall back to saved preference
      const saved = localStorage.getItem('portfolio-audience') as Audience
      if (saved === 'recruiter' || saved === 'client') {
        setAudienceState(saved)
      }
    }
  }, [])

  function setAudience(a: Audience) {
    setAudienceState(a)
    localStorage.setItem('portfolio-audience', a)
  }

  return (
    <AudienceContext.Provider value={{
      audience,
      setAudience,
      isRecruiter: audience === 'recruiter',
      isClient: audience === 'client',
    }}>
      {children}
    </AudienceContext.Provider>
  )
}

export const useAudience = () => useContext(AudienceContext)