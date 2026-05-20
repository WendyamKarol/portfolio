import { tool } from 'ai';
import { z } from 'zod';
import { getConfig } from '@/lib/config-loader';

export const getContact = tool({
  description:
    'This tool provides professional contact information and social media profiles.',
  parameters: z.object({}),
  execute: async () => {
    const config = getConfig();
    
    return {
      contact: {
        email: config.personal.email,
        phone: config.personal.phone ?? '',
        location: config.personal.location,
        availability: config.job?.availability || "Available immediately — actively looking for Data & AI roles"
      },
      socialProfiles: {
        github: config.social.github,
        linkedin: config.social.linkedin,
      },
      languages: config.personal.languages ?? [],
      message: "Happy to connect — I'm available immediately and actively looking for Data & AI engineering roles (CDI, CDD, or freelance). Email is best, and I'm very responsive on LinkedIn too."
    };
  },
});
