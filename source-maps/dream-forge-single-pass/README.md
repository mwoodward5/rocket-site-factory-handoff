# WSS Dream Forge — Single-Pass Starter

This is a runnable starter package for the WSS Dream Forge / Rocket Control direction:

- Own-template engine path instead of automating Lovable.
- Template gallery for your 180 kits.
- Bulk build queue for 20–30 businesses at once.
- Customer admin chat box that previews targeted patches.
- Credit wallet and Stripe-checkout-ready endpoint.
- Mock engine that matches business intake to templates.
- Drizzle schema scaffold for businesses, templates, sites, credits, jobs, and opportunities.

## Run it

```bash
npm install
npm run dev
```

Open:

```bash
http://localhost:3000
```

## Main files

```text
app/page.tsx                         # Full dashboard UI
app/api/build/route.ts               # POST one business intake -> mock build job
app/api/chat/route.ts                # POST site edit prompt -> mock safe diff
app/api/wallet/checkout/route.ts     # Mock Stripe checkout response
app/api/templates/route.ts           # Template list
app/api/queue/route.ts               # Build queue list
app/api/stats/summary/route.ts       # Dashboard stats
lib/mock-data.ts                     # Starter data
lib/engine/remixer.ts                # Template matching and recipe builder
lib/engine/index.ts                  # Mock build/chat engine
lib/engine/costs.ts                  # Credit and internal cost model
drizzle/schema.ts                    # DB schema scaffold
```

## What to replace next

1. Replace `lib/mock-data.ts` with DB queries.
2. Import all 180 template kits into the `templates` table.
3. Replace mock endpoints with authenticated Supastarter/Next.js route handlers.
4. Wire Stripe real checkout in `app/api/wallet/checkout/route.ts`.
5. Add provider adapters:
   - Firecrawl
   - Bright Data
   - Pexels
   - OpenAI image
   - Veo / Google AI
   - Resend
   - Vercel deploy API

## ENV placeholder

```bash
DATABASE_URL=
DIRECT_DATABASE_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
RESEND_API_KEY=
FIRECRAWL_API_KEY=
BRIGHTDATA_API_KEY=
PEXELS_API_KEY=
OPENAI_API_KEY=
GOOGLE_AI_KEY=
VERCEL_TOKEN=
VERCEL_TEAM_ID=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Why this build direction

The uploaded Dream Forge transfer material points toward a front end, template gallery, customer admin, credit wallet, and bulk build queue. The safer version uses your own template engine, not Lovable browser automation, so you own the margin, avoid ToS/API dependency risk, and can scale batch generation.
