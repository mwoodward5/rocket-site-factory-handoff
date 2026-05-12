/**
 * DataForSEO provider for the Dream Forge factory.
 *
 * Auth: HTTP Basic — Authorization: Basic base64("LOGIN:PASSWORD").
 * Docs:
 *  - SERP API:                https://docs.dataforseo.com/v3/serp/google/organic/live/advanced/
 *  - Keyword search volume:   https://docs.dataforseo.com/v3/keywords_data/google_ads/search_volume/live/
 *
 * Env:
 *  - DATAFORSEO_LOGIN
 *  - DATAFORSEO_PASSWORD
 *  - DATAFORSEO_API_BASE         (default https://api.dataforseo.com)
 *  - DATAFORSEO_LOCATION_NAME    (default "United States")
 *  - DATAFORSEO_LANGUAGE_CODE    (default "en")
 *  - DATAFORSEO_COST_PER_1000    (default 0.60)
 *  - DATAFORSEO_KEYWORD_METRICS_COST_PER_1000 (default 0.05)
 */

export type DataForSeoStatus = {
  provider: 'dataforseo';
  configured: boolean;
  apiBase: string;
  locationName: string;
  languageCode: string;
  costPer1000Usd: number;
  metricsCostPer1000Usd: number;
};

export function getDataForSeoStatus(): DataForSeoStatus {
  return {
    provider: 'dataforseo',
    configured: Boolean(
      process.env.DATAFORSEO_LOGIN?.trim() && process.env.DATAFORSEO_PASSWORD?.trim()
    ),
    apiBase: process.env.DATAFORSEO_API_BASE?.trim() || 'https://api.dataforseo.com',
    locationName: process.env.DATAFORSEO_LOCATION_NAME?.trim() || 'United States',
    languageCode: process.env.DATAFORSEO_LANGUAGE_CODE?.trim() || 'en',
    costPer1000Usd: Number(process.env.DATAFORSEO_COST_PER_1000 ?? 0.6),
    metricsCostPer1000Usd: Number(process.env.DATAFORSEO_KEYWORD_METRICS_COST_PER_1000 ?? 0.05),
  };
}

export type DataForSeoConstructorOpts = {
  login?: string;
  password?: string;
  apiBase?: string;
  locationName?: string;
  languageCode?: string;
};

export type SerpInput = { keyword: string; locationName?: string; languageCode?: string };
export type SerpRow = {
  position: number | null;
  title: string;
  url: string;
  domain: string;
  type: string;
};
export type SerpResult = {
  keyword: string;
  organic: SerpRow[];
  raw?: unknown;
};

export type KeywordMetricsInput = { keywords: string[]; locationName?: string; languageCode?: string };
export type KeywordMetricsRow = {
  keyword: string;
  volume: number | null;
  cpc: number | null;
  competition: number | null;
};
export type KeywordMetricsResult = {
  rows: KeywordMetricsRow[];
  raw?: unknown;
};

export class DataForSeoProvider {
  private login: string;
  private password: string;
  private apiBase: string;
  private locationName: string;
  private languageCode: string;

  constructor(opts: DataForSeoConstructorOpts = {}) {
    this.login = opts.login || process.env.DATAFORSEO_LOGIN || '';
    this.password = opts.password || process.env.DATAFORSEO_PASSWORD || '';
    this.apiBase = opts.apiBase || process.env.DATAFORSEO_API_BASE || 'https://api.dataforseo.com';
    this.locationName =
      opts.locationName || process.env.DATAFORSEO_LOCATION_NAME || 'United States';
    this.languageCode = opts.languageCode || process.env.DATAFORSEO_LANGUAGE_CODE || 'en';
    if (!this.login || !this.password) {
      throw new Error(
        'DataForSeoProvider: missing DATAFORSEO_LOGIN or DATAFORSEO_PASSWORD.'
      );
    }
  }

  private authHeader(): string {
    const token = Buffer.from(`${this.login}:${this.password}`, 'utf8').toString('base64');
    return `Basic ${token}`;
  }

  private async post(path: string, payload: unknown[]): Promise<unknown> {
    const response = await fetch(`${this.apiBase}${path}`, {
      method: 'POST',
      headers: {
        Authorization: this.authHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(
        `DataForSEO ${path} returned HTTP ${response.status}: ${text.slice(0, 280)}`
      );
    }
    return response.json();
  }

  async getSerpData(input: SerpInput): Promise<SerpResult> {
    const payload = [
      {
        keyword: input.keyword,
        language_code: input.languageCode || this.languageCode,
        location_name: input.locationName || this.locationName,
        depth: 30,
        device: 'desktop',
        os: 'windows',
      },
    ];
    const data = (await this.post(
      '/v3/serp/google/organic/live/advanced',
      payload
    )) as any;
    const items: any[] = data?.tasks?.[0]?.result?.[0]?.items ?? [];
    const organic = items
      .map((item: any): SerpRow => {
        const position = Number(item?.rank_absolute ?? item?.rank_group ?? item?.position);
        return {
          position: Number.isFinite(position) ? position : null,
          title: String(item?.title ?? ''),
          url: String(item?.url ?? ''),
          domain: String(item?.domain ?? '').toLowerCase(),
          type: String(item?.type ?? 'organic'),
        };
      })
      .filter((r) => r.position !== null);
    return { keyword: input.keyword, organic, raw: data };
  }

  async getKeywordMetrics(input: KeywordMetricsInput): Promise<KeywordMetricsResult> {
    const unique = [...new Set(input.keywords.map((k) => String(k).trim()).filter(Boolean))];
    if (!unique.length) return { rows: [] };
    const payload = [
      {
        keywords: unique,
        language_code: input.languageCode || this.languageCode,
        location_name: input.locationName || this.locationName,
        sort_by: 'search_volume',
      },
    ];
    const data = (await this.post(
      '/v3/keywords_data/google_ads/search_volume/live',
      payload
    )) as any;
    const items: any[] = data?.tasks?.[0]?.result ?? [];
    const byKeyword = new Map<string, any>();
    for (const item of items) {
      byKeyword.set(String(item?.keyword ?? '').toLowerCase(), item);
    }
    const rows: KeywordMetricsRow[] = unique.map((kw) => {
      const item = byKeyword.get(kw.toLowerCase());
      return {
        keyword: kw,
        volume: item && Number.isFinite(Number(item.search_volume))
          ? Number(item.search_volume)
          : null,
        cpc: item && Number.isFinite(Number(item.cpc)) ? Number(item.cpc) : null,
        competition: item && Number.isFinite(Number(item.competition_index))
          ? Number(item.competition_index)
          : item && Number.isFinite(Number(item.competition))
            ? Number(item.competition)
            : null,
      };
    });
    return { rows, raw: data };
  }
}
