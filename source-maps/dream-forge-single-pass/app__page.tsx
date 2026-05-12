"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronRight,
  Coins,
  Cpu,
  CreditCard,
  Gauge,
  Globe2,
  Image,
  LayoutGrid,
  MessageSquareText,
  Play,
  Plus,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Wand2,
  Zap
} from "lucide-react";
import { buildJobs as seedJobs, opportunities, templateKits, wallet } from "@/lib/mock-data";
import type { BuildJob, SiteTier } from "@/lib/types";

type NewSiteForm = {
  name: string;
  industry: string;
  city: string;
  state: string;
  phone: string;
  primaryKeyword: string;
  tier: SiteTier;
};

const initialForm: NewSiteForm = {
  name: "Pro Plumbers Summerfield",
  industry: "Plumbing",
  city: "Summerfield",
  state: "FL",
  phone: "(555) 201-8899",
  primaryKeyword: "emergency plumber Summerfield FL",
  tier: "starter"
};

const tabs = ["Mission Control", "Templates", "Bulk Builder", "Customer Admin", "Credits"] as const;

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function StatCard({
  label,
  value,
  icon: Icon,
  sub
}: {
  label: string;
  value: string;
  icon: typeof Rocket;
  sub: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-forge backdrop-blur"
    >
      <div className="flex items-center justify-between">
        <div className="rounded-2xl bg-white/10 p-3">
          <Icon className="h-5 w-5 text-cyan-200" />
        </div>
        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
          Live
        </span>
      </div>
      <div className="mt-5 text-3xl font-black tracking-tight">{value}</div>
      <div className="mt-1 text-sm font-semibold text-slate-200">{label}</div>
      <div className="mt-2 text-xs leading-relaxed text-slate-400">{sub}</div>
    </motion.div>
  );
}

function TemplateCard({ template }: { template: (typeof templateKits)[number] }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 shadow-forge"
    >
      <div className={cx("h-40 bg-gradient-to-br", template.thumbnailGradient, "relative")}>
        <div className="absolute inset-0 bg-forge-grid bg-[length:18px_18px] opacity-40" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="mb-2 flex flex-wrap gap-2">
            {template.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded-full bg-black/35 px-2.5 py-1 text-xs text-white/90 backdrop-blur">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-xl font-black text-white">{template.name}</h3>
          <p className="text-sm text-white/75">{template.industry} · {template.lane}</p>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="rounded-full bg-white/10 px-3 py-1 text-slate-200">{template.tier}</span>
          <span className="text-cyan-200">{template.popularity}% match</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {template.blocks.slice(0, 4).map((block) => (
            <span key={block} className="rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-slate-300">
              {block}
            </span>
          ))}
        </div>
        <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-100">
          Remix this kit <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

function QueueRow({ job }: { job: BuildJob }) {
  const statusColor =
    job.status === "live" || job.status === "ready"
      ? "text-emerald-300"
      : job.status === "failed"
      ? "text-rose-300"
      : "text-cyan-300";

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className={cx("text-xs font-bold uppercase tracking-[0.2em]", statusColor)}>{job.status}</span>
            <span className="text-xs text-slate-500">#{job.id}</span>
          </div>
          <h3 className="mt-1 text-lg font-black">{job.business.name}</h3>
          <p className="text-sm text-slate-400">{job.currentStep}</p>
        </div>
        <div className="min-w-[220px]">
          <div className="flex justify-between text-xs text-slate-400">
            <span>{job.progressPct}%</span>
            <span>{job.creditsCharged} credits</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${job.progressPct}%` }} />
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-2 md:grid-cols-3">
        {job.logs.slice(-3).map((log, index) => (
          <div key={`${job.id}-${index}`} className="rounded-2xl bg-black/20 p-3 text-xs text-slate-300">
            <span className="text-slate-500">{log.ts}</span> · {log.message}
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomerAdminPanel() {
  const [prompt, setPrompt] = useState("Make the hero more cinematic and add a stronger emergency call button.");
  const [patch, setPatch] = useState<string[]>([
    "+ Target: hero image + CTA copy",
    "+ Preserve phone CTA and local SEO schema",
    "+ Charge: 2 credits after approval"
  ]);

  function previewPatch() {
    const lower = prompt.toLowerCase();
    const target = lower.includes("hero") || lower.includes("image") ? "hero/media" : lower.includes("blog") ? "blog" : "copy";
    setPatch([
      `+ Targeted ${target} patch prepared`,
      `+ Request: ${prompt}`,
      "+ No full-site regeneration; only affected slot changes",
      "+ Mobile CTA and truth-rule QA will re-run"
    ]);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-forge">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-blue-500/15 p-3">
            <MessageSquareText className="h-5 w-5 text-blue-200" />
          </div>
          <div>
            <h3 className="text-xl font-black">Customer Site Assistant</h3>
            <p className="text-sm text-slate-400">Small edits, blogs, ads, images, and SEO tasks charge credits.</p>
          </div>
        </div>

        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          className="mt-5 min-h-[150px] w-full rounded-3xl border border-white/10 bg-black/30 p-4 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-600 focus:border-cyan-400/40"
        />

        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={previewPatch} className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950">
            Preview patch
          </button>
          <button className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold text-white">
            Approve + spend credits
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-forge">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black">Patch Preview</h3>
          <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-200">Safe diff</span>
        </div>
        <div className="mt-5 space-y-3">
          {patch.map((line) => (
            <div key={line} className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.04] p-3 font-mono text-xs text-emerald-100">
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DreamForgePage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Mission Control");
  const [jobs, setJobs] = useState(seedJobs);
  const [form, setForm] = useState<NewSiteForm>(initialForm);
  const [query, setQuery] = useState("");

  const filteredTemplates = useMemo(() => {
    return templateKits.filter((template) => {
      const haystack = `${template.name} ${template.industry} ${template.tags.join(" ")}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    });
  }, [query]);

  function launchMockBuild() {
    const template = templateKits.find((kit) => kit.industry.toLowerCase() === form.industry.toLowerCase()) ?? templateKits[0];
    const newJob: BuildJob = {
      id: `job-${Math.floor(Math.random() * 9000 + 1000)}`,
      business: {
        id: `biz-${Math.floor(Math.random() * 9000 + 1000)}`,
        ...form,
        templateId: template.id
      },
      templateId: template.id,
      status: "queued",
      progressPct: 3,
      currentStep: "Queued for WSS Dream Forge remix engine",
      estimatedCostUsd: form.tier === "starter" ? 0.4 : form.tier === "premier" ? 1.35 : 3.5,
      creditsCharged: form.tier === "starter" ? 10 : form.tier === "premier" ? 18 : 40,
      previewUrl: `https://${form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.vercel.app`,
      logs: [
        { ts: new Date().toLocaleTimeString(), level: "success", message: `Matched to ${template.name}` },
        { ts: new Date().toLocaleTimeString(), level: "info", message: "Build recipe created" },
        { ts: new Date().toLocaleTimeString(), level: "info", message: "Provider calls are mocked until env vars are connected" }
      ]
    };
    setJobs((current) => [newJob, ...current]);
    setActiveTab("Bulk Builder");
  }

  const activeJobs = jobs.filter((job) => ["queued", "building", "qa"].includes(job.status)).length;

  return (
    <main className="min-h-screen overflow-hidden bg-[#030712] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-10%] top-[-20%] h-[480px] w-[480px] rounded-full bg-cyan-500/20 blur-[110px]" />
        <div className="absolute right-[-10%] top-[10%] h-[520px] w-[520px] rounded-full bg-blue-600/20 blur-[130px]" />
        <div className="absolute bottom-[-15%] left-[30%] h-[420px] w-[420px] rounded-full bg-fuchsia-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-forge backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-700 p-4 shadow-glow">
              <Wand2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight md:text-3xl">WSS Dream Forge</h1>
                <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-100">
                  Own-engine path
                </span>
              </div>
              <p className="mt-1 max-w-2xl text-sm text-slate-400">
                Template remixing, bulk site builds, customer edits, credit wallet, and provider-ready engine scaffolding.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-white">
              View docs
            </button>
            <button onClick={launchMockBuild} className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-950">
              Launch build
            </button>
          </div>
        </header>

        <div className="mt-6 flex gap-2 overflow-x-auto rounded-3xl border border-white/10 bg-black/20 p-2 forge-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cx(
                "whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-bold transition",
                activeTab === tab ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/10"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Mission Control" && (
          <section className="mt-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Template kits" value="180-ready" icon={LayoutGrid} sub="This starter ships with 4 examples; expand registry to all kits." />
              <StatCard label="Active builds" value={String(activeJobs)} icon={Activity} sub="Queue-first architecture for 20–30 site batches." />
              <StatCard label="Credit balance" value={`${wallet.balance}`} icon={Coins} sub="Mock wallet now; Stripe checkout endpoint scaffold included." />
              <StatCard label="Gross margin target" value="88%" icon={Gauge} sub="Your engine keeps the spread instead of reselling Lovable." />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-forge">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-200">Build Intake</p>
                    <h2 className="mt-2 text-3xl font-black">Create a site from a tested kit</h2>
                    <p className="mt-2 text-sm text-slate-400">
                      This avoids full regeneration. The engine matches a business to a kit, fills slots, then QA checks it.
                    </p>
                  </div>
                  <Rocket className="h-8 w-8 text-cyan-200" />
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {(["name", "industry", "city", "state", "phone", "primaryKeyword"] as const).map((field) => (
                    <label key={field} className="block">
                      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">{field}</span>
                      <input
                        value={form[field]}
                        onChange={(event) => setForm({ ...form, [field]: event.target.value })}
                        className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-cyan-400/50"
                      />
                    </label>
                  ))}
                  <label className="block">
                    <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">tier</span>
                    <select
                      value={form.tier}
                      onChange={(event) => setForm({ ...form, tier: event.target.value as SiteTier })}
                      className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-cyan-400/50"
                    >
                      <option value="starter">starter</option>
                      <option value="premier">premier</option>
                      <option value="domination">domination</option>
                    </select>
                  </label>
                </div>

                <button onClick={launchMockBuild} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 py-4 font-black text-slate-950">
                  Queue mock build <Play className="h-4 w-4" />
                </button>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-forge">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-emerald-300" />
                  <h2 className="text-2xl font-black">Architecture locked</h2>
                </div>
                <div className="mt-5 space-y-3">
                  {[
                    ["No Lovable dependency", "Own template engine avoids API/ToS risk."],
                    ["Slot-level edits", "Chat changes only copy/image/palette/blog slots."],
                    ["Credit wallet", "Charge users before expensive actions run."],
                    ["Provider-ready", "Firecrawl, Bright Data, Pexels, OpenAI, Veo, Resend, Vercel adapters are named."]
                  ].map(([title, desc]) => (
                    <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.05] p-4">
                      <div className="flex items-center gap-2 font-bold">
                        <CheckCircle2 className="h-4 w-4 text-emerald-300" /> {title}
                      </div>
                      <p className="mt-1 text-sm text-slate-400">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "Templates" && (
          <section className="mt-6">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-3xl font-black">Template Gallery</h2>
                <p className="mt-1 text-sm text-slate-400">Replace the four sample kits with your full 180-template registry.</p>
              </div>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search vertical, tag, kit..."
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.06] py-3 pl-11 pr-4 text-sm outline-none md:w-[320px]"
                />
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {filteredTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </section>
        )}

        {activeTab === "Bulk Builder" && (
          <section className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-forge">
              <div className="flex items-center gap-3">
                <Cpu className="h-6 w-6 text-cyan-200" />
                <h2 className="text-2xl font-black">Bulk Paste Queue</h2>
              </div>
              <p className="mt-2 text-sm text-slate-400">
                Paste 20–30 businesses, one per line. This starter simulates queueing; wire the API to persist jobs later.
              </p>
              <textarea
                className="mt-5 min-h-[260px] w-full rounded-3xl border border-white/10 bg-black/30 p-4 text-sm outline-none"
                defaultValue={`Pro Plumbers Summerfield | Plumbing | Summerfield FL | emergency plumber Summerfield FL
Auburn Fence Pros | Fence | Auburn KY | fence installation Auburn KY
South County Roof Rescue | Roofing | Mission Viejo CA | roof repair Mission Viejo CA`}
              />
              <button onClick={launchMockBuild} className="mt-4 w-full rounded-2xl bg-white px-5 py-4 font-black text-slate-950">
                Parse + queue batch
              </button>
            </div>

            <div className="space-y-4">
              {jobs.map((job) => (
                <QueueRow key={job.id} job={job} />
              ))}
            </div>
          </section>
        )}

        {activeTab === "Customer Admin" && (
          <section className="mt-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <StatCard label="Site health" value="94" icon={ShieldCheck} sub="Mock QA score for current customer site." />
              <StatCard label="AI credits" value={String(wallet.balance)} icon={Coins} sub="Customer-visible wallet balance." />
              <StatCard label="Live pages" value="5" icon={Globe2} sub="Premier site page count." />
              <StatCard label="Open tasks" value="3" icon={Sparkles} sub="Upsell and content opportunities." />
            </div>
            <CustomerAdminPanel />
            <div className="grid gap-4 md:grid-cols-3">
              {opportunities.map((opp) => (
                <div key={opp.id} className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-200">{opp.type}</span>
                    <span className="text-sm font-black text-emerald-300">{opp.metricValue}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-black">{opp.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{opp.subtitle}</p>
                  <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold">
                    Run for {opp.suggestedCreditCost} credits <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "Credits" && (
          <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-forge">
              <div className="flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-cyan-200" />
                <h2 className="text-2xl font-black">Credit Wallet</h2>
              </div>
              <div className="mt-6 rounded-[2rem] bg-gradient-to-br from-cyan-400 to-blue-700 p-6 text-slate-950">
                <div className="text-sm font-bold uppercase tracking-[0.25em] text-slate-900/60">Available credits</div>
                <div className="mt-3 text-6xl font-black">{wallet.balance}</div>
                <p className="mt-3 text-sm font-semibold text-slate-900/70">
                  Customer pays your configured credit price. Engine spends provider cost only when approved.
                </p>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {[25, 100, 250].map((credits) => (
                  <button key={credits} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 font-black">
                    Buy {credits}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-forge">
              <h2 className="text-2xl font-black">Action Pricing</h2>
              <div className="mt-5 space-y-3">
                {[
                  ["New starter site", "$0.40 internal", "10 credits", "Template remix + local copy"],
                  ["Hero image regen", "$0.08 internal", "2 credits", "AI or premium media slot"],
                  ["Copy edit", "$0.02 internal", "1 credit", "Targeted copy patch"],
                  ["Cinematic hero", "$1.50 internal", "8 credits", "Premium video hero action"],
                  ["Door hanger/ad pack", "$0.30 internal", "6 credits", "Sales material generator"]
                ].map(([action, cost, credits, desc]) => (
                  <div key={action} className="grid gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                    <div>
                      <div className="font-black">{action}</div>
                      <div className="text-sm text-slate-400">{desc}</div>
                    </div>
                    <div className="text-sm text-slate-300">{cost}</div>
                    <div className="rounded-full bg-cyan-400/10 px-3 py-1 text-sm font-bold text-cyan-200">{credits}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <footer className="mt-10 rounded-[2rem] border border-white/10 bg-black/20 p-5 text-sm text-slate-500">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <span>WSS Dream Forge starter scaffold · mock engine mode</span>
            <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-cyan-300" /> Swap mocks with DB + provider adapters when ready.</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
