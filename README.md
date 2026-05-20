# Karol Naze — AI-Powered Portfolio

A chat-first portfolio where visitors interact with an AI assistant to discover my projects, skills, experience, and availability. All content is driven by a single JSON configuration file.

**Live:** [karolnaze.dev](https://karolnaze.dev)

## Stack

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui, Radix UI, Framer Motion
- **AI:** Vercel AI SDK + Google Gemini 1.5 Flash (tool calling)
- **Analytics:** Vercel Analytics

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your GOOGLE_GENERATIVE_AI_API_KEY

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|---|---|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google AI API key for Gemini |

## Configuration

All portfolio content (personal info, projects, skills, experience, job preferences) lives in `portfolio-config.json`. Edit this file to update the portfolio — no code changes required.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, SEO metadata, theme
│   ├── page.tsx            # Entry point
│   └── api/chat/
│       ├── route.ts        # Chat API endpoint (Gemini streaming)
│       ├── prompt.ts       # System prompt
│       └── tools/          # AI tool definitions
├── components/
│   ├── chat/               # Chat UI (landing, messages, tools, input)
│   ├── projects/           # Project carousel
│   ├── presentation.tsx    # About me section
│   ├── skills.tsx          # Skills grid
│   ├── resume.tsx          # Resume viewer
│   ├── contact.tsx         # Contact info
│   └── AvailabilityCard.tsx# Job availability pitch
├── lib/                    # Config loader, parser, utils
└── types/                  # TypeScript interfaces
```

## License

MIT
