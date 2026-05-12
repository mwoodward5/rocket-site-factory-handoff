# Source Scavenger Inventory

This is the 30,000-foot source map for DreamForge. Mine these sources for contracts, patterns, prompts, providers, and reusable design assets. Do not copy rejected UI wholesale.

## Build Rule

Use prior work as a parts library:

- Keep: auth, billing, credits, providers, queues, template catalogs, lead/call proof, social connector logic, prompt libraries, reference site patterns.
- Avoid: the rejected Vercel/DreamForge debug-console UI, dense preflight pages, raw system jargon, and any screen where a customer cannot tell what to click next.
- Target: a simpler-than-Lovable idea box first, then a visual editor and customer admin.

## Highest-Value Sources

| Source | Role | Mine For | Avoid |
|---|---|---|---|
| `wss-ai-rocket-control` / WSS Visibility | Supastarter-based SaaS and WSS AI engine integration | Better Auth patterns, organizations, Stripe provider, customer portal, wallet routes, credit packs, provider status, WSS engine providers, blocks | Old Vercel operator UI as primary UX |
| `wss-ai-engine-drop` | Standalone WSS AI engine package | Provider wrappers, orchestrator, seed templates, credit actions, hero/contact blocks | Vercel deploy assumptions |
| `open-lovable-cloud-export` and `open-lovable` | Lovable-like builder/export experiments | Project launcher, saved projects, design packs, generated outputs, quality gates | Any stale cloud/deploy assumptions |
| `ad-alchemy-studio-43` | Social/connectors/ads/credits platform | Facebook, LinkedIn, X/Twitter, TikTok, YouTube OAuth functions, social-post flow, Reels studio, credit widgets, Stripe migrations, lead responder | Marketplace-specific UI/copy that does not fit local website clients |
| `lovable-bulk-ops-command-center` | Bulk Lovable operations and generated client repo cache | Local-first orchestration, GitHub-connected client builds, Ricardo ticket reports, screenshot/log conventions, generated site repos | Bulk-ops dashboard as customer UI |
| `rocket-craft-os` | TanStack template/prompt prototype | Template route, prompt library docs, Supabase auth middleware | Framework-specific assumptions unless useful |
| `rocket-mission-build` | Template catalog and build-ticket handoff | Template seeder, catalog APIs, Firecrawl server helper, site template cards/mockups, lead data | Any unfinished UI polish |
| Paid Lovable design library | Design asset moat | 80-178 paid Lovable projects, high-credit templates, hero styles, widgets, section ideas, screenshots, remix notes | Overwriting originals or rebuilding from scratch when remixing is cheaper |

## GitHub Breadcrumbs

Relevant repos discovered by name:

- `mwoodward5/wss-ai-rocket-control`
- `mwoodward5/wss-ai-engine-drop`
- `mwoodward5/wss-ai-branding`
- `mwoodward5/wss-ai-integration`
- `mwoodward5/rocket-site-factory-openlovable-v3`
- `mwoodward5/rocket-search-insights`
- `mwoodward5/rocket-serps-studio`
- `mwoodward5/lovable-bulk-ops-command-center`
- `mwoodward5/lovable-factory-agent`
- `mwoodward5/Dream-forge-code`
- generated client repos such as `m-m-property-planner`, `artesanal-grill-site`, `digi-dream`, `mantra-zen-forge`, `sitecraft-ai-38`, `site-sculptor-33`, and related one-page builds

Private repos may need to be connected or manually copied into source maps before Lovable can read them.

## Specific Parts To Pull Forward

### SaaS / Billing / Admin

From WSS Visibility / Supastarter:

- Better Auth style login, magic link, passkeys, organizations, collaborators.
- Stripe checkout, customer portal, subscription records, webhooks.
- Credit packs and wallet routes.
- Customer settings and billing pages.

### Builder Engine

From WSS AI engine and DreamForge:

- Provider registry and provider health checks.
- Bright Data, Firecrawl, Pexels, OpenAI image, Veo, Resend, Stripe wrappers.
- Template seed data and credit action seed data.
- Orchestrator, blocks, hero/contact components.
- Publish gates and status diagnostics.

### Template / Remix Library

From Lovable projects and generated repos:

- Thumbnails and screenshots.
- Project/live URLs.
- Credits used when known.
- Public remix setting when known.
- Industry/category/style tags.
- Reusable section notes: hero, service grid, gallery, CTA, form, footer, widget.
- Quality flags: reusable, premium, experimental, retired.

### Connectors / Social / Media

From Ad Alchemy:

- OAuth functions for Facebook, LinkedIn, X/Twitter, TikTok, YouTube, Nextdoor.
- Social post generation and publishing modal concepts.
- Reels/media studio credit widget.
- Add-on marketplace and billing upgrade surfaces.
- Lead responder and lead scoring functions.

### Proof / ROI

From bulk ops, reports, and site systems:

- Lead table and lead detail modal concepts.
- Call tracking placeholders and Twilio-ready data model.
- Search/SEO opportunity cards.
- Before/after reports and screenshot proof.
- Growth recommendation cards that cite evidence instead of making unsupported promises.

## Product Shape

The final app should combine these sources like this:

1. DreamForge home: sidebar, gallery, one giant idea box, plus button, Plan/Build, mic, send.
2. Visual editor: left site/chat dock, center preview, right inspector.
3. Client admin: edit site, leads, calls, billing, buy credits, connectors, social, growth recommendations.
4. Template library: import Lovable project URLs and catalog high-value templates.
5. Growth engine: proof-backed opportunities tied to calls, leads, search trends, and connected channels.

## From-Scratch vs Remix Recommendation

Start the Lovable build as a fresh project.

Reason: the old Vercel/DreamForge UI is rejected and remixing it risks inheriting the wrong product shape. The repo and this inventory provide source truth without forcing that UI into the new build.

Use remixing later for specific imported Lovable design templates, not for the core app shell.
