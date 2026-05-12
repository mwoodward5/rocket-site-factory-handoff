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
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
X_CLIENT_ID=
X_CLIENT_SECRET=
YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
TIKTOK_CLIENT_KEY=
TIKTOK_CLIENT_SECRET=
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

`template_sources`

- `id uuid primary key`
- `name text not null`
- `source_type text check source_type in ('lovable_project','live_site','github_repo','local_archive','manual')`
- `lovable_project_url text`
- `live_url text`
- `github_url text`
- `thumbnail_asset_id uuid references assets(id) on delete set null`
- `category text`
- `vertical text`
- `style_tags text[] default '{}'`
- `widgets text[] default '{}'`
- `sections text[] default '{}'`
- `credits_used numeric`
- `public_remixing_enabled boolean default false`
- `status text check status in ('new','cataloged','reusable','premium','experimental','retired')`
- `notes text`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

`template_sections`

- `id uuid primary key`
- `template_source_id uuid references template_sources(id) on delete cascade`
- `section_type text`
- `name text`
- `description text`
- `style_notes text`
- `reusable boolean default true`
- `quality_score numeric default 0`
- `screenshot_asset_id uuid references assets(id) on delete set null`
- `created_at timestamptz default now()`

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

`connectors`

- `id uuid primary key`
- `site_id uuid references sites(id) on delete cascade`
- `profile_id uuid references profiles(id)`
- `provider text not null`
- `display_name text`
- `status text check status in ('connected','needs_setup','expired','unavailable','simulated')`
- `scopes text[] default '{}'`
- `metadata jsonb not null default '{}'`
- `token_ref text`
- `last_checked_at timestamptz`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

`social_posts`

- `id uuid primary key`
- `site_id uuid references sites(id) on delete cascade`
- `created_by uuid references profiles(id)`
- `source_page_id uuid references pages(id) on delete set null`
- `title text`
- `body text not null`
- `cta text`
- `status text check status in ('draft','previewed','approved','scheduled','published','failed')`
- `scheduled_at timestamptz`
- `credits_estimated integer default 0`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

`media_generations`

- `id uuid primary key`
- `site_id uuid references sites(id) on delete cascade`
- `social_post_id uuid references social_posts(id) on delete set null`
- `kind text check kind in ('image','short_video','story','thumbnail')`
- `prompt text`
- `asset_id uuid references assets(id) on delete set null`
- `status text`
- `credits_estimated integer default 0`
- `created_at timestamptz default now()`

`publishing_jobs`

- `id uuid primary key`
- `site_id uuid references sites(id) on delete cascade`
- `social_post_id uuid references social_posts(id) on delete cascade`
- `connector_id uuid references connectors(id) on delete set null`
- `provider text not null`
- `status text check status in ('queued','publishing','published','failed','fallback_ready')`
- `provider_post_id text`
- `error text`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

`call_events`

- `id uuid primary key`
- `site_id uuid references sites(id) on delete cascade`
- `lead_id uuid references leads(id) on delete set null`
- `provider text default 'manual'`
- `caller_number text`
- `tracking_number text`
- `source_url text`
- `source_campaign text`
- `duration_seconds integer`
- `status text check status in ('missed','answered','voicemail','unknown')`
- `metadata jsonb not null default '{}'`
- `created_at timestamptz default now()`

`referral_rewards`

- `id uuid primary key`
- `profile_id uuid references profiles(id)`
- `site_id uuid references sites(id) on delete set null`
- `referral_code text unique not null`
- `referred_email text`
- `reward_kind text check reward_kind in ('credits','free_pages','discount')`
- `reward_value integer default 0`
- `status text check status in ('pending','earned','redeemed','expired')`
- `created_at timestamptz default now()`

`growth_opportunities`

- `id uuid primary key`
- `site_id uuid references sites(id) on delete cascade`
- `kind text check kind in ('seo','calls','leads','social','speed','conversion','content')`
- `title text not null`
- `evidence text`
- `suggested_action text`
- `estimated_credits integer default 0`
- `confidence numeric default 0`
- `status text check status in ('new','previewed','approved','dismissed','completed')`
- `created_at timestamptz default now()`

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

`connect-social-account`

Input:

```json
{ "siteId": "uuid", "provider": "facebook|instagram|google-business|linkedin|x|youtube|tiktok|email" }
```

Output:

```json
{ "ok": true, "connectorId": "uuid", "status": "connected|needs_setup|simulated", "authUrl": "https://..." }
```

`preview-social-post`

Input:

```json
{ "siteId": "uuid", "instruction": "make a post for spring AC tune-ups", "destinationProviders": ["facebook"], "sourcePageId": "uuid" }
```

Output:

```json
{ "ok": true, "postId": "uuid", "estimatedCredits": 2, "copy": "...", "mediaPreview": null }
```

`generate-social-asset`

Input:

```json
{ "siteId": "uuid", "postId": "uuid", "kind": "image|short_video|story|thumbnail" }
```

Output:

```json
{ "ok": true, "mediaGenerationId": "uuid", "assetId": "uuid", "estimatedCredits": 5 }
```

`publish-social-post`

Input:

```json
{ "siteId": "uuid", "postId": "uuid", "connectorIds": ["uuid"], "scheduledAt": null }
```

Output:

```json
{ "ok": true, "jobs": [{ "id": "uuid", "status": "queued" }] }
```

`track-call-event`

Input:

```json
{ "siteId": "uuid", "callerNumber": "+15551234567", "sourceUrl": "https://example.com/service", "status": "answered" }
```

Output:

```json
{ "ok": true, "callEventId": "uuid" }
```

`create-referral-link`

Input:

```json
{ "profileId": "uuid", "siteId": "uuid", "rewardKind": "credits|free_pages|discount" }
```

Output:

```json
{ "ok": true, "referralCode": "ROCKET-ABC123", "rewardText": "Two free pages when your referral signs up." }
```

`dismiss-or-approve-growth-opportunity`

Input:

```json
{ "opportunityId": "uuid", "action": "dismiss|preview|approve" }
```

Output:

```json
{ "ok": true, "status": "previewed", "estimatedCredits": 10 }
```

## Routes

Operator:

- `/login`
- `/cockpit`
- `/cockpit/sites/:siteId`
- `/cockpit/intake`
- `/cockpit/queue`
- `/cockpit/templates`
- `/cockpit/connectors`
- `/cockpit/settings`

Client:

- `/admin`
- `/admin/editor`
- `/admin/billing`
- `/admin/leads`
- `/admin/calls`
- `/admin/domain`
- `/admin/assistant`
- `/admin/connectors`
- `/admin/social`
- `/admin/growth`

Published site:

- `/`
- `/services`
- `/contact`
- `/privacy`
- `/sitemap.xml`
- `/robots.txt`
