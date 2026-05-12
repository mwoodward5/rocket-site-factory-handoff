# Wiring Contract

This file is the naming contract for the Lovable rebuild.

## Environment Variables

Required:

```text
OPENAI_API_KEY=
FIRECRAWL_API_KEY=
BRIGHT_DATA_API_KEY=
BRIGHT_DATA_ZONE=serp_api1
GOOGLE_PLACES_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

Optional:

```text
PEXELS_API_KEY=
RESEND_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=
```

## Supabase Tables

`profiles`

- `id uuid primary key`
- `email text unique not null`
- `role text check role in ('operator','client')`
- `stripe_customer_id text`
- `created_at timestamptz default now()`

`sites`

- `id uuid primary key`
- `slug text unique not null`
- `owner_id uuid references profiles(id)`
- `business_name text not null`
- `industry text`
- `city text`
- `state text`
- `phone text`
- `email text`
- `primary_color text`
- `accent_color text`
- `status text check status in ('draft','live','paused','archived')`
- `custom_domain text`
- `stripe_subscription_id text`
- `plan_tier text`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

`pages`

- `id uuid primary key`
- `site_id uuid references sites(id) on delete cascade`
- `slug text not null`
- `title text`
- `sections_json jsonb not null default '[]'`
- `seo_meta jsonb not null default '{}'`
- `published_at timestamptz`

`assets`

- `id uuid primary key`
- `site_id uuid references sites(id) on delete cascade`
- `kind text check kind in ('image','logo','video','document')`
- `storage_path text not null`
- `alt_text text`
- `source text check source in ('uploaded','generated','firecrawl','bright_data','pexels','operator')`
- `created_at timestamptz default now()`

`leads`

- `id uuid primary key`
- `site_id uuid references sites(id) on delete cascade`
- `name text`
- `email text`
- `phone text`
- `message text`
- `source text`
- `payload jsonb default '{}'`
- `created_at timestamptz default now()`

`messages`

- `id uuid primary key`
- `site_id uuid references sites(id) on delete cascade`
- `user_id uuid references profiles(id)`
- `role text check role in ('user','assistant','system','tool')`
- `content text`
- `attachments jsonb default '[]'`
- `created_at timestamptz default now()`

`add_ons`

- `id uuid primary key`
- `site_id uuid references sites(id) on delete cascade`
- `kind text`
- `stripe_price_id text`
- `status text`
- `activated_at timestamptz`

`activity_log`

- `id uuid primary key`
- `site_id uuid references sites(id) on delete cascade`
- `actor_id uuid references profiles(id)`
- `action text not null`
- `payload jsonb default '{}'`
- `created_at timestamptz default now()`

### Supastarter/DreamForge Extension Tables

`accounts` or `client_orgs`

- `id uuid primary key`
- `name text not null`
- `owner_id uuid references profiles(id)`
- `stripe_customer_id text`
- `created_at timestamptz default now()`

`subscriptions`

- `id uuid primary key`
- `site_id uuid references sites(id) on delete cascade`
- `stripe_subscription_id text unique`
- `plan_tier text`
- `status text`
- `current_period_end timestamptz`
- `created_at timestamptz default now()`

`credit_purchases`

- `id uuid primary key`
- `site_id uuid references sites(id) on delete cascade`
- `profile_id uuid references profiles(id)`
- `stripe_checkout_session_id text`
- `credits integer not null`
- `amount_cents integer not null`
- `status text`
- `created_at timestamptz default now()`

`wallets`

- `id uuid primary key`
- `site_id uuid references sites(id) on delete cascade unique`
- `balance integer not null default 0`
- `updated_at timestamptz default now()`

`wallet_ledger`

- `id uuid primary key`
- `wallet_id uuid references wallets(id) on delete cascade`
- `delta integer not null`
- `reason text not null`
- `reference_type text`
- `reference_id text`
- `created_at timestamptz default now()`

`kits`

- `id uuid primary key`
- `slug text unique not null`
- `name text not null`
- `vertical text`
- `tier integer default 1`
- `config jsonb not null default '{}'`
- `created_at timestamptz default now()`

`intakes`

- `id uuid primary key`
- `site_id uuid references sites(id) on delete set null`
- `raw_input text`
- `source_url text`
- `parsed jsonb not null default '{}'`
- `status text`
- `created_at timestamptz default now()`

`build_jobs`

- `id uuid primary key`
- `site_id uuid references sites(id) on delete cascade`
- `intake_id uuid references intakes(id) on delete set null`
- `kit_id uuid references kits(id) on delete set null`
- `status text`
- `phase text`
- `cost_estimate_cents integer default 0`
- `logs jsonb not null default '[]'`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

`optimization_opportunities`

- `id uuid primary key`
- `site_id uuid references sites(id) on delete cascade`
- `kind text`
- `title text`
- `description text`
- `estimated_credits integer default 0`
- `status text`
- `created_at timestamptz default now()`

`site_patch_previews`

- `id uuid primary key`
- `site_id uuid references sites(id) on delete cascade`
- `requested_by uuid references profiles(id)`
- `instruction text not null`
- `patch_json jsonb not null default '{}'`
- `estimated_credits integer default 0`
- `status text`
- `created_at timestamptz default now()`

`provider_status`

- `id uuid primary key`
- `provider text unique not null`
- `configured boolean default false`
- `last_tested_at timestamptz`
- `last_status text`
- `last_error text`
- `estimated_test_cost_cents integer default 0`

## RLS Rules

- Operators can select, insert, update, and delete all rows.
- Clients can select and update only rows tied to their owned sites.
- Clients cannot update billing identifiers, owner ids, audit logs, or provider settings.
- Edge functions use service role only for controlled write paths.

## Supabase Edge Functions

`firecrawl-collect`

Input:

```json
{ "url": "https://example.com", "siteId": "uuid" }
```

Output:

```json
{ "ok": true, "pages": [], "assets": [], "summary": "..." }
```

`bright-data-enrich`

Input:

```json
{ "businessName": "Name", "city": "City", "state": "ST", "siteId": "uuid" }
```

Output:

```json
{ "ok": true, "services": [], "keywords": [], "businessFacts": {} }
```

`places-enrich`

Input:

```json
{ "businessName": "Name", "city": "City", "state": "ST", "siteId": "uuid" }
```

`generate-image`

Input:

```json
{ "siteId": "uuid", "prompt": "...", "aspectRatio": "16:9", "costClass": "cheap|standard|premium" }
```

`generate-logo`

Input:

```json
{ "siteId": "uuid", "businessName": "Name", "style": "monogram|badge|wordmark" }
```

`ai-edit`

Input:

```json
{ "siteId": "uuid", "instruction": "...", "attachments": [] }
```

`publish-site`

Input:

```json
{ "siteId": "uuid", "target": "lovable-hosting|custom-domain" }
```

`create-checkout`

Input:

```json
{ "siteId": "uuid", "priceId": "price_..." }
```

`customer-portal`

Input:

```json
{ "siteId": "uuid" }
```

`stripe-webhook`

Events:

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`

`provider-status`

Input:

```json
{ "provider": "bright-data|firecrawl|openai|pexels|places|stripe|dataforseo" }
```

Output:

```json
{ "ok": true, "configured": true, "lastStatus": "healthy", "estimatedCostCents": 1 }
```

`preview-site-patch`

Input:

```json
{ "siteId": "uuid", "instruction": "add a dishwasher repair page", "attachments": [] }
```

Output:

```json
{ "ok": true, "previewId": "uuid", "estimatedCredits": 10, "summary": "..." }
```

`approve-site-patch`

Input:

```json
{ "previewId": "uuid" }
```

Output:

```json
{ "ok": true, "siteId": "uuid", "walletBalance": 42 }
```

## Routes

Operator:

- `/login`
- `/cockpit`
- `/cockpit/sites/:siteId`
- `/cockpit/intake`
- `/cockpit/queue`
- `/cockpit/templates`
- `/cockpit/settings`

Client:

- `/admin`
- `/admin/editor`
- `/admin/billing`
- `/admin/leads`
- `/admin/domain`
- `/admin/assistant`

Published site:

- `/`
- `/services`
- `/contact`
- `/privacy`
- `/sitemap.xml`
- `/robots.txt`
