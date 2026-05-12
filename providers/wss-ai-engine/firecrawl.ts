/**
 * Firecrawl provider adapter
 * Scrapes URLs and returns structured markdown + metadata.
 * Falls back to fetch + simple HTML extraction when FIRECRAWL_API_KEY is absent.
 * Caches results by URL hash for 7 days in .cache/firecrawl/
 */

import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ScrapeResult {
	markdown: string;
	html: string;
	metadata: {
		title?: string;
		description?: string;
		ogImage?: string;
		favicon?: string;
		language?: string;
		statusCode?: number;
		sourceUrl: string;
	};
	links: string[];
}

export interface ScrapeOptions {
	/** Comma-separated list of formats. Default: "markdown,html,links" */
	formats?: string[];
	/** Whether to include only the main content. Default: true */
	onlyMainContent?: boolean;
	/** Additional HTTP headers to pass. */
	headers?: Record<string, string>;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TIMEOUT_MS = 30_000;
const MAX_RETRIES = 1;
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const CACHE_DIR = path.join(process.cwd(), ".cache", "firecrawl");
const FIRECRAWL_BASE = "https://api.firecrawl.dev/v1";

// ─── Cache helpers ────────────────────────────────────────────────────────────

function urlHash(url: string): string {
	return crypto.createHash("sha256").update(url).digest("hex").slice(0, 32);
}

function getCachePath(url: string): string {
	return path.join(CACHE_DIR, `${urlHash(url)}.json`);
}

function readCache(url: string): ScrapeResult | null {
	try {
		const p = getCachePath(url);
		if (!fs.existsSync(p)) return null;
		const stat = fs.statSync(p);
		if (Date.now() - stat.mtimeMs > CACHE_TTL_MS) return null;
		const raw = fs.readFileSync(p, "utf-8");
		return JSON.parse(raw) as ScrapeResult;
	} catch {
		return null;
	}
}

function writeCache(url: string, result: ScrapeResult): void {
	try {
		fs.mkdirSync(CACHE_DIR, { recursive: true });
		fs.writeFileSync(getCachePath(url), JSON.stringify(result, null, 2), "utf-8");
	} catch {
		// non-fatal
	}
}

// ─── Fetch with timeout helper ────────────────────────────────────────────────

async function fetchWithTimeout(
	url: string,
	init: RequestInit,
	timeoutMs: number,
): Promise<Response> {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);
	try {
		return await fetch(url, { ...init, signal: controller.signal });
	} finally {
		clearTimeout(timer);
	}
}

// ─── Fallback: bare fetch + naive HTML extraction ─────────────────────────────

function extractLinks(html: string, baseUrl: string): string[] {
	const hrefRe = /href=["']([^"']+)["']/gi;
	const links: string[] = [];
	let m: RegExpExecArray | null;
	while ((m = hrefRe.exec(html)) !== null) {
		try {
			links.push(new URL(m[1], baseUrl).href);
		} catch {
			// skip relative/invalid
		}
	}
	return [...new Set(links)].slice(0, 100);
}

function htmlToMarkdown(html: string): string {
	return html
		.replace(/<script[\s\S]*?<\/script>/gi, "")
		.replace(/<style[\s\S]*?<\/style>/gi, "")
		.replace(/<br\s*\/?>/gi, "\n")
		.replace(/<\/p>/gi, "\n\n")
		.replace(/<\/li>/gi, "\n")
		.replace(/<\/h[1-6]>/gi, "\n\n")
		.replace(/<[^>]+>/g, "")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&nbsp;/g, " ")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

function extractMeta(html: string): ScrapeResult["metadata"] {
	const title = /<title[^>]*>([^<]*)<\/title>/i.exec(html)?.[1] ?? undefined;
	const desc =
		/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i.exec(html)?.[1] ??
		/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i.exec(html)?.[1] ??
		undefined;
	const ogImage =
		/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i.exec(html)?.[1] ??
		undefined;
	return { title, description: desc, ogImage, sourceUrl: "" };
}

async function fallbackScrape(url: string): Promise<ScrapeResult> {
	const res = await fetchWithTimeout(
		url,
		{ headers: { "User-Agent": "WSS-AI-Bot/1.0" } },
		TIMEOUT_MS,
	);
	const html = await res.text();
	const markdown = htmlToMarkdown(html);
	const meta = extractMeta(html);
	meta.statusCode = res.status;
	meta.sourceUrl = url;
	return {
		markdown,
		html,
		metadata: meta,
		links: extractLinks(html, url),
	};
}

// ─── Firecrawl API call ───────────────────────────────────────────────────────

async function firecrawlScrape(
	url: string,
	apiKey: string,
	opts: ScrapeOptions,
): Promise<ScrapeResult> {
	const body = {
		url,
		formats: opts.formats ?? ["markdown", "html", "links"],
		onlyMainContent: opts.onlyMainContent ?? true,
		headers: opts.headers ?? {},
	};

	const res = await fetchWithTimeout(
		`${FIRECRAWL_BASE}/scrape`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify(body),
		},
		TIMEOUT_MS,
	);

	if (!res.ok) {
		throw new Error(`Firecrawl API error ${res.status}: ${await res.text()}`);
	}

	const json = (await res.json()) as {
		success: boolean;
		data?: {
			markdown?: string;
			html?: string;
			metadata?: Record<string, unknown>;
			links?: string[];
		};
	};

	if (!json.success || !json.data) {
		throw new Error("Firecrawl returned unsuccessful response");
	}

	const d = json.data;
	const meta = (d.metadata ?? {}) as Record<string, unknown>;

	return {
		markdown: d.markdown ?? "",
		html: d.html ?? "",
		metadata: {
			title: typeof meta["title"] === "string" ? meta["title"] : undefined,
			description: typeof meta["description"] === "string" ? meta["description"] : undefined,
			ogImage: typeof meta["ogImage"] === "string" ? meta["ogImage"] : undefined,
			favicon: typeof meta["favicon"] === "string" ? meta["favicon"] : undefined,
			language: typeof meta["language"] === "string" ? meta["language"] : undefined,
			statusCode: typeof meta["statusCode"] === "number" ? meta["statusCode"] : undefined,
			sourceUrl: url,
		},
		links: d.links ?? [],
	};
}

// ─── Retry with exponential backoff ──────────────────────────────────────────

async function withRetry<T>(fn: () => Promise<T>, retries: number, baseDelayMs = 1000): Promise<T> {
	let lastErr: unknown;
	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			return await fn();
		} catch (err) {
			lastErr = err;
			if (attempt < retries) {
				await new Promise((r) => setTimeout(r, baseDelayMs * Math.pow(2, attempt)));
			}
		}
	}
	throw lastErr;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Scrape a URL and return markdown, raw HTML, metadata, and extracted links.
 *
 * Uses Firecrawl when FIRECRAWL_API_KEY is set; otherwise falls back to
 * a plain fetch + HTML extraction. Results are cached for 7 days.
 */
export async function scrapeUrl(url: string, opts: ScrapeOptions = {}): Promise<ScrapeResult> {
	// Check cache first
	const cached = readCache(url);
	if (cached) return cached;

	const apiKey = process.env["FIRECRAWL_API_KEY"];

	const result = await withRetry(async () => {
		if (apiKey) {
			return firecrawlScrape(url, apiKey, opts);
		}
		return fallbackScrape(url);
	}, MAX_RETRIES);

	writeCache(url, result);
	return result;
}
