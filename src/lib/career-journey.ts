import type {
  CareerJourney,
  CareerStep,
  CareerStepType,
  Locale,
  LocalizedString,
  Testimonial,
} from '@/types/portfolio';
import { PLACEHOLDER_QUOTE, STEP_COLORS } from '@/lib/career-map-constants';

export function getSortedSteps(journey: CareerJourney): CareerStep[] {
  return [...journey.steps].sort((a, b) => a.order - b.order);
}

export function getSpineSteps(steps: CareerStep[]): CareerStep[] {
  return steps.filter((s) => !s.sideTrip);
}

export function getHubStep(steps: CareerStep[], hubId: string): CareerStep | undefined {
  return steps.find((s) => s.id === hubId);
}

export function getSideTripHubId(step: CareerStep): string | undefined {
  return step.returnsToHubId ?? step.sideTripFromId;
}

export function resolveLocalized(value: LocalizedString, locale: Locale): string {
  return value[locale] || value.en || value.fr;
}

export function isPlaceholderQuote(quote: LocalizedString): boolean {
  return (
    quote.fr.includes(PLACEHOLDER_QUOTE) ||
    quote.en.includes(PLACEHOLDER_QUOTE) ||
    quote.fr.trim() === '' ||
    quote.en.trim() === ''
  );
}

export function getStepColor(step: CareerStep): string {
  return step.mapStyle?.lineColor ?? STEP_COLORS[step.type];
}

export function isTestimonialVisible(testimonial: Testimonial): boolean {
  return Boolean(testimonial.documentUrl) || !isPlaceholderQuote(testimonial.quote);
}

export function getTestimonialsForStep(
  journey: CareerJourney,
  stepId: string,
): Testimonial[] {
  return journey.testimonials.filter(
    (t) => t.stepId === stepId && isTestimonialVisible(t),
  );
}

export function isSideTripSegment(from: CareerStep, to: CareerStep): boolean {
  if (to.sideTrip && to.sideTripFromId === from.id) return true;
  if (from.sideTrip && getSideTripHubId(from) === to.id) return true;
  return false;
}

/** Waypoints for avatar animation between two player indices */
export function resolveAnimationPath(
  steps: CareerStep[],
  fromIndex: number,
  toIndex: number,
): CareerStep[] {
  const from = steps[fromIndex];
  const to = steps[toIndex];
  if (!from || !to) return [];

  if (fromIndex === toIndex) return [from];

  // Hub → side-trip destination
  if (to.sideTrip && to.sideTripFromId === from.id) {
    return [from, to];
  }

  // Side-trip → next chapter (return to hub first, then continue)
  if (from.sideTrip) {
    const hubId = getSideTripHubId(from);
    const hub = hubId ? getHubStep(steps, hubId) : undefined;
    if (hub && to.id !== hub.id) {
      if (to.sideTrip && to.sideTripFromId === hub.id) {
        return [from, hub, to];
      }
      return [from, hub, to];
    }
  }

  return [from, to];
}

export function buildAnimationPath(
  steps: CareerStep[],
  fromIndex: number,
  toIndex: number,
): CareerStep[] {
  if (fromIndex === toIndex) return [steps[fromIndex]];

  if (fromIndex < toIndex) {
    const path = [steps[fromIndex]];
    for (let i = fromIndex; i < toIndex; i++) {
      const segment = resolveAnimationPath(steps, i, i + 1);
      path.push(...segment.slice(1));
    }
    return path;
  }

  const path = [steps[fromIndex]];
  for (let i = fromIndex; i > toIndex; i--) {
    const segment = resolveAnimationPath(steps, i - 1, i);
    path.push(...[...segment].reverse().slice(1));
  }
  return path;
}

export function getTransitionHopCount(
  steps: CareerStep[],
  fromIndex: number,
  toIndex: number,
): number {
  return Math.max(1, buildAnimationPath(steps, fromIndex, toIndex).length - 1);
}

export function buildSpineRouteGeoJSON(steps: CareerStep[]): GeoJSON.FeatureCollection {
  const spine = getSpineSteps(steps);
  if (spine.length < 2) {
    return { type: 'FeatureCollection', features: [] };
  }

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { kind: 'spine' },
        geometry: {
          type: 'LineString',
          coordinates: spine.map((s) => [s.lng, s.lat]),
        },
      },
    ],
  };
}

export function buildSideTripsGeoJSON(steps: CareerStep[]): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = [];

  for (const step of steps) {
    if (!step.sideTrip || !step.sideTripFromId) continue;
    const origin = steps.find((s) => s.id === step.sideTripFromId);
    if (!origin) continue;

    features.push({
      type: 'Feature',
      properties: { kind: 'side-trip-out', id: step.id },
      geometry: {
        type: 'LineString',
        coordinates: [
          [origin.lng, origin.lat],
          [step.lng, step.lat],
        ],
      },
    });

    features.push({
      type: 'Feature',
      properties: { kind: 'side-trip-return', id: step.id },
      geometry: {
        type: 'LineString',
        coordinates: [
          [step.lng, step.lat],
          [origin.lng, origin.lat],
        ],
      },
    });
  }

  return { type: 'FeatureCollection', features };
}

/** Spine route only — used for static previews */
export function buildFullRouteGeoJSON(steps: CareerStep[]): GeoJSON.FeatureCollection {
  return buildSpineRouteGeoJSON(steps);
}

export interface ProgressRouteGeoJSON {
  spine: GeoJSON.FeatureCollection;
  side: GeoJSON.FeatureCollection;
}

function segmentFeature(
  from: CareerStep,
  to: CareerStep,
  dashed: boolean,
): GeoJSON.Feature {
  return {
    type: 'Feature',
    properties: { color: getStepColor(to), dashed },
    geometry: {
      type: 'LineString',
      coordinates: [
        [from.lng, from.lat],
        [to.lng, to.lat],
      ],
    },
  };
}

export function buildProgressRouteGeoJSON(
  steps: CareerStep[],
  progressIndex: number,
): ProgressRouteGeoJSON {
  const empty: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };

  if (steps.length < 2 || progressIndex < 1) {
    return { spine: empty, side: empty };
  }

  const spineFeatures: GeoJSON.Feature[] = [];
  const sideFeatures: GeoJSON.Feature[] = [];
  const end = Math.min(progressIndex, steps.length - 1);

  for (let i = 1; i <= end; i++) {
    const path = resolveAnimationPath(steps, i - 1, i);
    for (let j = 1; j < path.length; j++) {
      const from = path[j - 1];
      const to = path[j];
      const dashed = isSideTripSegment(from, to);
      const feature = segmentFeature(from, to, dashed);
      if (dashed) {
        sideFeatures.push(feature);
      } else {
        spineFeatures.push(feature);
      }
    }
  }

  return {
    spine: { type: 'FeatureCollection', features: spineFeatures },
    side: { type: 'FeatureCollection', features: sideFeatures },
  };
}

export function interpolateLngLat(
  from: CareerStep,
  to: CareerStep,
  t: number,
): [number, number] {
  const lng = from.lng + (to.lng - from.lng) * t;
  const lat = from.lat + (to.lat - from.lat) * t;
  return [lng, lat];
}

export function getStepByCvRef(
  steps: CareerStep[],
  section: 'education' | 'experience',
  index: number,
): CareerStep | undefined {
  return steps.find(
    (s) => s.cvRef?.section === section && s.cvRef?.index === index,
  );
}

export function getStepTypeLabel(type: CareerStepType, locale: Locale): string {
  const labels: Record<CareerStepType, { fr: string; en: string }> = {
    education: { fr: 'Formation', en: 'Education' },
    internship: { fr: 'Stage', en: 'Internship' },
    job: { fr: 'Emploi', en: 'Job' },
    freelance: { fr: 'Freelance', en: 'Freelance' },
    student_job: { fr: 'Job étudiant', en: 'Student job' },
  };
  return labels[type][locale];
}

/** Project lat/lng to x/y for static SVG teaser (equirectangular) */
export function projectToSvg(
  lng: number,
  lat: number,
  width: number,
  height: number,
): { x: number; y: number } {
  const x = ((lng + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
}
