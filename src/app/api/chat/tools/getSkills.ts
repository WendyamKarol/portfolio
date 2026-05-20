import { tool } from 'ai';
import { z } from 'zod';
import { getConfig } from '@/lib/config-loader';

export const getSkills = tool({
  description:
    'This tool provides a comprehensive overview of technical skills, expertise, and professional qualifications.',
  parameters: z.object({}),
  execute: async () => {
    const config = getConfig();

     // Regrouper tous les achievements de chaque formation
    const allAchievements = config.education.flatMap((edu) => edu.achievements || []);

    
    return {
      technicalSkills: {
        programming: config.skills.programming,
        backendDevelopment: config.skills.backend_development,
        frontendDevelopment: config.skills.frontend_development,
        dataScience: config.skills.data_science,
        MLComputerVision: config.skills.ml_computer_vision,
        generativeAI: config.skills.genai_ai,
        cloudDevOps: config.skills.cloud_devops,
        IoTEmbeddedSystems: config.skills.iot_embedded,
        methodsAndPrinciples: config.skills.methods ?? [],
      },
      certifications: config.skills.certifications ?? [],
      
      education: config.education.map((edu) => ({
        degree: edu.degree,
        institution: edu.institution,
        duration: edu.duration,
        graduationDate: edu.graduationDate || '',
        achievements: edu.achievements || [],
      })),

      achievements: allAchievements,
      experience: config.experience.map((exp) => ({
        position: exp.position,
        company: exp.company,
        duration: exp.duration,
        type: exp.type,
        technologies: exp.technologies,
        description: exp.description,
      })),
      message:
      "My core expertise is in AI engineering and backend development. On the AI side: LLM integration, RAG systems, agentic workflows with LangGraph, and multimodal pipelines. On the backend: Python (FastAPI, Django), Node.js, and REST API design. I'm also certified on the major cloud platforms — Azure AI Engineer (AI-102), Google Cloud Generative AI Leader, and AWS Certified Cloud Practitioner. I use the right tool for each problem and pick up new technologies fast — happy to go deeper on any specific area."
    };
  },
});
