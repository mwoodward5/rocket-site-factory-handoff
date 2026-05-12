import type { SiteTier } from "@/lib/types";

export const CREDIT_PRICE_USD = 0.5;

export const actionCosts = {
  newStarterSite: { internalUsd: 0.4, credits: 10 },
  newPremierSite: { internalUsd: 1.35, credits: 18 },
  newDominationSite: { internalUsd: 3.5, credits: 40 },
  heroImage: { internalUsd: 0.08, credits: 2 },
  cinematicHero: { internalUsd: 1.5, credits: 8 },
  copyEdit: { internalUsd: 0.02, credits: 1 },
  blogPost: { internalUsd: 0.05, credits: 2 },
  doorHanger: { internalUsd: 0.3, credits: 6 }
} as const;

export function estimateForTier(tier: SiteTier) {
  if (tier === "starter") return actionCosts.newStarterSite;
  if (tier === "premier") return actionCosts.newPremierSite;
  return actionCosts.newDominationSite;
}
