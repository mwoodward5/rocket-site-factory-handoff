import type { PremiumComponentName } from './premium-components';

export type VerticalPresetId =
  | 'kitchen-remodel'
  | 'cleaning'
  | 'plumbing'
  | 'landscape'
  | 'dental'
  | 'law-firm'
  | 'electrical';

export interface VerticalPreset {
  id: VerticalPresetId;
  label: string;
  components: PremiumComponentName[];
  widgetName: string;
  notes: string[];
}

export const verticalPresets: Record<VerticalPresetId, VerticalPreset> = {
  'kitchen-remodel': {
    id: 'kitchen-remodel',
    label: 'Kitchen remodeling',
    components: ['HeroCinematic', 'LiveEstimatorWidget', 'BeforeAfterSlider', 'ProcessTimeline', 'LocationsGrid', 'CTAMagnetic', 'SectionDivider'],
    widgetName: 'Kitchen Remodel Vision Planner',
    notes: ['Use bright luxury visual language.', 'Do not present simulated before/after panels as real project photos.'],
  },
  cleaning: {
    id: 'cleaning',
    label: 'Cleaning',
    components: ['HeroCinematic', 'LiveEstimatorWidget', 'ProcessTimeline', 'LocationsGrid', 'CTAMagnetic', 'SectionDivider'],
    widgetName: 'Quote Wizard',
    notes: ['Favor clarity, trust, and fast quote intent.'],
  },
  plumbing: {
    id: 'plumbing',
    label: 'Plumbing',
    components: ['HeroCinematic', 'LiveEstimatorWidget', 'ProcessTimeline', 'LocationsGrid', 'CTAMagnetic', 'SectionDivider'],
    widgetName: 'Dispatch ETA Widget',
    notes: ['Emergency claims must be verified before publishing.'],
  },
  landscape: {
    id: 'landscape',
    label: 'Landscape',
    components: ['HeroCinematic', 'LiveEstimatorWidget', 'BeforeAfterSlider', 'ProcessTimeline', 'LocationsGrid', 'CTAMagnetic', 'SectionDivider'],
    widgetName: 'Property Console',
    notes: ['Use property-shape and outdoor motion motifs.'],
  },
  dental: {
    id: 'dental',
    label: 'Dental',
    components: ['HeroCinematic', 'LiveEstimatorWidget', 'ProcessTimeline', 'LocationsGrid', 'CTAMagnetic', 'SectionDivider'],
    widgetName: 'Booking Console',
    notes: ['Insurance logos require real asset confirmation.'],
  },
  'law-firm': {
    id: 'law-firm',
    label: 'Law firm',
    components: ['HeroCinematic', 'LiveEstimatorWidget', 'ProcessTimeline', 'LocationsGrid', 'CTAMagnetic', 'SectionDivider'],
    widgetName: 'Case Type Selector',
    notes: ['No outcome guarantees or fake case results.'],
  },
  electrical: {
    id: 'electrical',
    label: 'Electrical',
    components: ['HeroCinematic', 'LiveEstimatorWidget', 'ProcessTimeline', 'LocationsGrid', 'CTAMagnetic', 'SectionDivider'],
    widgetName: 'Electrical Clarity Planner',
    notes: ['License, emergency, EV, and panel claims require verification.'],
  },
};

export function getVerticalPreset(id: string | undefined) {
  return verticalPresets[(id || '') as VerticalPresetId] || verticalPresets['kitchen-remodel'];
}
