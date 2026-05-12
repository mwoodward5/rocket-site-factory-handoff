/**
 * Bright Data provider adapter
 * - searchSerp: Google SERP data (organic, local pack, PAA)
 * - scrapeGbpReviews: Google Business Profile reviews, rating, count
 *
 * Uses BRIGHTDATA_API_KEY. Returns graceful empty responses if key missing.
 * 7-day cache keyed on (query+location) or GBP URL hash.
 */

import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface OrganicResult {
	position: number;
	url: string;
	title: string;
	snippet: string;
	domain: string;
}

export interface LocalPackResult {
	position: number;
	name: string;
	address: string;
	phone?: string;
	rating?: number;
	reviews?: number;
	gbpUrl?: string;
}

export interface PeopleAlsoAskItem {
	question: string;
	answer?: string;
	sourceUrl?: string;
}

export interface SerpResult {
	organic: OrganicResult[];
	localPack: LocalPackResult[];
	peopleAlsoAsk: PeopleAlsoAskItem[];
}

export interface GbpReview {
	author: string;
	rating: number;
	date: string;
	text: string;
	ownerReply?: string;
}

export interface GbpReviewResult {
	reviews: GbpReview[];
	rating: number;
	count: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TIMEOUT_MS = 45_000;
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const CACHE_DIR = path.join(process.cwd(), ".cache", "brightdata");
const BRIGHTDATA_BASE = "https://api.brightdata.com";

function cleanEnv(value: string | undefined): string | undefined {
	return value?.trim().replace(/^["']|["']$/g, "");
}

function brightDataApiKey(): string | undefined {
	return (
		cleanEnv(process.env["BRIGHTDATA_API_KEY"]) ??
		cleanEnv(process.env["BRIGHT_DATA_API_KEY"]) ??
		cleanEnv(process.env["BRIGHTDATA_API_TOKEN"])
	);
}

function brightDataSerpZone(): string {
	return (
		cleanEnv(process.env["BRIGHTDATA_SERP_ZONE"]) ??
		cleanEnv(process.env["BRIGHT_DATA_ZONE"]) ??
		"serp_api1"
	);
}

// ─── Cache helpers ────────────────────────────────────────────────────────────

function cacheKey(input: string): string {
	return crypto.createHash("sha256").update(input).digest("hex").slice(0, 32);
}

function readCache<T>(key: string): T | null {
	try {
		const p = path.join(CACHE_DIR, `${key}.json`);
		if (!fs.existsSync(p)) return null;
		const stat = fs.statSync(p);
		if (Date.now() - stat.mtimeMs > CACHE_TTL_MS) return null;
		return JSON.parse(fs.readFileSync(p, "utf-8")) as T;
	} catch {
		return null;
	}
}

function writeCache<T>(key: string, data: T): void {
	try {
		fs.mkdirSync(CACHE_DIR, { recursive: true });
		fs.writeFileSync(path.join(CACHE_DIR, `${key}.json`), JSON.stringify(data, null, 2), "utf-8");
	} catch {
		// non-fatal
	}
}

// ─── Fetch helper ─────────────────────────────────────────────────────────────

async function fetchWithTimeout(url: string, init: RequestInit, ms: number): Promise<Response> {
	const ac = new AbortController();
	const t = setTimeout(() => ac.abort(), ms);
	try {
		return await fetch(url, { ...init, signal: ac.signal });
	} finally {
		clearTimeout(t);
	}
}

// ─── SERP ─────────────────────────────────────────────────────────────────────

/**
 * Search Google SERP via Bright Data for a given query + location.
 * Returns organic listings, local pack, and People Also Ask results.
 *
 * Returns empty arrays if BRIGHTDATA_API_KEY is not set.
 */
export async function searchSerp(query: string, location: string): Promise<SerpResult> {
	const empty: SerpResult = { organic: [], localPack: [], peopleAlsoAsk: [] };

	const apiKey = brightDataApiKey();
	if (!apiKey) {
		console.warn("[brightdata] API key not set - skipping SERP");
		return empty;
	}

	const ck = cacheKey(`serp:${query}:${location}`);
	const cached = readCache<SerpResult>(ck);
	if (cached) return cached;

	try {
		const searchParams = new URLSearchParams();
		searchParams.set("q", query);
		searchParams.set("hl", "en");
		searchParams.set("gl", "us");
		if (location) {
			searchParams.set("uule", location);
		}
		searchParams.set("brd_json", "1");

		const body = JSON.stringify({
			zone: brightDataSerpZone(),
			url: `https://www.google.com/search?${searchParams.toString()}`,
			format: "json",
			method: "GET",
			country: "us",
		});

		const serpRes = await fetchWithTimeout(
			`${BRIGHTDATA_BASE}/request`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${apiKey}`,
					"Content-Type": "application/json",
					"x-unblock-data-format": "parsed_light",
				},
				body,
			},
			TIMEOUT_MS,
		);

		if (!serpRes.ok) {
			console.warn(`[brightdata] SERP request failed: ${serpRes.status}`);
			return empty;
		}

		const rawData = await serpRes.json();
		const page = parseSerpPage(rawData);
		if (!page) return empty;

		const organic = parseOrganic(page);
		const localPack = parseLocalPack(page);
		const peopleAlsoAsk = parsePAA(page);

		const result: SerpResult = { organic, localPack, peopleAlsoAsk };
		writeCache(ck, result);
		return result;
	} catch (err) {
		console.warn("[brightdata] SERP error:", err);
		return empty;
	}
}

function parseSerpPage(rawData: unknown): Record<string, unknown> | null {
	if (!rawData || typeof rawData !== "object") return null;
	const response = rawData as Record<string, unknown>;

	if (typeof response["body"] === "string") {
		try {
			return JSON.parse(response["body"]) as Record<string, unknown>;
		} catch {
			return null;
		}
	}

	if (response["body"] && typeof response["body"] === "object") {
		return response["body"] as Record<string, unknown>;
	}

	return response;
}

function parseOrganic(page: Record<string, unknown>): OrganicResult[] {
	const items = page["organic"] ?? page["organic_results"];
	if (!Array.isArray(items)) return [];
	return items.slice(0, 10).map((item: Record<string, unknown>, idx: number) => ({
		position: (item["position"] as number) ?? (item["rank"] as number) ?? idx + 1,
		url: (item["url"] as string) ?? (item["link"] as string) ?? "",
		title: (item["title"] as string) ?? "",
		snippet: (item["description"] as string) ?? (item["snippet"] as string) ?? "",
		domain:
			(item["domain"] as string) ??
			(item["source"] as string) ??
			(item["display_link"] as string) ??
			"",
	}));
}

function parseLocalPack(page: Record<string, unknown>): LocalPackResult[] {
	const items = page["local_pack"] ?? page["local"] ?? page["local_results"] ?? page["places"];
	if (!Array.isArray(items)) return [];
	return items.slice(0, 3).map((item: Record<string, unknown>, idx: number) => ({
		position: (item["position"] as number) ?? (item["rank"] as number) ?? idx + 1,
		name: (item["name"] as string) ?? "",
		address: (item["address"] as string) ?? "",
		phone: (item["phone"] as string) ?? undefined,
		rating: (item["rating"] as number) ?? undefined,
		reviews: (item["reviews"] as number) ?? undefined,
		gbpUrl: (item["url"] as string) ?? undefined,
	}));
}

function parsePAA(page: Record<string, unknown>): PeopleAlsoAskItem[] {
	const items = page["people_also_ask"] ?? page["related_questions"];
	if (!Array.isArray(items)) return [];
	return items.slice(0, 5).map((item: Record<string, unknown>) => ({
		question: (item["question"] as string) ?? "",
		answer: (item["answer"] as string) ?? undefined,
		sourceUrl: (item["url"] as string) ?? undefined,
	}));
}

// ─── GBP Reviews ──────────────────────────────────────────────────────────────

/**
 * Scrape Google Business Profile reviews from a GBP URL.
 * Returns reviews, aggregate rating, and review count.
 *
 * Returns empty result if BRIGHTDATA_API_KEY is not set.
 */
export async function scrapeGbpReviews(gbpUrl: string): Promise<GbpReviewResult> {
	const empty: GbpReviewResult = { reviews: [], rating: 0, count: 0 };

	const apiKey = process.env["BRIGHTDATA_API_KEY"];
	if (!apiKey) {
		console.warn("[brightdata] BRIGHTDATA_API_KEY not set — skipping GBP reviews");
		return empty;
	}

	const ck = cacheKey(`gbp:${gbpUrl}`);
	const cached = readCache<GbpReviewResult>(ck);
	if (cached) return cached;

	try {
		// Bright Data "Google Maps Reviews" dataset
		const body = JSON.stringify([{ url: gbpUrl, max_reviews: 50 }]);

		const triggerRes = await fetchWithTimeout(
			`${BRIGHTDATA_BASE}/datasets/v3/trigger?dataset_id=gd_lk538t2k2p1k3oos71&format=json&uncompressed_webhook=true`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${apiKey}`,
					"Content-Type": "application/json",
				},
				body,
			},
			TIMEOUT_MS,
		);

		if (!triggerRes.ok) {
			console.warn(`[brightdata] GBP trigger failed: ${triggerRes.status}`);
			return empty;
		}

		const triggerJson = (await triggerRes.json()) as { snapshot_id?: string };
		const snapshotId = triggerJson.snapshot_id;
		if (!snapshotId) return empty;

		let rawData: unknown = null;
		for (let i = 0; i < 6; i++) {
			await new Promise((r) => setTimeout(r, 6000));
			const pollRes = await fetchWithTimeout(
				`${BRIGHTDATA_BASE}/datasets/v3/snapshot/${snapshotId}?format=json`,
				{ headers: { Authorization: `Bearer ${apiKey}` } },
				TIMEOUT_MS,
			);
			if (pollRes.ok) {
				rawData = await pollRes.json();
				break;
			}
		}

		if (!rawData || !Array.isArray(rawData) || rawData.length === 0) return empty;

		const page = rawData[0] as Record<string, unknown>;
		const rating = (page["rating"] as number) ?? 0;
		const count = (page["review_count"] as number) ?? 0;
		const rawReviews = page["reviews"];
		const reviews: GbpReview[] = Array.isArray(rawReviews)
			? rawReviews.map((r: Record<string, unknown>) => ({
					author: (r["reviewer_name"] as string) ?? "Anonymous",
					rating: (r["rating"] as number) ?? 5,
					date: (r["date"] as string) ?? "",
					text: (r["review_text"] as string) ?? "",
					ownerReply: (r["owner_response"] as string) ?? undefined,
				}))
			: [];

		const result: GbpReviewResult = { reviews, rating, count };
		writeCache(ck, result);
		return result;
	} catch (err) {
		console.warn("[brightdata] GBP reviews error:", err);
		return empty;
	}
}
