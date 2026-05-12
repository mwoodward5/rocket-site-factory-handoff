import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { HeroMediaPlan } from './types';

function escapeXml(value: string) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderLocalHeroPosterSvg(plan: HeroMediaPlan) {
  const title = escapeXml(plan.business.businessName);
  const niche = escapeXml(plan.business.niche);
  const place = escapeXml([plan.business.city, plan.business.region || plan.business.state].filter(Boolean).join(' / '));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img" aria-label="${title} cinematic hero concept poster">
  <defs>
    <linearGradient id="sky" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#fff7ed"/>
      <stop offset="0.42" stop-color="#e0f2fe"/>
      <stop offset="1" stop-color="#d9f99d"/>
    </linearGradient>
    <radialGradient id="glow" cx="70%" cy="28%" r="55%">
      <stop offset="0" stop-color="#67e8f9" stop-opacity=".78"/>
      <stop offset=".5" stop-color="#60a5fa" stop-opacity=".28"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="18"/>
    </filter>
  </defs>
  <rect width="1600" height="900" rx="72" fill="url(#sky)"/>
  <rect width="1600" height="900" rx="72" fill="url(#glow)"/>
  <g opacity=".28" stroke="#0f172a" stroke-width="1">
    ${Array.from({ length: 18 }, (_, index) => `<path d="M${140 + index * 74} 130V780"/>`).join('')}
    ${Array.from({ length: 9 }, (_, index) => `<path d="M120 ${170 + index * 70}H1480"/>`).join('')}
  </g>
  <circle cx="1245" cy="235" r="118" fill="#22d3ee" opacity=".24" filter="url(#soft)"/>
  <rect x="814" y="188" width="548" height="388" rx="46" fill="#ffffff" opacity=".58"/>
  <rect x="914" y="240" width="355" height="160" rx="34" fill="#67e8f9" opacity=".34"/>
  <rect x="730" y="536" width="686" height="122" rx="38" fill="#ffffff" opacity=".74"/>
  <rect x="890" y="633" width="474" height="118" rx="42" fill="#f8fafc" opacity=".88"/>
  <g transform="rotate(-4 410 230)">
    <rect x="116" y="138" width="458" height="604" rx="52" fill="#ffffff" opacity=".9"/>
    <text x="166" y="230" fill="#2563eb" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="800" letter-spacing="6">CINEMATIC CONCEPT</text>
    <text x="166" y="312" fill="#07111f" font-family="Inter, Arial, sans-serif" font-size="62" font-weight="900">${title}</text>
    <text x="166" y="386" fill="#334155" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="700">${niche}</text>
    <text x="166" y="436" fill="#64748b" font-family="Inter, Arial, sans-serif" font-size="24">${place}</text>
    <rect x="166" y="500" width="248" height="54" rx="27" fill="#2563eb"/>
    <text x="202" y="535" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="19" font-weight="800">Open planner</text>
  </g>
  <g font-family="Inter, Arial, sans-serif" font-weight="800">
    <rect x="1124" y="172" width="206" height="82" rx="24" fill="#ffffff" opacity=".86"/>
    <text x="1152" y="207" fill="#2563eb" font-size="20">01 Flow</text>
    <text x="1152" y="234" fill="#475569" font-size="17">layout + storage</text>
    <rect x="1288" y="430" width="226" height="86" rx="25" fill="#ffffff" opacity=".88"/>
    <text x="1318" y="465" fill="#2563eb" font-size="20">02 Light</text>
    <text x="1318" y="492" fill="#475569" font-size="17">mood + function</text>
  </g>
</svg>`;
}

export async function writeLocalHeroPoster({
  plan,
  cwd = process.cwd(),
}: {
  plan: HeroMediaPlan;
  cwd?: string;
}) {
  const siteDir = path.join(cwd, 'public', 'generated-sites', plan.slug);
  await fs.mkdir(siteDir, { recursive: true });
  const posterPath = path.join(siteDir, 'hero-media-poster.svg');
  await fs.writeFile(posterPath, renderLocalHeroPosterSvg(plan), 'utf8');
  plan.localPosterPath = posterPath;
  return posterPath;
}

