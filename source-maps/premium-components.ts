export type PremiumComponentName =
  | 'HeroCinematic'
  | 'LiveEstimatorWidget'
  | 'BeforeAfterSlider'
  | 'BrandsMarquee'
  | 'StatsCounter'
  | 'LocationsGrid'
  | 'ReviewsWall'
  | 'ProcessTimeline'
  | 'CTAMagnetic'
  | 'SectionDivider';

export interface PremiumComponentContract {
  name: PremiumComponentName;
  requiredInputs: string[];
  visualRequirements: string[];
  forbiddenPatterns: string[];
  mobileRequirements: string[];
  auditRequirements: string[];
}

export const premiumComponentKitVersion = 'rocket-premium-site-kit-v1';

export const premiumComponentContracts: PremiumComponentContract[] = [
  {
    name: 'HeroCinematic',
    requiredInputs: ['businessName', 'primaryHeadline', 'niche', 'city', 'region'],
    visualRequirements: ['animated motion field', 'grain overlay', 'depth layers', 'asymmetrical composition'],
    forbiddenPatterns: ['static centered hero', 'single flat gradient', 'generic three-card hero'],
    mobileRequirements: ['hero remains readable', 'widget stacks below copy', 'sticky CTA is visible'],
    auditRequirements: ['data-component marker', 'prefers-reduced-motion CSS', 'keyframed ambient motion'],
  },
  {
    name: 'LiveEstimatorWidget',
    requiredInputs: ['verticalPreset', 'painPoints', 'styleOptions', 'scopeOptions', 'timelineOptions'],
    visualRequirements: ['premium software panel', 'live recommendation output', 'clear labels'],
    forbiddenPatterns: ['basic contact form', 'oversized submit button', 'fake estimate claim'],
    mobileRequirements: ['48px minimum tap targets', 'single-column layout'],
    auditRequirements: ['scripted local output', 'no provider call', 'no hardcoded fake claims'],
  },
  {
    name: 'BeforeAfterSlider',
    requiredInputs: ['beforeLabel', 'afterLabel', 'safeDisclosure'],
    visualRequirements: ['comparison logic', 'clear non-fake language', 'visual depth'],
    forbiddenPatterns: ['fake client photos', 'unverified project result claims'],
    mobileRequirements: ['comparison stacks or scrolls cleanly'],
    auditRequirements: ['safe simulated comparison copy'],
  },
  {
    name: 'BrandsMarquee',
    requiredInputs: ['items'],
    visualRequirements: ['subtle loop', 'pause on hover', 'safe icon or text tokens'],
    forbiddenPatterns: ['fake customer logos', 'unverified partnerships'],
    mobileRequirements: ['does not trap horizontal scroll'],
    auditRequirements: ['no fake brand affiliation'],
  },
  {
    name: 'StatsCounter',
    requiredInputs: ['stats'],
    visualRequirements: ['small, disciplined counters', 'verified or safe non-claim numbers only'],
    forbiddenPatterns: ['fake review counts', 'fake years', 'fake ratings', 'inflated awards'],
    mobileRequirements: ['compact grid'],
    auditRequirements: ['safe-stat labels only'],
  },
  {
    name: 'LocationsGrid',
    requiredInputs: ['locations'],
    visualRequirements: ['polished city chips', 'service-area caveat when unverified'],
    forbiddenPatterns: ['invented cities', 'fake physical address'],
    mobileRequirements: ['wraps without clipping'],
    auditRequirements: ['locations sourced from manifest'],
  },
  {
    name: 'ReviewsWall',
    requiredInputs: ['reviews'],
    visualRequirements: ['real reviews only, otherwise render questions/concerns panel'],
    forbiddenPatterns: ['fake testimonials', 'fake ratings'],
    mobileRequirements: ['cards stack with readable text'],
    auditRequirements: ['must prove review source or use fallback'],
  },
  {
    name: 'ProcessTimeline',
    requiredInputs: ['steps'],
    visualRequirements: ['section rhythm variation', 'sticky or animated feeling without clutter'],
    forbiddenPatterns: ['flat brochure list'],
    mobileRequirements: ['steps stack with clear numbers'],
    auditRequirements: ['at least three explicit steps'],
  },
  {
    name: 'CTAMagnetic',
    requiredInputs: ['label', 'href'],
    visualRequirements: ['subtle hover pull', 'max 8px movement', 'disciplined sizing'],
    forbiddenPatterns: ['giant pill button', 'cartoon icon CTA'],
    mobileRequirements: ['48px tap target', 'motion reduced gracefully'],
    auditRequirements: ['no oversized button CSS'],
  },
  {
    name: 'SectionDivider',
    requiredInputs: ['motif'],
    visualRequirements: ['premium hairline or blueprint motif', 'adds rhythm between sections'],
    forbiddenPatterns: ['thick generic separator'],
    mobileRequirements: ['does not consume vertical space excessively'],
    auditRequirements: ['present between major section shifts'],
  },
];

export function getPremiumComponentNames() {
  return premiumComponentContracts.map(contract => contract.name);
}
