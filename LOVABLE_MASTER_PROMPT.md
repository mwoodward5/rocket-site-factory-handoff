# Lovable Master Prompt

Paste everything below into a fresh Lovable project.

Replace `REPLACE_WITH_GITHUB_REPO_URL` with this handoff repo after pushing it to GitHub.

---

Before you start, clone and read this curated handoff repository fully:

`REPLACE_WITH_GITHUB_REPO_URL`

Read `STRUCTURE.md` first, then `WIRING_CONTRACT.md`, then `spec/KIT_ENGINE_SPEC.md`. The `providers/` folder contains tested provider wrapper patterns. The `templates/reference-sites/` folder contains real generated-site references. The `prompts/` folder contains the premium renderer and cinematic standards. Do not rebuild from the old Vercel cockpit UI. Build a fresh Lovable-native application using these files only as the source-of-truth reference.

Also read `REFERENCE_BUILDS.md`. The Ricardo URLs listed there are live reference builds that show current one-page local-business output. Use them to understand page rhythm, CTA placement, and service structure. Do not preserve Vercel as the hosting target.

Build me a production-grade web app called **Rocket Site Factory** for Woodward Software Systems.

This is a Lovable-style site builder for local service businesses. I am the operator. My clients log into their own dashboards to edit their site, manage billing, view leads, and use AI tools.

## Stack

- Framework: Vite, React, TypeScript, Tailwind, shadcn/ui
- Backend: Supabase auth, Postgres, storage, edge functions, RLS
- Payments: Stripe subscriptions and one-time add-ons
- AI: OpenAI for chat/content/image where configured
- Data collection: Firecrawl, Bright Data, Google Places
- Hosting: Lovable deploy

## Two Faces of the App

### Operator Cockpit

The cockpit must feel like a Lovable-style editor.

Three columns:

1. Left dock, 320px, dark:
   - avatar and New Site button
   - searchable site list
   - each row shows logo thumbnail, business name, and status pill: draft, live, paused, archived
   - bottom multimodal chat input with text, paperclip, mic, plus-menu
   - plus-menu checkboxes: Use Firecrawl, Use Bright Data, Use Google Places, Generate hero image, Generate logo

2. Center preview:
   - giant live preview iframe
   - top device toggle: desktop, tablet, mobile
   - staging URL bar
   - Open in new tab, refresh, undo, redo, Publish
   - file drag-drop onto preview attaches to selected section

3. Right inspector, 380px collapsible:
   - selected section controls
   - color tokens, type scale, image swap, copy editor
   - tabs: Pages, SEO, Domains, Billing, Analytics, Activity

### Client Admin

Each generated site has `/admin` on its own domain. The business owner logs in by email magic link.

Client admin includes:

- Edit my site
- Billing
- Plan and add-ons
- Leads
- AI Assistant
- Domain connection

RLS must lock clients to their own site only.

## Database

Use the tables in `WIRING_CONTRACT.md` exactly:

- profiles
- sites
- pages
- assets
- leads
- messages
- add_ons
- activity_log

## Edge Functions

Implement the edge functions in `WIRING_CONTRACT.md`:

- firecrawl-collect
- bright-data-enrich
- places-enrich
- generate-image
- generate-logo
- ai-edit
- publish-site
- create-checkout
- customer-portal
- stripe-webhook

## Magic Site Flow

This is the core product:

1. I paste a URL, Google Maps link, text brief, or upload a photo.
2. App extracts business name, phone, location, and service clues.
3. App runs selected data providers in parallel.
4. App chooses the best kit from the kit library.
5. App generates only the required deltas: hero headline, hero media, copy, schema, logo treatment.
6. App renders the site into the center preview.
7. I click Publish.
8. The client receives a login link for `/admin`.

Target preview time: under 60 seconds for normal one-page sites.

## Templates

Build at least five polished one-page template families:

- service-trade
- outdoor-trade
- property
- auto
- professional

Each template uses:

- sticky nav
- Ken Burns or cinematic hero
- trust strip that hides unverified facts
- services grid
- service area
- about
- contact form
- footer

Never invent reviews, ratings, years in business, awards, licenses, or guarantees. If unverified, hide the field.

## Brand Direction

Operator cockpit:

- deep navy `#0A1628`
- electric cyan `#3DD9D6`
- near-white `#F5F7FA`
- Inter UI
- JetBrains Mono for ids/logs
- Linear plus Lovable feel

Client admin:

- warm light `#FAF7F2`
- navy text `#0A1628`
- client accent color from `sites.primary_color`

Motion:

- Framer Motion
- 200ms slide-up page transitions
- subtle preview shimmer on refresh
- 4px card lift on hover

## Stripe Pricing

Create these products/prices on setup:

- Starter: $79/mo
- Pro: $149/mo
- Business: $299/mo
- Extra page: $20/mo
- AI chatbot widget: $49/mo
- Booking: $49/mo
- Call tracking: $29/mo

## Hard Rules

- No fake data.
- No fake reviews.
- No fake ratings.
- No fake awards.
- No customer-visible "scrape" or "crawl" wording.
- Use "collect," "gather," "fetch," "browse," or "import" instead.
- Mobile-first for all pages.
- Operator UI dark by default.
- Client admin light by default.
- Command palette on Cmd/Ctrl+K.
- Multimodal input must support file upload, image paste, and voice input.
- Provider failures must show clear operator messages and still allow manual completion.

## Done Criteria

When complete, I can:

1. Log in at `/login`.
2. Land in the operator cockpit.
3. Paste a business URL into the chat dock.
4. Check Firecrawl, Bright Data, and Generate Hero.
5. Get a generated preview in the middle pane.
6. Publish it.
7. Open the client `/admin`.
8. See billing, leads, editor, and AI assistant.

Return:

- deployed Lovable URL
- env vars I still need to paste
- five-line first-login guide
