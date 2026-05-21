export interface PersonalInfo {
  name: string;
  age: number;
  location: string;
  title: string;
  email: string;
  phone?: string;
  handle: string;
  bio: string;
  bioFr?: string;
  avatar: string;
  fallbackAvatar: string;
  languages?: { language: string; level: string }[];
}

export interface EducationEntry {
  degree: string;
  institution: string;
  duration: string;
  graduationDate?: string;
  achievements?: string[];
}

export type Education = EducationEntry[];

export interface Experience {
  company: string;
  position: string;
  type: string;
  duration: string;
  description: string;
  impact?: string[];
  technologies: string[];
}

export type CareerStepType =
  | 'education'
  | 'internship'
  | 'job'
  | 'freelance'
  | 'student_job';

export type Locale = 'fr' | 'en';

export interface LocalizedString {
  fr: string;
  en: string;
}

export interface CareerStepImage {
  src: string;
  alt: LocalizedString;
}

export interface CareerStepDetail {
  description: LocalizedString;
  highlights: LocalizedString[];
  technologies?: string[];
  images?: CareerStepImage[];
}

export interface CareerStepCvRef {
  section: 'education' | 'experience';
  index: number;
}

export interface CareerStepMapStyle {
  lineColor?: string;
}

export interface NestedExperience {
  id: string;
  type: CareerStepType;
  period: string;
  title: LocalizedString;
  organization: string;
  location?: string;
  skills?: string[];
}

export interface CareerStep {
  id: string;
  order: number;
  type: CareerStepType;
  city: string;
  country: LocalizedString;
  countryCode: string;
  lat: number;
  lng: number;
  period: string;
  title: LocalizedString;
  organization: string;
  summary: LocalizedString;
  detail: CareerStepDetail;
  cvRef?: CareerStepCvRef;
  mapStyle?: CareerStepMapStyle;
  emoji?: string;
  sideTrip?: boolean;
  sideTripFromId?: string;
  /** After this side-trip stop, avatar returns here before the next chapter */
  returnsToHubId?: string;
  /** Hide duplicate map pin (e.g. hub return waypoints) */
  hideMarker?: boolean;
  nestedExperiences?: NestedExperience[];
  recruiterSkills?: string[];
}

export interface Testimonial {
  id: string;
  stepId: string;
  quote: LocalizedString;
  author: string;
  role: LocalizedString;
  company?: string;
  /** PDF shown inline (e.g. official internship evaluation grid) */
  documentUrl?: string;
  documentLabel?: LocalizedString;
}

export interface CareerJourneyMapConfig {
  style: string;
  idleCenter: [number, number];
  idleZoom: number;
  segmentDurationMs: number;
  stepPauseMs: number;
}

export interface CareerJourneyIntro {
  headline: LocalizedString;
  subheadline: LocalizedString;
  ctaLabel: LocalizedString;
  skipIntroLabel: LocalizedString;
}

export interface CareerJourney {
  enabled: boolean;
  avatarMarkerSrc?: string;
  intro: CareerJourneyIntro;
  map: CareerJourneyMapConfig;
  steps: CareerStep[];
  testimonials: Testimonial[];
}

export interface Skills {
  scripting_tools: string[];
  databases_orm: string[];
  backend_development: string[];
  frontend_development: string[];
  data_science: string[];
  ml_computer_vision: string[];
  genai_ai: string[];
  cloud_devops: string[];
  iot_embedded: string[];
  programming: string[];
  ml_ai: string[];
  web_development: string[];
  databases: string[];
  devops_cloud: string[];
  iot_hardware: string[];
  soft_skills: string[];
  certifications?: string[];
  methods?: string[];
}

export interface ProjectLink {
  name: string;
  url: string;
}

export interface ProjectImage {
  src: string;
  alt: string;
}

export interface Project {
  title: string;
  category: string;
  description: string;
  techStack: string[];
  date: string;
  status: string;
  featured: boolean;
  achievements?: string[];
  metrics?: string[];
  links: ProjectLink[];
  images: ProjectImage[];
}

export interface Social {
  linkedin: string;
  github: string;
}

export interface Job {
  seeking: boolean;
  contractTypes: string[];
  startDate: string;
  preferredLocation: string;
  roles: string[];
  focusAreas: string[];
  availability: string;
  workStyle: string;
  goals: string;
}


export interface Personality {
  traits: string[];
  interests: string[];
  funFacts: string[];
  workingStyle: string;
  motivation: string;
}

export interface Resume {
  title: string;
  description: string;
  fileType: string;
  lastUpdated: string;
  fileSize: string;
  downloadUrl: string;
}

export interface Chatbot {
  name: string;
  personality: string;
  tone: string;
  language: string;
  responseStyle: string;
  useEmojis: boolean;
  topics: string[];
}

export interface PresetQuestions {
  me: string[];
  professional: string[];
  projects: string[];
  contact: string[];
  fun: string[];
}

export interface Meta {
  configVersion: string;
  lastUpdated: string;
  generatedBy: string;
  description: string;
}

export interface LandingContent {
  tagline: string;
  highlight: string;
  valueProposition: string;
}

export interface CvSkillCategory {
  category: string;
  categoryEn: string;
  skills: string[];
}

export interface PortfolioConfig {
  job: Job;
  personal: PersonalInfo;
  education: Education;
  experience: Experience[];
  skills: Skills;
  cv_skills?: CvSkillCategory[];
  projects: Project[];
  social: Social;
  personality: Personality;
  resume: Resume;
  chatbot: Chatbot;
  presetQuestions: PresetQuestions;
  landing: LandingContent;
  meta: Meta;
  careerJourney?: CareerJourney;
}

// Utility types for component props
export interface ProjectContentProps {
  project: {
    title: string;
  };
}

export interface ContactInfo {
  name: string;
  email: string;
  handle: string;
  socials: Array<{
    name: string;
    url: string;
  }>;
}

export interface ProfileInfo {
  name: string;
  age: string;
  location: string;
  description: string;
  descriptionFr?: string;
  src: string;
  fallbackSrc: string;
}

export interface SkillCategory {
  category: string;
  icon: React.ReactNode;
  skills: string[];
  color: string;
}
