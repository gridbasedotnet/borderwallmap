# borderwallmap — See the Impact

Interactive map of GPS-tagged field footage from Big Bend National Park.
Live site: **[map.defendbigbend.com](https://map.defendbigbend.com)**
Campaign site: [defendbigbend.com](https://www.defendbigbend.com)

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Local Development](#local-development)
3. [Deployment Guide](#deployment-guide)
4. [Content Editing](#content-editing)
5. [Email List Setup](#email-list-setup)
6. [Donation Setup](#donation-setup)
7. [Analytics Toggle](#analytics-toggle)
8. [Pre-launch Checklist](#pre-launch-checklist)
9. [DNS Records Reference](#dns-records-reference)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (static export) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 (custom canyon/taupe palette) |
| Mapping | Leaflet 1.9 + react-leaflet |
| Backend | Supabase (PostgreSQL) |
| Animations | Framer Motion |
| Native app | Capacitor 8 (iOS) |
| Analytics | Plausible (optional, env-toggled) |

---

## Local Development

### Prerequisites

- Node.js 18+ and npm
- A Supabase project (free tier works for development)

### Setup

```bash
# 1. Clone
git clone https://github.com/gridbasedotnet/borderwallmap.git
cd borderwallmap

# 2. Install dependencies (includes prettier)
npm install

# 3. Configure environment
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# 4. Start dev server
npm run dev
# → http://localhost:3000
```

### Useful Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build (outputs to `/out`) |
| `npm run lint` | ESLint check |
| `npm run typecheck` | TypeScript type check (no emit) |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting without writing |

---

## Deployment Guide

The site is configured for **static export** (`output: "export"` in `next.config.mjs`),
so the build produces a fully static `/out` directory that works on any static host.

### Option A — Vercel (recommended)

1. Import the repo at [vercel.com/new](https://vercel.com/new).
2. Set the **Framework Preset** to **Next.js**.
3. Add environment variables (see [Environment Variables](#environment-variables) below).
4. Deploy. Vercel detects the static export automatically.
5. Assign your custom domain in **Settings → Domains**.

> Note: Because this is a static export, Vercel Edge Functions and ISR are not used.

### Option B — Netlify

1. Connect the repo in the Netlify dashboard.
2. Build command: `npm run build`
3. Publish directory: `out`
4. Add environment variables in **Site settings → Environment variables**.
5. Add a `netlify.toml` if you need custom redirect rules.

### Option C — AWS S3 + CloudFront

```bash
# Build
npm run build

# Sync to S3
aws s3 sync out/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

Configure the S3 bucket for static website hosting and set `index.html` as the default document and error document.

### Environment Variables

Copy `.env.local.example` to `.env.local` for local dev.
Set these in your hosting provider's dashboard for production:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public API key |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Service role key (server-side only, not needed for static export) |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical URL, e.g. `https://map.defendbigbend.com` |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | No | Plausible domain to enable analytics (see [Analytics Toggle](#analytics-toggle)) |

---

## Content Editing

### Adding a New Field Video

Videos live in Supabase. Each row in the `impact_videos` table represents one map pin.

**Schema:**

```sql
create table impact_videos (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  latitude      double precision not null,
  longitude     double precision not null,
  altitude_m    double precision,
  video_url     text not null,   -- relative path within the Supabase bucket
  recorded_at   timestamptz,
  created_at    timestamptz default now()
);
```

**Steps:**

1. Upload the video file to your Supabase Storage bucket (e.g. `impact-videos`).
2. Note the file path returned by the upload (e.g. `footage/big-bend-canyon.mp4`).
3. Insert a row in the `impact_videos` table via the Supabase dashboard or SQL:

```sql
insert into impact_videos (title, description, latitude, longitude, altitude_m, video_url, recorded_at)
values (
  'Santa Elena Canyon',
  'Looking east along the Rio Grande at the mouth of Santa Elena Canyon.',
  29.1675, -103.6091, 610,
  'footage/santa-elena-canyon.mp4',
  '2026-01-15T14:30:00Z'
);
```

4. The map will show the new pin immediately (data loads on page mount).

### Updating the Border Wall Route Data

The wall route overlay is generated from CBP's ArcGIS feature service.
The data lives in `src/lib/wall_routes.ts` (a large auto-generated TypeScript file).

To refresh it:

```bash
# Requires Python 3 + pip
cd scraper
pip install playwright requests
playwright install chromium

python scrape_cbp_wall.py
# Outputs updated wall_routes.ts — move it to src/lib/
mv wall_routes.ts ../src/lib/wall_routes.ts
```

### Editing Page Copy

| What | Where |
|---|---|
| Site title & description | `src/app/layout.tsx` → `metadata` |
| Hero title / action bar | `src/components/SeeTheImpactContent.tsx` |
| About / Info modal text | `src/components/InfoModal.tsx` |
| Email sign-up modal | `src/components/EmailCTA.tsx` |
| Video submission instructions | `src/app/submit/page.tsx` |
| Footer links | `src/components/Footer.tsx` |
| Privacy policy | `src/app/privacy/page.tsx` |
| Terms of service | `src/app/terms/page.tsx` |

### Adding an Open Graph Image

Place a `1200×630` PNG at `public/og-image.png`.
Next.js will serve it at `/og-image.png` and it will be picked up by the metadata in `layout.tsx`.

---

## Email List Setup

Email sign-ups are stored in a Supabase `petitions` table.

### Create the Table

Run this in the Supabase SQL editor:

```sql
create table petitions (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  first_name text not null default '',
  last_name  text not null default '',
  zip_code   text not null default '',
  created_at timestamptz default now()
);

-- Allow anonymous inserts (the site does not require login)
alter table petitions enable row level security;

create policy "Anyone can sign up"
  on petitions for insert
  to anon
  with check (true);
```

### Exporting Signups

In the Supabase dashboard: **Table Editor → petitions → Export CSV**.

Or via the CLI:

```bash
supabase db dump --data-only -t petitions > petitions.csv
```

### Connecting an Email Service

To send welcome or update emails, connect your Supabase project to an email provider:

- **Resend** — add a Supabase webhook on `petitions` INSERT that calls a Resend API endpoint.
- **SendGrid / Mailchimp** — use a Supabase Edge Function or Zapier to sync new rows.

Contact email for the campaign: **hello@defendbigbend.com**

---

## Donation Setup

The site does not currently have an inline donation widget. To add one:

1. **Donate button in `SeeTheImpactContent.tsx`** — add a link styled like the existing "About" or "Submit Video" buttons pointing to your fundraising page (e.g. ActBlue, Every.org, Stripe Payment Link).
2. **Footer link** — add a "Donate" anchor in `src/components/Footer.tsx`.

Example ActBlue button:

```tsx
<a
  href="https://secure.actblue.com/donate/your-campaign"
  target="_blank"
  rel="noopener noreferrer"
  className="..."
>
  Donate
</a>
```

---

## Analytics Toggle

Analytics use [Plausible](https://plausible.io) — a privacy-first, cookie-free tracker.

### Enable

Set the environment variable to your Plausible site domain:

```bash
# .env.local
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=map.defendbigbend.com
```

The script tag is injected automatically in `src/app/layout.tsx` when this variable is set.

### Disable

Leave `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` blank or unset. No script will be loaded.

### Self-hosted Plausible

If you run your own Plausible instance, update the `src` URL in `layout.tsx`:

```tsx
src="https://your-plausible-instance.com/js/script.js"
```

### Alternative: Google Analytics / gtag.js

Replace the Plausible `<script>` block in `layout.tsx` with your GA4 snippet, gated on a `NEXT_PUBLIC_GA_MEASUREMENT_ID` variable.

---

## Pre-launch Checklist

### Infrastructure

- [ ] Supabase project created and URL/keys added to production env vars
- [ ] `impact_videos` table created and seeded with initial footage
- [ ] `petitions` table created with RLS policy
- [ ] Storage bucket created and public read access enabled for video files
- [ ] Production environment variables set in hosting provider dashboard

### SEO & Metadata

- [ ] `public/og-image.png` created (1200×630 px)
- [ ] `NEXT_PUBLIC_SITE_URL` set to canonical production URL (no trailing slash)
- [ ] `public/sitemap.xml` `<lastmod>` dates updated
- [ ] `public/robots.txt` sitemap URL matches production domain
- [ ] Verify Open Graph tags with [opengraph.xyz](https://www.opengraph.xyz) or [metatags.io](https://metatags.io)
- [ ] Verify Twitter Card with [cards-dev.twitter.com/validator](https://cards-dev.twitter.com/validator)

### Analytics

- [ ] Plausible site created (or GA4 property set up)
- [ ] `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` set in production env vars
- [ ] Verify analytics script loads on production

### Content

- [ ] All map pins tested — video playback works
- [ ] "Submit Video" email template verified
- [ ] Privacy policy and Terms of Service reviewed by counsel
- [ ] Footer links resolve correctly
- [ ] "Learn more at defendbigbend.com" link is current

### Performance & QA

- [ ] Run `npm run build` locally — zero errors and zero type errors (`npm run typecheck`)
- [ ] Run `npm run format:check` — no formatting issues
- [ ] Test on mobile (iOS Safari + Android Chrome)
- [ ] Test with slow 3G throttling — map loads within 5 s
- [ ] Lighthouse score > 90 for Performance, Accessibility, Best Practices, SEO
- [ ] Check HTTPS redirect is active on production domain

### DNS

- [ ] DNS records propagated (use [whatsmydns.net](https://www.whatsmydns.net))
- [ ] SSL certificate issued and valid
- [ ] `www` redirects to apex (or vice-versa, consistently)

---

## DNS Records Reference

Replace `YOUR_HOST_IP` / `YOUR_CNAME_TARGET` with values from your hosting provider.

### Vercel

| Type | Name | Value | TTL |
|---|---|---|---|
| `A` | `@` | `76.76.21.21` | 3600 |
| `CNAME` | `www` | `cname.vercel-dns.com` | 3600 |
| `CNAME` | `map` | `cname.vercel-dns.com` | 3600 |

### Netlify

| Type | Name | Value | TTL |
|---|---|---|---|
| `A` | `@` | `75.2.60.5` | 3600 |
| `CNAME` | `www` | `your-site.netlify.app` | 3600 |
| `CNAME` | `map` | `your-site.netlify.app` | 3600 |

### Email (hello@defendbigbend.com)

Configure these in your DNS provider alongside the web records:

| Type | Name | Value | Priority |
|---|---|---|---|
| `MX` | `@` | Your mail provider's MX record | 10 |
| `TXT` | `@` | `v=spf1 include:your-provider.com ~all` | — |
| `TXT` | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:hello@defendbigbend.com` | — |
| `CNAME` | `mail._domainkey` | DKIM key from your mail provider | — |

> Exact values depend on your email provider (Google Workspace, Fastmail, Resend, etc.).
> Check their DNS setup guide for the authoritative records.
