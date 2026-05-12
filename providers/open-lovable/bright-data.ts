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
  return Boolean(process.env.BRIGHT_DATA_API_KEY?.trim());
}

function hasZone() {
  return Boolean(process.env.BRIGHT_DATA_ZONE?.trim());
}

export function getBrightDataStatus() {
  return {
    provider: 'bright-data' as const,
    configured: hasKey() && hasZone(),
    endpoints: ['serpScrape', 'localPackScrape'] as BrightDataEndpoint[],
    spendPolicy: 'zero-spend-by-default',
    health: !hasKey() ? 'key_missing' : !hasZone() ? 'zone_missing' : 'configured-blocked',
  };
}

export async function runBrightData(request: BrightDataRequest, options: { allowExternal?: boolean } = {}): Promise<BrightDataResult> {
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

export const serpScrape = (request: Omit<BrightDataRequest, 'endpoint'>, options?: { allowExternal?: boolean }) =>
  runBrightData({ ...request, endpoint: 'serpScrape' }, options);

export const localPackScrape = (request: Omit<BrightDataRequest, 'endpoint'>, options?: { allowExternal?: boolean }) =>
  runBrightData({ ...request, endpoint: 'localPackScrape' }, options);
