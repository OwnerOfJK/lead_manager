# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lead Manager is a RevOps tool for streamlining lead qualification and sales enablement. It aggregates data from HubSpot and LinkedIn, transcribes sales calls using OpenAI Whisper, and provides an AI chat assistant for context-aware lead interactions.

**Key technologies:**
- Next.js 15 (App Router) with React 19 and TypeScript
- HubSpot CRM API integration
- OpenAI API (Whisper for transcription, GPT-3.5-turbo for chat)
- Tailwind CSS v4

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Production server
npm start

# Linting
npm run lint

# Run all tests
npm test

# Watch mode for tests
npm run test:watch

# Run only API tests
npm run test:api
```

## Environment Variables

Required in `.env.local`:
```
HUBSPOT_API_KEY=your_hubspot_api_key
OPENAI_API_KEY=your_openai_api_key
```

## Architecture

### Data Flow Pattern

The application follows a **fetch → enrich → aggregate** pattern:

1. **Fetch**: HubSpot contacts with `hs_lead_status === "NEW"` are fetched via `/api/hubspot`
2. **Enrich**: For each contact, frontend triggers parallel enrichment:
   - LinkedIn profile data via `/api/linkedin` (currently mock implementation)
   - Call transcription via `/api/call` (uses OpenAI Whisper on a test audio file)
3. **Aggregate**: Data is combined into a `UserContext` object stored in component state
4. **Interact**: AI chat assistant at `/api/chat` uses the aggregated context to answer questions

### Key Type Definitions

Located in `src/app/types.ts`:
- `HubSpotProfile`: Contact data from HubSpot CRM
- `LinkedInProfile`: Scraped/API data from LinkedIn
- `UserContext`: Aggregated context combining all data sources

### API Routes (Next.js App Router)

- `GET /api/hubspot`: Fetches contacts from HubSpot with NEW status
- `POST /api/linkedin`: Returns LinkedIn profile data (currently mock, needs real scraping/API)
- `POST /api/call`: Transcribes call recordings using OpenAI Whisper
- `POST /api/chat`: AI assistant that answers questions using aggregated lead context

### Component Structure

- `page.tsx`: Main page that lists leads from HubSpot
- `ContactCard.tsx`: Individual contact card with "Collect Data" action
- `ContextCard.tsx`: Displays aggregated data (HubSpot + LinkedIn + transcription)
- `ChatCard.tsx`: AI chat interface for asking questions about a lead

### Data Aggregation

The `aggregateData.ts` utility provides two main functions:
- `fetchContactLinkedIn(lead)`: Calls LinkedIn API endpoint
- `transcribeContactCalls(lead)`: Calls transcription API endpoint

These are orchestrated in `ContactCard.tsx` to build the complete `UserContext`.

## Testing

Tests use Jest with ts-jest. Test files are located in `__tests__` directories.

Current test coverage:
- HubSpot API integration tests at `src/app/api/__tests__/hubspot-app-router.test.ts`

Tests mock `global.fetch` to avoid hitting real APIs. The environment variable `HUBSPOT_API_KEY` is set to a test value in `beforeEach` blocks.

## Import Aliases

The project uses `@/*` as an alias for `./src/*` (configured in tsconfig.json).

Example: `import { HubSpotProfile } from "@/app/types"`

## Known Limitations & TODOs

1. **LinkedIn integration**: Currently uses mock data. Needs real LinkedIn API integration or scraping implementation.
2. **Call recordings**: Uses a single test audio file from production URL. Should integrate with HubSpot's call recording API.
3. **HubSpot webhooks**: Premium feature for real-time contact updates not yet implemented.
4. **Test coverage**: Needs tests for LinkedIn, call transcription, and chat endpoints.

## AI Chat System

The chat assistant at `/api/chat` is configured as a "sales manager at Factorial" (all-in-one business management software). It receives:
- System prompt with company context
- Aggregated lead data as context
- User's question

The AI provides concise, context-aware responses about leads to help with sales enablement.
