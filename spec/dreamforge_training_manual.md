# Dream Forge — Operator Training Manual (May 2026)

> **Audience:** Codex agents and human operators. Every step needed to go from an inbound client email to a live cinematic local-business site with a self-serve AI edit widget is documented here. Screenshots are embedded; auth-walled steps are documented in text.

---

## Quick Reference

| URL | Purpose |
|---|---|
| `https://wss-dream-forge.vercel.app` | Factory homepage |
| `https://wss-dream-forge.vercel.app/admin` | Admin dashboard (Dream Studio Site Manager) |
| `https://wss-dream-forge.vercel.app/templates` | Templates / cockpit view |
| `https://wss-dream-forge.vercel.app/widget/edit-widget.js` | Embeddable AI edit widget |
| `https://wss-dream-forge.vercel.app/api/admin/edits` | Edit API endpoint (POST, SSE-streamed) |

| Live Showcase Sites | Lane | Tier |
|---|---|---|
| `https://hill-country-plumbing.vercel.app` | Editorial Heritage 2.0 | Tier 1 · Hook |
| `https://tier1desertstarrv.vercel.app` | Industrial Precision 2.0 | Tier 1 · Hook |
| `https://tier2848propertyservices.vercel.app` | Kinetic Bold | Tier 2 · Premier |
| `https://tier2halekanakaelectric.vercel.app` | Luxury Quiet | Tier 2 · Premier |

---

## Part 1: First Look — What Building a Site Looks Like

### 1.1 Factory Homepage

The homepage is the operator's command center. It is **not** a marketing page — it is a production dashboard entry point.

![Factory homepage — "Build, finish, publish, and sell local-business sites all day."](screenshots/factory_homepage.png)

**Key UI elements visible:**

| Element | Description |
|---|---|
| Headline | "Build, finish, publish, and sell local-business sites all day." |
| Label | `AI-NATIVE WEBSITE PRODUCTION DASHBOARD` |
| Sub-copy | "A private Lovable-style factory for Basic one-page demos, Premier five-page authority sites, and Domination service-city matrix builds with stable Vercel previews." |
| Primary CTA | **Enter factory** |
| Secondary CTA | **See simple cost view** |
| Command Center panel (right side) | Live production workflow checklist |

**Production Workflow (visible in Command Center):**
1. Start Build → Business Packet → Lane
2. Sandbox Preview stays temporary
3. Stable Vercel URL is safe to share
4. Checklist gates block weak sites
5. Proof report and sitemap queue after publish

**Three tiers / lanes:**

| Tier | Lane | Description |
|---|---|---|
| Basic | Hook | One-page demo — fastest to produce |
| Premier | Authority | Five-page authority site — standard client deliverable |
| Domination | — | Service-city matrix builds — multi-page, multi-city SEO blowout |

---

### 1.2 Templates / Cockpit View

The `/templates` page surfaces the factory's production monitoring view — live factory tape, cost guardrails, and batch status.

![Factory cockpit — "Command the website factory from one cinematic cockpit."](screenshots/factory_templates.png)

**Key elements:**
- **Badge:** `ROCKET SITE FACTORY` · `Budget-safe local mode`
- **Headline:** "Command the website factory from one cinematic cockpit."
- **Sub-copy:** "Flux Intake, Business Packets, Brand Packages, Finish Pass, stable Vercel previews, proof reports, and cost guardrails in one private WSS dashboard."
- **Three status pills:**
  - **Protected** — Admin-only routes
  - **1% target** — Provider calls held
  - **Stable URLs** — Sandbox stays temporary
- **Live Factory Tape** — Animated wave graph showing intake velocity and finish quality. Rolling ticker at bottom: `INTAKE NORMALIZED + BRAND PACKAGE READY + FINISH PASS GATED + STABLE URL REQUIRED + PROOF REPORT REQUIRED + STORAGE TRUTH VISIBLE`

---

### 1.3 Site Creation Flow — Step by Step

> **Note:** The intake wizard lives behind auth at `/dashboard`. The steps below describe the flow from first click to deployed site. A human operator logs in; a Codex agent hits the API directly.

**Step 1 — Enter Factory**
Click **Enter factory** on the homepage. You land at the authenticated `/dashboard`.

**Step 2 — Business Packet**
Fill in the client's intake:
- Business name, phone, city, ZIP, state
- Industry / service type
- Primary service list (truth rule: only real services the client actually offers)
- Optional: existing website URL (run Firecrawl on it to auto-populate; see Part 5)

**Step 3 — Pick a Lane**
Choose from the `templateRegistry`:

| Lane | Build | Pages | Credits |
|---|---|---|---|
| Basic / Hook | One-page demo with hero + quote widget | 1 | 100 credits |
| Premier / Authority | Full 5-page site + signature widget + schema blowout | 5–14 | 700 credits |
| Domination | Service × city matrix | 14+ | Custom |

**Step 4 — Generation**
The factory:
1. Runs the Business Packet through the brand-package generator (OKLCH palette, typography, visual fingerprint)
2. Invokes the cinematic hero engine (Veo 3 Fast video prompt, 8-layer hero stack)
3. Builds the lane-specific signature widget (quote console, dispatch console, ROI calculator, etc.)
4. Runs QA gates: premium-renderer contract, anti-template-sameness (≥4 dimensions differ), visual fingerprint, truth rule check
5. Deploys to a stable Vercel URL

**Step 5 — Output**
- Stable `*.vercel.app` URL ready to share with client
- Edit widget auto-embedded on every page (pencil FAB, bottom-right)
- Proof report generated
- Sitemap queued

---

## Part 2: The Live Site — Where the Magic Lives

All four showcase sites demonstrate the factory's output. Each has a **unique cinematic lane**, a **live-recalc signature widget**, and the **AI edit FAB** (cyan pencil, bottom-right corner).

---

### 2.1 Hill Country Plumbing Co. — Editorial Heritage 2.0

**Live URL:** `https://hill-country-plumbing.vercel.app`
**Lane:** Editorial Heritage 2.0 · Tier 1 · Hook (Spark Care)
**Location:** Boerne, TX 78006

![Hill Country Plumbing — hero section with "Quote the Job" live widget and cyan edit FAB](screenshots/hill_country_hero.png)

**What you're seeing:**
- **Cinematic hero:** Limestone creek, copper-warm Texas morning, sepia-tinged duotone — site-specific Veo video background
- **Stacked typography:** Editorial-weight serif "Limestone / country / *plumbing,* / built / honest." — 5-line kinetic lockup
- **Quote the Job widget (right):** Live recalculation — service selector chips (Leak repair / Drain clean / Water heater / Fixture install / Repipe / Emergency call), home-year slider, urgency picker → instant price range
- **Sticky CTA:** "☎ (210) 901-0236 · Tap to call" bottom-center
- **Cyan pencil FAB:** Bottom-right corner — this is the AI edit entry point (see Part 3)

![Hill Country mid-page — services section "SIX SERVICES. ONE CREW."](screenshots/hill_country_mid.png)

**Mid-page services section:**
- Section label: `// WHAT WE DO`
- Bold kinetic headline: "SIX SERVICES. ONE CREW."
- Copy: "From a slow drip under the cabinet to a slab leak under the foundation, we diagnose before a single fitting is touched."
- FAB still visible bottom-right

---

### 2.2 Desert Star Mobile RV Repair — Industrial Precision 2.0

**Live URL:** `https://tier1desertstarrv.vercel.app`
**Lane:** Industrial Precision 2.0 · Tier 1 · Hook (Spark Care)
**Location:** El Paso, TX 79912

![Desert Star RV — hero with Dispatch Console and blueprint grid overlay](screenshots/desert_star_hero.png)

**What you're seeing:**
- **Cinematic hero:** High-desert dawn, amber/teal sky, blueprint grid overlay drifting — industrial precision aesthetic
- **Typography:** Mono-weight tactical, coordinate sidebar showing ZIP/lat markers
- **Dispatch Console widget (right):** Rig Class selector (Class A / B / C / 5th Wheel / Trailer), System dropdown (HVAC · A/C & heat), Urgency toggle (Standard 24–48h / Priority same-day) → live ETA window (100 min) and Price Band ($240–$520)
- **Bottom CTA bar:** "Call (915) 600-9751" · "Run dispatch console ↓"
- **Rolling ticker:** Service capabilities scrolling horizontally
- **Cyan pencil FAB:** Bottom-right

---

### 2.3 848 Property Services — Kinetic Bold

**Live URL:** `https://tier2848propertyservices.vercel.app`
**Lane:** Kinetic Bold · Tier 2 · Premier (Authority Care)
**Location:** Hastings, MI 49058

![848 Property Services — hero with "Quote Forge" instant ballpark widget](screenshots/property848_hero.png)

**What you're seeing:**
- **Cinematic hero:** Golden-hour Michigan, copper-amber flares
- **Stacked typography:** "Handyman, *engineered* for the way Michigan houses age." — italic accent on "engineered"
- **Quote Forge widget (right):** Service chips (Painting / Drywall / Doors / Flooring / Bathroom), Project Size slider (320 sq ft), Urgency slider (This month) → Estimated Price Band: **$1,150–$1,540** with Timeline 2–3 weeks / Crew days 4 / Confidence High
- **Dual CTAs:** "Lock this quote →" · "Call instead"
- **Bottom sticky CTA:** "● Call (269) 908-1905"
- **Cyan pencil FAB:** Bottom-right

---

### 2.4 Hale Kanaka Electric — Luxury Quiet

**Live URL:** `https://tier2halekanakaelectric.vercel.app`
**Lane:** Luxury Quiet · Tier 2 · Premier (Authority Care)
**Location:** Pāhoa, HI 96778

![Hale Kanaka Electric — hero with constellation overlay and EV ROI calculator](screenshots/hale_kanaka_hero.png)

**What you're seeing:**
- **Cinematic hero:** Big Island evening, constellation star-map overlay drifting, molten amber horizon — slow luxury parallax
- **Typography:** Oversized italic "Current" — editorial weight, site-color matched
- **EV ROI Widget (right):** "LIVE · EV ROI — What a Level 2 charger pays back" — Miles Driven/Week slider (220 mi), Hawai'i Pump Price slider ($4.85/gal), Charger Amperage selector (32 A / 40 A / 48 A)
- **Copy:** "Hawai'i has the highest gas prices in the nation. Drag the sliders for your real household."
- **Cyan pencil FAB:** Bottom-right

---

## Part 3: The In-Site Chatbot (THE STAR)

> **This is the #1 differentiator.** Every deployed site carries a self-contained AI editor that any client can use without touching code, a dashboard, or calling the agency. The client types what they want. The site updates.

### 3.1 The Edit Widget — What It Is

The edit widget is a **62×62px floating action button** (FAB) positioned `fixed; right:20px; bottom:24px`. It is injected into every page via a single `<script>` tag.

- **Visual:** Cyan-to-violet gradient (`#22D3EE → #a78bfa`), pencil glyph (`✎`), glowing cyan box-shadow
- **z-index:** 2147483647 (always on top of everything)
- **On hover:** scales to 1.08×
- **On press:** scales to 0.92× (tactile feedback)

You can see the FAB in the bottom-right corner of **every screenshot** in Part 2.

---

### 3.2 The Embed Code (Operator Must Verify on Every Page)

```html
<!-- Paste before </body> on every page -->
<script
  src="https://wss-dream-forge.vercel.app/widget/edit-widget.js"
  data-site-id="hill-country-78006-tier1"
  data-factory="https://wss-dream-forge.vercel.app"
  defer>
</script>
```

**Site IDs (must match exactly):**

| Site | `data-site-id` |
|---|---|
| Hill Country Plumbing | `hill-country-78006-tier1` |
| Desert Star RV | `desert-star-79912-tier1` |
| 848 Property Services | `848-49058-tier2` |
| Hale Kanaka Electric | `hale-kanaka-96778-tier2` |

**What happens if `data-site-id` is missing:** The widget silently refuses to load (`console.warn('[wss-edit-widget] missing data-site-id, widget will not load')`). No FAB appears.

---

### 3.3 The Full Chatbot Interaction Flow (Click → Panel → Type → Stream → Applied → Debit)

#### Step 1 — Click the FAB

Look for the **cyan pencil button at the bottom-right** of the live site. Click it.

The panel slides open from the right side. It appears as a `360px wide × 520px tall` dark card (`#0b1326` background) with rounded corners, a subtle border, and a 64px drop shadow.

**Panel header elements:**
- Green pulsing dot (live indicator)
- Title: **"Dream Studio Editor"**
- Site ID in JetBrains Mono (e.g., `hill-country-78006-tier1`)

**Onboarding message (shown before first send):**
> "Type a change in plain English. Examples: 'make the hero headline bolder' · 'swap the gallery photo for a sunset shot' · 'add a third service card for emergency calls'."

#### Step 2 — Type a Request

Click into the textarea (auto-focused on panel open). Type in plain English. Example requests:

```
change the headline to "Texas Hill Country's Most Trusted Plumbers"
```
```
add emergency service hours: Mon–Sun 7am–10pm
```
```
swap the hero background to a darker limestone tone
```
```
add a fourth service card for water softener installation
```

Press **Enter** (or click **Send**) to submit. Shift+Enter adds a newline without sending.

#### Step 3 — Watch the Stream

The widget sends a `POST` to `https://wss-dream-forge.vercel.app/api/admin/edits` with payload:
```json
{
  "siteId": "hill-country-78006-tier1",
  "instruction": "change the headline to ..."
}
```

The response is **OpenAI SSE-proxied streaming** (`data:` lines). The reply bubble starts at `…` and fills in token-by-token as the AI writes the edit instructions and/or the modified HTML. You watch the text stream in real-time inside the chat panel.

**What streams back:** The AI acknowledges the instruction, describes what it is changing, and in some cases returns the modified component code for the factory to apply.

#### Step 4 — Credit Debit

Every successful edit costs **5 credits**, shown in the footer:
> "Powered by Dream Forge · **5 credits per edit**"

If credits run to zero, the response is:
> "You are out of credits. Top up at the Dream Studio dashboard to keep editing."

HTTP 402 (Payment Required) triggers this message. No edit is applied.

#### Step 5 — Error States

| Condition | Message shown |
|---|---|
| Out of credits | "You are out of credits. Top up at the Dream Studio dashboard to keep editing." |
| API error | "Edit service returned {status}. {first 200 chars of body}" |
| Network failure | "Network error: {err.message}" |
| Edit acknowledged but no content | "(edit acknowledged · no preview available)" |

---

### 3.4 Widget Architecture (For Codex Agents)

The widget is a **self-contained IIFE** (`(function() { ... })()`). No dependencies. No bundler. It:

1. Reads `data-site-id` and `data-factory` from the script tag at runtime
2. Injects its own `<style>` block into `<head>`
3. Appends the FAB `<button>` and the panel `<div>` to `<body>`
4. On send: fetches `${FACTORY}/api/admin/edits` via `fetch()` with streaming reader
5. Parses OpenAI SSE `data:` lines (`choices[0].delta.content`) and appends to the reply bubble
6. Enables/disables send button during in-flight requests

**To add the widget to a new site:**
1. Add the `<script>` tag (see 3.2) before `</body>`
2. Register the site in the admin dashboard (Part 4) to get a `siteId`
3. Fund the credit balance — 100 credits = 20 edits

---

## Part 4: The Admin Dashboard

### 4.1 Dashboard Overview

The Admin Dashboard lives at `https://wss-dream-forge.vercel.app/admin`. At the time of writing it is **publicly accessible** (no auth wall detected) — the factory is in private beta mode for WSS internal use.

![Admin dashboard — "Dream Studio · Site Manager" with 4 site cards](screenshots/admin_dashboard.png)

**Header:**
- Title: **Dream Studio · Site Manager**
- Sub: `Woodward Software Systems · 4 sites registered`

---

### 4.2 The Site Card Grid

Each registered site gets a card in a responsive grid. Cards display:

| Field | Description |
|---|---|
| Tier badge | `TIER 1 · HOOK` or `TIER 2 · PREMIER` |
| Care level badge | `Spark Care` (Tier 1) or `Authority Care` (Tier 2) |
| Site name | Business name (bold headline) |
| Industry · Location | e.g., `Plumbing · Boerne, TX 78006` |
| Page count | e.g., `1 page` or `14 pages` |
| Credit balance | Shown in cyan (e.g., `100 credits`, `700 credits`) |
| Archetype slug | Full slug for the build archetype (monospace, below fold) |

**Current 4 registered sites:**

| Site | Tier | Care | Pages | Credits | Archetype Slug |
|---|---|---|---|---|---|
| Hill Country Plumbing Co. | Tier 1 · Hook | Spark Care | 1 | 100 | `hill-country-78006-tier1-archetype-radial-burst` |
| Desert Star Mobile RV Repair | Tier 1 · Hook | Spark Care | 1 | 100 | `desert-star-79912-tier1-archetype-cinematic-letterbox` |
| 848 Property Services | Tier 2 · Premier | Authority Care | 14 | 700 | `848-49058-tier2-archetype-magazine-grid` |
| Hale Kanaka Electric | Tier 2 · Premier | Authority Care | 14 | 700 | `hale-kanaka-96778-tier2-archetype-liquid-blob-canvas` |

---

### 4.3 Credit Ledger

Credits are the consumption unit for all AI operations. The ledger is per-site, not per-account.

| Operation | Credit cost |
|---|---|
| In-site chatbot edit (via FAB) | **5 credits** |
| Full site generation (Basic/Hook) | **100 credits** |
| Full site generation (Premier/Authority) | **700 credits** |
| Credit top-up | Via Stripe (see Stripe connector) |

When a site card shows `100 credits` and the client makes 20 edits, the balance hits zero. The widget then returns HTTP 402 and shows the "out of credits" message. Operator tops up via the dashboard.

---

### 4.4 Per-Site Edit Flow (Dashboard Side)

> **Note:** The per-site card click / edit flow inside the dashboard is behind auth. The documented behavior is based on the factory architecture spec.

1. Click a site card → opens site detail view
2. Site detail shows: build history, current page count, Vercel deployment URL, edit log
3. Admin can trigger a **Finish Pass** (runs the 8-point QA checklist)
4. Admin can push a **new deployment** to Vercel directly from the card
5. Admin can top up credits via the Stripe payment flow

---

## Part 5: Mass-Production Playbook

Use this runbook to take any inbound client to a live site in a single production session.

---

### Step 1 — Receive Client via Gmail/Email

- Client comes in via email, form submit, or cold outreach
- Extract: business name, phone, city/ZIP, industry, services offered, existing website URL
- Tag the email in Gmail for tracking
- If they have an existing site, copy the URL for Firecrawl intake

---

### Step 2 — Firecrawl Their Existing Web Presence

If the client has an existing site, run Firecrawl on it to auto-populate the intake packet:

```bash
# Via Firecrawl connector (pipedream)
# Returns: all visible copy, services, phone, address, color hints
firecrawl.scrapeURL({ url: "https://clientsite.com", formats: ["markdown"] })
```

**Extract from the crawl:**
- Business name (normalize capitalization)
- Phone number (`tel:` format)
- Physical address + ZIP
- Services actually offered (no invented services — truth rule)
- Existing color palette (hint for OKLCH generation)
- Any real photos (for `alt` text and gallery seeding)

If no existing site: use the client intake form answers directly.

---

### Step 3 — Pick a Lane per `templateRegistry`

| Signal | Lane to pick |
|---|---|
| Single trade, one city, demo/proof-of-concept | **Basic / Hook** (100 credits, 1 page) |
| Established trade, wants authority presence, 2–5 service types | **Premier / Authority** (700 credits, 14 pages) |
| Multi-city, wants city-page SEO matrix | **Domination** (custom credits) |

**Visual fingerprint assignment (4 lanes — must not collide if building multiple sites at once):**

| Lane | Visual DNA | Signature Widget |
|---|---|---|
| Editorial Heritage 2.0 | Putting Green contour board + AdClimber holographic accent | Job Diagnostic / symptom-checker |
| Industrial Precision 2.0 | Rocket Mission starfield + AdClimber media rail | Dispatch Console / ETA + price band |
| Kinetic Bold | AdClimber visual system + glow CTA + 21st.dev hero blocks | Quote Forge / draggable before-after or instant ballpark |
| Luxury Quiet | Aceternity parallax + slow contour drift | ROI Calculator / savings curve |

---

### Step 4 — Run Intake → Generation

1. Open the factory at `https://wss-dream-forge.vercel.app`
2. Click **Enter factory**
3. Paste the normalized business packet into the intake form
4. Select lane
5. Click **Start Build**

The factory runs:
- Brand package (OKLCH palette, typography, fingerprint)
- Cinematic hero engine (Veo 3 Fast video, 8-layer stack)
- Signature widget (lane-specific interactive block)
- QA gate run

Generation time: typically 3–8 minutes depending on asset pipeline.

---

### Step 5 — Verify QA Gates

Before sharing the Vercel URL with the client, run the finish-pass checklist:

| Gate | Pass condition |
|---|---|
| **Premium kit** | All 8 layers of hero present; cinematic video loading |
| **Visual fingerprint** | Fingerprint HTML comment present in source |
| **Anti-template-sameness** | ≥4 dimensions differ from any other active build |
| **Truth rule** | Zero fake reviews, ratings, awards, counts, or team bios |
| **Edit widget** | `<script data-site-id="...">` present before `</body>` on every page |
| **Schema blowout** | `FAQPage` + `Service` + `LocalBusiness` JSON-LD in `<head>` |
| **A11y** | All images have descriptive `alt` text; skip-to-content link present |
| **Page weight** | < 1.2MB (excluding streaming Veo MP4) |

If any gate fails: trigger a **Finish Pass** from the admin card.

---

### Step 6 — Deploy via Vercel

The factory auto-deploys to Vercel. The sandbox URL (`*.vercel.app`) is immediately shareable.

For production custom domain:
1. Go to Vercel dashboard for the project
2. Add the client's custom domain
3. Update DNS (CNAME or A record) per Vercel instructions
4. SSL provisions automatically

---

### Step 7 — Hand Off the In-Site Chatbot to the Client

Send the client this one-sentence instruction:

> "Your site has a cyan pencil button in the bottom-right corner — click it, type what you want changed in plain English, and the AI will update the site. Each edit costs 5 credits; your starting balance is shown in your dashboard card."

**What the client can do without any operator involvement:**
- Change headlines, copy, phone numbers
- Add or rewrite service descriptions
- Update business hours
- Request new section layouts
- Swap placeholder images for real photos (by describing what they want)

**What requires operator intervention:**
- Adding new pages (triggers a new factory generation)
- Custom domain setup
- Credit top-up (if client exhausts balance)
- Major design changes that violate the visual fingerprint

---

## Part 6: The Bentley Bar — How We Beat Lovable.dev

> Source: `/home/user/workspace/intel/MASTER_INTEL_PACK.md`, "Lovable killer" section

Lovable.dev is the closest competitor — a well-funded, widely-used AI website builder. Here is the dimension-by-dimension breakdown of how Dream Forge beats them:

---

### What Lovable.dev Ships

Based on analysis of their rendered output and their own scroll-patterns guide:

| Lovable default | Limitation |
|---|---|
| Predictable scroll-fade hero | 2–3 layer max — no cinematic depth |
| Three-card feature grid | Static — no live recalculation |
| Centered headline + subtitle + button | Generic — no typographic personality |
| Stripe-blue / Vercel-black default palette | Same across hundreds of sites |
| Bare meta tags | No structured schema, no FAQPage, no LocalBusiness JSON-LD |
| Dashboard-only edits | Client must log in and navigate UI to make any change |
| Stock images | No site-specific cinematography |
| No conversion stack | No sticky CTA, no exit intent, no scroll progress bar |

---

### How Dream Forge Wins on Each Dimension

| Dimension | Lovable.dev | Dream Forge |
|---|---|---|
| **Hero depth** | 2–3 layers (image + text + button) | **8-layer cinematic stack** — Veo video, parallax overlay, contour drift, signature widget, kinetic typography, sticky CTA, fingerprint watermark, conversion bar |
| **Live widgets** | Static cards | **Two live-recalc widgets per site** — one in the hero (quote/dispatch/ROI), one below-fold (job diagnostic, service radar, before-after slider, solar savings curve) |
| **Color palette** | Safe blue/black defaults | **Fresh OKLCH palette per site** — invented from real client trade context, never repeated |
| **Hero video** | Stock photography | **Veo 3 Fast cinematic prompt** — site-specific script, 8-second loop, trade-specific location, cinematography direction per lane |
| **SEO / Schema** | Bare meta tags | **Full schema blowout** — `FAQPage` + `Service` + `BreadcrumbList` + `LocalBusiness` JSON-LD, 6–8 FAQ Q&As, sitemap, full OG cards |
| **Conversion stack** | Rarely included | **3-piece conversion stack** — sticky CTA bar (after 600px scroll), exit-intent dialog (desktop) / scroll-depth card (mobile), scroll-progress bar |
| **Client edits** | Dashboard login required | **In-site chatbot FAB** — plain English, no login, no dashboard, edits stream in real-time right inside the live site |
| **Visual DNA** | Generic template library | **Source visual keys** — AdClimber glass cards + Putting Green planning board + Rocket Mission starfield, recreated locally per-site and per-lane |
| **Anti-sameness** | No gate | **≥4 dimensions must differ** across concurrent builds — enforced by the anti-template-sameness QA gate |
| **Truth rules** | No enforcement | **Hard-coded truth rules** — zero fake reviews, ratings, awards, stats, testimonials. Real client data only. |

---

### The Bentley Bar — One-Sentence Pitch

> "Lovable builds you a site. Dream Forge builds you a **cinematic product** — a live-breathing local business presence with a built-in AI editor that the client can run themselves forever, for 5 credits a change."

---

### The "Edit Widget Moat"

The in-site chatbot is the deepest competitive moat. Lovable requires:
1. Client navigates to Lovable dashboard
2. Finds their project
3. Describes change in a separate UI
4. Waits for re-deploy
5. Views result on a different preview URL

Dream Forge requires:
1. Client is already on their live site
2. Clicks the pencil FAB
3. Types the change
4. Watches it stream back in 3–8 seconds
5. Done — on the live site, no navigation required

This is the moment the user described: *"Once someone's in the site now, they can make new things. I want to see the chat box and typing stuff in and having it build stuff right in front of you inside your site is really cool to me."* That is the product. Everything else is the wrapper.

---

## Appendix A — Screenshot Index

| Screenshot | File | Captured |
|---|---|---|
| Factory homepage | `screenshots/factory_homepage.png` | ✓ |
| Factory templates / cockpit | `screenshots/factory_templates.png` | ✓ |
| Factory dashboard (cockpit redirect) | `screenshots/factory_dashboard.png` | ✓ |
| Admin dashboard — site card grid | `screenshots/admin_dashboard.png` | ✓ |
| Admin dashboard — close crop | `screenshots/admin_grid_close.png` | ✓ |
| Hill Country Plumbing — hero + FAB | `screenshots/hill_country_hero.png` | ✓ |
| Hill Country Plumbing — mid-page services | `screenshots/hill_country_mid.png` | ✓ |
| Desert Star RV — hero + Dispatch Console | `screenshots/desert_star_hero.png` | ✓ |
| 848 Property Services — hero + Quote Forge | `screenshots/property848_hero.png` | ✓ |
| Hale Kanaka Electric — hero + EV ROI | `screenshots/hale_kanaka_hero.png` | ✓ |
| Edit widget source code | `screenshots/edit_widget_source.png` | ✓ |

---

## Appendix B — Pages That Need Browser-Task Follow-Up

The following interactions **require a live browser session** (click + type + stream) and cannot be captured by static screenshot:

| Flow | What to Capture | Instructions for Browser Task |
|---|---|---|
| **Chatbot panel open state** | Screenshot the panel *after* clicking the FAB — shows the chat panel slid in from right, green dot, "Dream Studio Editor" header, onboarding message, textarea, Send button | Navigate to `https://hill-country-plumbing.vercel.app`, click the cyan pencil FAB bottom-right, screenshot the result |
| **Chatbot mid-stream** | Screenshot while a reply is actively streaming — reply bubble partially filled with AI text | After opening the panel, type "make the hero headline bolder", hit Send, screenshot during the stream |
| **Chatbot after edit applied** | Screenshot showing the applied change in the live DOM | Screenshot immediately after stream completes |
| **Admin card expanded** | Per-site detail view (may require auth) | Login to admin, click a site card, screenshot the expanded view |
| **Factory intake form** | The actual intake form fields (business name, phone, lane picker, etc.) | Login to factory, click "Enter factory", screenshot the intake wizard |
| **Factory generation in progress** | Loading/progress state during site generation | Start a new build, screenshot the generation progress indicator |
| **Credit top-up Stripe flow** | Stripe checkout for credit reload | Click "Top up" on an admin card, screenshot the Stripe modal |

---

*Manual compiled May 2026 · Woodward Software Systems · Dream Forge v3 (Flagship 3.0)*
