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
        IoTEmbeddedSystems: config.skills.iot_embedded
      },
      
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
      "I'd be happy to walk you through my technical skills and expertise. I've built a diverse skill set across multiple domains through both my academic coursework and hands-on project experience. I'm particularly passionate about machine learning and full-stack development, where I've been able to apply these technologies to solve real-world problems. Each area of my expertise has been strengthened through practical application - from building end-to-end web applications to developing ML models for complex data analysis. I believe my combination of theoretical knowledge and practical experience, along with my enthusiasm for continuous learning, would allow me to contribute effectively to your team. What specific technical areas would you like me to elaborate on?"
    };
  },
});
