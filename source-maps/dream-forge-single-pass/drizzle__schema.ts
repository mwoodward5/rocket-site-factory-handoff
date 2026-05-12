import { integer, jsonb, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const businesses = pgTable("businesses", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id"),
  ownerUserId: uuid("owner_user_id"),
  name: text("name").notNull(),
  industry: text("industry").notNull(),
  city: text("city"),
  state: text("state"),
  phone: text("phone"),
  email: text("email"),
  primaryKeyword: text("primary_keyword"),
  secondaryKeywords: jsonb("secondary_keywords").$type<string[]>().default([]),
  truthRules: jsonb("truth_rules").$type<string[]>().default([]),
  promises: jsonb("promises").$type<string[]>().default([]),
  gbpUrl: text("gbp_url"),
  existingSiteUrl: text("existing_site_url"),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").defaultNow()
});

export const templates = pgTable("templates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  industry: text("industry"),
  tier: text("tier"),
  thumbnailUrl: text("thumbnail_url"),
  previewUrl: text("preview_url"),
  tags: jsonb("tags").$type<string[]>(),
  lane: text("lane"),
  paletteFamily: text("palette_family"),
  typographyPair: text("typography_pair"),
  widgetType: text("widget_type"),
  popularity: integer("popularity").default(0),
  recipeJson: jsonb("recipe_json")
});

export const sites = pgTable("sites", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id"),
  templateId: text("template_id"),
  tier: text("tier"),
  status: text("status"),
  previewUrl: text("preview_url"),
  liveUrl: text("live_url"),
  vercelProjectId: text("vercel_project_id"),
  qaScore: integer("qa_score"),
  lighthouseScore: integer("lighthouse_score"),
  lastBuiltAt: timestamp("last_built_at")
});

export const creditWallets = pgTable("credit_wallets", {
  businessId: uuid("business_id").primaryKey(),
  balance: integer("balance").default(0),
  totalPurchased: integer("total_purchased").default(0),
  totalSpent: integer("total_spent").default(0)
});

export const creditTransactions = pgTable("credit_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  walletBusinessId: uuid("wallet_business_id"),
  type: text("type"),
  amount: integer("amount").notNull(),
  description: text("description"),
  relatedActionId: text("related_action_id"),
  stripeChargeId: text("stripe_charge_id"),
  createdAt: timestamp("created_at").defaultNow()
});

export const buildJobs = pgTable("build_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  siteId: uuid("site_id"),
  status: text("status"),
  progressPct: integer("progress_pct").default(0),
  currentStep: text("current_step"),
  logs: jsonb("logs").$type<Array<{ ts: string; level: string; message: string }>>(),
  estimatedCostUsd: numeric("estimated_cost_usd"),
  actualCostUsd: numeric("actual_cost_usd"),
  providersCalled: jsonb("providers_called").$type<string[]>(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at")
});

export const opportunities = pgTable("opportunities", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id"),
  type: text("type"),
  title: text("title"),
  subtitle: text("subtitle"),
  metricLabel: text("metric_label"),
  metricValue: text("metric_value"),
  trend: text("trend"),
  trendPct: integer("trend_pct"),
  cpcUsd: numeric("cpc_usd"),
  competitionLevel: text("competition_level"),
  suggestedActionKey: text("suggested_action_key"),
  suggestedCreditCost: integer("suggested_credit_cost"),
  previewSnippet: text("preview_snippet"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow()
});
