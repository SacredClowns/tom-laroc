# Deploying tomlaroc.com (Vercel)

Next.js 15 app — Vercel auto-detects everything. No `vercel.json` needed.

## 1. Connect the repo
1. Go to **vercel.com → Add New → Project**.
2. Import the GitHub repo **SacredClowns/tom-laroc**.
3. Framework preset: **Next.js** (auto). Build command, output dir: leave default.
4. Click **Deploy**. First deploy works with zero env vars (uses safe fallbacks).

## 2. Environment variables (Project → Settings → Environment Variables)

All optional for a first deploy; add when ready. Values for **Production**:

| Variable | What it does | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, OG | `https://tomlaroc.com` |
| `RESEND_API_KEY` | Sends inquiry + outreach emails | resend.com (free) |
| `INQUIRY_TO` | Inbox that receives leads | `brookeganster75@gmail.com` |
| `INQUIRY_FROM` | Email "from" address | `Tom Laroc <inquiries@tomlaroc.com>` (verify domain in Resend) |
| `ADMIN_PASSWORD` | Login for `/admin` | **change from default** |
| `ADMIN_TOKEN` | Admin session cookie value | long random string |
| `SUPABASE_URL` | Durable lead/subscriber storage | free Supabase project (optional) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase server key | server-only; never expose |

> ⚠️ On Vercel the filesystem is read-only, so the local `.data` store won't persist.
> Add **Supabase** (free) for leads/subscribers to survive in production. Run
> `supabase/schema.sql` in the Supabase SQL editor first.

## 3. Custom domain
1. Vercel → Project → **Settings → Domains → Add** `tomlaroc.com` (and `www`).
2. Point DNS as Vercel instructs (A / CNAME).
3. Set `NEXT_PUBLIC_SITE_URL=https://tomlaroc.com` and redeploy.

## 4. After launch
- Submit `https://tomlaroc.com/sitemap.xml` in Google Search Console.
- Create a free Google Business Profile (Miami) for local SEO.
- In Resend, verify the `tomlaroc.com` domain so auto-replies reach anyone.
