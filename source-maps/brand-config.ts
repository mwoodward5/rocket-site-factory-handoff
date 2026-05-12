export interface GeneratedSiteBrandConfig {
  businessName: string;
  phone?: string;
  email?: string;
  address?: string;
  license?: string;
  foundedYear?: string;
  colors?: string[];
  fonts?: string[];
  services: string[];
  locations: string[];
  testimonials?: Array<{ quote: string; author?: string; source?: string }>;
  googleBusinessUrl?: string;
  citations?: string[];
}

export function getMissingBrandFields(config: GeneratedSiteBrandConfig) {
  const missing: string[] = [];

  if (!config.businessName) missing.push('businessName');
  if (!config.services?.length) missing.push('services');
  if (!config.locations?.length) missing.push('locations');

  return missing;
}

export function publicBrandValue(value: string | undefined) {
  if (!value || value.trim().toLowerCase().startsWith('todo')) {
    return null;
  }

  return value.trim();
}
