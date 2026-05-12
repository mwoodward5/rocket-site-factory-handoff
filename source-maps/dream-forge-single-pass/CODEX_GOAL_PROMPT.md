/goal Build WSS Dream Forge into a working Supastarter/Next.js SaaS product using this starter scaffold as the source of truth.

Mission:
Turn this project into an operational AI website factory for local-business websites. Use the own-template engine path, not Lovable automation. The UI must look premium, cinematic, modern, and owner-friendly.

Hard rules:
- Do not automate Lovable's private UI as the core business engine.
- Use WSS's own 180-template kit registry as the remix source.
- Preserve credit wallet economics: customer credits are charged before provider-cost actions.
- Use targeted slot patches for edits instead of regenerating whole sites.
- Keep all provider keys in env vars only.
- Make every page mobile-first and high-polish.

Build phases:
1. Install and verify the project runs.
2. Port this starter into the current Supastarter app structure.
3. Replace mock data with Drizzle/Supabase queries.
4. Implement businesses, templates, sites, credit_wallets, credit_transactions, build_jobs, opportunities.
5. Wire API route handlers for build queue, chat patch preview, wallet checkout, opportunities, stats, and templates.
6. Build a template importer for existing React/Lovable exports.
7. Add provider adapters behind env gates: Firecrawl, Bright Data, Pexels, OpenAI image, Veo, Resend, Vercel.
8. Add a pilot build: Pro Plumbers Summerfield.
9. Add QA gates: mobile screenshot, CTA check, schema check, truth-rule check, basic Lighthouse score.
10. Ship a preview deploy and document remaining env vars.

Credit diet:
Use the smallest possible number of expensive model/provider calls. Prefer deterministic code, local mocks, and seeded template data until the pilot path is proven.
