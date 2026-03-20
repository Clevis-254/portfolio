# Deployment guide — clevisgikenyi.dev

Complete step-by-step guide to get your portfolio live on Vercel with a custom domain.

---

## 1. Prerequisites (5 minutes)

Make sure you have:
- [ ] Node.js 18+ installed (`node --version`)
- [ ] Git installed
- [ ] A GitHub account
- [ ] A Vercel account (free) — sign up at vercel.com with your GitHub

---

## 2. Set up environment variables locally

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
RESEND_API_KEY=re_...        # from resend.com (free)
ANTHROPIC_API_KEY=sk-ant-... # from console.anthropic.com (once your account opens)
```

Test locally first:

```bash
npm install
npm run dev
```

Open http://localhost:3000 — everything should work except the AI assistant (needs the API key).

---

## 3. Add your files to /public/

Before deploying, add these files:

| File | What it is |
|------|-----------|
| `public/cv.pdf` | Your CV — the download button links here |
| `public/projects/keswa.png` | Screenshot of KESWA (1200×630px ideal) |
| `public/projects/pontiro.png` | Screenshot of Pontiro |
| `public/favicon.ico` | Your favicon — generate at favicon.io |
| `public/icon.png` | 512×512px icon |
| `public/apple-touch-icon.png` | 180×180px for iOS |

---

## 4. Push to GitHub

```bash
# In the portfolio folder
git init
git add .
git commit -m "Initial portfolio — Phase 1-4"

# Create a new repo on github.com called 'portfolio', then:
git remote add origin https://github.com/Clevis-254/portfolio.git
git branch -M main
git push -u origin main
```

---

## 5. Deploy to Vercel

### Option A — Vercel CLI (fastest)

```bash
npm install -g vercel
vercel

# Follow the prompts:
# - Link to your GitHub account
# - Set up as new project
# - Framework: Next.js (auto-detected)
# - Root directory: ./  (leave default)
```

### Option B — Vercel dashboard

1. Go to vercel.com/new
2. Click "Import Git Repository"
3. Select your `portfolio` repo
4. Click "Deploy" — Vercel auto-detects Next.js

---

## 6. Add environment variables on Vercel

In your Vercel project dashboard:
Settings → Environment Variables → Add:

| Name | Value | Environments |
|------|-------|-------------|
| `RESEND_API_KEY` | `re_...` | Production, Preview |
| `ANTHROPIC_API_KEY` | `sk-ant-...` | Production, Preview |

Then redeploy: Deployments → ⋯ → Redeploy

---

## 7. Custom domain

### Buy the domain

Recommended registrars (cheapest for .dev):
- **Cloudflare Registrar** — cost price, no markup (~£10/yr)
- **Namecheap** — good UI, ~£11/yr
- **Google Domains** (now Squarespace) — easy but pricier

Go to one of these and buy: `clevisgikenyi.dev`

### Connect to Vercel

1. Vercel dashboard → your project → Settings → Domains
2. Add `clevisgikenyi.dev`
3. Vercel shows you DNS records to add — two options:

**If using Cloudflare (recommended):**
- Add a `CNAME` record: `@` → `cname.vercel-dns.com`
- Or use Vercel nameservers: `ns1.vercel-dns.com`, `ns2.vercel-dns.com`

**If using Namecheap / other:**
- Go to your registrar's DNS settings
- Add the records Vercel shows you (usually an A record + CNAME)

4. Wait 5–30 minutes for DNS to propagate
5. Vercel auto-provisions your SSL certificate (HTTPS) — free

---

## 8. Google Search Console (5 minutes, worth it)

Helps Google index your site faster and shows you search traffic.

1. Go to search.google.com/search-console
2. Add property → URL prefix → `https://clevisgikenyi.dev`
3. Verify via HTML tag — copy the verification code
4. Add it to `app/layout.tsx`:

```ts
verification: { google: 'your-code-here' },
```

5. Submit your sitemap: `https://clevisgikenyi.dev/sitemap.xml`

---

## 9. Post-launch checklist

- [ ] CV downloads correctly from the navbar
- [ ] Contact form sends emails (test it yourself)
- [ ] Dark mode works
- [ ] Both audience modes (recruiter / client) switch correctly
- [ ] Calendly embed shows your real availability
- [ ] Site loads fast on mobile (check in Chrome DevTools → Mobile)
- [ ] Share your URL on LinkedIn — check the OG preview looks right
- [ ] Submit sitemap to Google Search Console

---

## 10. Ongoing — what to update

Everything lives in `data/site.ts`. When you:

- **Get a new job** → add to `siteConfig.experience`
- **Ship a project** → add to `siteConfig.projects` + add screenshot to `/public/projects/`
- **Get a testimonial** → add to `siteConfig.testimonials`
- **Change your rates** → update `siteConfig.services`
- **Add your logo** → drop `logo.svg` into `/public/` and update `Navbar.tsx`

Then just `git push` — Vercel auto-deploys in ~30 seconds.

---

## Troubleshooting

**Build fails on Vercel:**
- Check the build log for TypeScript errors
- Make sure all env variables are set
- Run `npm run build` locally first to catch errors

**Contact form not sending:**
- Check `RESEND_API_KEY` is set in Vercel env vars
- Verify your domain in Resend dashboard (resend.com → Domains)
- Check the Vercel function logs (project → Functions tab)

**AI assistant not working:**
- `ANTHROPIC_API_KEY` not set or incorrect
- Check Vercel function logs for the error

**Calendly not showing:**
- Make sure your Calendly event type slug is `/30min`
- Check the URL: `https://calendly.com/clevisgikenyi/30min`
