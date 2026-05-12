export type BrightLocalEndpoint =
  | 'citationTracker'
  | 'localRankFlex'
  | 'gbpAudit'
  | 'reputationManager';

export type BrightLocalRequest = {
  endpoint: BrightLocalEndpoint;
  businessName?: string;
  location?: string;
  keywords?: string[];
};

export type ProviderShortCircuit = {
  ok: false;
  provider: 'brightlocal';
  endpoint: BrightLocalEndpoint;
  reason: 'key_missing' | 'external_not_allowed';
  externalCallsUsed: 0;
  estimatedCostUsd: 0;
};

export type BrightLocalReady = {
  ok: true;
  provider: 'brightlocal';
  endpoint: BrightLocalEndpoint;
  reason: 'ready_not_called';
  externalCallsUsed: 0;
  estimatedCostUsd: 0;
};

function hasKey() {
  return Boolean(process.env.BRIGHTLOCAL_API_KEY?.trim());
}

export function getBrightLocalStatus() {
  return {
    provider: 'brightlocal' as const,
    configured: hasKey(),
    endpoints: ['citationTracker', 'localRankFlex', 'gbpAudit', 'reputationManager'] as BrightLocalEndpoint[],
    spendPolicy: 'zero-spend-by-default',
    health: hasKey() ? 'configured-blocked' : 'key_missing',
  };
}

export async function runBrightLocal(request: BrightLocalRequest, options: { allowExternal?: boolean } = {}) {
  if (!hasKey()) {
    return {
      ok: false,
      provider: 'brightlocal',
      endpoint: request.endpoint,
      reason: 'key_missing',
      externalCallsUsed: 0,
      estimatedCostUsd: 0,
    } satisfies ProviderShortCircuit;
  }

  if (!options.allowExternal) {
    return {
      ok: false,
      provider: 'brightlocal',
      endpoint: request.endpoint,
      reason: 'external_not_allowed',
      externalCallsUsed: 0,
      estimatedCostUsd: 0,
    } satisfies ProviderShortCircuit;
  }

  return {
    ok: true,
    provider: 'brightlocal',
    endpoint: request.endpoint,
    reason: 'ready_not_called',
    externalCallsUsed: 0,
    estimatedCostUsd: 0,
  } satisfies BrightLocalReady;
}

export const citationTracker = (request: Omit<BrightLocalRequest, 'endpoint'>, options?: { allowExternal?: boolean }) =>
  runBrightLocal({ ...request, endpoint: 'citationTracker' }, options);

export const localRankFlex = (request: Omit<BrightLocalRequest, 'endpoint'>, options?: { allowExternal?: boolean }) =>
  runBrightLocal({ ...request, endpoint: 'localRankFlex' }, options);

export const gbpAudit = (request: Omit<BrightLocalRequest, 'endpoint'>, options?: { allowExternal?: boolean }) =>
  runBrightLocal({ ...request, endpoint: 'gbpAudit' }, options);

export const reputationManager = (request: Omit<BrightLocalRequest, 'endpoint'>, options?: { allowExternal?: boolean }) =>
  runBrightLocal({ ...request, endpoint: 'reputationManager' }, options);
