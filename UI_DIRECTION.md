# UI Direction

The old Vercel/DreamForge UI is rejected. It looked like an internal debug console, not a site builder.

DreamForge should be easier than Lovable:

- one beautiful idea box
- attach anything
- speak into mic
- choose Plan or Build
- send
- DreamForge handles the reasoning, model choice, provider enrichment, template remixing, and build packet behind the scenes

## What Not To Build

- No dense debug panels as the first screen.
- No tiny unreadable status boxes.
- No "AI council dry run" blocks in the primary builder.
- No credit warning panels dominating the preview.
- No confusing lane/debug terminology.
- No layout where the user cannot tell where to click next.
- No visible wall of tools.
- No boxes inside boxes as the main product feel.

## What To Build

Build the app around the exact Lovable pattern shown in the reference screenshots:

1. **Home / Created-by Gallery**
   - dark sidebar on the left
   - project/gallery cards in the main area
   - search and simple filters across the top
   - sidebar items should include Home, Search, Resources, Connectors, All projects, Starred, Created by me, Shared with me
   - lower sidebar should include compact cards inspired by Lovable:
     - Share Rocket Site: referral reward, bonus credits, or two free pages
     - Upgrade to Pro: more pages, AI assistant, social posting, reports, call tracking
   - "Created by me" style project ownership view
   - card thumbnails that make the work feel visual and real

2. **Clean Build Box**
   - centered prompt box on the home screen
   - one big text area: "What should we build?"
   - a simple `+` attachment button
   - a compact Plan/Build selector
   - microphone button
   - send button
   - no extra chrome unless the user expands advanced options

This clean build box is the first product moment. Do not replace it with a dashboard, preflight console, or status-grid screen.

3. **Ticket Intake Mode**
   - same clean prompt box
   - paste Ricardo/PageHub emails, screenshots, files, URLs, or business links
   - show extracted ticket cards below the prompt
   - each card gets Preview, Start, Skip, Done
   - do not lead with poll intervals, window times, raw JSON, or debugging fields
   - advanced auto-scan settings belong in Settings

After a project is selected or generated, build a Lovable-style editor with three obvious regions:

1. **Left Dock**
   - site list
   - current project context
   - the same clean chat input pattern: `+`, Plan/Build, mic, send
   - advanced provider toggles hidden behind a small menu

2. **Center Preview**
   - live site preview
   - desktop/tablet/mobile toggles
   - publish button
   - selected-section highlighting

3. **Right Inspector**
   - section controls
   - page controls
   - SEO
   - domains
   - billing
   - leads
   - activity

## Customer Admin

The customer admin must be simpler than the operator cockpit:

- "Edit my site"
- "Leads"
- "Calls"
- "Billing"
- "Buy credits"
- "Ask the website assistant"
- "Connect domain"
- "Reports"
- "Growth recommendations"

Assume the customer is not technical.

The customer-facing assistant should reuse the same simple Lovable-style prompt box. The secret product advantage is that customers can safely edit their own site through our branded assistant, while Supastarter handles login, billing, collaborators, customer portal, and subscriptions behind it.

## Connectors

Connectors should feel like a natural part of the Lovable-style sidebar, not a separate enterprise admin maze.

Use simple cards:

- Facebook / Instagram
- Google Business Profile
- LinkedIn
- X / Twitter
- YouTube
- TikTok
- Email / newsletter
- future connectors

Each connector card should show: connected, needs setup, unavailable, or simulated. If a connector is unavailable, preserve the workflow with copy/download fallback.

The point of connectors is client value: generate a post, image, or short video from the website and publish/schedule it with credits.

## Growth Cards

Use compact, proof-backed cards to suggest upgrades:

- "Search interest is rising for this service."
- "This page has visits but no calls."
- "You have not posted to Google Business Profile recently."
- "This service could use a dedicated page."
- "This CTA is underperforming."

Each card should show:

- what changed
- why it matters
- suggested action
- estimated credits
- confidence/evidence
- Preview button

No loud banners. No pressure. The tone is useful operator intelligence.

Phone calls are the main proof metric. Reports and growth cards should favor call volume, call source, form leads, and conversion actions over vanity traffic.

## Visual Feel

Operator:

- dark, premium, calm
- large preview area
- clear primary actions
- no debugging noise unless an "Advanced" panel is opened

Customer:

- warm, light, trustworthy
- fewer options
- explain credit costs plainly
- show before/after previews before charging

## Advanced Controls

Provider controls, Bright Data, Firecrawl, Places, debug logs, queues, cost estimates, and health checks must exist, but they should live behind:

- Advanced menu
- Settings page
- Provider status page
- Build details drawer

They should not dominate the first screen.

The old Bulk Ops/Ricardo screen should be treated as source logic only. Do not copy its visual layout. Keep the functionality, simplify the interface.
