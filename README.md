# ConnectMe – Personal Local AI Workspace OS

A local-only personal AI command center that lets you access ChatGPT, Claude, and Gemini from one unified interface using real browser automation.

## Quick Start

```bash
# Install all dependencies
npm install

# Start development servers
npm run dev
```

The frontend will be at http://localhost:5173  
The backend API will be at http://localhost:3001

## Architecture

```
apps/frontend/              → React + Vite UI (port 5173)
services/backend/           → TypeScript + Fastify API (port 3001)
services/browser-runtime/   → Playwright + Chromium automation
services/memory-service/    → Chat memory and search
packages/shared-types/      → Shared TypeScript types
packages/provider-sdk/      → Provider adapter base classes
data/sqlite/                → SQLite databases
profiles/                   → Persistent browser profiles
```

## Phases

- **Phase 1** ✅ – Frontend, Backend, SQLite, Sidebar UI
- **Phase 2** ✅ – Browser runtime, ChatGPT adapter
- **Phase 3** ✅ – Claude adapter, Gemini adapter
- **Phase 4** ✅ – Memory service
- **Phase 5** ✅ – Compare mode, logs, polish

## Features

- Unified chat panel (ChatGPT, Claude, Gemini)
- Workspace & thread organization
- Real browser-based automation (Playwright + Chromium)
- Persistent browser sessions
- Cross-provider memory
- Compare mode (side-by-side responses)
- Capability detection
