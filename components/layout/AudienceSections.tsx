'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useAudience } from '@/lib/audience-context'
import { AboutSection } from '@/components/recruiter/AboutSection'
import { SkillsSection } from '@/components/recruiter/SkillsSection'
import { ExperienceSection } from '@/components/recruiter/ExperienceSection'
import { ProjectsSection } from '@/components/recruiter/ProjectsSection'
import { ServicesSection } from '@/components/client/ServicesSection'
import { EstimatorSection } from '@/components/client/EstimatorSection'
import { CaseStudiesSection } from '@/components/client/CaseStudiesSection'
import { BookingSection } from '@/components/client/BookingSection'

export function AudienceSections() {
  const { audience } = useAudience()

  return (
    <AnimatePresence mode="wait">
      {audience === 'recruiter' ? (
        <motion.div
          key="recruiter"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <AboutSection />
          <SkillsSection />
          <ExperienceSection />
          <ProjectsSection />
        </motion.div>
      ) : (
        <motion.div
          key="client"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <ServicesSection />
          <EstimatorSection />
          <CaseStudiesSection />
          <BookingSection />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
