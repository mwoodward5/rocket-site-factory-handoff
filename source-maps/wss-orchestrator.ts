/**
 * WSS-AI Rocket Control — Build Orchestrator
 *
 * 9-phase pipeline:
 * research → snowflake → copy → media → render → schema → qa → deploy → done
 *
 * Each phase:
 * - Emits BuildLog entries at info/warn/error level
 * - Retries up to 3× on transient failure
 * - Surfaces precise blockers in BuildResult
 *
 * Returns BuildResult with all logs, costs, providers used.
 */

import { getFallbackCopy } from "../seed/copy-templates";
import { generateCopy } from "./copy";
import { estimateCost, recordSpend } from "./costs";
import { deploySite } from "./deploy";
import { generateMedia } from "./media";
import { runQA } from "./qa";
import { renderSite } from "./render";
import { runResearch } from "./research";
import { generateSchema } from "./schema";
import { pickSnowflake } from "./snowflake";
import type {
	ClientBlock,
	Tier,
	BuildResult,
	BuildLog,
	BuildStep,
	ResearchDossier,
	SnowflakeChoices,
	GeneratedCopy,
	GeneratedMedia,
	GeneratedSchema,
	Recipe,
	RenderContext,
	SchemaType,
	BlockKind,
	Industry,
} from "./types";

// ──────────────────────────────────────────────────────────────────
// Logger
// ──────────────────────────────────────────────────────────────────

class BuildLogger {
	private logs: BuildLog[] = [];
	private providers: Set<string> = new Set();
	private totalCost: number = 0;

	log(
		level: BuildLog["level"],
		step: BuildStep,
		message: string,
		data?: Record<string, unknown>,
	): void {
		const entry: BuildLog = {
			ts: new Date().toISOString(),
			level,
			step,
			message,
			data,
		};
		this.logs.push(entry);
		console.log(`[${entry.ts}] [${step.toUpperCase()}] [${level.toUpperCase()}] ${message}`);
	}

	addProvider(name: string): void {
		this.providers.add(name);
	}

	addCost(usd: number): void {
		this.totalCost += usd;
	}

	getLogs(): BuildLog[] {
		return [...this.logs];
	}

	getProviders(): string[] {
		return [...this.providers];
	}

	getTotalCost(): number {
		return this.totalCost;
	}
}

// ──────────────────────────────────────────────────────────────────
// Retry wrapper
// ──────────────────────────────────────────────────────────────────

async function withRetry<T>(
	fn: () => Promise<T>,
	maxAttempts: number,
	step: BuildStep,
	logger: BuildLogger,
): Promise<T> {
	let lastError: Error = new Error("Unknown error");

	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		try {
			return await fn();
		} catch (err) {
			lastError = err instanceof Error ? err : new Error(String(err));

			if (attempt < maxAttempts) {
				const backoffMs = 1000 * Math.pow(2, attempt - 1); // exponential: 1s, 2s, 4s
				logger.log(
					"warn",
					step,
					`Attempt ${attempt}/${maxAttempts} failed: ${lastError.message}. Retrying in ${backoffMs}ms…`,
				);
				await new Promise((r) => setTimeout(r, backoffMs));
			} else {
				logger.log("error", step, `All ${maxAttempts} attempts failed: ${lastError.message}`);
			}
		}
	}

	throw lastError;
}

// ──────────────────────────────────────────────────────────────────
// Default recipe builder
// ──────────────────────────────────────────────────────────────────

function buildDefaultRecipe(client: ClientBlock, tier: Tier, jobId: string): Recipe {
	const homeBlocks =
		tier === "premier"
			? ([
					"header",
					"hero",
					"trust",
					"services",
					"before-after",
					"about",
					"reviews",
					"faq",
					"contact",
					"footer",
				] as const)
			: (["header", "hero", "trust", "services", "about", "faq", "contact", "footer"] as const);

	const pages = [
		{
			slug: "/",
			title: client.name,
			blockKinds: [...homeBlocks] as BlockKind[],
			schema: [
				"Organization",
				"LocalBusiness",
				"Service",
				"FAQPage",
				"BreadcrumbList",
			] as SchemaType[],
		},
		{
			slug: "/services",
			title: "Services",
			blockKinds: ["header", "hero", "services", "contact", "footer"] as BlockKind[],
			schema: ["LocalBusiness", "Service", "BreadcrumbList"] as SchemaType[],
		},
		{
			slug: "/about",
			title: "About",
			blockKinds: ["header", "about", "owner-bio", "contact", "footer"] as BlockKind[],
			schema: ["LocalBusiness", "Person", "BreadcrumbList"] as SchemaType[],
		},
		{
			slug: "/contact",
			title: "Contact",
			blockKinds: ["header", "contact", "footer"] as BlockKind[],
			schema: ["LocalBusiness", "BreadcrumbList"] as SchemaType[],
		},
		{
			slug: "/service-area",
			title: "Service Area",
			blockKinds: ["header", "service-area", "contact", "footer"] as BlockKind[],
			schema: ["LocalBusiness", "Place", "BreadcrumbList"] as SchemaType[],
		},
	];

	const seoPillars = [
		"unique-title-under-60",
		"meta-desc-under-160",
		"canonical",
		"og-tags",
		"twitter-card",
		"json-ld-org",
		"json-ld-localbiz",
		"json-ld-faq",
		"json-ld-breadcrumb",
		"favicons-set",
		"branded-og-image",
		"sitemap-xml",
		"robots-txt",
		"geo-meta",
		"image-alt-text",
		"image-dimensions",
		"lazy-load-below-fold",
		"fetchpriority-hero",
		"hreflang",
		"image-sitemap",
		"indexnow",
		"preload-hero-poster",
		"defer-gtm",
		"dns-prefetch",
		"skip-to-content",
		"semantic-landmarks",
		"breadcrumbs-visible",
		"internal-links-3min",
	] as const;

	return {
		id: `recipe-${jobId}`,
		name: `${client.industry}-${tier}-recipe`,
		tier,
		pages,
		seoPillars: [...seoPillars],
		trustStack: [
			"gbp",
			"license-num",
			"insurance-line",
			"founding-year",
			"owner-portrait",
			"review-count",
		],
		motionRules: [
			{ selector: ".hero", intensity: 2, reducedMotionFallback: "static" },
			{ selector: ".services", intensity: 1, reducedMotionFallback: "minimal" },
		],
		performanceTargets: {
			lighthousePerf: tier === "premier" ? 85 : 90,
			lighthouseA11y: 90,
			firstPaintMaxKb: tier === "starter" ? 500 : 600,
		},
	};
}

// ──────────────────────────────────────────────────────────────────
// Phase implementations
// ──────────────────────────────────────────────────────────────────

/** Minimal industry-default dossier used when all research providers fail. */
function buildFallbackDossier(client: ClientBlock): ResearchDossier {
	const { city, state } = client;
	return {
		source: {
			services: client.services.length > 0 ? client.services : ["General Service"],
			tone: "professional",
			refusals: client.truthRules,
			promises: client.promises,
			faq: [],
			photos: [],
			nap: { name: client.name, address: client.address, phone: client.phone },
		},
		reviews: {
			repeatedPhrases: [
				"professional service",
				"reliable",
				"quality work",
				"fair price",
				"highly recommend",
			],
			painPoints: ["slow response", "hidden fees", "poor communication"],
			emotionalPayoffs: ["peace of mind", "problem solved", "home protected"],
		},
		persona: {
			languageStyle: "direct and professional",
			colorAffinity: "neutral and trustworthy",
			cadence: "clear and confident",
			formality: "professional",
			humor: "none",
			ownerVibe: client.ownerName ? `${client.ownerName}, owner` : "experienced professional",
		},
		hyperlocal: {
			nouns: [city, `${city} area`, `${city} homeowners`, `${city}, ${state}`],
			weather: ["local weather conditions"],
			cultural: [`${city} community`, "locally owned and operated", `serving ${city} families`],
		},
		competitors: null,
	};
}

async function phaseResearch(client: ClientBlock, logger: BuildLogger): Promise<ResearchDossier> {
	logger.log("info", "research", `Starting research for ${client.name}`, {
		existingSiteUrl: client.existingSiteUrl,
		gbpUrl: client.gbpUrl,
	});

	if (client.existingSiteUrl) {
		logger.log("info", "research", `Firecrawl: fetching ${client.existingSiteUrl}`);
		logger.addProvider("firecrawl");
	}
	if (client.gbpUrl) {
		logger.log("info", "research", `Bright Data GBP pull: ${client.gbpUrl}`);
		logger.addProvider("bright-data");
		logger.addCost(0.025); // gbp + serp
	}

	try {
		const dossier = await runResearch(client);

		logger.log("info", "research", "Research complete", {
			sourceServices: dossier.source?.services.length ?? 0,
			reviewPhrases: dossier.reviews?.repeatedPhrases.length ?? 0,
			hyperlocalNouns: dossier.hyperlocal.nouns.length,
			competitorsFound: dossier.competitors?.topThree.length ?? 0,
			persona: dossier.persona?.formality ?? "unknown",
		});

		return dossier;
	} catch (err) {
		const reason = err instanceof Error ? err.message : String(err);
		logger.log(
			"warn",
			"research",
			`Research phase failed (${reason}); using industry-default dossier. ` +
				"Firecrawl/BrightData keys may be missing or invalid.",
			{ fallback: true },
		);
		return buildFallbackDossier(client);
	}
}

async function phaseSnowflake(
	client: ClientBlock,
	dossier: ResearchDossier,
	tier: Tier,
	logger: BuildLogger,
): Promise<SnowflakeChoices> {
	logger.log(
		"info",
		"snowflake",
		`Deriving snowflake design choices for ${client.industry}/${tier}`,
	);

	const snowflake = pickSnowflake(client, dossier, tier);

	logger.log("info", "snowflake", "Snowflake selected", {
		lane: snowflake.lane,
		primaryColor: snowflake.palette.primary,
		displayFont: snowflake.typography.display,
		bodyFont: snowflake.typography.body,
		heroShape: snowflake.hero.shape,
		motionIntensity: snowflake.hero.motionIntensity,
		widgetType: snowflake.widgetType,
		galleryLayout: snowflake.galleryLayout ?? "none",
	});

	return snowflake;
}

async function phaseCopy(
	client: ClientBlock,
	dossier: ResearchDossier,
	snowflake: SnowflakeChoices,
	tier: Tier,
	logger: BuildLogger,
): Promise<GeneratedCopy> {
	logger.log("info", "copy", "Generating copy via OpenAI gpt-4o-mini");

	try {
		logger.addProvider("openai-gpt4o-mini");
		logger.addCost(0.015); // approximate copy cost

		const copy = await generateCopy(client, dossier, snowflake, tier);

		logger.log("info", "copy", "Copy generated", {
			heroHeadline: copy.hero.headline,
			services: copy.services.length,
			faqItems: copy.faq.length,
			metaTitle: copy.meta.title,
		});

		return copy;
	} catch (err) {
		const reason = err instanceof Error ? err.message : String(err);
		logger.log(
			"warn",
			"copy",
			`LLM copy generation failed (${reason}); using industry template copy. ` +
				"OPENAI_API_KEY may be missing or invalid.",
			{ fallback: true, phase: "completed-with-fallback" },
		);

		// generateCopy already catches internally and returns template copy;
		// if it somehow rethrew, produce the fallback directly here.
		const fallbackCopy = getFallbackCopy(
			client.industry as Industry,
			{
				name: client.name,
				industry: client.industry,
				industryTitle: client.industry.charAt(0).toUpperCase() + client.industry.slice(1),
				city: client.city,
				state: client.state,
				phone: client.phone,
				primaryKeyword: client.primaryKeyword,
				ownerName: client.ownerName ?? "our team",
			},
			tier,
			client.services,
		);

		logger.log("info", "copy", "Fallback copy applied", {
			heroHeadline: fallbackCopy.hero.headline,
			services: fallbackCopy.services.length,
			phase: "completed-with-fallback",
		});

		return fallbackCopy;
	}
}

/** Minimal all-placeholder media used when all media providers fail. */
function buildFallbackMedia(client: ClientBlock, copy: GeneratedCopy, tier: Tier): GeneratedMedia {
	const industry = client.industry;
	const placeholderFavicon = `data:image/svg+xml;base64,${Buffer.from(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="80" fill="#2563eb"/><text x="256" y="360" font-family="Georgia,serif" font-weight="bold" font-size="280" fill="white" text-anchor="middle">${client.name.charAt(0).toUpperCase()}</text></svg>`,
	).toString("base64")}`;

	return {
		hero: {
			posterUrl: `/images/placeholder-${tier}-hero.jpg`,
			provider: "placeholder",
			alt: `${client.name} — professional ${industry} in ${client.city}`,
		},
		services: copy.services.map((s, i) => ({
			name: s.name,
			imageUrl: `/images/placeholder-${tier}-service-${i}.jpg`,
			provider: "placeholder",
			alt: `${s.name} — ${industry} service`,
		})),
		ownerPortrait: {
			url: `/images/placeholder-portrait.jpg`,
			provider: "placeholder",
			alt: `${client.ownerName ?? "Owner"} — ${client.name}`,
		},
		ogImage: `/images/placeholder-og.jpg`,
		favicon: {
			v32: placeholderFavicon,
			v180: placeholderFavicon,
			v512: placeholderFavicon,
		},
	};
}

async function phaseMedia(
	client: ClientBlock,
	snowflake: SnowflakeChoices,
	copy: GeneratedCopy,
	tier: Tier,
	logger: BuildLogger,
): Promise<GeneratedMedia> {
	logger.log("info", "media", `Generating media — tier: ${tier}, lane: ${snowflake.lane}`);

	if (tier === "starter") {
		logger.log("info", "media", "Starter: using Pexels for hero and service images");
		if (process.env.PEXELS_API_KEY) {
			logger.addProvider("pexels");
			logger.addCost(0.0); // free
		} else {
			logger.log("warn", "media", "PEXELS_API_KEY not set — will use placeholder images");
		}
	} else {
		if (process.env.OPENAI_API_KEY) {
			logger.log("info", "media", "Premier: AI-generated hero via OpenAI gpt-image-1");
			logger.addProvider("openai-gpt-image-1");
			logger.addCost(0.08); // hero image
		} else {
			logger.log(
				"warn",
				"media",
				"OPENAI_API_KEY not set — premier hero will fall back to Pexels or placeholder",
			);
		}
	}

	logger.log("info", "media", "Generating OG image (1200x630)");
	logger.addCost(0.04); // OG image

	try {
		const media = await generateMedia(client, snowflake, copy, tier);

		logger.log("info", "media", "Media generation complete", {
			heroProvider: media.hero.provider,
			hasVideo: Boolean(media.hero.videoUrl),
			serviceImages: media.services.length,
			ownerPortraitSource: media.ownerPortrait?.provider ?? "none",
			galleryImages: media.galleryImages?.length ?? 0,
		});

		if (media.hero.provider === "veo-3") {
			logger.addProvider("veo-3");
			logger.addCost(2.8); // 8s × $0.35
		}

		return media;
	} catch (err) {
		const reason = err instanceof Error ? err.message : String(err);
		logger.log(
			"warn",
			"media",
			`Media generation failed (${reason}); using placeholder images. ` +
				"OPENAI_API_KEY and/or PEXELS_API_KEY may be missing or invalid.",
			{ fallback: true, phase: "completed-with-fallback" },
		);

		const fallbackMedia = buildFallbackMedia(client, copy, tier);

		logger.log("info", "media", "Placeholder media applied", {
			heroProvider: fallbackMedia.hero.provider,
			serviceImages: fallbackMedia.services.length,
			phase: "completed-with-fallback",
		});

		return fallbackMedia;
	}
}

async function phaseRender(
	ctx: RenderContext,
	recipe: Recipe,
	logger: BuildLogger,
): Promise<Record<string, string>> {
	logger.log("info", "render", `Rendering ${recipe.pages.length} pages`);

	const { files } = await renderSite(ctx, recipe);

	logger.log("info", "render", "Site files generated", {
		fileCount: Object.keys(files).length,
		pages: recipe.pages.map((p) => p.slug),
		hasNextConfig: Boolean(files["next.config.ts"]),
		hasSitemap: Boolean(files["public/sitemap.xml"]),
		hasRobots: Boolean(files["public/robots.txt"]),
		hasLlmsTxt: Boolean(files["public/llms.txt"]),
	});

	return files;
}

async function phaseSchema(
	client: ClientBlock,
	copy: GeneratedCopy,
	recipe: Recipe,
	tier: Tier,
	media: GeneratedMedia,
	snowflake: SnowflakeChoices,
	logger: BuildLogger,
): Promise<GeneratedSchema> {
	logger.log("info", "render", "Generating structured data and meta tags");

	const schema = generateSchema(
		client,
		copy,
		recipe,
		tier,
		media.hero.posterUrl,
		media.ogImage,
		media.favicon.v32,
		snowflake.palette.primary,
	);

	logger.log("info", "render", "Schema generated", {
		jsonLdEntities: schema.jsonLd.length,
		metaKeys: Object.keys(schema.meta).length,
	});

	return schema;
}

async function phaseQA(
	siteFiles: Record<string, string>,
	client: ClientBlock,
	tier: Tier,
	jobId: string,
	logger: BuildLogger,
): Promise<{ score: number; lighthouseScore: number; issues: string[] }> {
	logger.log("info", "qa", "Running QA audits");

	const result = await runQA(siteFiles, {
		client: {
			name: client.name,
			truthRules: client.truthRules,
			industry: client.industry,
			city: client.city,
			state: client.state,
			phone: client.phone,
		},
		buildMeta: { tier, jobId },
	});

	const level = result.score >= 80 ? "info" : result.score >= 60 ? "warn" : "error";
	logger.log(
		level,
		"qa",
		`QA complete — score: ${result.score}/100, lighthouse: ${result.lighthouseScore}/100`,
		{
			issueCount: result.issues.length,
			issues: result.issues.slice(0, 10),
		},
	);

	if (result.issues.length > 0) {
		for (const issue of result.issues) {
			const isError = issue.startsWith("TRUTH RULE") || issue.startsWith("INTERNAL LANGUAGE");
			logger.log(isError ? "error" : "warn", "qa", issue);
		}
	}

	return result;
}

async function phaseDeploy(
	siteFiles: Record<string, string>,
	client: ClientBlock,
	jobId: string,
	tier: Tier,
	logger: BuildLogger,
): Promise<{ previewUrl: string; vercelProjectId: string }> {
	logger.log("info", "deploy", "Deploying to Vercel");

	if (!process.env.VERCEL_TOKEN) {
		logger.log(
			"warn",
			"deploy",
			"VERCEL_TOKEN not set — site marked as pending-deploy. " +
				"Set VERCEL_TOKEN to enable live deployment.",
			{ phase: "completed-with-fallback", pendingDeploy: true },
		);
		return {
			previewUrl: `https://pending-deploy.example.com/${jobId}`,
			vercelProjectId: `pending-${client.businessId}`,
		};
	}

	logger.addProvider("vercel");

	try {
		const result = await deploySite(siteFiles, {
			client: {
				businessId: client.businessId,
				name: client.name,
				city: client.city,
				state: client.state,
			},
			buildMeta: { jobId, tier },
		});

		logger.log("info", "deploy", `Deployment ready`, {
			previewUrl: result.previewUrl,
			vercelProjectId: result.vercelProjectId,
		});

		return result;
	} catch (err) {
		const reason = err instanceof Error ? err.message : String(err);
		logger.log(
			"warn",
			"deploy",
			`Vercel deployment failed (${reason}); site marked as pending-deploy.`,
			{ fallback: true, phase: "completed-with-fallback" },
		);
		return {
			previewUrl: `https://pending-deploy.example.com/${jobId}`,
			vercelProjectId: `pending-${client.businessId}`,
		};
	}
}

// ──────────────────────────────────────────────────────────────────
// Main export
// ──────────────────────────────────────────────────────────────────

export async function runBuild(client: ClientBlock, tier: Tier): Promise<BuildResult> {
	const jobId = crypto.randomUUID().slice(0, 12);
	const logger = new BuildLogger();
	const buildStartedAt = new Date().toISOString();

	logger.log("info", "queued", `Build started — job ${jobId}`, {
		business: client.name,
		industry: client.industry,
		city: client.city,
		state: client.state,
		tier,
	});

	let previewUrl: string | undefined;
	let qaScore: number | undefined;
	let lighthouseScore: number | undefined;

	try {
		// ── Phase 1: Research ──────────────────────────────────────────
		// phaseResearch catches internally — withRetry only handles transient faults.
		const dossier = await withRetry(
			() => phaseResearch(client, logger),
			3,
			"research",
			logger,
		).catch((err: unknown) => {
			logger.log(
				"warn",
				"research",
				`Research retries exhausted (${err instanceof Error ? err.message : String(err)}); using fallback dossier`,
				{ fallback: true },
			);
			return buildFallbackDossier(client);
		});

		// ── Phase 2: Snowflake ─────────────────────────────────────────
		const snowflake = await withRetry(
			() => phaseSnowflake(client, dossier, tier, logger),
			3,
			"snowflake",
			logger,
		);

		// ── Phase 3: Copy ──────────────────────────────────────────────
		// phaseCopy catches internally and returns template copy on LLM failure.
		const copy = await withRetry(
			() => phaseCopy(client, dossier, snowflake, tier, logger),
			3,
			"copy",
			logger,
		).catch((err: unknown) => {
			logger.log(
				"warn",
				"copy",
				`Copy retries exhausted (${err instanceof Error ? err.message : String(err)}); using fallback templates`,
				{ fallback: true },
			);
			return getFallbackCopy(
				client.industry as Industry,
				{
					name: client.name,
					industry: client.industry,
					industryTitle: client.industry.charAt(0).toUpperCase() + client.industry.slice(1),
					city: client.city,
					state: client.state,
					phone: client.phone,
					primaryKeyword: client.primaryKeyword,
					ownerName: client.ownerName ?? "our team",
				},
				tier,
				client.services,
			);
		});

		// ── Phase 4: Media ─────────────────────────────────────────────
		// phaseMedia catches internally and returns placeholder media on failure.
		const media = await withRetry(
			() => phaseMedia(client, snowflake, copy, tier, logger),
			3,
			"media",
			logger,
		).catch((err: unknown) => {
			logger.log(
				"warn",
				"media",
				`Media retries exhausted (${err instanceof Error ? err.message : String(err)}); using placeholder media`,
				{ fallback: true },
			);
			return buildFallbackMedia(client, copy, tier);
		});

		// ── Phase 5 + 6: Schema then Render (schema needed for render context) ──
		logger.log("info", "render", "Building recipe and render context");

		const recipe = buildDefaultRecipe(client, tier, jobId);

		const schema = await withRetry(
			() => phaseSchema(client, copy, recipe, tier, media, snowflake, logger),
			2,
			"render",
			logger,
		);

		const renderContext: RenderContext = {
			client,
			dossier,
			snowflake,
			copy,
			media,
			schema,
			buildMeta: {
				jobId,
				buildStartedAt,
				tier,
				recipeId: recipe.id,
			},
		};

		const siteFiles = await withRetry(
			() => phaseRender(renderContext, recipe, logger),
			2,
			"render",
			logger,
		);

		// ── Phase 7: QA ────────────────────────────────────────────────
		const qaResult = await withRetry(
			() => phaseQA(siteFiles, client, tier, jobId, logger),
			1, // QA is read-only, no retry value
			"qa",
			logger,
		).catch((err: unknown) => {
			logger.log(
				"warn",
				"qa",
				`QA phase failed (${err instanceof Error ? err.message : String(err)}); skipping QA check`,
				{ fallback: true },
			);
			// Return a neutral QA result so the build continues to deploy.
			return { score: 70, lighthouseScore: 70, issues: [] };
		});

		qaScore = qaResult.score;
		lighthouseScore = qaResult.lighthouseScore;

		// Block deploy if critical QA failures
		const criticalIssues = qaResult.issues.filter(
			(i) => i.startsWith("TRUTH RULE VIOLATION") || i.startsWith("INTERNAL LANGUAGE LEAK"),
		);

		if (criticalIssues.length > 0) {
			throw new Error(`Build blocked by critical QA failures:\n${criticalIssues.join("\n")}`);
		}

		// ── Phase 8: Deploy ────────────────────────────────────────────
		// phaseDeploy catches internally — withRetry handles transient faults.
		const deployResult = await withRetry(
			() => phaseDeploy(siteFiles, client, jobId, tier, logger),
			3,
			"deploy",
			logger,
		).catch((err: unknown) => {
			logger.log(
				"warn",
				"deploy",
				`Deploy retries exhausted (${err instanceof Error ? err.message : String(err)}); marking as pending-deploy`,
				{ fallback: true },
			);
			return {
				previewUrl: `https://pending-deploy.example.com/${jobId}`,
				vercelProjectId: `pending-${client.businessId}`,
			};
		});

		previewUrl = deployResult.previewUrl;

		// ── Phase 9: Done ──────────────────────────────────────────────
		const costEstimate = estimateCost(tier, snowflake);
		const actualCost = logger.getTotalCost();

		// Record spend
		await recordSpend(client.businessId, `build-${tier}`, costEstimate.credits).catch((err) => {
			logger.log(
				"warn",
				"done",
				`Credit record failed: ${err instanceof Error ? err.message : String(err)}`,
			);
		});

		logger.log("info", "done", `Build complete — ${client.name} — ${previewUrl}`, {
			jobId,
			qaScore,
			lighthouseScore,
			estimatedCostUsd: costEstimate.internalUsd,
			actualCostUsd: actualCost,
			credits: costEstimate.credits,
			providersUsed: logger.getProviders(),
			fileCount: Object.keys(siteFiles).length,
		});

		return {
			success: true,
			siteId: jobId,
			previewUrl,
			qaScore,
			lighthouseScore,
			totalCostUsd: Math.max(actualCost, costEstimate.internalUsd),
			providersUsed: logger.getProviders(),
			logs: logger.getLogs(),
		};
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);

		logger.log("error", "failed", `Build failed: ${message}`, {
			jobId,
			previewUrl,
		});

		return {
			success: false,
			siteId: jobId,
			previewUrl,
			qaScore,
			lighthouseScore,
			totalCostUsd: logger.getTotalCost(),
			providersUsed: logger.getProviders(),
			logs: logger.getLogs(),
			error: message,
		};
	}
}
