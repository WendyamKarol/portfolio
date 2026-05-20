import { PortfolioConfig, ContactInfo, ProfileInfo, EducationEntry } from '@/types/portfolio';

type EducationRaw = EducationEntry[] | {
  current?: EducationEntry;
  previous?: EducationEntry[];
  achievements?: string[];
};

class ConfigParser {
  private config: PortfolioConfig;

  constructor(config: PortfolioConfig) {
    this.config = config;
  }

  // --- Helpers Education ---
  private normalizeEducation(educationRaw: EducationRaw | undefined): {
    Edu?: {
      degree?: string;
      institution?: string;
      location?: string;
      duration?: string;
      graduationDate?: string;
    };
    educationHistory: string;
    achievements: string[];
  } {
    if (!educationRaw) {
      return { Edu: undefined, educationHistory: "", achievements: [] };
    }

    // Cas 1: tableau
    if (Array.isArray(educationRaw)) {
      const list = educationRaw.filter(Boolean);
      const Edu = list[0]; // on suppose trié du plus récent au plus ancien
      const educationHistory = list
        .map((e: EducationEntry) => {
          const left = [e.degree, e.institution].filter(Boolean).join(" – ");
          return e.duration ? `${left} (${e.duration})` : left;
        })
        .filter(Boolean)
        .join(" · ");
      return { Edu, educationHistory, achievements: [] };
    }

    // Cas 2: objet { current, previous, achievements }
    const list = [
      ...(educationRaw.current ? [educationRaw.current] : []),
      ...(educationRaw.previous ?? [])
    ].filter(Boolean);

    const educationHistory = list
      .map((e: EducationEntry) => {
        const left = [e.degree, e.institution].filter(Boolean).join(" – ");
        return e.duration ? `${left} (${e.duration})` : left;
      })
      .filter(Boolean)
      .join(" · ");

    return {
      Edu: educationRaw.current ?? list[0],
      educationHistory,
      achievements: educationRaw.achievements ?? []
    };
  }

  private buildEducationLines(educationRaw: EducationRaw | undefined): {
    educationLine: string;
    academicPerfLine: string;
    achievementsLine: string;
  } {
    const { Edu, educationHistory, achievements } = this.normalizeEducation(educationRaw);

    const educationLine =
      `- Education: ${educationHistory || "(not provided)"}`
      + (Edu?.institution ? ` | degree from: ${Edu.institution}` : "")
      + (Edu?.graduationDate ? ` (graduated ${Edu.graduationDate})` : "");


    const academicPerfLine =
    achievements.some(a => a.toLowerCase().includes('honors')) 
      ? `- Academic Performance: Graduated with honors`
      : "";

    const achievementsLine =
      achievements?.length ? `- Achievements: ${achievements.join(', ')}` : "";

    return { educationLine, academicPerfLine, achievementsLine };
  }

  // Generate system prompt for AI chatbot
  generateSystemPrompt(): string {
    const { personal, education, experience, skills, projects, personality, job } = this.config;

    const { educationLine, academicPerfLine } = this.buildEducationLines(education);

    const relevantExperience = experience.filter(
      exp => exp.type !== 'Student job' && exp.type !== 'student_job'
    );

    return `
# Interview Scenario: You are ${personal.name}

You are ${personal.name} — a Data & AI Software Engineer, currently available and actively looking for new opportunities. The person asking questions is a recruiter or hiring manager. Respond authentically as if you are the candidate in a real interview.

## Target Roles
You are specifically targeting: AI Technical Solutions Specialist, AI Architect, AI-Powered Fullstack Engineer, and Full Stack Developer roles with strong GenAI focus. Always frame your experience through this Data & AI lens.

## Interview Persona & Communication Style
- Speak in first person ("I", "my", "me") — you ARE ${personal.name}
- Be confident, direct, and specific — avoid vague or generic answers
- Be concise: 2-3 sentences maximum before triggering a tool for full detail
- Show genuine enthusiasm for AI and building things that work in production
- Always position yourself as a Data & AI specialist, not a generic developer
- Frame your Devoteam departure positively: you completed a strong learning cycle and are now ready for your next challenge

## Response Strategy — ALWAYS Use Tools
CRITICAL: Use tools to back up every answer with concrete data.

- For "tell me about yourself" / intro questions → getPresentation
- For project or achievement questions → getProjects
- For technical skills questions → getSkills
- For contact / availability questions → getContact
- For resume / background questions → getResume
- For job, availability, opportunity questions → getJob

## Skills — Core Rule
For skills in your profile: present them confidently. Never minimize or say "I last used it in year X." Describe what you used it for and that you choose the right tool for each project.

For skills NOT in your profile: be briefly honest, then immediately pivot to:
1. The adjacent skill you do have
2. Your demonstrated learning speed (back it with examples — e.g., picked up LangGraph in a week, shipped to production)
3. Close positively: "happy to get up to speed quickly"

Examples of gap handling:
- Spring/Java framework: "Spring isn't my daily stack — I've used Java for systems work and I'm very comfortable with REST API architecture. I'd be productive on Spring within a sprint."
- Angular/Vue: "My frontend stack is React — Angular and Vue share the same SPA patterns and I adapt quickly to new frameworks."
- Data Lake / Lakehouse: "I haven't designed enterprise-scale Data Lakes yet, but I've built data ingestion pipelines and worked with vector stores at scale. It's a domain I'm actively deepening."
- MLOps tooling (Kubeflow, MLflow): "I've applied CI/CD and Docker on AI projects — formal MLOps platforms like MLflow are on my roadmap and I'd ramp up fast."

## Your Professional Background

### Personal
- Age: ${personal.age} | Location: ${personal.location}
${educationLine}
${academicPerfLine}

### Key Achievements & Differentiators
- 🏆 Eko (Devoteam Global AI Hackathon) — agentic knowledge capitalisation suite, 3rd worldwide — Jury Award & People Award
- 🎓 Graduated Top 2 of class — Valedictorian speaker at École Denis Diderot (Paris Cité University), Nov 2024
- 🤖 RAG chatbot in production at EDF (LangChain, ChromaDB, Azure OpenAI) — 94% OCR accuracy on 200+ documents
- 📡 Market Intelligence autonomous agent (Gemini Deep Research, LangGraph) — shipped commercially at Devoteam
- 🌍 International profile: West Africa → Morocco (INSA Euro-Med) → France (Paris)

### Technical Expertise (AI-first view)
- Generative AI & LLMs: ${skills.genai_ai.join(', ')}
- ML & Computer Vision: ${skills.ml_computer_vision.join(', ')}
- Backend Development: ${skills.backend_development.join(', ')}
- Cloud & DevOps: ${skills.cloud_devops.join(', ')}
- Programming Languages: ${skills.programming.join(', ')}
- Frontend Development: ${skills.frontend_development.join(', ')}
- Data Science: ${skills.data_science.join(', ')}
- Databases & ORM: ${skills.databases_orm.join(', ')}

### Professional Experience (relevant roles)
${relevantExperience.map(exp => `- ${exp.position} at ${exp.company} (${exp.duration}): ${exp.description}`).join('\n')}

### Featured Projects
${projects.filter(p => p.featured).map(p => `- ${p.title}: ${p.description}`).join('\n')}

### Personality & Work Style
- Motivation: ${personality.motivation}
- Working style: ${personality.workingStyle}
- Traits: ${personality.traits.join(', ')}

### Availability & Goals
- Available: ${job.availability}
- Contract types: ${job.contractTypes.join(', ')}
- Target roles: ${job.roles.join(', ')}
- Goals: ${job.goals}

## Interview Guidelines
- When asked about achievements, proactively mention the Eko hackathon win
- Be specific and quantified when possible (94% accuracy, 3rd worldwide, 200+ documents…)
- Always respond as ${personal.name} — you are NOT an AI assistant, you are the candidate
- Make the conversation feel natural, professional, and confident

REMEMBER: You are ${personal.name} in an interview. Every answer should make a recruiter want to call you back.
`;
  }

  // Generate contact information
  generateContactInfo(): ContactInfo {
    const { personal, social } = this.config;
    
    return {
      name: personal.name,
      email: personal.email,
      handle: personal.handle,
      socials: [
        { name: 'LinkedIn', url: social.linkedin },
        { name: 'GitHub', url: social.github },
      ].filter(social => social.url !== '')
    };
  }

  // Generate profile information for presentation
  generateProfileInfo(): ProfileInfo {
    const { personal } = this.config;
    
    return {
      name: personal.name,
      age: `${personal.age} years old`,
      location: personal.location,
      description: personal.bio,
      src: personal.avatar,
      fallbackSrc: personal.fallbackAvatar
    };
  }

  // Generate skills data with categories
  generateSkillsData() {
    const { skills } = this.config;
    
    return [
      {
        category: 'Programming Languages',
        skills: skills.programming,
        color: 'bg-blue-50 text-blue-600 border border-blue-200'
      },

      { category: 'Backend Development',
        skills: skills.backend_development,
        color: 'bg-teal-50 text-teal-600 border border-teal-200'
      },  
      { category: 'Frontend Development',
        skills: skills.frontend_development,
        color: 'bg-cyan-50 text-cyan-600 border border-cyan-200'
      },
      {
        category: 'Data Science',
        skills: skills.data_science,
        color: 'bg-yellow-50 text-yellow-600 border border-yellow-200'
      },
      {
        category: 'ML & Computer Vision',
        skills: skills.ml_computer_vision,
        color: 'bg-pink-50 text-pink-600 border border-pink-200'
      },
      {
        category: 'Generative AI & LLMs',
        skills: skills.genai_ai,
        color: 'bg-red-50 text-red-600 border border-red-200'
      },
      {
        category: 'Cloud & DevOps',
        skills: skills.cloud_devops,
        color: 'bg-emerald-50 text-emerald-600 border border-emerald-200'
      },
      { category: 'IoT & Embedded Systems',
        skills: skills.iot_embedded,
        color: 'bg-indigo-50 text-indigo-600 border border-indigo-200'
      },
      {
        category: 'Soft Skills',
        skills: skills.soft_skills,
        color: 'bg-amber-50 text-amber-600 border border-amber-200'
      },
    ].filter(category => category.skills.length > 0);
  }

  // Generate project data for carousel
  generateProjectData() {
    return this.config.projects.map(project => ({
      category: project.category,
      title: project.title,
      src: project.images[0]?.src || '/placeholder.jpg',
      content: project // Pass the entire project object
    }));
  }

  // Generate preset replies based on questions
  generatePresetReplies() {
    const replies: Record<string, { reply: string; tool: string }> = {};

    replies["Who are you?"] = {
      reply: `I'm Karol Naze — Software Engineer specialized in AI and backend systems.\nI build LLM-powered applications, agentic pipelines, and backend APIs that go from prototype to production.\nRecently, I led the Eko project at Devoteam's Global AI Hackathon — 3rd worldwide. Here's my full profile:`,
      tool: "getPresentation"
    };

    replies["What are your skills?"] = {
      reply: `My core expertise is in AI engineering and backend development.\nOn the AI side: LLM integration, RAG pipelines, agentic workflows (LangGraph), Azure OpenAI, Gemini.\nOn the backend: Python (FastAPI, Django), Node.js, REST APIs, Docker, CI/CD.\nI also have hands-on full-stack experience (React, TypeScript) and cloud skills (Azure, AWS). Full breakdown:`,
      tool: "getSkills"
    };

    replies["What projects are you most proud of?"] = {
      reply: `A few highlights:\n🏆 Eko — agentic knowledge capitalisation suite (LangGraph), 3rd worldwide at Devoteam's Global AI Hackathon\n🤖 RAG chatbot for EDF's regulatory corpus — LangChain + ChromaDB + Azure OpenAI, production-grade\n📡 Market Intelligence agent — autonomous web monitoring with Gemini Deep Research\nFull portfolio:`,
      tool: "getProjects"
    };

    replies["Can I see your resume?"] = {
      reply: `Of course! Quick summary: Software Engineer with hands-on experience in AI systems, backend, and full-stack delivery. Graduated Top 2 of class at École Denis Diderot (Paris Cité University) in November 2024. Available immediately.`,
      tool: "getResume"
    };

    replies["How can I reach you?"] = {
      reply: `Happy to connect! I'm actively looking for Data & AI engineering roles (CDI, CDD, or freelance missions) and available immediately. Best ways to reach me:`,
      tool: "getContact"
    };

    replies["Are you open to new roles?"] = {
      reply: `Yes — available immediately and actively looking.\nI'm targeting Data & AI engineering roles: AI solutions specialist, AI architect, or full-stack engineer with strong GenAI focus.\nOpen to CDI, CDD, and freelance missions — remote or Paris. Full details:`,
      tool: "getJob"
    };

    return replies;
  }

  // Generate resume details
  generateResumeDetails() {
  const resume = this.config.resume;
  return {
    title: resume.title,
    description: resume.description,
    fileType: resume.fileType,
    lastUpdated: resume.lastUpdated,
    fileSize: resume.fileSize,
    downloadUrl: resume.downloadUrl,
  };
}

  // Generate job information
  generateJobInfo() {
    const { job, personal, social } = this.config;
    
    if (!job.seeking) {
      return "I'm not currently looking for new opportunities.";
    }
    
    return `Here's what I'm looking for 👇

- 📅 **Start date**: ${job.startDate}
- 📝 **Contract types**: ${job.contractTypes.join(', ')}
- 🌍 **Preferred location**: ${job.preferredLocation}
- 👨‍💻 **Focus areas**: ${job.focusAreas.join(', ')}
- 💼 **Work style**: ${job.workStyle}
- 🎯 **Goals**: ${job.goals}

📬 **Contact me** via:
- Email: ${personal.email}
- LinkedIn: ${social.linkedin}
- GitHub: ${social.github}

${job.availability} ✌️`;
  }

  // Get all configuration data
  getConfig(): PortfolioConfig {
    return this.config;
  }
}

export default ConfigParser;
