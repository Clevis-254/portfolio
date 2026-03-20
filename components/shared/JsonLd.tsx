import { siteConfig } from '@/data/site'

export function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      // Person schema — shows your name, job, social links in Google
      {
        '@type': 'Person',
        '@id': 'https://clevisgikenyi.dev/#person',
        name: siteConfig.name,
        jobTitle: siteConfig.title,
        description: siteConfig.shortBio,
        url: 'https://clevisgikenyi.dev',
        email: siteConfig.email,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Cardiff',
          addressCountry: 'GB',
        },
        sameAs: [
          siteConfig.social.github,
          siteConfig.social.linkedin,
        ].filter(Boolean),
        knowsAbout: [
          'Python', 'Django', 'Next.js', 'React', 'TypeScript',
          'REST APIs', 'Full-Stack Development', 'Software Engineering',
        ],
        alumniOf: {
          '@type': 'CollegeOrUniversity',
          name: 'Cardiff University',
        },
        award: 'Cardiff Award — Best Applied Software Engineering Project, Class of 2025',
      },

      // Website schema
      {
        '@type': 'WebSite',
        '@id': 'https://clevisgikenyi.dev/#website',
        url: 'https://clevisgikenyi.dev',
        name: 'Clevis Gikenyi — Full-Stack Software Engineer',
        description: siteConfig.shortBio,
        author: { '@id': 'https://clevisgikenyi.dev/#person' },
      },

      // ProfessionalService schema — helps with "hire developer Cardiff" searches
      {
        '@type': 'ProfessionalService',
        '@id': 'https://clevisgikenyi.dev/#service',
        name: 'Clevis Gikenyi — Freelance Development',
        description: 'Full-stack web development services. Python, Django, Next.js, React.',
        url: 'https://clevisgikenyi.dev',
        provider: { '@id': 'https://clevisgikenyi.dev/#person' },
        areaServed: ['Cardiff', 'Wales', 'United Kingdom', 'Remote'],
        serviceType: [
          'Web Application Development',
          'API Development',
          'Full-Stack Development',
          'Landing Page Development',
        ],
        priceRange: '££',
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
