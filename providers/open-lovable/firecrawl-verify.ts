import type { NormalizedBusinessPacket } from '@/lib/intake/normalize-intake';

export interface FirecrawlVerificationResult {
  status: 'not-configured' | 'ready-manual-click' | 'blocked';
  creditsUsed: number;
  confirmed: string[];
  conflicting: string[];
  missing: string[];
  unverified: string[];
  message: string;
}

export async function firecrawlVerify(packet: NormalizedBusinessPacket): Promise<FirecrawlVerificationResult> {
  const configured = Boolean(process.env.FIRECRAWL_API_KEY?.trim());
  const sourceUrls = [
    packet.website,
    packet.googleBusinessUrl,
    packet.googleMapsUrl,
    packet.facebookUrl,
    ...packet.otherSourceUrls,
  ].filter(Boolean);

  if (!configured) {
    return {
      status: 'not-configured',
      creditsUsed: 0,
      confirmed: [],
      conflicting: [],
      missing: sourceUrls.length ? [] : ['source URL'],
      unverified: ['NAP', 'services', 'service areas', 'social/citation links', 'brand clues'],
      message: 'Firecrawl is not configured. Continue with manual packet review or add FIRECRAWL_API_KEY later.',
    };
  }

  return {
    status: 'ready-manual-click',
    creditsUsed: 0,
    confirmed: [],
    conflicting: [],
    missing: sourceUrls.length ? [] : ['source URL'],
    unverified: ['NAP', 'services', 'service areas', 'social/citation links', 'brand clues'],
    message: 'Firecrawl is configured, but this pass intentionally made zero crawl calls. Manual click can run verification later.',
  };
}
