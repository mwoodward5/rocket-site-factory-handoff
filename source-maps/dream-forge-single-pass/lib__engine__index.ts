import { estimateForTier } from "@/lib/engine/costs";
import { buildRecipe, pickTemplate } from "@/lib/engine/remixer";
import type { BuildJob, BusinessIntake } from "@/lib/types";

function now() {
  return new Date().toISOString();
}

export async function enqueueMockBuild(business: BusinessIntake): Promise<BuildJob> {
  const template = pickTemplate(business);
  const cost = estimateForTier(business.tier);
  const recipe = buildRecipe(business, template);

  return {
    id: `job-${crypto.randomUUID().slice(0, 8)}`,
    business,
    templateId: template.id,
    status: "queued",
    progressPct: 0,
    currentStep: "Queued for WSS Dream Forge remix engine",
    estimatedCostUsd: cost.internalUsd,
    creditsCharged: cost.credits,
    previewUrl: `https://${recipe.slug}.vercel.app`,
    logs: [
      { ts: now(), level: "success", message: `Matched to template: ${template.name}` },
      { ts: now(), level: "info", message: `Recipe ready with blocks: ${template.blocks.join(", ")}` },
      { ts: now(), level: "info", message: `Estimated internal cost: $${cost.internalUsd.toFixed(2)} / charge ${cost.credits} credits` }
    ]
  };
}

export async function previewChatPatch(prompt: string) {
  const lower = prompt.toLowerCase();
  const target =
    lower.includes("picture") || lower.includes("image") || lower.includes("hero") ? "image" :
    lower.includes("seo") || lower.includes("google") || lower.includes("schema") ? "seo" :
    lower.includes("blog") ? "blog" :
    lower.includes("ad") || lower.includes("door") ? "ad" :
    lower.includes("color") || lower.includes("palette") ? "palette" :
    "copy";

  const creditsRequired = target === "image" ? 2 : target === "blog" ? 2 : target === "ad" ? 6 : 1;

  return {
    id: `patch-${crypto.randomUUID().slice(0, 8)}`,
    target,
    summary: `Prepared a targeted ${target} patch instead of regenerating the whole site.`,
    creditsRequired,
    diffPreview: [
      `+ Interpret request: ${prompt}`,
      `+ Modify only affected ${target} slot`,
      "+ Preserve template structure, CTA placement, schema, and brand voice",
      "+ Re-run QA gate for mobile, CTA, and truth-rule safety"
    ]
  };
}
