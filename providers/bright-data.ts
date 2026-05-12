/**
 * Bright Data provider — real REST client for SERP + GBP lookups.
 *
 * Auth: Bearer <BRIGHT_DATA_API_KEY> via Bright Data Web Unlocker / SERP API.
 * Docs:
 *  - SERP API:        https://docs.brightdata.com/scraping-automation/serp-api
 *  - SERP reference:  https://docs.brightdata.com/api-reference/rest-api/serp/serp-api
 *  - Google params:   https://docs.brightdata.com/scraping-automation/serp-api/query-parameters/google
 *
 * Env:
 *  - BRIGHT_DATA_API_KEY (preferred) / BRIGHTDATA_API_KEY (alias)
 *  - BRIGHT_DATA_ZONE (default: serp_api1)
 *  - BRIGHT_DATA_COUNTRY (default: us)
 *  - BRIGHT_DATA_LANGUAGE (default: en)
 *
 * Backward-compatible: existing zero-spend helpers (getBrightDataStatus, runBrightData,
 * serpScrape, localPackScrape) are preserved. New: BrightDataProvider class with
 * getSerpData() + getGBPData() — these are what enrichment.ts already imports.
 */

export type BrightDataEndpoint = 'serpScrape' | 'localPackScrape';

export type BrightDataRequest = {
  endpoint: BrightDataEndpoint;
  query?: string;
  location?: string;
};

export type BrightDataResult =
  | {
      ok: false;
      provider: 'bright-data';
      endpoint: BrightDataEndpoint;
      reason: 'key_missing' | 'zone_missing' | 'external_not_allowed';
      externalCallsUsed: 0;
      estimatedCostUsd: 0;
    }
  | {
      ok: true;
      provider: 'bright-data';
      endpoint: BrightDataEndpoint;
      reason: 'ready_not_called';
      externalCallsUsed: 0;
      estimatedCostUsd: 0;
    };

function hasKey() {
  return Boolean(
    process.env.BRIGHT_DATA_API_KEY?.trim() || process.env.BRIGHTDATA_API_KEY?.trim()
  );
}

function hasZone() {
  return Boolean(
    process.env.BRIGHT_DATA_ZONE?.trim() || process.env.BRIGHTDATA_ZONE?.trim()
  );
}

export function getBrightDataStatus() {
  return {
    provider: 'bright-data' as const,
    configured: hasKey() && hasZone(),
    endpoints: ['serpScrape', 'localPackScrape'] as BrightDataEndpoint[],
    spendPolicy: 'zero-spend-by-default',
    health: !hasKey() ? 'key_missing' : !hasZone() ? 'zone_missing' : 'configured',
  };
}

export async function runBrightData(
  request: BrightDataRequest,
  options: { allowExternal?: boolean } = {}
): Promise<BrightDataResult> {
  if (!hasKey()) {
    return {
      ok: false,
      provider: 'bright-data',
      endpoint: request.endpoint,
      reason: 'key_missing',
      externalCallsUsed: 0,
      estimatedCostUsd: 0,
    };
  }
  if (!hasZone()) {
    return {
      ok: false,
      provider: 'bright-data',
      endpoint: request.endpoint,
      reason: 'zone_missing',
      externalCallsUsed: 0,
      estimatedCostUsd: 0,
    };
  }
  if (!options.allowExternal) {
    return {
      ok: false,
      provider: 'bright-data',
      endpoint: request.endpoint,
      reason: 'external_not_allowed',
      externalCallsUsed: 0,
      estimatedCostUsd: 0,
    };
  }
  return {
    ok: true,
    provider: 'bright-data',
    endpoint: request.endpoint,
    reason: 'ready_not_called',
    externalCallsUsed: 0,
    estimatedCostUsd: 0,
  };
}

export const serpScrape = (
  request: Omit<BrightDataRequest, 'endpoint'>,
  options?: { allowExternal?: boolean }
) => runBrightData({ ...request, endpoint: 'serpScrape' }, options);

export const localPackScrape = (
  request: Omit<BrightDataRequest, 'endpoint'>,
  options?: { allowExternal?: boolean }
) => runBrightData({ ...request, endpoint: 'localPackScrape' }, options);

// ─────────────────────────────────────────────────────────────────────────────
// Real provider class — used by lib/dream-forge/enrichment.ts
// ─────────────────────────────────────────────────────────────────────────────

export type BrightDataConstructorOpts = {
  apiKey?: string;
  zone?: string;
  country?: string;
  language?: string;
};

export type SerpFetchInput = { query: string; country?: string; language?: string };
export type SerpFetchResult = {
  localPack: boolean;
  localPackRank?: number | null;
  competitors: { name: string; url?: string; rating?: number; reviews?: number }[];
  organicTop10: { position: number; title: string; url: string; domain: string }[];
  raw?: unknown;
};

export type GBPFetchInput = { placeId?: string; url?: string };
export type GBPFetchResult = {
  name?: string;
  rating?: number;
  reviewCount?: number;
  categories?: string[];
  photos?: string[];
  hours?: Record<string, string>;
  address?: string;
  reviews?: { author: string; rating: number; text: string; date?: string }[];
  raw?: unknown;
};

export class BrightDataProvider {
  private apiKey: string;
  private zone: string;
  private country: string;
  private language: string;

  constructor(opts: BrightDataConstructorOpts = {}) {
    this.apiKey =
      opts.apiKey ||
      process.env.BRIGHT_DATA_API_KEY ||
      process.env.BRIGHTDATA_API_KEY ||
      '';
    this.zone =
      opts.zone ||
      process.env.BRIGHT_DATA_ZONE ||
      process.env.BRIGHTDATA_ZONE ||
      'serp_api1';
    this.country = (opts.country || process.env.BRIGHT_DATA_COUNTRY || 'us').toLowerCase();
    this.language = (opts.language || process.env.BRIGHT_DATA_LANGUAGE || 'en').toLowerCase();
    if (!this.apiKey) {
      throw new Error('BrightDataProvider: missing BRIGHT_DATA_API_KEY.');
    }
  }

  private async post(body: Record<string, unknown>): Promise<unknown> {
    const response = await fetch('https://api.brightdata.com/request', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ zone: this.zone, format: 'json', ...body }),
    });
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(
        `Bright Data ${response.status} ${response.statusText}: ${text.slice(0, 280)}`
      );
    }
    return response.json();
  }

  /**
   * SERP fetch via Bright Data SERP API. Returns parsed local-pack + organic top 10.
   */
  async getSerpData(input: SerpFetchInput): Promise<SerpFetchResult> {
    const country = (input.country || this.country).toLowerCase();
    const language = (input.language || this.language).toLowerCase();
    const url =
      `https://www.google.com/search?q=${encodeURIComponent(input.query)}` +
      `&gl=${encodeURIComponent(country)}&hl=${encodeURIComponent(language)}&brd_json=1`;
    const data = (await this.post({ url, country, method: 'GET' })) as any;

    const organicRaw: any[] = Array.isArray(data?.organic) ? data.organic : [];
    const organicTop10 = organicRaw.slice(0, 10).map((row, idx) => ({
      position: Number(row.rank ?? row.position ?? idx + 1),
      title: String(row.title ?? ''),
      url: String(row.link ?? row.url ?? ''),
      domain: String(row.display_link ?? row.domain ?? '').toLowerCase(),
    }));

    const localPackRaw: any[] =
      data?.local_pack?.items ||
      data?.local_pack ||
      data?.local_results ||
      [];
    const localPack = Array.isArray(localPackRaw) && localPackRaw.length > 0;
    const competitors = (Array.isArray(localPackRaw) ? localPackRaw : []).map((row: any) => ({
      name: String(row.title ?? row.name ?? ''),
      url: row.link ?? row.url,
      rating: row.rating ? Number(row.rating) : undefined,
      reviews: row.reviews ? Number(row.reviews) : undefined,
    }));

    return {
      localPack,
      localPackRank: localPack ? 1 : null,
      competitors,
      organicTop10,
      raw: data,
    };
  }

  /**
   * GBP lookup by place_id or maps URL via Bright Data SERP API (Google Maps endpoint).
   */
  async getGBPData(input: GBPFetchInput): Promise<GBPFetchResult> {
    const ident = input.placeId
      ? `place_id:${input.placeId}`
      : input.url || '';
    const url =
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ident)}` +
      `&brd_json=1`;
    const data = (await this.post({ url, country: this.country, method: 'GET' })) as any;

    const place = data?.place || data?.results?.[0] || data || {};
    const reviews = Array.isArray(place.reviews) ? place.reviews : [];
    return {
      name: place.name || place.title,
      rating: place.rating ? Number(place.rating) : undefined,
      reviewCount: place.reviews_count ? Number(place.reviews_count) : undefined,
      categories: place.categories || place.category ? [].concat(place.categories || place.category) : [],
      photos: Array.isArray(place.photos) ? place.photos : [],
      hours: place.hours || place.working_hours,
      address: place.address,
      reviews: reviews.slice(0, 10).map((r: any) => ({
        author: String(r.author || r.user_name || 'Customer'),
        rating: Number(r.rating || 5),
        text: String(r.text || r.review || ''),
        date: r.date || r.published_at,
      })),
      raw: data,
    };
  }
}
