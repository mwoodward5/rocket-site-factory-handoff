import { promises as fs } from 'node:fs';
import path from 'node:path';
import { packetFromManifest } from './prompt-builder';
import type { MediaBusinessPacket } from './types';

export interface EnvatoAssetPlan {
  slug: string;
  generatedAt: string;
  business: MediaBusinessPacket;
  source: 'envato-elements';
  apiTruth: {
    elementsDownloadApiAvailable: false;
    marketApiSupported: boolean;
    note: string;
  };
  externalCallsUsed: 0;
  licensingRules: string[];
  searchSets: Array<{
    slot: string;
    intent: string;
    queries: string[];
    mediaType: 'stock-video' | 'photo' | 'graphics' | 'template';
    envatoSearchUrl: string;
  }>;
  requiredManifestFields: string[];
}

function text(value: unknown, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function envatoSearchUrl(query: string, mediaType: EnvatoAssetPlan['searchSets'][number]['mediaType']) {
  const encoded = encodeURIComponent(query);
  const category = mediaType === 'stock-video' ? 'stock-video' : mediaType === 'photo' ? 'photos' : mediaType;
  return `https://elements.envato.com/${category}/${encoded}`;
}

export function createEnvatoAssetPlan({
  slug,
  business,
}: {
  slug: string;
  business: MediaBusinessPacket;
}): EnvatoAssetPlan {
  const place = [business.city, business.region || business.state].filter(Boolean).join(' ');
  const niche = business.niche || 'local service';
  const heroBase = `${niche} ${place}`.trim();
  const services = business.services.slice(0, 4).join(' ');

  const searchSets: EnvatoAssetPlan['searchSets'] = [
    {
      slot: 'cinematic-hero-video',
      intent: 'Primary above-the-fold motion: real footage or abstract premium b-roll that can sit behind the hero copy.',
      queries: [
        `${heroBase} cinematic`,
        `${niche} luxury interior slow motion`,
        `${niche} premium home renovation b roll`,
      ],
      mediaType: 'stock-video',
      envatoSearchUrl: envatoSearchUrl(`${heroBase} cinematic`, 'stock-video'),
    },
    {
      slot: 'hero-poster-still',
      intent: 'Fallback poster or first frame for the hero video.',
      queries: [`${heroBase} editorial`, `${niche} bright modern`, `${services || niche} detail`],
      mediaType: 'photo',
      envatoSearchUrl: envatoSearchUrl(`${heroBase} editorial`, 'photo'),
    },
    {
      slot: 'section-texture-graphics',
      intent: 'Subtle overlays, blueprint lines, material textures, and non-stock-feeling visual depth.',
      queries: [`${niche} blueprint texture`, 'luxury editorial gradient overlay', 'architectural line pattern'],
      mediaType: 'graphics',
      envatoSearchUrl: envatoSearchUrl(`${niche} blueprint texture`, 'graphics'),
    },
    {
      slot: 'motion-template-reference',
      intent: 'Motion direction reference only. Do not ship raw template projects unless transformed and licensed for this end product.',
      queries: [`${niche} promo opener`, 'cinematic website hero opener', 'luxury service promo template'],
      mediaType: 'template',
      envatoSearchUrl: envatoSearchUrl(`${niche} promo opener`, 'template'),
    },
  ];

  return {
    slug,
    generatedAt: new Date().toISOString(),
    business,
    source: 'envato-elements',
    apiTruth: {
      elementsDownloadApiAvailable: false,
      marketApiSupported: Boolean(process.env.ENVATO_MARKET_API_TOKEN),
      note:
        'Envato Market has an official API, but this connector does not claim automated Envato Elements asset download/licensing. Use manual licensed downloads plus media-source-manifest tracking.',
    },
    externalCallsUsed: 0,
    licensingRules: [
      'Download/license each Envato asset for the specific client project or end product.',
      'Do not commit Envato login credentials, raw source archives, or license certificates into public repos.',
      'Do not let end users extract raw Envato assets from a SaaS/template product.',
      'Track asset title, URL, author, license/project name, local path, and usage slot before publish.',
      'Use Envato media as part of a larger designed website experience, not as an as-is standalone product.',
    ],
    searchSets,
    requiredManifestFields: [
      'assetId',
      'title',
      'envatoUrl',
      'author',
      'licenseProjectName',
      'downloadedAt',
      'localPath',
      'usageSlot',
      'transformationNotes',
    ],
  };
}

async function readJson(filePath: string) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch {
    return null;
  }
}

export async function createEnvatoAssetPlanForSlug(slug: string, cwd = process.cwd()) {
  const normalizedSlug = slugify(String(slug || '').trim());
  if (!normalizedSlug) throw new Error('A project slug is required.');

  const manifestPath = path.join(cwd, '.saved-projects', normalizedSlug, 'manifest.json');
  const manifest = (await readJson(manifestPath)) || { slug: normalizedSlug, name: normalizedSlug };
  const business = packetFromManifest(manifest);
  const plan = createEnvatoAssetPlan({ slug: normalizedSlug, business });

  const reportDir = path.join(cwd, 'reports', normalizedSlug);
  const siteDir = path.join(cwd, 'public', 'generated-sites', normalizedSlug);
  await fs.mkdir(reportDir, { recursive: true });
  await fs.mkdir(siteDir, { recursive: true });

  const planPath = path.join(reportDir, 'envato-asset-plan.json');
  const manifestPathOut = path.join(siteDir, 'media-source-manifest.json');
  const manifestTemplatePath = path.join(reportDir, 'envato-media-source-manifest.template.json');
  const emptyManifest = {
    slug: normalizedSlug,
    generatedAt: new Date().toISOString(),
    source: 'envato-elements',
    externalCallsUsed: 0,
    publishGate: 'blocked-until-assets-licensed-and-tracked',
    assets: [],
    requiredFields: plan.requiredManifestFields,
  };

  await fs.writeFile(planPath, `${JSON.stringify(plan, null, 2)}\n`, 'utf8');
  try {
    await fs.access(manifestPathOut);
  } catch {
    await fs.writeFile(manifestPathOut, `${JSON.stringify(emptyManifest, null, 2)}\n`, 'utf8');
  }
  await fs.writeFile(manifestTemplatePath, `${JSON.stringify(emptyManifest, null, 2)}\n`, 'utf8');

  return {
    ok: true as const,
    plan,
    planPath,
    mediaSourceManifestPath: manifestPathOut,
    mediaSourceTemplatePath: manifestTemplatePath,
    externalCallsUsed: 0 as const,
  };
}

export function getEnvatoReadiness() {
  const hasElementsCredentials = Boolean(process.env.ENVATO_ELEMENTS_USERNAME && process.env.ENVATO_ELEMENTS_PASSWORD);
  const hasMarketToken = Boolean(process.env.ENVATO_MARKET_API_TOKEN);
  return {
    ok: hasElementsCredentials || hasMarketToken,
    elementsCredentials: hasElementsCredentials ? 'configured-redacted' : 'missing',
    marketApiToken: hasMarketToken ? 'configured-redacted' : 'missing',
    externalCallsUsed: 0,
    elementsDownloadApiAvailable: false,
    status: hasElementsCredentials
      ? 'manual-elements-sourcing-ready'
      : hasMarketToken
        ? 'market-api-metadata-ready'
        : 'missing-env',
    blockers: [
      ...(!hasElementsCredentials ? ['Set ENVATO_ELEMENTS_USERNAME and ENVATO_ELEMENTS_PASSWORD in local env or use manual browser login.'] : []),
      'Envato Elements downloads and project licensing must be completed through the Envato product unless an official Elements download API is provided.',
    ],
  };
}
