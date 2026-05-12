/**
 * Provider registry
 * Checks which providers are configured and returns their status.
 *
 * availableProviders() → string[] of enabled provider names
 * providerHealth()     → Record<name, 'enabled' | 'disabled' | 'misconfigured'>
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type ProviderStatus = "enabled" | "disabled" | "misconfigured";

export interface ProviderHealthReport {
	provider: string;
	status: ProviderStatus;
	detail?: string;
}

// ─── Provider definitions ─────────────────────────────────────────────────────

interface ProviderDef {
	name: string;
	/** Env vars that must ALL be present for the provider to be enabled */
	requiredVars: string[];
	/** Additional validation beyond presence check */
	validate?: () => string | null; // returns error string or null if ok
}

const PROVIDER_DEFS: ProviderDef[] = [
	{
		name: "firecrawl",
		requiredVars: ["FIRECRAWL_API_KEY"],
		// No key = graceful fallback, so we mark it enabled even without the key
		// but we note it will use the fallback path.
	},
	{
		name: "brightdata",
		requiredVars: ["BRIGHTDATA_API_KEY"],
	},
	{
		name: "pexels",
		requiredVars: ["PEXELS_API_KEY"],
	},
	{
		name: "openai-image",
		requiredVars: ["OPENAI_API_KEY"],
	},
	{
		name: "veo",
		requiredVars: ["GOOGLE_AI_KEY"],
		validate: () => {
			// Also accept alternate key names
			const key =
				process.env["GOOGLE_AI_KEY"] ??
				process.env["GOOGLE_VEO_API_KEY"] ??
				process.env["GOOGLE_GENERATIVE_AI_API_KEY"];
			return key
				? null
				: "No Google AI key found (GOOGLE_AI_KEY / GOOGLE_VEO_API_KEY / GOOGLE_GENERATIVE_AI_API_KEY)";
		},
	},
	{
		name: "resend",
		requiredVars: ["RESEND_API_KEY"],
		validate: () => {
			// Warn if from email is not set — emails will use default fallback
			if (!process.env["RESEND_FROM_EMAIL"] && !process.env["RESEND_FROM_DOMAIN"]) {
				return "RESEND_FROM_EMAIL not set — emails will use default fallback sender";
			}
			return null;
		},
	},
	{
		name: "vercel",
		requiredVars: ["VERCEL_TOKEN"],
	},
	{
		name: "stripe",
		requiredVars: ["STRIPE_SECRET_KEY"],
		validate: () => {
			if (!process.env["STRIPE_WEBHOOK_SECRET"]) {
				return "STRIPE_WEBHOOK_SECRET not set — webhook verification will fail";
			}
			return null;
		},
	},
];

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Firecrawl is special: it falls back gracefully when the key is missing.
 * Report as "enabled" always, but note the mode in detail.
 */
const GRACEFUL_FALLBACK_PROVIDERS = new Set(["firecrawl"]);

function checkProvider(def: ProviderDef): ProviderHealthReport {
	const missingVars = def.requiredVars.filter((v) => !process.env[v]);

	// Providers with graceful fallbacks are always "enabled"
	if (GRACEFUL_FALLBACK_PROVIDERS.has(def.name)) {
		if (missingVars.length > 0) {
			return {
				provider: def.name,
				status: "enabled",
				detail: `Running in fallback mode — ${missingVars.join(", ")} not set`,
			};
		}
	} else {
		if (missingVars.length > 0) {
			return {
				provider: def.name,
				status: "disabled",
				detail: `Missing env var(s): ${missingVars.join(", ")}`,
			};
		}
	}

	// Run custom validation if provided
	if (def.validate) {
		const issue = def.validate();
		if (issue) {
			return {
				provider: def.name,
				status: "misconfigured",
				detail: issue,
			};
		}
	}

	return { provider: def.name, status: "enabled" };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns the names of all providers that are currently enabled.
 *
 * A provider is "enabled" when:
 * - All required env vars are set, OR
 * - The provider has a graceful fallback (currently: firecrawl)
 */
export function availableProviders(): string[] {
	return PROVIDER_DEFS.map(checkProvider)
		.filter((r) => r.status === "enabled")
		.map((r) => r.provider);
}

/**
 * Returns a health report for every provider.
 * Useful for debugging configuration and for the admin dashboard.
 *
 * Status values:
 * - "enabled"       — ready to use
 * - "disabled"      — required env vars missing
 * - "misconfigured" — keys present but additional config is missing/wrong
 */
export function providerHealth(): Record<string, ProviderStatus> {
	return Object.fromEntries(PROVIDER_DEFS.map(checkProvider).map((r) => [r.provider, r.status]));
}

/**
 * Returns full health reports including detail messages.
 * More verbose than providerHealth() — use for diagnostics.
 */
export function providerHealthDetailed(): ProviderHealthReport[] {
	return PROVIDER_DEFS.map(checkProvider);
}

/**
 * Checks whether a specific provider is available.
 */
export function isProviderAvailable(providerName: string): boolean {
	const def = PROVIDER_DEFS.find((d) => d.name === providerName);
	if (!def) return false;
	return checkProvider(def).status === "enabled";
}
