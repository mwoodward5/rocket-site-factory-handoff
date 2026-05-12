import { promises as fs } from 'node:fs';
import path from 'node:path';
import { getMediaProviderStatuses } from './provider-status';
import { createHeroMediaPlan, packetFromManifest } from './prompt-builder';
import { writeLocalHeroPoster } from './local-poster';

async function readJson(filePath: string) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch {
    return null;
  }
}

export async function prepareHeroMediaForSlug(slug: string, cwd = process.cwd()) {
  const normalizedSlug = String(slug || '').trim().toLowerCase();
  if (!normalizedSlug) throw new Error('A project slug is required.');

  const manifestPath = path.join(cwd, '.saved-projects', normalizedSlug, 'manifest.json');
  const manifest = (await readJson(manifestPath)) || { slug: normalizedSlug, name: normalizedSlug };
  const business = packetFromManifest(manifest);
  const plan = createHeroMediaPlan({ slug: normalizedSlug, business });
  await writeLocalHeroPoster({ plan, cwd });

  const reportDir = path.join(cwd, 'reports', normalizedSlug);
  await fs.mkdir(reportDir, { recursive: true });
  const planPath = path.join(reportDir, 'media-generation-plan.json');
  await fs.writeFile(planPath, `${JSON.stringify(plan, null, 2)}\n`, 'utf8');

  return {
    ok: true as const,
    plan,
    planPath,
    providerStatuses: getMediaProviderStatuses(),
  };
}

export { getMediaProviderStatuses } from './provider-status';
export { createHeroMediaPlan, packetFromManifest } from './prompt-builder';
export { createEnvatoAssetPlan, createEnvatoAssetPlanForSlug, getEnvatoReadiness } from './envato';
export type { HeroMediaPlan, MediaProviderStatusItem } from './types';
