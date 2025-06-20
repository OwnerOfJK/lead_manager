# Lead Manager

A comprehensive tool for RevOps teams at factorial to streamline lead qualification, context gathering, and sales enablement through automation and AI assistance.

View deployed MVP here: https://lead-manager-woad.vercel.app/

https://github.com/user-attachments/assets/340bf4cb-41c8-463b-a067-808f02698e1c

## Project Overview

Lead Manager is a full-stack application designed to optimize the sales process by:

1. **Automating Lead Data Collection** - Seamlessly aggregating data from multiple sources (HubSpot, LinkedIn) into a unified interface
2. **Enhancing Lead Context** - Automatically transcribing sales calls and pulling in LinkedIn profile data for a complete 360° view
3. **AI-Powered Sales Assistance** - Providing AI chat functionality that can answer questions about leads based on all available context

This tool directly addresses key RevOps challenges by:
- Reducing manual data entry and context switching between platforms
- Accelerating sales cycles through automated data collection
- Enabling more personalized outreach with comprehensive lead context
- Creating new CX opportunities through AI-assisted lead interactions

## Technologies

This project uses the following stack:

- **Frontend**: Next.js/React with TypeScript for a responsive, type-safe UI
- **API Integrations**: 
  - **HubSpot** CRM integration for lead management
  - LinkedIn data collection
- **AI Engineering**:
  - OpenAI API for call transcription (Speech-to-Text)
  - **AI chat assistant** with context-aware responses
- **Development**: 
  - Node.js backend with API routes
  - TypeScript for type safety
  - Tailwind CSS for modern UI design

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- HubSpot API key
- OpenAI API key

### Environment Setup

Create a `.env.local` file in the root directory with:
```
HUBSPOT_API_KEY=your_hubspot_api_key
OPENAI_API_KEY=your_openai_api_key
```

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

## Key Features

- **Lead List View**: Automatically fetch and display new leads from HubSpot
- **Data Enrichment**: One-click enrichment of lead data from LinkedIn and call recordings
- **Context Card**: Visual display of aggregated lead data from multiple sources
- **AI Assistant**: Chat-based assistant that can answer questions about specific leads using the gathered context

## Future Enhancements

- Webhook integration for real-time lead updates
- Sales performance analytics dashboard
- Automated lead scoring based on context
- Integration with additional data sources
- Team collaboration features

## Alignment with RevOps Role

This project demonstrates capabilities directly applicable to factorial's RevOps Engineer position:

- **Process Automation**: Eliminates manual data gathering across platforms
- **Revenue-Enhancing Innovation**: Enables more informed, context-rich sales conversations
- **Scalable Workflows**: Creates a repeatable process for lead qualification and enrichment
- **Technical Proficiency**: Showcases programming skills across Node.js, API integrations, and AI implementation
- **GTM Stack Integration**: Connects critical sales and marketing data sources

## Project Structure

```
lead_manager/
├── src/
│   ├── app/
│   │   ├── api/             # Backend API routes
│   │   │   ├── call/        # Call transcription endpoint
│   │   │   ├── chat/        # AI assistant endpoint
│   │   │   ├── hubspot/     # HubSpot integration
│   │   │   └── linkedin/    # LinkedIn data collection
│   │   ├── components/      # React components
│   │   ├── lib/            # Utility functions
│   │   └── types.ts        # TypeScript type definitions
├── public/                 # Static assets
└── .env.local              # Environment variables (not committed)
```

## Improvements

- Add HubSpot webhook whenever a new contact is added (exclusive to premium members)
- Collect user-specific LinkedIn data through the API/scraping (LinkedIn API is very limiting)
- Collect data beyond LinkedIn and call recordings (the more data the better)
- Get call recordings straight from HubSpot (currently a local recording of a call)
- Add unit/integrations tests.
