import type { CareerStepType } from '@/types/portfolio';

export const STEP_COLORS: Record<CareerStepType, string> = {
  education: '#3B82F6',
  internship: '#F4821E',
  job: '#00C9A7',
  freelance: '#22C55E',
  student_job: '#A855F7',
};

export const MAP_STYLE = 'mapbox://styles/mapbox/dark-v11';

export const DEFAULT_SEGMENT_DURATION_MS = 2000;
export const DEFAULT_STEP_PAUSE_MS = 2500;
export const FLY_TO_DURATION_MS = 1800;
export const INTRO_ROTATION_MS = 1000;

export const PLACEHOLDER_QUOTE = '[À compléter]';

export const STEP_TYPE_LABELS: Record<CareerStepType, { fr: string; en: string }> = {
  education: { fr: 'Formation', en: 'Education' },
  internship: { fr: 'Stage', en: 'Internship' },
  job: { fr: 'Emploi', en: 'Job' },
  freelance: { fr: 'Freelance', en: 'Freelance' },
  student_job: { fr: 'Job étudiant', en: 'Student job' },
};
