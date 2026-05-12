import { templateKits } from "@/lib/mock-data";
import type { BusinessIntake, TemplateKit } from "@/lib/types";

export function scoreTemplate(business: BusinessIntake, template: TemplateKit) {
  let score = template.popularity;
  if (template.industry.toLowerCase() === business.industry.toLowerCase()) score += 40;
  if (template.tier === business.tier) score += 30;
  if (template.tags.some((tag) => business.primaryKeyword.toLowerCase().includes(tag.toLowerCase()))) score += 5;
  return score;
}

export function pickTemplate(business: BusinessIntake) {
  if (business.templateId) {
    const exact = templateKits.find((template) => template.id === business.templateId);
    if (exact) return exact;
  }

  return [...templateKits].sort((a, b) => scoreTemplate(business, b) - scoreTemplate(business, a))[0];
}

export function generateSiteSlug(business: BusinessIntake) {
  return `${business.name}-${business.city}-${business.state}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildRecipe(business: BusinessIntake, template: TemplateKit) {
  return {
    businessId: business.id,
    templateId: template.id,
    slug: generateSiteSlug(business),
    palette: template.thumbnailGradient,
    blocks: template.blocks,
    copySlots: {
      heroHeadline: `${business.name}: ${business.primaryKeyword.replace(/\b\w/g, (letter) => letter.toUpperCase())}`,
      heroSubhead: `Fast, local, trust-first ${business.industry.toLowerCase()} service in ${business.city}, ${business.state}.`,
      primaryCta: `Call ${business.phone}`,
      proofLine: "Locally targeted, mobile-first, SEO-ready, and built from a tested WSS template kit."
    },
    seo: {
      title: `${business.primaryKeyword} | ${business.name}`,
      description: `${business.name} helps ${business.city} homeowners with fast ${business.industry.toLowerCase()} service, honest guidance, and easy scheduling.`,
      schemaTypes: ["LocalBusiness", "Service", "FAQPage", "BreadcrumbList"]
    }
  };
}
