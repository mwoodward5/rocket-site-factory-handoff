# Supastarter + DreamForge Integration Map

This is the source-truth integration plan for Rocket Site Factory.

## Product Decision

Rocket Site Factory is now a Lovable-built product, but the architecture should preserve the best pieces from two prior systems:

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
   - bulk intake
   - build queue
   - credit wallet
   - site-builder chat
   - customer edit assistant
   - Bright Data / Firecrawl / Places enrichment
   - cinematic hero and media generation
   - local-business page generation

The old Vercel cockpit UI is rejected. Do not copy it.

## UI Standard

The UI must be easier than the rejected Vercel cockpit and closer to Lovable itself:

- home screen: dark left sidebar plus a clean central prompt box
- prompt box: `+` attachment, Plan/Build selector, microphone, send
- created-by view: gallery cards with real thumbnails and search/filter controls
- left dock: site list + chat
- center: live editable preview
- right: inspector
- obvious primary action
- fewer dense cards
- no giant wall of system/debug panels
- no operator-only jargon in the customer admin
- client admin must feel like a small business owner can use it

Default rule: hide complexity until it is needed. Bright Data, Firecrawl, provider costs, queues, and diagnostics are operator controls, not first-screen clutter.

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
