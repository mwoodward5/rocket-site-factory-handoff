import type { HeroMediaPlan, MediaBusinessPacket } from './types';

function list(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(item => String(item).trim()).filter(Boolean);
  if (typeof value === 'string') return value.split(/[,;\n]/).map(item => item.trim()).filter(Boolean);
  return [];
}

function text(value: unknown, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

export function packetFromManifest(manifest: Record<string, any> = {}): MediaBusinessPacket {
  const packet = manifest.businessPacket || {};
  const businessName = text(packet.businessName, text(packet.name, text(manifest.name, 'Local business')));
  const niche = text(packet.niche, 'local service');
  const city = text(packet.city, 'local market');
  const state = text(packet.state);
  const region = text(packet.region);
  const services = list(packet.services).length ? list(packet.services) : [niche];
  const serviceArea = list(packet.serviceArea).length
    ? list(packet.serviceArea)
    : list(packet.serviceAreas).length
      ? list(packet.serviceAreas)
      : [city, region].filter(Boolean);

  return {
    businessName,
    niche,
    city,
    state,
    region,
    services,
    serviceArea,
    visualVariant: text(packet.visualVariant),
  };
}

export function createHeroMediaPlan({
  slug,
  business,
}: {
  slug: string;
  business: MediaBusinessPacket;
}): HeroMediaPlan {
  const place = [business.city, business.region || business.state].filter(Boolean).join(', ');
  const servicePhrase = business.services.slice(0, 4).join(', ');
  const serviceArea = business.serviceArea.slice(0, 5).join(', ');

  const cinematicVideo = [
    `Create an 8 second cinematic website hero loop for ${business.businessName}, a ${business.niche} brand serving ${place}.`,
    `Visual mood: bright Apple-modern luxury, warm daylight, tasteful depth, premium editorial composition, no dark navy bubble dashboard look.`,
    `Scene: abstract concept art for ${business.niche}, not a real completed client project. Show layered foreground glass UI cards, midground material/plan surfaces, and background motion lighting.`,
    `Camera: slow dolly, shallow depth, subtle parallax, soft light sweep, restrained premium movement that can loop cleanly.`,
    `Use safe non-claim visuals only. Do not show fake staff, fake reviews, fake awards, fake badges, fake license numbers, or fake finished project photos.`,
    `Focus themes: ${servicePhrase || business.niche}. Service area context: ${serviceArea || place}.`,
  ].join(' ');

  const heroStill = [
    `Premium hero still for ${business.businessName}: ${business.niche} in ${place}.`,
    `Bright luxury editorial website art, cinematic light, clean material palette, layered glass interface cards, motion-ready composition, high-end local business homepage.`,
    `No logos from unrelated brands, no fake review stars, no fake project photo claims, no text clutter.`,
  ].join(' ');

  return {
    slug,
    generatedAt: new Date().toISOString(),
    business,
    objective: 'Replace empty CSS-only hero presentation with provider-ready cinematic image/video prompts and a local poster fallback.',
    recommendedStack: {
      primaryVideo: 'google-veo',
      primaryImage: 'openai-images',
      stockMedia: 'envato-elements',
      visualPlanner: 'kimi-planner',
      localFallback: 'local-svg-poster',
    },
    prompts: {
      cinematicVideo,
      heroStill,
      negativePrompt:
        'No fake reviews, no fake ratings, no fabricated awards, no stock-photo-as-client-work, no unrelated business names, no navy bubble UI, no oversized cartoon buttons, no generic centered contractor hero.',
      cssPosterFallback:
        `Generate a local abstract SVG poster field for ${business.niche}: bright gradients, glass panels, blueprint lines, depth layers, no fake photography.`,
    },
    shots: [
      {
        name: 'Opening light field',
        durationSeconds: 2,
        camera: 'slow push-in',
        motion: 'ambient gradient and grain drift',
        visual: `Sunlit ${business.niche} concept field with clean architectural depth.`,
      },
      {
        name: 'Planner layer reveal',
        durationSeconds: 3,
        camera: 'left-to-right parallax',
        motion: 'glass UI cards slide 12px with light sweep',
        visual: 'Interactive planning widget floating above material and layout surfaces.',
      },
      {
        name: 'CTA settle',
        durationSeconds: 3,
        camera: 'micro dolly back to balanced composition',
        motion: 'soft shine pass and loop return',
        visual: `Readable premium hero for ${business.businessName} with safe service-area context.`,
      },
    ],
    safetyRules: [
      'Generated or stock media must be labeled as concept/supporting visuals until approved.',
      'Do not claim generated visuals are real client work.',
      'Paid media calls require MEDIA_GENERATION_ALLOW_PAID=true and explicit UI confirmation.',
      'Every provider output must pass residue, no-fake-claims, humanity, and visual QA gates.',
    ],
    paidCallRequired: false,
    paidCallBlockedReason: 'This plan was generated locally. Real provider media is blocked until keys and explicit paid confirmation exist.',
    externalCallsUsed: 0,
  };
}
