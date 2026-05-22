import { tool } from 'ai';
import { z } from 'zod';
import { getConfig } from '@/lib/config-loader';

export const getPresentation = tool({
  description:
    'This tool provides a comprehensive professional introduction and personal background, suitable for interviews and formal presentations.',
  parameters: z.object({}),
  execute: async () => {
    const config = getConfig();
    
    return {
      name: config.personal.name,
      title: config.personal.title,
      location: config.personal.location,
      languages: config.personal.languages ?? [],
      bio: config.personal.bio,
      education: config.education.map(edu => ({
        degree: edu.degree,
        institution: edu.institution,
        duration: edu.duration,
        achievements: edu.achievements ?? []
      })),
      traits: config.personality.traits,
      interests: config.personality.interests,
      motivation: config.personality.motivation,
      certifications: config.skills.certifications ?? [],
      professionalSummary: "I'm Karol Naze — Software Engineer specialized in AI and backend systems. I studied in Morocco (INSA Euro-Méd, scholarship via competitive exam) then in Paris where I graduated Top 2 of my class at École d'ingénieur Denis Diderot (Université Paris Cité) and delivered the valedictorian speech. Since then, I've shipped production-grade AI systems: a RAG chatbot for EDF, autonomous agents at Devoteam, and a mobile app deployed on the App Store. I hold certifications from Google, Microsoft (Azure AI-102), and AWS. I'm available immediately and looking for AI Software Engineer roles."
    };
  },
});
