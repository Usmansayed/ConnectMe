````md id="kz3qaq"
# BUILD_PROMPT.md

# Personal Local AI Workspace OS
## Full Build Prompt / Engineering Spec

---

# 1. Objective

Build a **personal local AI command center** that runs entirely on my laptop.

This is for **one user only** (me).

The application should let me access all my AI subscriptions from one interface using their real browser web products.

Examples:

- ChatGPT
- Claude
- Gemini
- Perplexity (later)
- others later

Instead of switching browser tabs, I should use one local web app.

---

# 2. Non-Negotiable Constraints

## This project is:

- local only
- personal only
- no SaaS
- no public users
- no team accounts
- no billing
- no cloud frontend/backend hosting
- no unnecessary enterprise architecture

## Everything runs on my laptop.

---

# 3. Final Stack (Mandatory)

# Frontend

Fork:

:contentReference[oaicite:0]{index=0}

Use Open WebUI as the UI base only.

We will modify it heavily.

Use:

- React frontend
- existing layouts
- sidebar
- chat components
- themes
- settings pages

---

# Backend

Custom backend.

Use:

:contentReference[oaicite:1]{index=1}  
TypeScript  
Fastify

Purpose:

- local API server
- provider routing
- browser automation control
- memory pipeline
- logs
- thread/workspace management

---

# Browser Layer

Use:

:contentReference[oaicite:2]{index=2}  
+  
:contentReference[oaicite:3]{index=3}

Not Chrome.

Use Chromium only.

---

# Database

Use:

:contentReference[oaicite:4]{index=4}

Purpose:

- chats
- workspaces
- threads
- logs
- settings
- provider metadata

---

# Memory Layer

Use MemZero / Mem0 framework.

Memory LLM:

:contentReference[oaicite:5]{index=5} Nova Pro

Embeddings:

:contentReference[oaicite:6]{index=6} Titan

Vector Storage:

:contentReference[oaicite:7]{index=7} / Milvus

---

# 4. Final Product UX

Open one local app.

See:

```text
Sidebar:
- Workspaces
- Threads
- Providers
- Memory Search
- Logs
- Settings

Main Panel:
- Chat

Right Panel:
- Provider Options
- Memory Context
- Browser Status
````

---

# 5. Core Features

## 5.1 Unified Chat Panel

Write one prompt.

Choose provider:

* ChatGPT
* Claude
* Gemini

Receive response in same UI.

---

## 5.2 Real Provider Capability Detection

When provider selected:

inspect actual browser UI.

Show only features account has.

Examples:

ChatGPT:

* available models
* research mode
* file upload
* projects
* canvas

Gemini:

* models
* thinking mode
* deep research
* file tools

Claude:

* Sonnet
* Opus
* artifacts

Do not hardcode.

---

## 5.3 Shared Memory

Memory works across providers.

If I researched startup pricing in Gemini yesterday, ChatGPT can use that memory today.

---

## 5.4 Workspace Memory Isolation

Workspace examples:

* Startup A
* Startup B
* Personal Learning
* Hiring

Each workspace has separate memory.

---

## 5.5 Compare Mode

Same prompt to multiple providers.

Show responses side by side.

---

# 6. Folder Structure (Mandatory)

```text
ai-workspace/

apps/
  frontend/

services/
  backend/
  browser-runtime/
  memory-service/

packages/
  shared-types/
  provider-sdk/

data/
  sqlite/

profiles/
  chatgpt/
  claude/
  gemini/

logs/

scripts/
```

---

# 7. What to Fork

# Open WebUI

Fork repository.

Use ONLY frontend/UI portions.

Keep useful parts:

```text
/src/components
/src/layouts
/src/pages
/src/styles
/src/chat UI
/src/sidebar UI
```

Remove or replace:

```text
their backend integrations
their provider API logic
their auth assumptions
their cloud model logic
their server coupling
```

Our backend will replace all of that.

---

# 8. Frontend Tasks

# Edit Sidebar

Replace with:

```text
Workspaces
Threads
Providers
Memory Search
Logs
Settings
```

---

# Add Provider Selector

Dropdown:

* ChatGPT
* Claude
* Gemini

When selected:

call backend:

```http
GET /provider/:name/capabilities
```

Render detected options.

---

# Chat Composer

When prompt submitted:

```http
POST /chat/send
```

Payload:

```json
{
  "workspaceId": "...",
  "threadId": "...",
  "provider": "chatgpt",
  "mode": "...",
  "prompt": "..."
}
```

---

# Stream Responses

Use SSE or WebSocket.

---

# Add Right Panel

Display:

* memory loaded
* browser connected
* selected provider
* selected mode
* provider status

---

# 9. Backend Folder Structure

```text
services/backend/src/

modules/
  workspace/
  thread/
  provider/
  chat/
  logs/
  settings/

providers/
  chatgpt/
  claude/
  gemini/

routes/
db/
utils/
```

---

# 10. Backend APIs

# Workspace

```http
GET /workspaces
POST /workspaces
PUT /workspaces/:id
DELETE /workspaces/:id
```

# Threads

```http
GET /threads/:workspaceId
POST /threads
DELETE /threads/:id
```

# Providers

```http
GET /provider/chatgpt/capabilities
GET /provider/claude/capabilities
GET /provider/gemini/capabilities
```

# Chat

```http
POST /chat/send
POST /chat/compare
```

# Logs

```http
GET /logs
```

---

# 11. Browser Runtime

```text
services/browser-runtime/
```

Runs Playwright + Chromium.

---

# Responsibilities

* launch Chromium
* persistent sessions
* login state
* provider tabs
* send prompts
* stream output
* screenshots on failure
* recover crashes

---

# Profiles

```text
profiles/chatgpt
profiles/claude
profiles/gemini
```

Each provider isolated.

---

# Launch Method

Use Playwright persistent context.

---

# 12. Provider Adapters

# ChatGPT Adapter

```text
providers/chatgpt/
```

Functions:

* ensure logged in
* detect models
* detect tools
* type prompt
* submit
* stream answer
* extract final response

---

# Claude Adapter

Same pattern.

---

# Gemini Adapter

Same pattern.

---

# 13. Capability Detection Logic

Each provider adapter returns:

```json
{
  "loggedIn": true,
  "models": [],
  "tools": [],
  "features": {
    "research": true,
    "files": true
  }
}
```

Frontend builds UI dynamically.

---

# 14. SQLite Schema

# workspaces

```sql
id
name
created_at
updated_at
```

# threads

```sql
id
workspace_id
name
created_at
```

# messages

```sql
id
thread_id
provider
role
content
created_at
```

# logs

```sql
id
type
message
created_at
```

# settings

```sql
key
value
```

---

# 15. Memory Service

```text
services/memory-service/
```

Responsibilities:

* summarize chats
* extract facts
* save memory
* semantic search
* inject relevant context before prompts

---

# Memory Flow

Before prompt:

1. retrieve workspace memory
2. retrieve recent thread memory
3. semantic search
4. build context packet

After response:

1. summarize
2. detect useful facts
3. store embeddings
4. update memory

---

# 16. Chat Flow

```text
User submits prompt
↓
Frontend sends /chat/send
↓
Backend loads workspace memory
↓
Calls provider adapter
↓
Browser runtime sends prompt
↓
Streams response back
↓
Stores message
↓
Runs memory update
```

---

# 17. Compare Mode

POST /chat/compare

```json
{
 "providers":["chatgpt","claude","gemini"],
 "prompt":"..."
}
```

Run sequentially or parallel.

Return side-by-side.

---

# 18. Reliability Rules

Mandatory:

* headed Chromium mode first
* one active task/provider
* retries max 1
* screenshots on failure
* session re-check before prompt
* selector fallback chains
* page reload recovery

---

# 19. What NOT To Build

Do not build:

* user accounts
* billing
* multi-user auth
* cloud sync
* mobile app
* team features
* enterprise RBAC
* unnecessary Docker clusters

---

# 20. Development Order

# Phase 1

* fork Open WebUI
* strip backend logic
* custom backend skeleton
* sidebar/workspaces
* SQLite

# Phase 2

* Playwright runtime
* ChatGPT adapter

# Phase 3

* Claude adapter
* Gemini adapter

# Phase 4

* memory service

# Phase 5

* compare mode
* logs
* polish

---

# 21. Success Condition

When finished I can:

* open one local app
* choose workspace
* ask ChatGPT
* ask Claude
* ask Gemini
* keep memory across days
* search all past work
* compare providers
* never switch tabs manually

---

# 22. Final Instruction

Build this as a serious local founder productivity tool.

Prioritize:

1. reliability
2. speed
3. clean UI
4. memory usefulness
5. stable browser automation
6. simplicity

Ignore fancy unnecessary features.

```
```
