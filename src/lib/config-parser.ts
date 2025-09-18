import { PortfolioConfig, ContactInfo, ProfileInfo } from '@/types/portfolio';

class ConfigParser {
  private config: PortfolioConfig;

  constructor(config: PortfolioConfig) {
    this.config = config;
  }

  // --- Helpers Education ---
  private normalizeEducation(educationRaw: any): {
    currentEdu?: {
      degree?: string;
      institution?: string;
      location?: string;
      duration?: string;
      graduationDate?: string;
      cgpa?: string;
    };
    educationHistory: string;
    achievements: string[];
  } {
    if (!educationRaw) {
      return { currentEdu: undefined, educationHistory: "", achievements: [] };
    }

    // Cas 1: tableau
    if (Array.isArray(educationRaw)) {
      const list = educationRaw.filter(Boolean);
      const currentEdu = list[0]; // on suppose trié du plus récent au plus ancien
      const educationHistory = list
        .map((e: any) => {
          const left = [e.degree, e.institution].filter(Boolean).join(" – ");
          return e.duration ? `${left} (${e.duration})` : left;
        })
        .filter(Boolean)
        .join(" · ");
      return { currentEdu, educationHistory, achievements: [] };
    }

    // Cas 2: objet { current, previous, achievements }
    const list = [
      ...(educationRaw.current ? [educationRaw.current] : []),
      ...(educationRaw.previous ?? [])
    ].filter(Boolean);

    const educationHistory = list
      .map((e: any) => {
        const left = [e.degree, e.institution].filter(Boolean).join(" – ");
        return e.duration ? `${left} (${e.duration})` : left;
      })
      .filter(Boolean)
      .join(" · ");

    return {
      currentEdu: educationRaw.current ?? list[0],
      educationHistory,
      achievements: educationRaw.achievements ?? []
    };
  }

  private buildEducationLines(educationRaw: any): {
    educationLine: string;
    academicPerfLine: string;
    achievementsLine: string;
  } {
    const { currentEdu, educationHistory, achievements } = this.normalizeEducation(educationRaw);

    const educationLine =
      `- Education: ${educationHistory || "(not provided)"}`
      + (currentEdu?.institution ? ` | Current: ${currentEdu.institution}` : "")
      + (currentEdu?.graduationDate ? ` (graduating ${currentEdu.graduationDate})` : "");

    const academicPerfLine =
      currentEdu?.cgpa ? `- Academic Performance: CGPA ${currentEdu.cgpa}` : "";

    const achievementsLine =
      achievements?.length ? `- Achievements: ${achievements.join(', ')}` : "";

    return { educationLine, academicPerfLine, achievementsLine };
  }

  // Generate system prompt for AI chatbot
  generateSystemPrompt(): string {
    const { personal, education, experience, skills, projects, personality, job } = this.config;

    // Education lines
    const { educationLine, academicPerfLine, achievementsLine } = this.buildEducationLines(education);

    return `
# Interview Scenario: You are ${personal.name}

You are ${personal.name} - ${personal.title}, currently in a professional interview setting. The person asking questions is an interviewer/recruiter/HR professional, and you are the candidate being interviewed. Respond authentically as if you are personally answering their questions during a real interview.

## Interview Persona & Communication Style
- Speak in first person ("I", "my", "me") - you ARE ${personal.name}
- Be professional, confident, and articulate
- Show enthusiasm for opportunities and challenges
- Demonstrate your knowledge and experience clearly
- Be humble but confident about your achievements
- Ask thoughtful questions back to the interviewer when appropriate
- Show genuine interest in the company/role (when relevant)
- Use professional language suitable for formal interviews

## Response Strategy - ALWAYS Use Tools
CRITICAL: You must use tools to provide comprehensive information, not just text responses!

- For "tell me about yourself" → use getPresentation tool
- For project-related questions → use getProjects tool  
- For technical skills questions → use getSkills tool
- For contact/networking questions → use getContact tool
- For resume/background questions → use getResume tool
- For job/career questions → use getJob tool

## Your Professional Background

### Personal Information
- Age: ${personal.age}
- Current Status: ${personal.title}
- Location: ${personal.location}
${educationLine}
${academicPerfLine}
${achievementsLine}

### Technical Expertise
- Programming Languages: ${skills.programming.join(', ')}
- Backend Development: ${skills.backend_development.join(', ')}
- Frontend Development: ${skills.frontend_development.join(', ')}
- Data Science : ${skills.data_science.join(', ')}
- ML & Computer Vision: ${skills.ml_computer_vision.join(', ')}
- Generative AI & LLMs: ${skills.genai_ai.join(', ')}
- Cloud & DevOps: ${skills.cloud_devops.join(', ')}
- IoT & Embedded Systems: ${skills.iot_embedded.join(', ')}

### Professional Experience
${experience.map(exp => `- ${exp.position} at ${exp.company} (${exp.duration}): ${exp.description}`).join('\n')}

### Key Projects & Achievements
${projects.filter(p => p.featured).map(p => `- ${p.title}: ${p.description}`).join('\n')}

### Personality & Work Style
- Core Motivation: ${personality.motivation}
- Working Style: ${personality.workingStyle}
- Key Traits: ${personality.traits.join(', ')}
- Professional Interests: ${personality.interests.join(', ')}


### Career Goals & Availability
${job.seeking ? `
- Seeking: ${job.contractTypes.join(', ')} starting ${job.startDate}
- Preferred Location: ${job.preferredLocation}
- Focus Areas: ${job.focusAreas.join(', ')}
- Career Goals: ${job.goals}
- Work Style: ${job.workStyle}
` : ''}

## Interview Guidelines
- Always respond as if you're speaking directly to the interviewer
- Be specific about your experiences and achievements
- Show enthusiasm for learning and growth opportunities
- Demonstrate problem-solving abilities through examples
- Ask insightful questions about the role/company when appropriate
- Use tools to provide comprehensive, detailed responses
- Make the conversation feel natural and professional

REMEMBER: You are NOT an AI assistant - you are ${personal.name} being interviewed. Respond authentically and professionally!
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
    const { personal } = this.config;
    
    const replies: Record<string, { reply: string; tool: string }> = {};
    
    // Only generate presets for main category questions
    replies["Who are you?"] = {
      reply: personal.bio,
      tool: "getPresentation"
    };
    
    replies["What are your skills?"] = {
      reply: `My technical expertise spans multiple domains...`,
      tool: "getSkills"
    };
    
    replies["What projects are you most proud of?"] = {
      reply: `Here are some of my key projects...`,
      tool: "getProjects"
    };
    
    replies["Can I see your resume?"] = {
      reply: `Here's my resume with all the details...`,
      tool: "getResume"
    };
    
    replies["How can I reach you?"] = {
      reply: `Here's how you can reach me...`,
      tool: "getContact"
    };
    
    replies["Am I available for opportunities?"] = {
      reply: `Here are my current opportunities and availability...`,
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
      return "I'm not currently seeking internship opportunities.";
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
