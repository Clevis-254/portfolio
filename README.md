# Portfolio

A full-stack developer portfolio with dual audience mode (recruiter / client), interactive project estimator, and AI-powered quote assistant.

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** + custom design tokens
- **Framer Motion** animations
- **next-themes** dark mode
- **Resend** contact form emails
- **Anthropic Claude API** (Phase 3 — AI quote assistant)

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.local.example .env.local
# Then edit .env.local and add your keys

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Customising your content

All personal content lives in one file: **`data/site.ts`**

Update the following:
- `siteConfig.name` — your full name
- `siteConfig.email` — your contact email
- `siteConfig.social` — your GitHub / LinkedIn / Twitter URLs
- `siteConfig.experience` — your work history
- `siteConfig.projects` — your projects (add real screenshots to `/public/projects/`)
- `siteConfig.services` — your freelance pricing

## Environment variables

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | From [resend.com](https://resend.com) — free tier is plenty |
| `ANTHROPIC_API_KEY` | From [console.anthropic.com](https://console.anthropic.com) — for Phase 3 AI assistant |

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Add your environment variables in the Vercel dashboard under Project → Settings → Environment Variables.

## Build phases

- ✅ **Phase 1** — Foundation, layout, hero, all sections (this package)
- 🔜 **Phase 2** — Interactive CV timeline + skills radar (D3.js)
- 🔜 **Phase 3** — Live code demo (Monaco) + AI quote assistant (Claude API)
- 🔜 **Phase 4** — Blog (MDX), SEO, analytics, custom domain
