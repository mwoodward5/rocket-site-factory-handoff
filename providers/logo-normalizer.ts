import { promises as fs } from 'node:fs';

export type LogoGateInput = {
  filePath?: string;
  mimeType?: string;
  width?: number;
  height?: number;
  hasTransparentBackground?: boolean;
  suspectedBoxedBackground?: boolean;
};

export type LogoGateResult = {
  ok: boolean;
  blockers: string[];
  warnings: string[];
  alphaHistogram: {
    transparent: number;
    translucent: number;
    opaque: number;
    estimated: boolean;
  };
  normalizedOutputs: string[];
};

function readPngHeader(buffer: Buffer) {
  const pngSignature = '89504e470d0a1a0a';
  if (buffer.subarray(0, 8).toString('hex') !== pngSignature || buffer.length < 33) return null;
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  const colorType = buffer.readUInt8(25);
  return { width, height, colorType, hasAlpha: colorType === 4 || colorType === 6 };
}

export async function inspectLogo(input: LogoGateInput): Promise<LogoGateResult> {
  const blockers: string[] = [];
  const warnings: string[] = [];
  let width = input.width ?? 0;
  let height = input.height ?? 0;
  let hasTransparentBackground = Boolean(input.hasTransparentBackground);

  if (input.filePath) {
    try {
      const buffer = await fs.readFile(input.filePath);
      const png = readPngHeader(buffer);
      if (png) {
        width = width || png.width;
        height = height || png.height;
        hasTransparentBackground = hasTransparentBackground || png.hasAlpha;
      } else {
        warnings.push('Logo is not a readable PNG; transparent-background proof requires manual review.');
      }
    } catch {
      blockers.push('Logo file could not be read.');
    }
  }

  if (!hasTransparentBackground) blockers.push('Logo must be a transparent PNG before publish.');
  if (width && width < 1024) blockers.push('Logo master must be at least 1024px wide.');
  if (height && height < 1024) warnings.push('Logo master is under 1024px tall; responsive variants may look soft.');
  if (input.suspectedBoxedBackground) blockers.push('Boxed-logo detector flagged a visible background rectangle.');

  return {
    ok: blockers.length === 0,
    blockers,
    warnings,
    alphaHistogram: {
      transparent: hasTransparentBackground ? 1 : 0,
      translucent: 0,
      opaque: hasTransparentBackground ? 0 : 1,
      estimated: true,
    },
    normalizedOutputs: blockers.length === 0 ? ['logo-master-1024.png', 'logo-header-112.png', 'logo-mobile-88.png', 'logo-hero-192.png'] : [],
  };
}

export async function normalizeLogo(input: LogoGateInput, options: { approvePaidRemoveBg?: boolean } = {}) {
  const inspection = await inspectLogo(input);
  if (inspection.ok) {
    return { ...inspection, action: 'already_transparent' as const, paidProviderUsed: false };
  }

  if (process.env.REMOVE_BG_API_KEY?.trim() && options.approvePaidRemoveBg) {
    return {
      ...inspection,
      action: 'remove_bg_ready_but_not_called' as const,
      paidProviderUsed: false,
      warnings: [...inspection.warnings, 'remove.bg key is present, but this local pass does not spend without a separate confirmed action.'],
    };
  }

  return {
    ...inspection,
    action: 'blocked_needs_local_rembg_or_manual_transparent_png' as const,
    paidProviderUsed: false,
  };
}
