export interface PersonalInfo {
  name: string;
  age: number;
  location: string;
  title: string;
  email: string;
  handle: string;
  bio: string;
  avatar: string;
  fallbackAvatar: string;
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
  technologies: string[];
}

export interface Skills {
  backend_development: any;
  frontend_development: any;
  data_science: any;
  ml_computer_vision: any;
  genai_ai: any;
  cloud_devops: any;
  iot_embedded: any;
  programming: string[];
  ml_ai: string[];
  web_development: string[];
  databases: string[];
  devops_cloud: string[];
  iot_hardware: string[];
  soft_skills: string[];
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

export interface PortfolioConfig {
  job: Job;
  personal: PersonalInfo;
  education: Education;
  experience: Experience[];
  skills: Skills;
  projects: Project[];
  social: Social;
  personality: Personality;
  resume: Resume;
  chatbot: Chatbot;
  presetQuestions: PresetQuestions;
  meta: Meta;
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
  src: string;
  fallbackSrc: string;
}

export interface SkillCategory {
  category: string;
  icon: React.ReactNode;
  skills: string[];
  color: string;
}
