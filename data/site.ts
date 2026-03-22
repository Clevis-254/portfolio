export const siteConfig = {
  name: "Clevis Gikenyi",
  title: "Full-Stack Software Engineer",
  tagline: "I build fast, secure web products that solve real problems — from MVP to production.",
  shortBio: "Cardiff University graduate specialising in Python, Django, and Next.js. Award-winning engineer with two shipped production systems.",
  location: "Cardiff, UK",
  email: "clevisgikenyi@gmail.com",
  phone: "+44 7897 348000",
  domain: "clevisgikenyi.dev",
  availability: true,
  availabilityNote: "Available for new projects and full-time roles",

  social: {
    github:   "https://github.com/Clevis-254",
    linkedin: "https://www.linkedin.com/in/simba-gikenyi-309aa4263/",
    twitter:  "",
  },

  skills: {
    languages:  ["Python", "TypeScript", "JavaScript", "Java", "SQL"],
    frontend:   ["Next.js", "React", "Tailwind CSS", "Vite"],
    backend:    ["Django", "Django REST Framework", "Flask", "Express.js", "Spring Boot"],
    databases:  ["MariaDB", "MongoDB", "PostgreSQL"],
    devops:     ["Docker", "GitLab CI/CD", "Linux VPS", "Git"],
    practices:  ["REST APIs", "JWT Auth", "RBAC", "GDPR-aware design", "Agile/Scrum", "TDD", "WebSockets"],
  },

  experience: [
    {
      id: "job-1",
      role: "Freelance Full-Stack Developer",
      company: "KESWA",
      companyUrl: "https://www.keswa.org.uk/",
      period: "Oct 2025 – Jan 2026",
      description: "Independently contracted to design and deliver a production web platform for a community organisation. Platform publicly launched 12 January 2026, serving 50+ organisation members.",
      bullets: [
        "Built a full-stack platform using Next.js, Tailwind CSS, and a Node/Express backend with responsive interfaces for public users and administrators.",
        "Developed 25+ feature modules — admin dashboards, membership management, event scheduling, blog publishing, and partnership workflows.",
        "Implemented secure user registration and approval workflows enabling administrators to review and activate member accounts.",
        "Built a volunteer opportunity system with admin-controlled publishing and application approval.",
        "Led end-to-end delivery: requirements gathering, iterative client demos, cloud deployment, and post-launch support.",
      ],
      tags: ["Next.js", "Tailwind CSS", "Node.js", "Express", "Full-stack"],
    },
    {
      id: "job-2",
      role: "Full-Stack Engineer & Scrum Master",
      company: "Pontiro — Cardiff University Capstone",
      companyUrl: "https://github.com/Clevis-254/pontiro",
      period: "Feb 2025 – May 2025",
      description: "Led backend development and Agile delivery for a privacy-preserving healthcare data-sharing platform. Won the Cardiff Award for Best Applied Software Engineering Project, Class of 2025.",
      bullets: [
        "Engineered a secure backend using Python, Django, and DRF — built 30+ REST API endpoints covering dataset management, researcher access requests, and admin approval workflows.",
        "Designed the full research-request lifecycle API with admin approve/reject/revoke controls and a full audit trail.",
        "Enabled real-time researcher–administrator communication via Django Channels and WebSockets.",
        "Integrated a GitLab CI/CD pipeline automating pytest runs, Docker builds, coverage checks, and deployment gates.",
        "Implemented GDPR-aligned RBAC and JWT authentication across all endpoints.",
        "Served as Scrum Master for a 3-person team across a 14-week delivery cycle.",
      ],
      tags: ["Python", "Django", "DRF", "WebSockets", "Docker", "GitLab CI/CD", "JWT", "RBAC"],
    },
  ],

  education: [
    {
      id: "edu-1",
      degree: "BSc (Hons) Applied Software Engineering",
      institution: "Cardiff University",
      period: "Graduated July 2025",
      grade: "2:1",
      award: "Cardiff Award — Best Applied Software Engineering Project, Class of 2025",
    },
  ],

  projects: [
    {
      id: "keswa",
      title: "KESWA Platform",
      category: "fullstack",
      description: "A production full-stack platform for a community organisation — membership management, event coordination, and digital engagement for 50+ members.",
      longDescription: "Contracted to design and deliver a complete web platform from scratch. Shipped 25+ feature modules including admin dashboards, membership workflows, event scheduling, blog publishing, volunteer management, and partnership tools.",
      image: "/projects/keswa.png",
      liveUrl: "https://www.keswa.org.uk/",
      githubUrl: "https://github.com/Clevis-254",
      tags: ["Next.js", "Tailwind CSS", "Node.js", "Express"],
      featured: true,
      stats: { members: "50+", modules: "25+", launched: "Jan 2026" },
      caseStudy: {
        problem: "KESWA were managing their membership, events, and communications through a patchwork of spreadsheets and emails. They needed a single platform their team could actually use.",
        solution: "Built a full-stack platform with Next.js and Express — a public-facing site plus a secure admin panel. Delivered iteratively with regular client demos throughout.",
        results: "Launched publicly on 12 January 2026. The platform now handles 50+ member accounts, volunteer applications, and event coordination — all managed through the admin dashboard without any developer involvement.",
        techDecisions: [
          { decision: "Next.js over a pure React SPA", reason: "SSR gave better SEO for the public pages and faster initial load for members." },
          { decision: "Express backend over a BaaS", reason: "The approval workflows and role logic were complex enough to warrant a custom API." },
        ],
      },
    },
    {
      id: "pontiro",
      title: "Pontiro Healthcare Platform",
      category: "backend",
      description: "Award-winning privacy-preserving data-sharing platform for healthcare researchers, with GDPR-aligned RBAC, real-time comms, and a full CI/CD pipeline.",
      longDescription: "Capstone project recognised as Best Applied Software Engineering Project at Cardiff University 2025. Enables researchers to securely request and access datasets in compliance with data protection law.",
      image: "/projects/alacrity.jpeg",
      liveUrl: "",
      githubUrl: "https://github.com/Clevis-254/pontiro",
      tags: ["Python", "Django", "DRF", "WebSockets", "Docker", "GitLab CI/CD"],
      featured: true,
      stats: { endpoints: "30+", team: "3 engineers", award: "Best Project 2025" },
      caseStudy: {
        problem: "Healthcare researchers had no secure, auditable way to request access to sensitive datasets — the process relied on emails with no trail and no access controls.",
        solution: "Designed and built a DRF backend with a full request lifecycle API: researchers submit requests, admins approve/reject/revoke with a full audit trail. Real-time messaging via Django Channels replaced async email delays.",
        results: "Won the Cardiff Award for Best Applied Software Engineering Project, Class of 2025 — recognised for backend architecture, Agile leadership, and real-world problem solving.",
        techDecisions: [
          { decision: "Django Channels for real-time messaging", reason: "Replacing email-based async communication with WebSockets cut response time from hours to seconds." },
          { decision: "GitLab CI/CD with pytest gates", reason: "Healthcare context demanded high confidence — every merge ran the full test suite before deployment." },
        ],
      },
    },
  ],

  services: [
    {
      id: "landing",
      name: "Landing page",
      description: "A fast, SEO-optimised landing page for your product or business.",
      priceFrom: 600,
      priceTo: 1500,
      timelineWeeks: 2,
      includes: [
        "Responsive design (Next.js)",
        "SEO optimised",
        "Contact / enquiry form",
        "CMS integration (optional)",
        "Deployed to your domain",
        "1 round of revisions",
      ],
    },
    {
      id: "webapp",
      name: "Web application",
      description: "A full-featured web app with auth, database, and a polished UI.",
      priceFrom: 2500,
      priceTo: 7000,
      timelineWeeks: 6,
      includes: [
        "Next.js frontend",
        "Django or Node.js backend",
        "Database design",
        "JWT auth + RBAC",
        "REST API",
        "Deployed + documented",
        "2 weeks post-launch support",
      ],
    },
    {
      id: "api",
      name: "API / backend",
      description: "A production-ready REST API with auth, docs, and a test suite.",
      priceFrom: 1500,
      priceTo: 4000,
      timelineWeeks: 3,
      includes: [
        "Django REST Framework or Express",
        "JWT auth + RBAC",
        "OpenAPI / Swagger docs",
        "pytest or Jest test suite",
        "Docker setup",
        "CI/CD pipeline",
      ],
    },
    {
      id: "fullstack",
      name: "Full product build",
      description: "End-to-end product development — from requirements to launch.",
      priceFrom: 6000,
      priceTo: 18000,
      timelineWeeks: 10,
      includes: [
        "Requirements & scope definition",
        "Full-stack development",
        "GDPR-aware design",
        "Testing + QA",
        "Deployment + CI/CD",
        "Admin dashboard",
        "1 month post-launch support",
      ],
    },
  ],

  testimonials: [
    {
      id: "t1",
      name: "KESWA Organisation",
      role: "Client — Community Platform",
      quote: "Clevis delivered a complete platform that transformed how we manage our membership and events. Professional, reliable, and technically excellent.",
      avatar: "KE",
    },
  ],

  skillLevels: [
    { skill: "Python / Django", level: 92 },
    { skill: "Next.js / React", level: 88 },
    { skill: "REST API design",  level: 90 },
    { skill: "TypeScript",       level: 80 },
    { skill: "Docker / CI/CD",   level: 78 },
    { skill: "Databases",        level: 82 },
  ],
}

export type SiteConfig  = typeof siteConfig
export type Project     = typeof siteConfig.projects[0]
export type Experience  = typeof siteConfig.experience[0]
export type Service     = typeof siteConfig.services[0]
export type SkillLevel  = typeof siteConfig.skillLevels[0]
