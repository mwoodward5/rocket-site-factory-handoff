# Premium Renderer Contract

Every client-ready generated site must declare and satisfy the premium renderer contract.

Required markers:
- `data-renderer="premium"`
- `data-design-runtime="rocket-site-factory"`
- premium block markers for hero, widget, trust, services, process, service area, FAQ, final CTA, sticky CTA, metadata/social, and QA status.

Blocked renderers:
- fallback
- simple
- static_basic
- emergency

If any blocked renderer is used, the site is dev-only. It cannot be marked complete or published.

Publish-ready requires:
- premium renderer used
- design runtime active
- visual score at least 85
- hero score at least 8
- old residue gate passed
- QA report generated
