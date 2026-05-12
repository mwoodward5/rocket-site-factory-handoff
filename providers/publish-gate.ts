export type PublishGateInput = {
  html?: string;
  routes?: Array<{ path: string; head: { title?: string; description?: string; ogImage?: string; canonical?: string } }>;
  heroMedia?: Array<{ type: 'img' | 'video'; src: string; licensed?: boolean }>;
  serviceCards?: Array<{ title: string; image?: string }>;
  logoGate?: { ok: boolean; blockers?: string[] };
  hasThemeToggle?: boolean;
  hasLanguageSwitcher?: boolean;
  hasGbpBadge?: boolean;
  hasLeadForm?: boolean;
  hasSchemaGraph?: boolean;
  hasMobileCallBar?: boolean;
};

export type PublishGateResult = {
  publishReady: boolean;
  blockers: string[];
  warnings: string[];
  checks: Record<string, boolean>;
};

const bannedTailwindHues = /\b(?:bg|text|from|to|via|border|ring)-(?:blue|indigo|purple)-(?:50|100|200|300|400|500|600|700|800|900|950)\b/g;

function hasDuplicateHead(routes: PublishGateInput['routes'] = []) {
  const seen = new Set<string>();
  for (const route of routes) {
    const signature = [route.head.title, route.head.description, route.head.ogImage, route.head.canonical].join('|');
    if (seen.has(signature)) return true;
    seen.add(signature);
  }
  return false;
}

export function evaluatePublishGate(input: PublishGateInput): PublishGateResult {
  const html = input.html ?? '';
  const blockers: string[] = [];
  const warnings: string[] = [];

  const heroMediaOk = Boolean(input.heroMedia?.some(media => media.src && (media.type === 'img' || media.type === 'video')));
  const serviceMediaOk = Boolean(input.serviceCards?.length) && input.serviceCards!.every(card => Boolean(card.image));
  const logoOk = Boolean(input.logoGate?.ok);
  const noBannedTailwind = !bannedTailwindHues.test(html);
  const uniqueHeads = !hasDuplicateHead(input.routes);
  const themeOk = Boolean(input.hasThemeToggle);
  const i18nOk = Boolean(input.hasLanguageSwitcher);
  const gbpOk = Boolean(input.hasGbpBadge);
  const leadOk = Boolean(input.hasLeadForm);
  const schemaOk = Boolean(input.hasSchemaGraph);
  const mobileCallOk = Boolean(input.hasMobileCallBar);

  if (!heroMediaOk) blockers.push('Hero-empty refused: at least one licensed <video> or <img> is required.');
  if (!serviceMediaOk) blockers.push('Each service card must have at least one image.');
  if (!logoOk) blockers.push(`Logo gate failed${input.logoGate?.blockers?.length ? `: ${input.logoGate.blockers.join('; ')}` : '.'}`);
  if (!noBannedTailwind) blockers.push('Default Tailwind blue/indigo/purple utility hues are banned for client-ready templates.');
  if (!uniqueHeads) blockers.push('Duplicate <head> metadata detected across routes.');
  if (!themeOk) blockers.push('Missing day/dark theme toggle.');
  if (!i18nOk) blockers.push('Missing EN/ES language switcher.');
  if (!gbpOk) blockers.push('Missing GBP badge linked to GOOGLE_MAPS_URL.');
  if (!leadOk) blockers.push('Missing lead form.');
  if (!schemaOk) blockers.push('Missing schema graph.');
  if (!mobileCallOk) blockers.push('Missing sticky mobile call bar.');

  if (html.includes('TODO') || html.includes('{{')) {
    warnings.push('Tokenized or TODO copy is still present; builder must fill tokens before publish.');
  }

  return {
    publishReady: blockers.length === 0,
    blockers,
    warnings,
    checks: {
      heroMediaOk,
      serviceMediaOk,
      logoOk,
      noBannedTailwind,
      uniqueHeads,
      themeOk,
      i18nOk,
      gbpOk,
      leadOk,
      schemaOk,
      mobileCallOk,
    },
  };
}
