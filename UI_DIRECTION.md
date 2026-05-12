# UI Direction

The old Vercel/DreamForge UI is rejected. It looked like an internal debug console, not a site builder.

## What Not To Build

- No dense debug panels as the first screen.
- No tiny unreadable status boxes.
- No "AI council dry run" blocks in the primary builder.
- No credit warning panels dominating the preview.
- No confusing lane/debug terminology.
- No layout where the user cannot tell where to click next.

## What To Build

Build the app around the exact Lovable pattern shown in the reference screenshots:

1. **Home / Created-by Gallery**
   - dark sidebar on the left
   - project/gallery cards in the main area
   - search and simple filters across the top
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
- "Billing"
- "Buy credits"
- "Ask the website assistant"
- "Connect domain"
- "Reports"

Assume the customer is not technical.

The customer-facing assistant should reuse the same simple Lovable-style prompt box. The secret product advantage is that customers can safely edit their own site through our branded assistant, while Supastarter handles login, billing, collaborators, customer portal, and subscriptions behind it.

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
