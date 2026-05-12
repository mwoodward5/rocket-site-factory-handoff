export type SiteTier = "starter" | "premier" | "domination";
export type JobStatus = "queued" | "building" | "qa" | "ready" | "live" | "failed";

export type TemplateKit = {
  id: string;
  name: string;
  industry: string;
  tier: SiteTier;
  lane: string;
  previewUrl: string;
  thumbnailGradient: string;
  tags: string[];
  popularity: number;
  blocks: string[];
};

export type BusinessIntake = {
  id: string;
  name: string;
  industry: string;
  city: string;
  state: string;
  phone: string;
  email?: string;
  existingSiteUrl?: string;
  gbpUrl?: string;
  primaryKeyword: string;
  tier: SiteTier;
  templateId?: string;
};

export type BuildJob = {
  id: string;
  business: BusinessIntake;
  templateId: string;
  status: JobStatus;
  progressPct: number;
  currentStep: string;
  estimatedCostUsd: number;
  creditsCharged: number;
  qaScore?: number;
  previewUrl?: string;
  liveUrl?: string;
  logs: Array<{ ts: string; level: "info" | "warn" | "error" | "success"; message: string }>;
};

export type Wallet = {
  businessId: string;
  balance: number;
  totalPurchased: number;
  totalSpent: number;
};

export type Opportunity = {
  id: string;
  title: string;
  subtitle: string;
  type: "keyword" | "competitor" | "content" | "media" | "conversion";
  metricLabel: string;
  metricValue: string;
  trendPct: number;
  suggestedActionKey: string;
  suggestedCreditCost: number;
};

export type ChatPatch = {
  id: string;
  target: "copy" | "image" | "palette" | "seo" | "blog" | "ad";
  summary: string;
  creditsRequired: number;
  diffPreview: string[];
};
