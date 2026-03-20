import { Hero } from '@/components/layout/Hero'
import { AboutSection } from '@/components/recruiter/AboutSection'
import { SkillsSection } from '@/components/recruiter/SkillsSection'
import { ExperienceSection } from '@/components/recruiter/ExperienceSection'
import { ProjectsSection } from '@/components/recruiter/ProjectsSection'
import { ServicesSection } from '@/components/client/ServicesSection'
import { EstimatorSection } from '@/components/client/EstimatorSection'
import { TestimonialsSection } from '@/components/shared/TestimonialsSection'
import { ContactSection } from '@/components/shared/ContactSection'
import { AudienceSections } from '@/components/layout/AudienceSections'

export default function HomePage() {
  return (
    <>
      <Hero />
      <AudienceSections />
      <TestimonialsSection />
      <ContactSection />
    </>
  )
}
