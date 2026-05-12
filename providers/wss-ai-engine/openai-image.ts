/**
 * OpenAI Image Generation provider adapter
 * Generates images using gpt-image-1 (dall-e-3 compatible API).
 * Stores results in .cache/openai-images/ by prompt hash.
 *
 * Cost model:
 *   standard 1024x1024  → $0.04
 *   hd       1024x1024  → $0.08
 *   hd       1792x1024  → $0.08
 *   hd       1024x1792  → $0.08
 *   standard 1792x1024  → $0.08  (widescreen standard treated same as hd pricing)
 *   standard 1024x1792  → $0.08
 */

import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ImageSize = "1024x1024" | "1792x1024" | "1024x1792";
export type ImageQuality = "standard" | "hd";

export interface GenerateImageOptions {
	size?: ImageSize;
	quality?: ImageQuality;
	/** Override the model. Default: "gpt-image-1" (reads OPENAI_IMAGE_MODEL) */
	model?: string;
	/** Number of images 1-4. Default: 1 */
	n?: number;
	/** Style: "vivid" | "natural". Default: "vivid" */
	style?: "vivid" | "natural";
}

export interface GeneratedImageResult {
	/** Temporary URL returned by OpenAI (valid ~60 min) */
	url: string;
	/** Estimated generation cost in USD */
	costUsd: number;
	/** Prompt hash, useful for referencing the cached record */
	promptHash: string;
	/** Size used */
	size: ImageSize;
	/** Quality used */
	quality: ImageQuality;
}

interface CachedImageRecord {
	url: string;
	costUsd: number;
	size: ImageSize;
	quality: ImageQuality;
	promptHash: string;
	generatedAt: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TIMEOUT_MS = 60_000;
const CACHE_DIR = path.join(process.cwd(), ".cache", "openai-images");
const OPENAI_BASE = "https://api.openai.com/v1";

// Cost table (USD per image)
const COST_TABLE: Record<ImageSize, Record<ImageQuality, number>> = {
	"1024x1024": { standard: 0.04, hd: 0.08 },
	"1792x1024": { standard: 0.08, hd: 0.08 },
	"1024x1792": { standard: 0.08, hd: 0.08 },
};

// ─── Cache helpers ────────────────────────────────────────────────────────────

function promptHash(prompt: string, size: ImageSize, quality: ImageQuality): string {
	return crypto
		.createHash("sha256")
		.update(`${prompt}:${size}:${quality}`)
		.digest("hex")
		.slice(0, 32);
}

function getCachePath(hash: string): string {
	return path.join(CACHE_DIR, `${hash}.json`);
}

function readCache(hash: string): CachedImageRecord | null {
	try {
		const p = getCachePath(hash);
		if (!fs.existsSync(p)) return null;
		return JSON.parse(fs.readFileSync(p, "utf-8")) as CachedImageRecord;
	} catch {
		return null;
	}
}

function writeCache(hash: string, record: CachedImageRecord): void {
	try {
		fs.mkdirSync(CACHE_DIR, { recursive: true });
		fs.writeFileSync(getCachePath(hash), JSON.stringify(record, null, 2), "utf-8");
	} catch {
		// non-fatal
	}
}

// ─── API call ─────────────────────────────────────────────────────────────────

interface OpenAIImagesResponse {
	created: number;
	data: Array<{ url?: string; b64_json?: string; revised_prompt?: string }>;
}

async function callOpenAIImages(
	apiKey: string,
	prompt: string,
	model: string,
	size: ImageSize,
	quality: ImageQuality,
	style: "vivid" | "natural",
	n: number,
): Promise<string> {
	const ac = new AbortController();
	const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);

	try {
		const res = await fetch(`${OPENAI_BASE}/images/generations`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({ model, prompt, size, quality, style, n }),
			signal: ac.signal,
		});

		if (!res.ok) {
			const errText = await res.text();
			throw new Error(`OpenAI Images API error ${res.status}: ${errText}`);
		}

		const json = (await res.json()) as OpenAIImagesResponse;
		const url = json.data?.[0]?.url;
		if (!url) {
			throw new Error("OpenAI Images returned no URL");
		}
		return url;
	} finally {
		clearTimeout(timer);
	}
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generate an image using OpenAI's image generation (gpt-image-1).
 *
 * Results are cached by prompt+size+quality hash — re-calling with the same
 * inputs returns the cached URL without another API call.
 *
 * Throws if OPENAI_API_KEY is not set.
 */
export async function generateImage(
	prompt: string,
	opts: GenerateImageOptions = {},
): Promise<GeneratedImageResult> {
	const apiKey = process.env["OPENAI_API_KEY"];
	if (!apiKey) {
		throw new Error("[openai-image] OPENAI_API_KEY is not set — cannot generate images");
	}

	const size: ImageSize = opts.size ?? "1024x1024";
	const quality: ImageQuality = opts.quality ?? "standard";
	const model: string = opts.model ?? process.env["OPENAI_IMAGE_MODEL"] ?? "gpt-image-1";
	const style: "vivid" | "natural" = opts.style ?? "vivid";
	const n = opts.n ?? 1;

	const hash = promptHash(prompt, size, quality);

	// Return cached record if available
	const cached = readCache(hash);
	if (cached) {
		return {
			url: cached.url,
			costUsd: cached.costUsd,
			promptHash: cached.promptHash,
			size: cached.size,
			quality: cached.quality,
		};
	}

	const url = await callOpenAIImages(apiKey, prompt, model, size, quality, style, n);

	const costUsd = (COST_TABLE[size]?.[quality] ?? 0.04) * n;

	const record: CachedImageRecord = {
		url,
		costUsd,
		size,
		quality,
		promptHash: hash,
		generatedAt: new Date().toISOString(),
	};

	writeCache(hash, record);

	return { url, costUsd, promptHash: hash, size, quality };
}

/**
 * Look up cost for a given size + quality combination without making an API call.
 */
export function imageCostUsd(size: ImageSize, quality: ImageQuality): number {
	return COST_TABLE[size]?.[quality] ?? 0.04;
}
