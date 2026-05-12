import type { MediaProviderStatusItem } from './types';

function hasEnv(name: string) {
  return Boolean(process.env[name]?.trim());
}

function allowPaidMedia() {
  return process.env.MEDIA_GENERATION_ALLOW_PAID === 'true';
}

function anyEnv(names: string[]) {
  return names.some(hasEnv);
}

function isTrue(name: string) {
  return process.env[name] === 'true';
}

function providerStatus(configured: boolean): MediaProviderStatusItem['status'] {
  if (!configured) return 'missing-env';
  return allowPaidMedia() ? 'ready' : 'configured-blocked';
}

export function getMediaProviderStatuses(): MediaProviderStatusItem[] {
  const allowPaid = allowPaidMedia();
  const googleAuthConfigured =
    hasEnv('GOOGLE_VERTEX_ACCESS_TOKEN') ||
    isTrue('GOOGLE_USE_GCLOUD_AUTH');
  const googleConfigured =
    hasEnv('GOOGLE_CLOUD_PROJECT') &&
    hasEnv('GOOGLE_CLOUD_STORAGE_URI') &&
    isTrue('GOOGLE_VERTEX_AI_ENABLED') &&
    googleAuthConfigured;

  const runwayConfigured = hasEnv('RUNWAY_API_KEY');
  const openAiConfigured = hasEnv('OPENAI_API_KEY');
  const replicateConfigured = hasEnv('REPLICATE_API_TOKEN');
  const kimiConfigured = anyEnv(['KIMI_API_KEY', 'MOONSHOT_API_KEY']);
  const envatoElementsConfigured = hasEnv('ENVATO_ELEMENTS_USERNAME') && hasEnv('ENVATO_ELEMENTS_PASSWORD');
  const envatoMarketApiConfigured = hasEnv('ENVATO_MARKET_API_TOKEN');
  const pexelsConfigured = hasEnv('PEXELS_API_KEY');

  return [
    {
      id: 'google-veo',
      label: 'Google Veo on Vertex AI',
      kind: 'video',
      configured: googleConfigured,
      allowPaid,
      status: providerStatus(googleConfigured),
      estimatedCostLabel:
        'Paid by generated video seconds. Veo 3.1 Fast can be cheaper for iteration; standard Veo is higher quality.',
      env: [
        'GOOGLE_CLOUD_PROJECT',
        'GOOGLE_CLOUD_LOCATION',
        'GOOGLE_CLOUD_STORAGE_URI',
        'GOOGLE_VERTEX_AI_ENABLED',
        'GOOGLE_USE_GCLOUD_AUTH or GOOGLE_VERTEX_ACCESS_TOKEN',
      ],
      detail: 'Primary cinematic hero-video target. Generates videos from text or image prompts through Vertex AI long-running operations.',
      docsUrl: 'https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/veo-video-generation',
    },
    {
      id: 'runway',
      label: 'Runway API',
      kind: 'video',
      configured: runwayConfigured,
      allowPaid,
      status: providerStatus(runwayConfigured),
      estimatedCostLabel: 'Paid video/image generation by Runway account billing.',
      env: ['RUNWAY_API_KEY'],
      detail: 'Alternate cinematic video API for Gen video models when Runway billing and API key are configured.',
      docsUrl: 'https://docs.dev.runwayml.com/',
    },
    {
      id: 'openai-images',
      label: 'OpenAI Images',
      kind: 'image',
      configured: openAiConfigured,
      allowPaid,
      status: providerStatus(openAiConfigured),
      estimatedCostLabel: 'Paid image generation. Use for still hero art, OG images, and editable concept references.',
      env: ['OPENAI_API_KEY'],
      detail: 'Best fit for high-quality still hero concepts and reference images, not final video.',
      docsUrl: 'https://platform.openai.com/docs/guides/image-generation',
    },
    {
      id: 'envato-elements',
      label: 'Envato Elements Licensed Media',
      kind: 'stock',
      configured: envatoElementsConfigured,
      allowPaid: false,
      status: envatoElementsConfigured ? 'manual-ready' : 'missing-env',
      estimatedCostLabel: 'Uses existing Envato subscription. Downloads/licensing remain manual unless Envato exposes an Elements download API.',
      env: ['ENVATO_ELEMENTS_USERNAME', 'ENVATO_ELEMENTS_PASSWORD'],
      detail:
        'Primary licensed stock photo, footage, graphics, and template source for cinematic heroes. The factory can plan and track assets, but must not auto-download or redistribute raw Envato files.',
      docsUrl: 'https://elements.envato.com/',
    },
    {
      id: 'envato-market-api',
      label: 'Envato Market API',
      kind: 'stock',
      configured: envatoMarketApiConfigured,
      allowPaid,
      status: providerStatus(envatoMarketApiConfigured),
      estimatedCostLabel: 'Official Envato Market API. Useful for Market catalog/search metadata, not confirmed as an Elements asset download API.',
      env: ['ENVATO_MARKET_API_TOKEN'],
      detail:
        'Optional official API integration point for Envato Market metadata. Elements media sourcing still requires licensed project downloads and manifest tracking.',
      docsUrl: 'https://build.envato.com/api/',
    },
    {
      id: 'pexels',
      label: 'Pexels Free Stock Media',
      kind: 'stock',
      configured: pexelsConfigured,
      allowPaid: false,
      status: pexelsConfigured ? 'ready' : 'missing-env',
      estimatedCostLabel: '$0.00 API access subject to Pexels limits and license terms.',
      env: ['PEXELS_API_KEY'],
      detail:
        'Free photo/video fallback for cinematic heroes when Envato or generated media is not ready. Every selected asset still needs attribution/license tracking in the media manifest.',
      docsUrl: 'https://www.pexels.com/api/documentation/',
    },
    {
      id: 'google-imagen',
      label: 'Google Imagen on Vertex AI',
      kind: 'image',
      configured: googleConfigured,
      allowPaid,
      status: providerStatus(googleConfigured),
      estimatedCostLabel: 'Paid image generation through Vertex AI.',
      env: ['GOOGLE_CLOUD_PROJECT', 'GOOGLE_CLOUD_LOCATION', 'GOOGLE_USE_GCLOUD_AUTH or GOOGLE_VERTEX_ACCESS_TOKEN'],
      detail: 'Google still-image option for polished hero/poster art before image-to-video.',
      docsUrl: 'https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/imagen-api',
    },
    {
      id: 'replicate',
      label: 'Replicate',
      kind: 'image',
      configured: replicateConfigured,
      allowPaid,
      status: providerStatus(replicateConfigured),
      estimatedCostLabel: 'Paid per model prediction.',
      env: ['REPLICATE_API_TOKEN'],
      detail: 'Future model marketplace lane for FLUX and video/image experiments. Disabled until confirmed.',
      docsUrl: 'https://replicate.com/docs',
    },
    {
      id: 'kimi-planner',
      label: 'Kimi / Moonshot Planner',
      kind: 'planner',
      configured: kimiConfigured,
      allowPaid,
      status: providerStatus(kimiConfigured),
      estimatedCostLabel: 'Paid text/multimodal reasoning if enabled. Not a final image/video generator in this integration.',
      env: ['KIMI_API_KEY', 'MOONSHOT_API_KEY'],
      detail: 'Useful for visual planning, code critique, and prompt compilation. Media output remains routed to image/video providers.',
      docsUrl: 'https://platform.kimi.ai/docs/introduction',
    },
    {
      id: 'local-svg-poster',
      label: 'Local SVG Poster',
      kind: 'local',
      configured: true,
      allowPaid: false,
      status: 'local-ready',
      estimatedCostLabel: '$0.00',
      env: [],
      detail: 'Always available deterministic fallback that creates concept poster art and shot plans without provider spend.',
      docsUrl: '',
    },
  ];
}

export function canRunPaidMediaProvider(providerId: string, explicitConfirmation: boolean) {
  const provider = getMediaProviderStatuses().find(item => item.id === providerId);
  if (!provider) {
    return { allowed: false, reason: `Unknown media provider: ${providerId}` };
  }

  if (provider.id === 'local-svg-poster') {
    return { allowed: true, reason: 'Local poster generation does not call an external provider.' };
  }

  if (provider.id === 'envato-elements') {
    return {
      allowed: false,
      reason:
        'Envato Elements is connected as a licensed manual media source. Use the generated asset plan and manifest; do not run it as a paid generation provider.',
    };
  }

  if (!provider.configured) {
    return { allowed: false, reason: `${provider.label} is missing required environment variables.` };
  }

  if (!process.env.MEDIA_GENERATION_ALLOW_PAID || process.env.MEDIA_GENERATION_ALLOW_PAID !== 'true') {
    return { allowed: false, reason: 'MEDIA_GENERATION_ALLOW_PAID is not true.' };
  }

  if (!explicitConfirmation) {
    return { allowed: false, reason: 'Explicit paid-action confirmation was not provided.' };
  }

  return { allowed: true, reason: `${provider.label} is configured and explicitly confirmed.` };
}

export function getLocalSeoProviderStatuses() {
  const brightLocalConfigured = Boolean(process.env.BRIGHTLOCAL_API_KEY?.trim());
  const brightDataConfigured = Boolean(process.env.BRIGHT_DATA_API_KEY?.trim()) && Boolean(process.env.BRIGHT_DATA_ZONE?.trim());

  return [
    {
      id: 'brightlocal',
      label: 'BrightLocal',
      configured: brightLocalConfigured,
      status: brightLocalConfigured ? 'configured-blocked' : 'missing-env',
      externalCallsUsed: 0,
      estimatedCostLabel: 'Zero spend until a user-confirmed local SEO pull is requested.',
      env: ['BRIGHTLOCAL_API_KEY'],
      capabilities: ['citationTracker', 'localRankFlex', 'gbpAudit', 'reputationManager'],
    },
    {
      id: 'bright-data',
      label: 'Bright Data',
      configured: brightDataConfigured,
      status: brightDataConfigured ? 'configured-blocked' : 'missing-env',
      externalCallsUsed: 0,
      estimatedCostLabel: 'Zero spend until a user-confirmed SERP/local-pack scrape is requested.',
      env: ['BRIGHT_DATA_API_KEY', 'BRIGHT_DATA_ZONE'],
      capabilities: ['serpScrape', 'localPackScrape'],
    },
  ];
}
