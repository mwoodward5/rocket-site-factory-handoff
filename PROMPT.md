# The Lovable.dev Prompt

> Paste everything below the line into Lovable.dev as your first message. Do not edit. Let it run.

---

You are building **Rocket Site Factory v2** for Woodward Software Systems — a Lovable-style site builder I sell to local service businesses (plumbers, tree services, insulation, property management, auto repair, etc.).

**Before you write a single line of code, read every file in this repo:**
- `README.md` — the brief in one page
- `STRUCTURE.md` — what every folder is for
- `WIRING.md` — env vars, Supabase schema, edge function contracts, Stripe products
- `/spec/` — design system + operating manual
- `/templates/` — 7 finished reference sites; pattern-match your visual language against them
- `/providers/` — tested API wrappers; reuse as-is, do not rebuild
- `/widget/edit-widget.js` — pen-FAB widget already deployed on live client sites; the contract stays stable
- `/reference/` — three real client briefs showing the shape of verified intake data

## Stack
Vite + React + TypeScript + Tailwind + shadcn/ui on the front. Supabase (auth, Postgres, storage, edge functions, RLS) on the back. Stripe for billing. OpenAI for chat + image. Firecrawl for site collection. Bright Data for SERP + business profile. Google Places fallback. Framer Motion for motion. Host on Lovable.

## Two faces

### A) Operator Cockpit (just me — `woodwardsoftware@gmail.com`, role `operator`)
**Three-column layout. Lovable-clone. No exceptions.**

- **Left column (320px, deep navy `#0A1628`):** avatar + "New Site" button up top. Searchable list of sites (logo thumb, business name, status pill). At the bottom, a **multimodal chat input**: text + paperclip (image upload) + mic (voice) + clipboard paste + drag-and-drop. A "+" button reveals checkboxes: ☐ Use Firecrawl ☐ Use Bright Data ☐ Use Google Places ☐ Generate hero image ☐ Generate logo. Drag-drop a photo onto the dock → OCR it (GPT-4o vision) → prefill the next message ("found brake repair shop at 123 Main St — build it?").
- **Middle column (flex-1):** giant live preview iframe of the selected site. Top bar: device toggle (desktop / tablet / mobile), URL bar with staging link, refresh, undo / redo, "Publish" button. Drag a file onto the preview → it gets attached to the current section.
- **Right column (380px, collapsible):** inspector for the selected section (color tokens, type scale, image swap, copy edit). Below that, a tabbed panel: **Pages | SEO | Domains | Billing | Analytics | Activity log**.

Visual direction for the cockpit: deep navy `#0A1628`, electric cyan accent `#3DD9D6`, near-white text `#F5F7FA`, Inter for UI, JetBrains Mono for code. Subtle glow on focused inputs. Cards lift 4px on hover. Think Linear meets Lovable.

### B) Client Admin (every site I publish gets `/admin` on its own domain)
Business owner logs in with magic-link. They see:
- **Edit my site** — same three-column editor as the cockpit, locked to their single site (RLS).
- **Billing** — Stripe Customer Portal embed (update card, see invoices, cancel).
- **Plan & add-ons** — current tier + toggles for add-ons (extra page, blog, online booking, AI chatbot widget, call tracking).
- **Leads** — form submissions + tracked calls in a single inbox.
- **AI Assistant** — a chatbot that helps them edit their site in plain English. Multimodal input.
- **Domain** — one-click flow that prints the exact DNS records they paste into their registrar.

Visual direction for the client admin: warm light `#FAF7F2`, navy text, single accent pulled from `sites.primary_color`. Inter throughout.

## The 60-second flow — make this magic actually work
1. I paste a URL, a Google Maps link, or drag a photo.
2. App OCRs the photo (GPT-4o vision) → pulls business name + phone.
3. In parallel: Firecrawl collects the existing site (if any), Bright Data fetches SERP + business profile, Google Places fills gaps.
4. `generate-image` makes a hero image matched to the industry.
5. `generate-logo` makes an SVG monogram if no logo was found.
6. App picks a template from `/templates/` based on industry.
7. New site row appears in my left dock + preview fills the middle column. Total: under 60 seconds.

## Templates — build 5 real ones in code, modeled on `/templates/`
- `service-trade` — plumber, electrician, HVAC
- `outdoor-trade` — tree, landscape, lawn, concrete
- `property` — property management, realty
- `auto` — mechanic, detail, brake repair
- `professional` — consultant, legal, financial

Each: sticky nav → Ken Burns hero (CSS scale 1.0 → 1.08 over 20s, infinite alternate) → trust strip (hidden when no verified data) → services grid → service area → about → contact form → footer. Per-industry palette + type pairing. JSON-LD `LocalBusiness` schema. Inline SVG favicon. Mobile-first 375px. The `wss-dream-forge` edit widget script injected before `</body>` on every published site.

## Hard rules — non-negotiable
- **No fake data.** No reviews, ratings, customer counts, years, awards unless verified. If unverified, hide the section.
- **Never use the words "scrape" or "crawl" in any UI copy.** Use "collect", "gather", "browse", "import".
- **No emojis** in product copy.
- **Mobile-first.** 375px works on every screen.
- **Dark mode** for the cockpit (default). Light mode for client admin (default). Both toggleable.
- **⌘K** opens a command palette (jump to any site, run any action).
- **The chat input must support text, image upload, clipboard paste, voice, and drag-and-drop.** That's the bar.

## Pricing — build these in Stripe on first run
- **Starter** $79/mo — one-page site, 1 form
- **Pro** $149/mo — up to 5 pages, AI assistant for client, lead inbox, blog
- **Business** $299/mo — everything + booking + AI chatbot widget + call tracking
- **Add-ons:** Extra page $20/mo · AI chatbot widget $49/mo · Booking $49/mo · Call tracking $29/mo

## What I want when you're done
1. Deployed Lovable URL.
2. Env var checklist (from `WIRING.md`) showing which I still need to paste.
3. A 5-line first-login guide.

**Build it. Ship it. Don't ask clarifying questions — make confident choices and ship.** If you have to pick between feature-complete-and-ugly vs. polished-and-missing-one-feature, pick polished. The cockpit's three-column layout and the 60-second magic flow are the two things that must work. Everything else is v1.1.

— Sharie, Woodward Software Systems
