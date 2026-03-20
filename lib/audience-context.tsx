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

export function AudienceProvider({ children }: { children: ReactNode }) {
  const [audience, setAudienceState] = useState<Audience>('recruiter')

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-audience') as Audience
    if (saved === 'recruiter' || saved === 'client') setAudienceState(saved)
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
