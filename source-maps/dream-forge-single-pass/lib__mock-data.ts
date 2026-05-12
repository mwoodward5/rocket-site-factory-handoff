import type { BuildJob, Opportunity, TemplateKit, Wallet } from "@/lib/types";

export const templateKits: TemplateKit[] = [
  {
    id: "plumber-cinematic-01",
    name: "Blue Collar Cinematic",
    industry: "Plumbing",
    tier: "starter",
    lane: "One-page rebuild",
    previewUrl: "https://example.com/templates/plumber-cinematic-01",
    thumbnailGradient: "from-cyan-500 via-blue-600 to-slate-950",
    tags: ["Emergency CTA", "Trust badges", "Video hero"],
    popularity: 97,
    blocks: ["HeroVideo", "TrustStrip", "ServiceGrid", "Reviews", "StickyCall"]
  },
  {
    id: "roofer-authority-05",
    name: "Roof Authority Pro",
    industry: "Roofing",
    tier: "premier",
    lane: "Five-page premier",
    previewUrl: "https://example.com/templates/roofer-authority-05",
    thumbnailGradient: "from-amber-400 via-orange-700 to-zinc-950",
    tags: ["Insurance claims", "Before/after", "Local SEO"],
    popularity: 94,
    blocks: ["SplitHero", "ProofWall", "CityServices", "FAQ", "InspectionCTA"]
  },
  {
    id: "fence-domination-12",
    name: "Fence Domination Grid",
    industry: "Fence",
    tier: "domination",
    lane: "City-service matrix",
    previewUrl: "https://example.com/templates/fence-domination-12",
    thumbnailGradient: "from-emerald-400 via-lime-700 to-stone-950",
    tags: ["Geo pages", "Gallery", "Estimator"],
    popularity: 90,
    blocks: ["MapHero", "MaterialCards", "CityGrid", "Estimator", "Gallery"]
  },
  {
    id: "hvac-premier-03",
    name: "HVAC Response Center",
    industry: "HVAC",
    tier: "premier",
    lane: "Five-page premier",
    previewUrl: "https://example.com/templates/hvac-premier-03",
    thumbnailGradient: "from-sky-300 via-indigo-700 to-slate-950",
    tags: ["Seasonal offers", "Booking CTA", "Financing"],
    popularity: 88,
    blocks: ["SeasonalHero", "OfferCards", "BookingPanel", "Reviews", "MaintenancePlans"]
  }
];

export const buildJobs: BuildJob[] = [
  {
    id: "job-1001",
    business: {
      id: "biz-001",
      name: "Pro Plumbers Summerfield",
      industry: "Plumbing",
      city: "Summerfield",
      state: "FL",
      phone: "(555) 201-8899",
      primaryKeyword: "emergency plumber Summerfield FL",
      tier: "starter",
      templateId: "plumber-cinematic-01"
    },
    templateId: "plumber-cinematic-01",
    status: "building",
    progressPct: 68,
    currentStep: "Rendering service blocks and schema",
    estimatedCostUsd: 0.42,
    creditsCharged: 10,
    previewUrl: "https://pro-plumbers-summerfield.vercel.app",
    logs: [
      { ts: "04:41", level: "success", message: "Matched business to Blue Collar Cinematic template" },
      { ts: "04:42", level: "info", message: "Generated local hero copy and emergency CTA" },
      { ts: "04:43", level: "info", message: "Queued Playwright screenshot QA" }
    ]
  },
  {
    id: "job-1002",
    business: {
      id: "biz-002",
      name: "Auburn Fence Pros",
      industry: "Fence",
      city: "Auburn",
      state: "KY",
      phone: "(555) 310-4501",
      primaryKeyword: "fence installation Auburn KY",
      tier: "premier",
      templateId: "fence-domination-12"
    },
    templateId: "fence-domination-12",
    status: "qa",
    progressPct: 91,
    currentStep: "Checking mobile CTAs and city links",
    estimatedCostUsd: 1.26,
    creditsCharged: 18,
    qaScore: 94,
    previewUrl: "https://auburn-fence-pros.vercel.app",
    logs: [
      { ts: "04:38", level: "success", message: "Generated 5-page premier site" },
      { ts: "04:39", level: "warn", message: "Missing two gallery images, fallback selected" },
      { ts: "04:40", level: "success", message: "Schema passed validation" }
    ]
  }
];

export const wallet: Wallet = {
  businessId: "biz-001",
  balance: 126,
  totalPurchased: 250,
  totalSpent: 124
};

export const opportunities: Opportunity[] = [
  {
    id: "opp-001",
    title: "Emergency plumber searches rising",
    subtitle: "Add a storm-ready emergency landing section this week.",
    type: "keyword",
    metricLabel: "Search lift",
    metricValue: "+31%",
    trendPct: 31,
    suggestedActionKey: "create-emergency-section",
    suggestedCreditCost: 3
  },
  {
    id: "opp-002",
    title: "Competitor added financing block",
    subtitle: "Install a financing CTA and estimate widget on service pages.",
    type: "competitor",
    metricLabel: "Conversion gap",
    metricValue: "High",
    trendPct: 18,
    suggestedActionKey: "add-financing-widget",
    suggestedCreditCost: 4
  },
  {
    id: "opp-003",
    title: "Blog topic ready",
    subtitle: "Write: What to do before calling an emergency plumber.",
    type: "content",
    metricLabel: "Content score",
    metricValue: "87",
    trendPct: 12,
    suggestedActionKey: "write-blog-post",
    suggestedCreditCost: 2
  }
];
