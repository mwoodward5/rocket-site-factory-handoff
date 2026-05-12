# Lovable Master Prompt

Paste everything below into a fresh Lovable project.

The GitHub handoff repo is already filled in below.

---

Before you start, clone and read this curated handoff repository fully:

`https://github.com/mwoodward5/rocket-site-factory-handoff`

Read `STRUCTURE.md` first, then `UI_DIRECTION.md`, then `SOURCE_SCAVENGER_INVENTORY.md`, then `SUPASTARTER_DREAMFORGE_INTEGRATION.md`, then `WIRING_CONTRACT.md`, then `spec/KIT_ENGINE_SPEC.md`. The `source-maps/supastarter/` folder is the SaaS/admin/billing reference. The `source-maps/dream-forge-single-pass/` folder is the builder/queue/credit-wallet reference. The `providers/` folder contains tested provider wrapper patterns. The `templates/reference-sites/` folder contains real generated-site references. The `prompts/` folder contains the premium renderer and cinematic standards. Do not rebuild from the old Vercel cockpit UI. Build a fresh Lovable-native application using these files only as the source-of-truth reference.

Also read `REFERENCE_BUILDS.md`. The Ricardo URLs listed there are live reference builds that show current one-page local-business output. Use them to understand page rhythm, CTA placement, and service structure. Do not preserve Vercel as the hosting target.

Build me a production-grade web app called **DreamForge** for Woodward Software Systems.

The previous Vercel/DreamForge UI is rejected. It looked like a technical debug console and was not understandable as a real website builder. Do not copy that UI. The new product must feel like Lovable or better: visual, obvious, preview-first, chat-driven, and easy for a collaborator or customer to understand.

This is the Lovable-killer version of DreamForge: simpler front end, stronger intelligence behind it. The first user experience is not a dashboard. It is a single beautiful idea box: put your idea here, attach anything, speak if you want, choose Plan or Build, send. DreamForge should then take that rough idea and make it much better using the internal models, templates, provider data, remix library, and reasoning layer.

This is a site builder and marketing cockpit for local service businesses. I am the operator. My clients log into their own dashboards to edit their site, manage billing, view leads, buy credits, connect accounts, post to social media, generate branded images/videos, and use an AI website assistant.

I already have a large Lovable design library: roughly 80-178 paid/high-credit Lovable projects, templates, widgets, sections, and design experiments. Some individual templates cost 70+ Lovable credits. Treat that work as a valuable design asset library, not disposable history.

This app also needs a simple ticket-intake lane for Ricardo/PageHub-style build emails. It should be much simpler than the old Bulk Ops dashboard: one big prompt box, ticket queue, preview, and Start buttons. The operational goal is to receive 10-ish build/edit/domain tickets during the day, detect them, turn each into a clean build/remix packet, and drive Lovable with as few prompts/credits as possible.

## Stack

- Framework: Vite, React, TypeScript, Tailwind, shadcn/ui
- Backend: Supabase auth, Postgres, storage, edge functions, RLS
- Payments: Stripe subscriptions and one-time add-ons
- AI: OpenAI for chat/content/image where configured
- Data collection: Firecrawl, Bright Data, Google Places
- Connectors: OAuth-style account connections for social/media channels where configured
- Hosting: Lovable deploy

Architecture preference:

- Supabase is the app backend: auth, database, storage, edge functions, client admin, tickets, credits, leads, calls, connectors.
- Lovable is the builder/editor/deploy lane for Lovable-native projects.
- Vercel is optional source/reference/legacy infrastructure only, not the default UI or required hosting target for this Lovable rebuild.
- Local compute can assist ticket parsing, prompt QA, transcript cleanup, and planning through Ollama/OpenClaw/OpenCode-style local workers.

Use Supastarter's patterns as the SaaS reference: auth, magic links, passkeys, organizations/collaborators, user settings, billing settings, Stripe checkout, Stripe customer portal, subscriptions, purchases, and webhooks.

Use DreamForge's patterns as the builder reference: template kits, business intake, build jobs, wallet/credits, optimization opportunities, chat patch previews, template matching, recipe building, and cost estimation.

Use my existing Lovable projects as a template/remix library where possible. The app should support cataloging imported Lovable project links, screenshots, categories, credit cost/history, strengths, reusable sections, widgets, hero styles, and remix notes.

## Two Faces of the App

### Operator Cockpit

The cockpit must feel like Lovable itself, not like a DevOps dashboard.

First screen:

- dark Lovable-style sidebar
- "Created by me" / project gallery card grid
- search and simple filters
- large clean centered build prompt
- prompt box controls: `+` attachment button, Plan/Build selector, microphone, send button
- sidebar entries for Home, Search, Resources, Connectors, All projects, Starred, Created by me, Shared with me
- lower sidebar cards:
  - "Share Rocket Site" referral card: give away a clear reward such as two free pages or bonus credits when a referred business signs up
  - "Upgrade to Pro" card: unlock more pages, AI assistant, social posting, reports, call tracking, and growth recommendations
- no visible provider/debug clutter on the first screen

The main idea box should feel like:

- no clutter
- no grid of tools
- no boxes inside boxes
- no technical controls until Advanced is opened
- one obvious place to type or attach anything
- DreamForge improves the user's idea instead of making them configure every step

Add a simple ticket mode reachable from the same prompt box:

- paste email text, screenshots, files, URLs, or a Google Maps/business link
- optionally scan Gmail/Ricardo/PageHub tickets if Gmail OAuth/env is configured
- show a clean queue of tickets with Preview, Start, Skip, Done
- do not show the old grid of polling fields and debug metrics on the main screen

This clean build box is the most important UI element. It should feel like the reference Lovable home screen: obvious, calm, and ready for one instruction.

After a project is opened or generated, use the editor layout below.

Three columns:

1. Left dock, 320px, dark:
   - avatar and New Site button
   - searchable site list
   - each row shows logo thumbnail, business name, and status pill: draft, live, paused, archived
   - bottom multimodal chat input with the same simple pattern: text, `+`, Plan/Build, mic, send
   - advanced plus-menu checkboxes: Use Firecrawl, Use Bright Data, Use Google Places, Generate hero image, Generate logo

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
- Calls
- Growth recommendations
- AI Assistant
- Domain connection
- Connectors
- Social posts
- Media studio

The client admin must include a credit wallet. A client should be able to buy credits, ask the site assistant for a change, see a plain-English preview and credit cost, approve it, and have the change applied to their site.

The same credit wallet should power marketing actions:

- create a branded social post from a site section or offer
- generate a square image, story image, or short video concept
- schedule or publish to connected accounts when APIs are configured
- reuse the site's logo, palette, services, city, phone, and offers
- preview everything before charging credits or publishing

Phone calls are the primary business outcome. The app must treat calls as first-class proof:

- show calls and form leads together
- support optional Twilio/call tracking when configured
- show call-source, page/source campaign, timestamp, caller number when available, and status
- surface opportunities in plain English, for example: "Search interest is up 400% for emergency AC repair this month. Create a service page or post now."
- never promise ranking or calls unless the app can show supporting trend/source data; use "opportunity" language unless verified

## Template Library + Remix Assets

Build a template library that can ingest my existing Lovable work:

- Lovable project URL
- live preview URL
- screenshot/thumbnail
- title/name
- category/vertical
- style tags
- widgets/sections present
- credit cost if known
- whether public remixing is enabled
- notes about why the template is valuable

This library should let me:

- browse templates visually
- tag templates by industry, hero style, layout pattern, widget type, and quality
- mark a template as reusable, premium, experimental, or retired
- create a new site from a selected template kit
- mix sections from multiple templates into a new build plan
- preserve the original template as read-only source material

The app should not require rebuilding every design from scratch. It should help me remix and reuse expensive prior Lovable work intelligently.

RLS must lock clients to their own site only.

### Operator Ticket Intake

This is an operator-only workflow for incoming build/edit/domain tickets:

- manual paste first, Gmail sync optional
- optional cron/interval scan every 5 minutes during business hours when configured
- last 10-20 Ricardo/PageHub emails become ticket cards
- local parser/deterministic fallback should work even if hosted AI is disabled
- each ticket becomes a build packet: company, domain, source URL, requested changes, assets, credentials redacted, project match, recommended action
- operator can preview the packet before sending anything to Lovable
- one-pass remix prompt should be the default
- hard budget rule: aim for one Lovable prompt per site, two or three max only when visual fixes or publishing/domain confirmation require it
- prefer remixing/catalog templates over generating from scratch
- keep all credentials redacted in the UI and logs

Do not make this workflow look like a SOC dashboard. It should feel like Lovable's home prompt plus a clean ticket inbox.

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

Also include the Supastarter/DreamForge extension tables described in `SUPASTARTER_DREAMFORGE_INTEGRATION.md`:

- accounts or client_orgs
- subscriptions
- credit_purchases
- wallets
- wallet_ledger
- kits
- intakes
- build_jobs
- template_sources
- template_sections
- optimization_opportunities
- site_patch_previews
- connectors
- social_posts
- media_generations
- publishing_jobs
- call_events
- referral_rewards
- growth_opportunities

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
- connect-social-account
- generate-social-asset
- preview-social-post
- publish-social-post
- track-call-event
- create-referral-link
- dismiss-or-approve-growth-opportunity

## Magic Site Flow

This is the core product:

1. I paste a URL, Google Maps link, text brief, or upload a photo.
2. App extracts business name, phone, location, and service clues.
3. App runs selected data providers in parallel.
4. App chooses the best kit from the kit/template library.
5. If an imported Lovable template is the best match, app creates a remix plan from that template's reusable sections and style notes.
6. App generates only the required deltas: hero headline, hero media, copy, schema, logo treatment.
7. App renders the site into the center preview.
8. I click Publish.
9. The client receives a login link for `/admin`.

Target preview time: under 60 seconds for normal one-page sites.

## Ricardo/PageHub Ticket Flow

1. Operator opens Ticket Intake.
2. App scans Gmail or accepts pasted email blocks.
3. App parses build/edit/domain tickets into a small clean queue.
4. Operator previews the extracted business and request.
5. App matches the ticket to an existing Lovable project, imported template, or new build.
6. App creates a one-pass remix/build prompt using the best template source.
7. App opens/links the Lovable project lane for execution.
8. App tracks status: ready, running, needs visual pass, domain step, complete, blocked.
9. App generates a client/Ricardo completion report.

The workflow should support manual operator approval at each step. No blind destructive actions.

## Connector + Marketing Flow

This is the second product lane:

1. Client or operator opens Connectors.
2. They connect social/media accounts that are available in the environment.
3. The app stores connector metadata safely and never exposes tokens in the UI.
4. Client asks: "make a Facebook post for this week's spring AC tune-up offer" or "turn this service page into a social post."
5. App uses the site's verified brand data, logo, colors, services, city, phone, and live URL.
6. App generates a post preview, image/video preview, estimated credits, and destination accounts.
7. Client approves.
8. App charges credits, queues the publishing job, posts/schedules through the connector, and logs the result.

Build the connectors surface in a practical v1 way: UI, data model, preview flow, status states, and mock/safe provider adapters if real provider keys are missing. Do not block the whole app if a connector is not configured.

## Growth Recommendation Flow

This is how the product sells useful upgrades without feeling like a generic upsell:

1. App checks site data, leads, calls, search trend data, and connected channels.
2. App creates growth opportunity cards with proof and a clear action.
3. Opportunity examples:
   - "Calls are coming from the emergency service page. Add a stronger CTA block."
   - "Search interest for sump pump repair is rising locally. Create a focused page."
   - "Your tree trimming page has traffic but no calls this week. Test a sharper offer."
   - "You have not posted to Google Business Profile in 14 days. Generate a post."
4. Each card shows estimated credits, confidence, supporting evidence, and expected business value.
5. Client clicks Preview, sees the proposed page/post/edit, then approves credits.

The promise is not "we magically rank everything." The promise is: show the client where money is likely being left on the table, give a one-click improvement, and track whether it creates phone calls or leads.

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

Also build a `/cockpit/templates` surface that supports imported Lovable template sources and reusable section notes. Seed it with realistic examples showing expensive/high-quality templates, credit cost, vertical, and reusable section tags.

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

Credit-priced actions:

- small site edit: 1 credit
- blog/service page: 10 credits
- SEO/speed opportunity: 5-20 credits
- social post draft: 1 credit
- branded image: 2-5 credits
- short video concept/render placeholder: 5-20 credits depending on provider availability
- growth opportunity implementation: priced by preview

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
- Advanced/provider controls must be hidden behind menus or settings. The main product surface is a simple build/chat box plus preview.
- Connector failures must never lose content. Save the draft, surface the exact connector status, and allow copy/download fallback.
- Upgrade/referral cards must be tasteful and compact, like Lovable's sidebar cards, not loud banners.
- Call tracking and lead proof must be central to reports because phone calls are the main client ROI.
- Imported Lovable templates are source material. Do not overwrite originals; catalog, tag, and remix them into reusable kits.
- Ticket intake must stay simple. The main interface is the big prompt box plus a clean queue, not a polling/debug console.
- Budget rule: default to remix + one-pass prompt. Two or three prompts max per site unless the operator explicitly overrides.
- Local LLM support is allowed for parsing, prompt compression, and QA when configured, but the app must still work with deterministic parsing.

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
9. Buy credits in the client admin.
10. Ask for a blog/service page/photo/SEO upgrade and see a credit-priced preview before approving.
11. Connect or simulate a social channel in Connectors.
12. Generate a branded social post from a site/page and preview the credit cost before publishing.
13. See compact sidebar cards for referral rewards and Pro upgrades.
14. See growth recommendations tied to leads, calls, search trends, and site opportunities.
15. Import/catalog Lovable templates and create a new build plan from one or more reusable template sections.
16. Paste or scan Ricardo/PageHub emails and turn them into clean remix/build tickets with one-pass prompts.

Return:

- deployed Lovable URL
- env vars I still need to paste
- five-line first-login guide
