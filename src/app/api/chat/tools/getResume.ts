import { tool } from 'ai';
import { z } from 'zod';
import { getConfig } from '@/lib/config-loader';

export const getResume = tool({
  description:
    'This tool provides comprehensive resume information including professional experience, education, and achievements.',
  parameters: z.object({}),
  execute: async () => {
    const config = getConfig();
    
    return {
      personalInfo: {
        name: config.personal.name,
        email: config.personal.email,
        phone: config.personal.phone ?? '',
        location: config.personal.location,
        title: config.personal.title,
        languages: config.personal.languages ?? [],
        profiles: {
          github: config.social.github,
          linkedin: config.social.linkedin,
        }
      },
      summary: config.personal.bio,

      education: config.education.map(edu => ({
        degree: edu.degree,
        institution: edu.institution,
        duration: edu.duration,
        graduationDate: edu.graduationDate,
        achievements: edu.achievements
      })),
      experience: config.experience.map(exp => ({
        company: exp.company,
        position: exp.position,
        duration: exp.duration,
        type: exp.type,
        description: exp.description,
        technologies: exp.technologies
      })),
      skills: config.skills,
      resume: {
        title: config.resume.title,
        description: config.resume.description,
        lastUpdated: config.resume.lastUpdated,
        downloadUrl: config.resume.downloadUrl
      },
      message: "Here's my full resume. I graduated Top 2 of my class at École Denis Diderot (Paris Cité University) in 2024, then built production AI systems at CGI/EDF, launched as a freelance engineer (including a mobile app deployed on the App Store), and joined Devoteam AI Apps where my team placed 3rd worldwide in their Global AI Hackathon. I'm certified Azure AI Engineer (AI-102), Google Cloud GenAI Leader, and AWS Cloud Practitioner. Available immediately for Data & AI roles."
    };
  },
});
