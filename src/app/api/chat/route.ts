import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, type CoreMessage } from 'ai';

import { SYSTEM_PROMPT } from './prompt';
import { getContact } from './tools/getContact';
import { getJob } from './tools/getJob';
import { getPresentation } from './tools/getPresentation';
import { getProjects } from './tools/getProjects';
import { getResume } from './tools/getResume';
import { getSkills } from './tools/getSkills';

export const maxDuration = 30;

const MAX_MESSAGES = 20;
const MAX_CONTENT_LENGTH = 2000;

const ALLOWED_ORIGINS = [
  'https://karolnaze.dev',
  'https://www.karolnaze.dev',
];

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

function isAllowedOrigin(origin: string | null): boolean {
  if (process.env.NODE_ENV === 'development') return true;
  if (!origin) return false;
  return ALLOWED_ORIGINS.includes(origin);
}

export async function POST(req: Request) {
  try {
    // CORS — only accept requests from the portfolio domain in production
    const origin = req.headers.get('origin');
    if (!isAllowedOrigin(origin)) {
      return new Response('Forbidden', { status: 403 });
    }

    // Reject non-JSON requests
    const contentType = req.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      return new Response('Invalid content type', { status: 400 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response('Invalid JSON', { status: 400 });
    }

    if (!body || typeof body !== 'object' || !Array.isArray((body as Record<string, unknown>).messages)) {
      return new Response('Invalid request body', { status: 400 });
    }

    const rawMessages = (body as { messages: unknown[] }).messages;

    // Hard limit on message count
    if (rawMessages.length > MAX_MESSAGES) {
      return new Response('Too many messages', { status: 400 });
    }

    // Sanitize: only allow user/assistant roles (blocks prompt injection via system role)
    // Truncate oversized content
    const sanitized = rawMessages
      .filter((m): m is { role: string; content: string } => {
        if (!m || typeof m !== 'object') return false;
        const msg = m as Record<string, unknown>;
        return (
          typeof msg.role === 'string' &&
          ['user', 'assistant'].includes(msg.role) &&
          typeof msg.content === 'string' &&
          msg.content.trim().length > 0
        );
      })
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content.slice(0, MAX_CONTENT_LENGTH),
      }));

    if (sanitized.length === 0) {
      return new Response('No valid messages', { status: 400 });
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response('Service unavailable', { status: 503 });
    }

    const messages: CoreMessage[] = [SYSTEM_PROMPT, ...sanitized];

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
      return new Response('Network error. Please try again later.', { status: 503 });
    }

    return new Response('Internal Server Error', { status: 500 });
  }
}
