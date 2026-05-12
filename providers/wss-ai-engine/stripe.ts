/**
 * Stripe provider adapter
 * - createCheckoutSession: initiate credit pack purchase
 * - verifyWebhook: validate Stripe webhook signature
 * - handleCreditPackPurchase: extract credits from completed session
 *
 * Pack prices:
 *   starter-50   → 50 credits / $25
 *   popular-200  → 200 credits / $90  (popular)
 *   pro-500      → 500 credits / $200
 *   enterprise-1500 → 1500 credits / $500
 *
 * Uses STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET.
 */

import * as crypto from "crypto";

// ─── Types ───────────────────────────────────────────────────────────────────

export type CreditPackId = "starter-50" | "popular-200" | "pro-500" | "enterprise-1500";

export interface CreditPack {
	id: CreditPackId;
	name: string;
	credits: number;
	priceUsd: number;
	/** Price in cents for Stripe */
	priceCents: number;
	popular?: boolean;
	description: string;
}

export interface CreateCheckoutSessionParams {
	businessId: string;
	packId: CreditPackId;
	successUrl: string;
	cancelUrl: string;
	/** Customer email to pre-fill */
	customerEmail?: string;
}

export interface CheckoutSessionResult {
	url: string;
	sessionId: string;
}

export interface StripeWebhookEvent {
	event: string;
	data: Record<string, unknown>;
}

export interface CreditPackPurchaseResult {
	businessId: string;
	credits: number;
	packId: CreditPackId;
	packName: string;
	amountPaidUsd: number;
	sessionId: string;
	customerId?: string;
}

// ─── Credit pack catalog ──────────────────────────────────────────────────────

export const CREDIT_PACKS: Record<CreditPackId, CreditPack> = {
	"starter-50": {
		id: "starter-50",
		name: "Starter Pack",
		credits: 50,
		priceUsd: 25,
		priceCents: 2500,
		description: "Perfect for trying individual upgrades and one-off additions.",
	},
	"popular-200": {
		id: "popular-200",
		name: "Popular Pack",
		credits: 200,
		priceUsd: 90,
		priceCents: 9000,
		popular: true,
		description: "Most popular — enough credits for a full site refresh plus extras.",
	},
	"pro-500": {
		id: "pro-500",
		name: "Pro Pack",
		credits: 500,
		priceUsd: 200,
		priceCents: 20000,
		description: "Best value for agencies or multi-location businesses.",
	},
	"enterprise-1500": {
		id: "enterprise-1500",
		name: "Enterprise Pack",
		credits: 1500,
		priceUsd: 500,
		priceCents: 50000,
		description: "White-glove volume package for high-output operators.",
	},
};

// ─── Constants ───────────────────────────────────────────────────────────────

const STRIPE_API = "https://api.stripe.com/v1";
const TIMEOUT_MS = 20_000;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSecretKey(): string {
	const key = process.env["STRIPE_SECRET_KEY"];
	if (!key) {
		throw new Error("[stripe] STRIPE_SECRET_KEY is not set — cannot process payments");
	}
	return key;
}

function getWebhookSecret(): string {
	const secret = process.env["STRIPE_WEBHOOK_SECRET"];
	if (!secret) {
		throw new Error("[stripe] STRIPE_WEBHOOK_SECRET is not set — cannot verify webhooks");
	}
	return secret;
}

async function stripeFetch(path: string, init: RequestInit, secretKey: string): Promise<Response> {
	const ac = new AbortController();
	const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);
	try {
		return await fetch(`${STRIPE_API}${path}`, {
			...init,
			headers: {
				Authorization: `Bearer ${secretKey}`,
				...(init.headers as Record<string, string> | undefined),
			},
			signal: ac.signal,
		});
	} finally {
		clearTimeout(timer);
	}
}

function encodeFormBody(params: Record<string, string | number | boolean | undefined>): string {
	return Object.entries(params)
		.filter(([, v]) => v !== undefined)
		.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
		.join("&");
}

// ─── Checkout session ──────────────────────────────────────────────────────────

interface StripeCheckoutResponse {
	id: string;
	url: string;
}

/**
 * Create a Stripe Checkout session for a credit pack purchase.
 *
 * The businessId and packId are stored in session metadata so the
 * webhook handler can identify which business gets the credits.
 */
export async function createCheckoutSession(
	params: CreateCheckoutSessionParams,
): Promise<CheckoutSessionResult> {
	const secretKey = getSecretKey();

	const pack = CREDIT_PACKS[params.packId];
	if (!pack) {
		throw new Error(`[stripe] Unknown pack ID: "${params.packId}"`);
	}

	// Build form-encoded body for Stripe
	const bodyParts: string[] = [
		`mode=payment`,
		`success_url=${encodeURIComponent(params.successUrl)}`,
		`cancel_url=${encodeURIComponent(params.cancelUrl)}`,
		`line_items[0][price_data][currency]=usd`,
		`line_items[0][price_data][unit_amount]=${pack.priceCents}`,
		`line_items[0][price_data][product_data][name]=${encodeURIComponent(pack.name)}`,
		`line_items[0][price_data][product_data][description]=${encodeURIComponent(pack.description)}`,
		`line_items[0][quantity]=1`,
		`metadata[businessId]=${encodeURIComponent(params.businessId)}`,
		`metadata[packId]=${encodeURIComponent(params.packId)}`,
		`metadata[credits]=${pack.credits}`,
	];

	if (params.customerEmail) {
		bodyParts.push(`customer_email=${encodeURIComponent(params.customerEmail)}`);
	}

	const res = await stripeFetch(
		"/checkout/sessions",
		{
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: bodyParts.join("&"),
		},
		secretKey,
	);

	if (!res.ok) {
		const errText = await res.text();
		throw new Error(`[stripe] createCheckoutSession failed ${res.status}: ${errText}`);
	}

	const json = (await res.json()) as StripeCheckoutResponse;
	return { url: json.url, sessionId: json.id };
}

// ─── Webhook verification ─────────────────────────────────────────────────────

/**
 * Verify a Stripe webhook payload using its Stripe-Signature header.
 *
 * Returns the parsed event + data if valid, or null if signature check fails.
 * Always returns null rather than throwing so the caller can return 400 safely.
 */
export function verifyWebhook(
	payload: string | Buffer,
	signature: string,
): StripeWebhookEvent | null {
	let webhookSecret: string;
	try {
		webhookSecret = getWebhookSecret();
	} catch {
		return null;
	}

	const payloadStr = typeof payload === "string" ? payload : payload.toString("utf-8");

	// Parse Stripe-Signature header: t=timestamp,v1=hash,...
	const sigParts = Object.fromEntries(
		signature.split(",").map((part) => {
			const [key, ...rest] = part.split("=");
			return [key, rest.join("=")];
		}),
	);

	const timestamp = sigParts["t"];
	const v1Sig = sigParts["v1"];

	if (!timestamp || !v1Sig) return null;

	// Validate timestamp (reject events older than 5 minutes)
	const eventAge = Date.now() / 1000 - parseInt(timestamp, 10);
	if (Math.abs(eventAge) > 300) return null;

	// Compute expected signature
	const signedPayload = `${timestamp}.${payloadStr}`;
	const expectedSig = crypto
		.createHmac("sha256", webhookSecret)
		.update(signedPayload, "utf-8")
		.digest("hex");

	// Constant-time comparison
	const v1Buffer = Buffer.from(v1Sig, "hex");
	const expectedBuffer = Buffer.from(expectedSig, "hex");

	if (
		v1Buffer.length !== expectedBuffer.length ||
		!crypto.timingSafeEqual(v1Buffer, expectedBuffer)
	) {
		return null;
	}

	try {
		const parsed = JSON.parse(payloadStr) as {
			type: string;
			data: { object: Record<string, unknown> };
		};
		return {
			event: parsed.type,
			data: parsed.data.object,
		};
	} catch {
		return null;
	}
}

// ─── Credit pack purchase handler ─────────────────────────────────────────────

/**
 * Extract business ID and credit grant from a completed checkout session.
 * Call this from your webhook handler after verifying the webhook.
 *
 * Throws if required metadata is missing from the session.
 */
export function handleCreditPackPurchase(
	session: Record<string, unknown>,
): CreditPackPurchaseResult {
	const metadata = session["metadata"] as Record<string, string> | undefined;

	if (!metadata) {
		throw new Error("[stripe] Checkout session has no metadata");
	}

	const businessId = metadata["businessId"];
	const packId = metadata["packId"] as CreditPackId | undefined;
	const creditsStr = metadata["credits"];

	if (!businessId) {
		throw new Error("[stripe] Session metadata missing businessId");
	}
	if (!packId || !CREDIT_PACKS[packId]) {
		throw new Error(`[stripe] Session metadata has invalid packId: "${packId ?? "undefined"}"`);
	}
	if (!creditsStr) {
		throw new Error("[stripe] Session metadata missing credits");
	}

	const credits = parseInt(creditsStr, 10);
	if (isNaN(credits) || credits <= 0) {
		throw new Error(`[stripe] Invalid credits value in metadata: "${creditsStr}"`);
	}

	const pack = CREDIT_PACKS[packId];
	const amountTotal = (session["amount_total"] as number | undefined) ?? 0;

	return {
		businessId,
		credits,
		packId,
		packName: pack.name,
		amountPaidUsd: amountTotal / 100,
		sessionId: (session["id"] as string) ?? "",
		customerId: (session["customer"] as string | undefined) ?? undefined,
	};
}
