import { tool } from 'ai';
import { z } from 'zod';
import { getConfig } from '@/lib/config-loader';

export const getJob = tool({
  description: 'Provides detailed information about job preferences, technical experience, and current availability for recruiters and hiring teams.',
  parameters: z.object({}),
  execute: async () => {
    const config = getConfig();
    
    return {
      availability: config.job.startDate ? `Available to start from ${config.job.startDate}` : "Not currently available",
      preferences: {
        contractTypes: config.job.contractTypes,
        roles: config.job.roles,
        workMode: config.job.preferredLocation,
        location: config.personal.location,
        focusAreas: config.job.focusAreas
      },

      experience: {
        freelanceWork: config.experience.find(exp => exp.type === "Freelance")?.description || "Active freelancer",
        recentRoles: config.experience.map(exp => `${exp.position} at ${exp.company} (${exp.duration})`),
        projectHighlights: config.projects
          .filter(p => p.featured)
          .map(p => `${p.title}: ${p.description}`)
      },

      skills: {
        technical: [
          ...config.skills.programming,
          ...config.skills.ml_ai,
          ...config.skills.web_development,
          ...config.skills.databases,
          ...config.skills.devops_cloud,
          ...config.skills.iot_hardware
        ],
        soft: [
          "Team Leadership", "Project Management", "Problem Solving", 
          "Communication", "Adaptability", "Innovation"
        ]
      },

      achievements: Array.isArray(config.education)
        ? ((config.education as { achievements?: string[] }[])[0]?.achievements || [])
        : ((config.education as { achievements?: string[] })?.achievements || []),
      lookingFor: {
        goals: config.job.goals,
        workStyle: config.job.workStyle,
        motivation: config.personality.motivation,
        interests: config.personality.interests
      },
     
      contact: {
        email: config.personal.email,
        linkedin: config.social.linkedin,
        github: config.social.github,
        portfolio: "This AI-powered portfolio showcases my projects and skills"
      },
      personality: {
        traits: config.personality.traits,
        funFacts: config.personality.funFacts,
        workingStyle: config.personality.workingStyle
      },
      professionalMessage: "I'm actively looking for full-time opportunities (CDI or CDD) where I can apply my technical skills, contribute to real products, and continue learning. I enjoy solving problems, working in collaborative teams, and building robust backend systems and AI features. I'd love to know more about the technical challenges your team is facing and how I might contribute."
    };
  },
});
