# Wiring Contract

Everything Lovable needs to wire on first run.

## Environment variables

| Key | Used by | Required |
|---|---|---|
| `OPENAI_API_KEY` | chat, image gen, ai-edit | **yes** |
| `FIRECRAWL_API_KEY` | site collection edge function | **yes** |
| `BRIGHT_DATA_API_KEY` | bright-data.ts | **yes** |
| `BRIGHT_DATA_ZONE` | bright-data.ts | **yes** — set to `serp_api1` (no trailing newline) |
| `DATAFORSEO_LOGIN` | dataforseo.ts | optional |
| `DATAFORSEO_PASSWORD` | dataforseo.ts | optional |
| `GOOGLE_PLACES_API_KEY` | places-enrich edge function | **yes** |
| `STRIPE_SECRET_KEY` | billing | **yes** |
| `STRIPE_WEBHOOK_SECRET` | stripe-webhook function | **yes** |
| `TWILIO_ACCOUNT_SID` | call tracking add-on | optional |
| `TWILIO_AUTH_TOKEN` | call tracking add-on | optional |
| `RESEND_API_KEY` (or similar) | magic-link emails to clients | **yes** |

## Supabase schema

```sql
-- Profiles
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text not null default 'client' check (role in ('operator','client')),
  stripe_customer_id text,
  created_at timestamptz default now()
);

-- Sites
create table sites (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  owner_id uuid references profiles(id) on delete cascade,
  business_name text not null,
  industry text,
  city text,
  state text,
  phone text,
  email text,
  primary_color text,
  accent_color text,
  status text not null default 'draft' check (status in ('draft','live','paused')),
  custom_domain text,
  stripe_subscription_id text,
  plan_tier text not null default 'starter' check (plan_tier in ('starter','pro','business')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Pages (sections stored as JSON)
create table pages (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references sites(id) on delete cascade,
  slug text not null,
  title text,
  sections_json jsonb not null default '[]'::jsonb,
  seo_meta jsonb,
  published_at timestamptz,
  unique(site_id, slug)
);

-- Assets
create table assets (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references sites(id) on delete cascade,
  kind text not null check (kind in ('image','logo','video')),
  storage_path text not null,
  alt_text text,
  source text not null check (source in ('uploaded','generated','firecrawl','bright_data')),
  created_at timestamptz default now()
);

-- Leads
create table leads (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references sites(id) on delete cascade,
  name text,
  email text,
  phone text,
  message text,
  source text,
  created_at timestamptz default now()
);

-- Messages (chat history per site)
create table messages (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references sites(id) on delete cascade,
  user_id uuid references profiles(id),
  role text not null check (role in ('user','assistant')),
  content text,
  attachments jsonb,
  created_at timestamptz default now()
);

-- Add-ons
create table add_ons (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references sites(id) on delete cascade,
  kind text not null,
  stripe_price_id text,
  status text not null default 'active',
  activated_at timestamptz default now()
);

-- Activity log
create table activity_log (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references sites(id) on delete cascade,
  actor_id uuid references profiles(id),
  action text not null,
  payload jsonb,
  created_at timestamptz default now()
);
```

## RLS

```sql
alter table profiles enable row level security;
alter table sites enable row level security;
alter table pages enable row level security;
alter table assets enable row level security;
alter table leads enable row level security;
alter table messages enable row level security;
alter table add_ons enable row level security;
alter table activity_log enable row level security;

-- Operator can do everything
create policy operator_all on sites for all
  using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'operator'))
  with check (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'operator'));
-- (repeat the same operator_all pattern on every other table)

-- Client can only touch rows they own
create policy client_own_sites on sites for all
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());
-- For pages/assets/leads/messages/add_ons/activity_log: scope through sites.owner_id
```

## Edge functions to build

Each is a single TypeScript file in `/supabase/functions/<name>/index.ts`. They all import from `_shared/providers/`.

| Function | Input | Output |
|---|---|---|
| `firecrawl-collect` | `{ url: string }` | Creates `sites` row + draft `pages.sections_json` + uploads assets. Returns `{ site_id }`. |
| `bright-data-enrich` | `{ business_name, city, state }` | Updates `sites` with phone/address/hours + `pages.seo_meta`. |
| `places-enrich` | `{ business_name, city, state }` | Same as bright-data, fallback path. |
| `generate-image` | `{ site_id, prompt, aspect_ratio }` | Uploads to storage, inserts `assets` row, returns `{ asset_id, url }`. |
| `generate-logo` | `{ business_name, style }` | Returns SVG string + uploads PNG to storage. |
| `ai-edit` | `{ site_id, instruction, attachments? }` | Streams patched `sections_json`. |
| `publish-site` | `{ site_id }` | Renders to static HTML + deploys to Lovable hosting. Sets `pages.published_at`. |
| `stripe-webhook` | Stripe event | Updates `sites.plan_tier`, `add_ons.status`. |
| `create-checkout` | `{ site_id, price_id }` | Returns Stripe Checkout URL. |
| `customer-portal` | `{ site_id }` | Returns Stripe Billing Portal URL. |

## Stripe products (setup script runs on first deploy)

| Product | Monthly price |
|---|---|
| Starter | $79 |
| Pro | $149 |
| Business | $299 |
| Add-on: Extra page | $20 |
| Add-on: AI chatbot widget | $49 |
| Add-on: Booking | $49 |
| Add-on: Call tracking | $29 |
