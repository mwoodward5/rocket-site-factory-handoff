# Rocket Site Factory — Lovable Handoff

This is the curated source of truth Woodward Software Systems is handing to Lovable.dev to build **Rocket Site Factory v2** — a Lovable-style site builder for local service businesses.

## What you (Lovable) should do, in order

1. Read `STRUCTURE.md` — what every folder is for.
2. Read `WIRING.md` — env vars, Supabase schema, edge function contracts, Stripe products.
3. Open `PROMPT.md` — the full build prompt with all hard rules.
4. Reuse `/providers/` and `/widget/` as-is. Do not rebuild them.
5. Pattern-match new templates against `/templates/`.
6. Honor the design rules in `/spec/`.
7. Build. Ship. Hand back the deployed URL + env var checklist.

## Hard rules — non-negotiable

- No fake reviews, ratings, customer counts, years in business, or awards. If a fact isn't verified, the UI hides it.
- Never use the words "scrape" or "crawl" anywhere in the product UI. Use "collect", "gather", "browse", "import".
- No emojis in product copy.
- Mobile-first at 375px.
- The pen-FAB `edit-widget.js` contract stays stable — live sites already depend on it.
- Git author for any commit is `woodwardsoftware@gmail.com`.

## What this is replacing

A Next.js + Vercel cockpit at `wss-dream-forge.vercel.app` that the operator (Sharie) rejected. The visual direction was right (the deployed reference sites in `/templates/` prove that) but the operator UI was wrong. Lovable v2 throws out the cockpit and rebuilds it as a Lovable-style three-column editor.

## The dashboards Lovable must deliver

1. **Operator cockpit** — three columns: left chat dock + site list, big middle preview, right inspector + tabs (Pages / SEO / Domains / Billing / Analytics / Activity).
2. **Client admin** — every published site has its own `/admin` with magic-link login, edit, Stripe billing, leads, AI assistant.
3. **60-second intake** — paste a URL, drop a photo, or click a checkbox to use Firecrawl + Bright Data + Places. Site appears in under 60 seconds.

— Sharie Woodward, Woodward Software Systems
