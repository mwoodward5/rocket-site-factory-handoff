# Structure — what every folder is for

> Read this first. Then read `WIRING.md`. Then build.

## `/providers/`
**Tested API client wrappers — reuse, do not rebuild.**

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

These files are TypeScript and assume a Node runtime, which fits Supabase Edge Functions cleanly. Drop them into `/supabase/functions/_shared/providers/`.

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
**Design system + admin spec — the source of truth for visual & functional decisions.**

- `dreamforge_training_manual.md` — the operating manual for the whole factory. Hard rules, providers, gates, anti-patterns.

## `/reference/`
**Real client briefs as examples of "what a complete brief looks like."**

Three briefs — Good News Insulation, Favorite Tree Service, M&M Property Management. Each shows the exact shape of verified data that flows from intake → site: phone, city, services, palette, hero direction. Match this shape for every new intake.
