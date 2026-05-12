export type MediaProviderId =
  | 'google-veo'
  | 'google-imagen'
  | 'openai-images'
  | 'envato-elements'
  | 'envato-market-api'
  | 'pexels'
  | 'runway'
  | 'replicate'
  | 'kimi-planner'
  | 'local-svg-poster';

export type MediaProviderKind = 'video' | 'image' | 'stock' | 'planner' | 'local';

export type MediaProviderStatus = 'ready' | 'configured-blocked' | 'manual-ready' | 'missing-env' | 'local-ready';

export interface MediaProviderStatusItem {
  id: MediaProviderId;
  label: string;
  kind: MediaProviderKind;
  status: MediaProviderStatus;
  configured: boolean;
  allowPaid: boolean;
  estimatedCostLabel: string;
  env: string[];
  detail: string;
  docsUrl: string;
}

export interface MediaBusinessPacket {
  businessName: string;
  niche: string;
  city: string;
  state?: string;
  region?: string;
  services: string[];
  serviceArea: string[];
  visualVariant?: string;
}

export interface HeroMediaPlan {
  slug: string;
  generatedAt: string;
  business: MediaBusinessPacket;
  objective: string;
  recommendedStack: {
    primaryVideo: MediaProviderId;
    primaryImage: MediaProviderId;
    stockMedia: MediaProviderId;
    visualPlanner: MediaProviderId;
    localFallback: MediaProviderId;
  };
  prompts: {
    cinematicVideo: string;
    heroStill: string;
    negativePrompt: string;
    cssPosterFallback: string;
  };
  shots: Array<{
    name: string;
    durationSeconds: number;
    camera: string;
    motion: string;
    visual: string;
  }>;
  safetyRules: string[];
  paidCallRequired: boolean;
  paidCallBlockedReason: string;
  externalCallsUsed: number;
  localPosterPath?: string;
}

export interface PrepareHeroMediaResult {
  ok: true;
  plan: HeroMediaPlan;
  providerStatuses: MediaProviderStatusItem[];
}
