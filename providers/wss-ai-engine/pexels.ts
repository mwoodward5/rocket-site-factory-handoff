/**
 * Pexels provider adapter
 * - searchImages: free stock photos
 * - searchVideos: free stock videos
 *
 * Uses PEXELS_API_KEY (required — no fallback, Pexels requires auth).
 * Results cached indefinitely (Pexels CDN URLs do not expire).
 */

import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PexelsImage {
	id: number;
	url: string; // full-resolution src.original
	largeUrl: string; // src.large2x
	mediumUrl: string; // src.medium
	width: number;
	height: number;
	photographer: string;
	photographerUrl: string;
	altText: string;
}

export interface ImageSearchOptions {
	per_page?: number; // 1-80, default 15
	orientation?: "landscape" | "portrait" | "square";
	size?: "large" | "medium" | "small";
	color?: string; // hex or color name
	locale?: string;
	page?: number;
}

export interface PexelsVideo {
	id: number;
	url: string; // download URL (best quality mp4)
	hdUrl?: string; // HD variant
	duration: number; // seconds
	dimensions: { width: number; height: number };
	image: string; // thumbnail
	user: string;
}

export interface VideoSearchOptions {
	per_page?: number;
	orientation?: "landscape" | "portrait" | "square";
	size?: "large" | "medium" | "small";
	page?: number;
	min_duration?: number;
	max_duration?: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PEXELS_BASE = "https://api.pexels.com/v1";
const PEXELS_VIDEO_BASE = "https://api.pexels.com/videos";
const TIMEOUT_MS = 15_000;
const CACHE_DIR = path.join(process.cwd(), ".cache", "pexels");

// ─── Cache (indefinite for Pexels) ───────────────────────────────────────────

function cacheKey(input: string): string {
	return crypto.createHash("sha256").update(input).digest("hex").slice(0, 32);
}

function readCache<T>(key: string): T | null {
	try {
		const p = path.join(CACHE_DIR, `${key}.json`);
		if (!fs.existsSync(p)) return null;
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

// ─── HTTP helper ──────────────────────────────────────────────────────────────

async function pexelsFetch(url: string, apiKey: string): Promise<unknown> {
	const ac = new AbortController();
	const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);
	try {
		const res = await fetch(url, {
			headers: { Authorization: apiKey },
			signal: ac.signal,
		});
		if (!res.ok) {
			throw new Error(`Pexels API error ${res.status}: ${await res.text()}`);
		}
		return await res.json();
	} finally {
		clearTimeout(timer);
	}
}

function getApiKey(): string {
	const key = process.env["PEXELS_API_KEY"];
	if (!key) {
		throw new Error("[pexels] PEXELS_API_KEY is required for free media tier but is not set");
	}
	return key;
}

// ─── Image search ─────────────────────────────────────────────────────────────

/**
 * Search Pexels for stock photos matching a query.
 * Throws if PEXELS_API_KEY is missing (required for free media tier).
 */
export async function searchImages(
	query: string,
	opts: ImageSearchOptions = {},
): Promise<PexelsImage[]> {
	const apiKey = getApiKey();

	const params = new URLSearchParams({
		query,
		per_page: String(opts.per_page ?? 15),
		page: String(opts.page ?? 1),
		...(opts.orientation ? { orientation: opts.orientation } : {}),
		...(opts.size ? { size: opts.size } : {}),
		...(opts.color ? { color: opts.color } : {}),
		...(opts.locale ? { locale: opts.locale } : {}),
	});

	const ck = cacheKey(`img:${params.toString()}`);
	const cached = readCache<PexelsImage[]>(ck);
	if (cached) return cached;

	const json = (await pexelsFetch(`${PEXELS_BASE}/search?${params.toString()}`, apiKey)) as {
		photos: Array<{
			id: number;
			width: number;
			height: number;
			photographer: string;
			photographer_url: string;
			alt: string;
			src: { original: string; large2x: string; medium: string };
			url: string;
		}>;
	};

	const results: PexelsImage[] = (json.photos ?? []).map((p) => ({
		id: p.id,
		url: p.src.original,
		largeUrl: p.src.large2x,
		mediumUrl: p.src.medium,
		width: p.width,
		height: p.height,
		photographer: p.photographer,
		photographerUrl: p.photographer_url,
		altText: p.alt ?? query,
	}));

	writeCache(ck, results);
	return results;
}

// ─── Video search ─────────────────────────────────────────────────────────────

interface PexelsVideoFile {
	quality: string;
	file_type: string;
	width?: number;
	height?: number;
	link: string;
}

/**
 * Search Pexels for stock videos matching a query.
 * Throws if PEXELS_API_KEY is missing.
 */
export async function searchVideos(
	query: string,
	opts: VideoSearchOptions = {},
): Promise<PexelsVideo[]> {
	const apiKey = getApiKey();

	const params = new URLSearchParams({
		query,
		per_page: String(opts.per_page ?? 10),
		page: String(opts.page ?? 1),
		...(opts.orientation ? { orientation: opts.orientation } : {}),
		...(opts.size ? { size: opts.size } : {}),
		...(opts.min_duration !== undefined ? { min_duration: String(opts.min_duration) } : {}),
		...(opts.max_duration !== undefined ? { max_duration: String(opts.max_duration) } : {}),
	});

	const ck = cacheKey(`vid:${params.toString()}`);
	const cached = readCache<PexelsVideo[]>(ck);
	if (cached) return cached;

	const json = (await pexelsFetch(`${PEXELS_VIDEO_BASE}/search?${params.toString()}`, apiKey)) as {
		videos: Array<{
			id: number;
			url: string;
			duration: number;
			width: number;
			height: number;
			image: string;
			user: { name: string };
			video_files: PexelsVideoFile[];
		}>;
	};

	const results: PexelsVideo[] = (json.videos ?? []).map((v) => {
		// Pick best quality: prefer HD
		const files = v.video_files as PexelsVideoFile[];
		const hd = files.find((f) => f.quality === "hd" && f.file_type === "video/mp4");
		const sd = files.find((f) => f.quality === "sd" && f.file_type === "video/mp4");
		const best = hd ?? sd ?? files[0];

		return {
			id: v.id,
			url: best?.link ?? v.url,
			hdUrl: hd?.link,
			duration: v.duration,
			dimensions: {
				width: best?.width ?? v.width,
				height: best?.height ?? v.height,
			},
			image: v.image,
			user: v.user?.name ?? "Pexels",
		};
	});

	writeCache(ck, results);
	return results;
}
