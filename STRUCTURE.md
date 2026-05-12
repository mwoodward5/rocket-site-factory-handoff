# Structure - what every folder is for

> Read this first. Then read `UI_DIRECTION.md`, `SUPASTARTER_DREAMFORGE_INTEGRATION.md`, `WIRING_CONTRACT.md`, and `LOVABLE_MASTER_PROMPT.md`. Then build.

## Product Direction

This repository is a curated handoff for a new Lovable-native build of **Rocket Site Factory**.

The previous Vercel/DreamForge cockpit UI is rejected. Do not copy its dense debug-console layout, "AI council" panels, credit warnings, lane terminology, or generation-preflight screens. Use the old code only for architecture, provider wiring, data models, and cost/queue concepts.

The target product is:

- Lovable-style editor UX: left chat/site dock, center live preview, right inspector.
- Supastarter-style SaaS/admin foundation: auth, organizations, client access, billing, subscriptions, customer portal.
- DreamForge-style builder engine: kits, business intake, credit wallet, build jobs, optimization opportunities, chat patch previews, provider enrichment, and cost estimation.

## `/providers/`
**Tested API client wrappers - reuse the contracts and behavior.**

| File | What it does |
|---|---|
| `bright-data.ts` | Bright Data SERP API + business profile collection. Reads `BRIGHT_DATA_API_KEY` + `BRIGHT_DATA_ZONE=serp_api1`. |
| `brightlocal.ts` | BrightLocal local-citation data. Optional fallback. |
| `dataforseo.ts` | DataForSEO keyword + SERP data. Reads `DATAFORSEO_LOGIN` + `DATAFORSEO_PASSWORD`. |
| `envato.ts` | Envato stock-asset search. Optional. |
| `local-poster.ts` | Local file writer for generated assets. |
| `logo-normalizer.ts` | Cleans logo SVGs to a single inline form. |
| `prompt-builder.ts` | Composes image-gen prompts from a brief. |
| `provider-status.ts` | Health check for every provider. |
| `publish-gate.ts` | Pre-publish validator — runs before any site goes live. |
| `types.ts` | Shared TypeScript types — the contracts every provider returns. |
| `index.ts` | Barrel export. Import from here only. |

These files are TypeScript and assume a Node runtime. In Lovable/Supabase, port the contracts into `/supabase/functions/_shared/providers/` or the closest generated equivalent.

## `/source-maps/supastarter/`
**Billing, auth, subscriptions, customer portal, and account-management reference.**

These files come from the Supastarter boilerplate and show how the paid SaaS foundation is supposed to work. Preserve the concepts, not necessarily every path:

- Better Auth config: magic links, social login, passkeys, two-factor, organizations/collaborators.
- Stripe provider: checkout, customer portal, subscription updates, webhooks, purchases.
- Prisma schema: users, sessions, accounts, organizations, payments, and subscription-oriented records.
- UI references: pricing table and customer portal button.

Use this as the foundation for client accounts and billing in the Lovable app.

## `/source-maps/dream-forge-single-pass/`
**Builder engine, intake, queue, credits, and site-remix reference.**

These files come from the single-pass DreamForge prototype. The UI is not the target, but the concepts are:

- `TemplateKit`, `BusinessIntake`, `BuildJob`, `Wallet`, `Opportunity`, and `ChatPatch`.
- Template matching and build recipe generation.
- Credit and cost estimation.
- Queue-style build jobs.
- API shapes for build, chat, and wallet checkout.

Use this as the foundation for the site-builder engine, not as the visual design.

## `/widget/`
**The pen-FAB edit widget already deployed on live sites.**

`edit-widget.js` — vanilla JS, no framework, ~10KB. Loaded on every published site via:

```html
<script src="https://<your-domain>/widget/edit-widget.js"
  data-site-id="<slug>"
  data-factory="https://<your-domain>"
  defer></script>
```

It opens a side panel that talks to `/api/edit` on the factory backend. **Keep this contract stable** — already-deployed sites depend on it.

## `/templates/`
**Seven finished one-page reference sites. Pattern-match new templates against their visual language.**

Each subfolder is a complete static one-pager (HTML + CSS + hero image). They share these traits — every new template you build should too:

- Sticky nav, big Ken Burns hero (CSS animation, 20s scale 1.0 → 1.08 infinite alternate), trust strip, services grid, service area, about, contact.
- Per-industry palette + type pairing.
- Zero fake reviews/ratings/years/awards.
- Inline SVG favicon.
- JSON-LD `LocalBusiness` schema.
- Mobile-first at 375px.
- The `wss-dream-forge` edit widget injected before `</body>`.

| Folder | Industry | Use as starting point for |
|---|---|---|
| `tier1_hill_country_plumbing/` | Plumbing | Service trades (plumber, HVAC, electrician) |
| `tier1_desert_star_rv/` | RV service | Specialty mechanical / automotive |
| `tier2_848_property_services/` | Property services | Property mgmt, real estate ops |
| `tier2_hale_kanaka_electric/` | Electrical | Service trades alt palette |
| `ricardo_good_news_insulation/` | Insulation | Insulation / weatherization |
| `ricardo_favorite_tree_service/` | Tree service | Outdoor trades (tree, landscape, lawn) |
| `ricardo_mm_property_management/` | Concrete + multi-service | Multi-service exterior trades |

## `/spec/`
**Design system + admin spec - the source of truth for visual and functional decisions.**

- `KIT_ENGINE_SPEC.md` - kit/remix architecture, catalog, classifier, caching, and rollout plan.

## `/archive/`
**Extracted closeout context from prior DreamForge work.**

This folder contains local extraction/summarization of the DreamForge closeout PDF. Use it as background for provider wiring and status diagnostics. It is not the product UI.

## `/reference/`
**Real client briefs as examples of "what a complete brief looks like."**

Three briefs — Good News Insulation, Favorite Tree Service, M&M Property Management. Each shows the exact shape of verified data that flows from intake → site: phone, city, services, palette, hero direction. Match this shape for every new intake.
