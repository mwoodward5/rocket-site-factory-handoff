# Cinematic Hero Engine

Every Basic and Finish Pass build must include an asymmetrical cinematic hero.

## Required Layers

- background visual field with gradient, image, procedural pattern, or cinematic environmental effect
- midground proof or service signal layer
- foreground CTA, headline, and custom utility widget
- at least one motion layer that respects `prefers-reduced-motion`

## Hero Rules

- Use one styled word in the headline.
- Avoid a plain centered title/subtitle/button stack.
- Use responsive composition so mobile still has a clear CTA above the fold.
- Include trust/status signals without fake ratings, fake years, fake awards, or fake certifications.
- Use real business data from the Business Packet only.

## Basic Hero Minimum

- primary CTA
- secondary CTA
- sticky mobile CTA
- custom interactive widget entry point
- image-led or procedural cinematic atmosphere
- QA-detectable `data-block="CinematicHero"` marker
- enough layered depth and motion cues to score heroScore >= 8
## Motion gate

The hero must use the local HeroCinematic contract: background motion field, grain, animated light sweep or equivalent depth motion, foreground widget, and reduced-motion fallback. A static centered hero is not client-ready and must fail visual QA.

## Real media gate

The hero must include a media-generation plan. Prefer Google Veo for cinematic loops, Runway as an alternate video provider, and OpenAI Images or Google Imagen for still hero art. Kimi can help plan/critique the shot list, but should not be treated as the final image/video generator. If no paid provider is confirmed, render `hero-media-poster.svg` and keep paid media status blocked, not silently skipped.
