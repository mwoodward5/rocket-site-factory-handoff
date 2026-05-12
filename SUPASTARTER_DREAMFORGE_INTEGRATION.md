# Supastarter + DreamForge Integration Map

This is the source-truth integration plan for DreamForge.

## Product Decision

DreamForge is now a Lovable-built product, but the architecture should preserve the best pieces from prior systems while hiding their complexity behind one simple idea box.

Product thesis:

- User enters an idea, URL, ticket, image, or pile of assets.
- DreamForge reasons over it, improves it, chooses the right kit/template/source data, and builds.
- The interface is simpler than Lovable; the internal system is more capable.
- No visible wall of tools, boxes, debugging controls, or provider settings on the primary screen.

1. **Supastarter** is the SaaS foundation:
   - authentication
   - magic links
   - passkeys
   - organizations/collaborators
   - user and organization settings
   - Stripe checkout
   - Stripe customer portal
   - subscriptions
   - purchase records
   - billing pages
   - webhooks

2. **DreamForge** is the site-building layer:
   - template kits
   - imported Lovable template/source library
   - bulk intake
   - build queue
   - credit wallet
   - site-builder chat
   - customer edit assistant
   - Bright Data / Firecrawl / Places enrichment
   - cinematic hero and media generation
   - local-business page generation

3. **Connectors + Marketing Credits** is the customer growth layer:
   - account connections for social/media channels
   - branded social posts
   - image and short-video generation
   - scheduling or publish jobs when provider APIs are configured
   - copy/download fallback when connectors are missing
   - credit-priced previews before publishing

4. **Proof + Upgrade Intelligence** is the revenue layer:
   - phone calls and form leads as the core KPI
   - compact referral and upgrade cards in the sidebar
   - growth opportunity cards backed by trend/search/lead/call evidence
   - credit-priced implementation previews
   - tasteful Pro upgrade prompts, not loud banners

5. **Lovable Design Library** is the asset moat:
   - 80-178 existing paid Lovable projects/templates/widgets/sections
   - template credit cost and project settings as useful metadata
   - reusable hero, section, widget, layout, and style patterns
   - read-only cataloging so originals are not overwritten
   - remix plans that combine the best reusable parts into new kits

6. **Ticket Intake + Local Planning** is the operator lane:
   - Gmail/Ricardo/PageHub ticket scanning when configured
   - manual paste fallback
   - local LLM/Ollama/OpenClaw planning where available
   - deterministic parser fallback when local AI is unavailable
   - remix-first, one-pass prompt generation
   - two or three Lovable prompts max unless operator overrides

The old Vercel cockpit UI is rejected. Do not copy it.

## UI Standard

The UI must be easier than the rejected Vercel cockpit and closer to Lovable itself:

- home screen: dark left sidebar plus a clean central prompt box
- prompt box: `+` attachment, Plan/Build selector, microphone, send
- one obvious idea box, not a tool grid
- created-by view: gallery cards with real thumbnails and search/filter controls
- connector entry in the sidebar, matching Lovable's simple connectors area
- compact lower-sidebar referral/upgrade cards, like Lovable's "Share Lovable" and "Upgrade to Pro"
- left dock: site list + chat
- center: live editable preview
- right: inspector
- obvious primary action
- fewer dense cards
- no giant wall of system/debug panels
- no operator-only jargon in the customer admin
- client admin must feel like a small business owner can use it

Default rule: hide complexity until it is needed. Bright Data, Firecrawl, provider costs, queues, and diagnostics are operator controls, not first-screen clutter.

The ticket inbox must also stay simple. It should feel like Lovable's prompt box plus a clean list of extracted jobs, not the old Bulk Ops polling dashboard.

## Supastarter Features to Preserve

From `source-maps/supastarter/`:

- Better Auth style config with magic link, passkey, Google auth, account settings, and organizations.
- Stripe provider wrapper with checkout, portal, subscription updates, deletion handling, and webhook verification.
- Pricing table and customer portal components.
- Purchase model: one-time and subscription records tied to user or organization.
- Organization invitation model for collaborators/customer access.

In Lovable/Supabase terms:

- Supastarter `User` maps to `profiles`.
- Supastarter `Organization` maps to `accounts` or `client_orgs`.
- Supastarter `Purchase` maps to `subscriptions`, `credit_purchases`, and `wallet_ledger`.
- Supastarter `CustomerPortalButton` maps to `/admin/billing`.

## DreamForge Features to Preserve

From `source-maps/dream-forge-single-pass/`:

- `TemplateKit`
- `BusinessIntake`
- `BuildJob`
- `Wallet`
- `Opportunity`
- `ChatPatch`
- `pickTemplate`
- `buildRecipe`
- `estimateForTier`
- `previewChatPatch`

In Lovable/Supabase terms:

- `TemplateKit` becomes `kits`.
- `BusinessIntake` becomes `intakes`.
- `BuildJob` becomes `build_jobs`.
- `Wallet` becomes `wallets` plus `wallet_ledger`.
- `Opportunity` becomes `optimization_opportunities`.
- `ChatPatch` becomes `site_patch_previews`.

## Lovable Template Library

The user has a large paid Lovable template/design library. Preserve it as a reusable source system:

- `template_sources` stores Lovable project URLs, live URLs, thumbnails, credit cost, category, tags, and remix status.
- `template_sections` stores reusable section notes such as hero, services, gallery, CTA, widget, form, footer, and animation style.
- Imported templates are read-only source material.
- New builds can choose a single source template or combine sections from several templates.
- Remix plans should explain which source sections are being reused and which deltas will be generated.

This is how the system gets cheaper over time: do not pay to rediscover the same design ideas. Catalog them, tag them, and reuse them.

## Ticket Intake Flow

1. Operator pastes email text/files/screenshots or enables Gmail sync.
2. Optional scan runs every 5 minutes during business hours when configured.
3. App extracts ticket cards: company, task type, domain, source URL, assets, requested changes, project match, risk, and recommended next action.
4. App redacts credentials from visible UI/logs.
5. Operator previews the generated build/remix packet.
6. App chooses an imported template or kit.
7. App creates one master Lovable prompt for the project.
8. Operator starts the Lovable lane and tracks ready/running/needs visual pass/domain step/complete/blocked.
9. App generates a clean completion report for Ricardo/client.

Budget rule: one prompt is the target. Two or three prompts max per site unless the operator explicitly overrides.

Local compute rule: use Ollama/OpenClaw/local models for email parsing, summary, QA, and prompt compression when configured. Do not make the whole product depend on hosted AI for routine parsing.

## Customer Flow

1. Operator creates or imports a business.
2. System builds the first site from a kit.
3. Operator publishes the site.
4. Operator adds the client's email as owner/collaborator.
5. Client receives a magic link.
6. Client logs into `/admin`.
7. Client sees site stats, leads, billing, credits, and edit assistant.
8. Client buys credits.
9. Client asks the site assistant for blog pages, photo swaps, service pages, SEO upgrades, or conversion improvements.
10. The assistant creates a preview and credit cost.
11. Client approves.
12. System applies the change, logs it, and updates the site.

The same flow should later be exposed to customers through the Supastarter account layer. That is the long-term advantage over using Lovable alone: Lovable is strong for operator builds, but Rocket Site Factory wins when each client has their own editable site, credit wallet, leads, billing, reports, and assistant without seeing or needing Lovable.

## Connector Flow

1. Operator or client opens Connectors.
2. They connect a supported channel, or the app shows "not configured yet" with a copy/download fallback.
3. The app stores connector metadata and token status, not raw tokens in the visible UI.
4. Client asks the assistant for a post, image, or short video idea.
5. Assistant builds from verified site data: logo, palette, service, city, phone, live URL, offer, and lead CTA.
6. App previews copy, image/video, destinations, schedule, and credit cost.
7. Client approves.
8. App spends credits, creates a publishing job, and logs result.

The first version may use safe mock adapters for connector actions while preserving the final data model and UI. The core rule is that no content is lost if a connector is unavailable: save the draft and offer copy/download.

## Proof + Upgrade Flow

1. Site receives calls, forms, visits, or connected-channel activity.
2. App stores proof events: lead source, call source, page URL, timestamp, and outcome when available.
3. App checks for simple growth opportunities.
4. App shows a compact card:
   - evidence
   - why it matters
   - recommended action
   - estimated credits
   - Preview button
5. Client previews the page/post/edit.
6. Client approves credits.
7. App applies the change and later reports whether calls/leads improved.

Examples:

- "Search interest for emergency AC repair is up locally. Create a focused page."
- "This service page has traffic but no calls this week. Tighten the CTA."
- "You have not posted to Google Business Profile recently. Generate a branded post."
- "Referral reward: share Rocket Site and get two free pages or bonus credits when a new business signs up."

Avoid unprovable promises. Say "opportunity" unless the app can show evidence.

## Billing/Credit Model

Subscriptions:

- Starter: one-page site, basic leads, basic edits
- Pro: multi-page site, AI assistant, lead inbox, blog/content credits
- Business: booking, chatbot widget, call tracking, advanced reports

Credit examples:

- small text/photo edit: 1 credit
- blog article/service page: 10 credits
- speed/SEO optimization pass: 5-20 credits depending on scope
- cinematic hero/media generation: provider-cost aware, preview before charge
- social post draft: 1 credit
- branded image: 2-5 credits
- short video concept/render: 5-20 credits depending on provider availability
- growth recommendation implementation: priced by preview

The client should understand credits as simple dollars. Internally the system tracks actual provider cost and margin.

## Provider Status Must Exist

The closeout PDF showed why provider diagnostics matter. The Lovable app needs a visible provider status page:

- Bright Data configured?
- Bright Data zone correct?
- Firecrawl configured?
- OpenAI configured?
- Pexels configured?
- Stripe configured?
- Google Places configured?
- DataForSEO optional configured?

Every provider should have:

- status pill
- last test time
- estimated test cost
- short error text
- safe test button

## Rejected UI Note

Do not recreate the Vercel `/generation` page shown in screenshots. It is too dense, too technical, and not understandable for customers or collaborators.

The desired product is a real front-end builder, not a debugging console.
