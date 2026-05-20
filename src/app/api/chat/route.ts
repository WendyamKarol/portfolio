import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

import { SYSTEM_PROMPT } from './prompt';
import { getContact } from './tools/getContact';
import { getJob } from './tools/getJob';
import { getPresentation } from './tools/getPresentation';
import { getProjects } from './tools/getProjects';
import { getResume } from './tools/getResume';
import { getSkills } from './tools/getSkills';

export const maxDuration = 30;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response('Missing API key', { status: 500 });
    }

    messages.unshift(SYSTEM_PROMPT);

    const tools = {
      getProjects,
      getPresentation,
      getResume,
      getContact,
      getSkills,
      getJob,
    };

    const result = await streamText({
      model: google('gemini-2.5-flash'),
      messages,
      tools,
      maxSteps: 2,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error instanceof Error ? error.message : 'Unknown error');
    
    if (error instanceof Error && (error.message?.includes('quota') || error.message?.includes('429'))) {
      return new Response('API quota exceeded. Please try again later.', { status: 429 });
    }
    
    if (error instanceof Error && error.message?.includes('network')) {
      return new Response('Network error. Please check your connection and try again.', { status: 503 });
    }
    
    return new Response(`Internal Server Error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}
