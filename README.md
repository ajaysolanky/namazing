# Namazing

An AI-powered baby-naming studio that transforms a free-form family brief into researched NameCards, a curated shortlist of 8-12 finalists, and a warm client-ready consultation report.

Built for professional baby-naming consultants who want to leverage AI while maintaining human oversight.

> **Status:** Orchestration includes stubbed fallbacks for local development. Replace with real agent calls when credentials are available.

---

## Table of Contents

- [Architecture](#architecture)
- [Pipeline Flow](#pipeline-flow)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Data Schemas](#data-schemas)
- [CLI Usage](#cli-usage)
- [Development Guide](#development-guide)
- [Troubleshooting](#troubleshooting)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              NAMAZING                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐         ┌──────────────────────────────────────────┐    │
│   │   apps/web   │◄──SSE───│            apps/server                   │    │
│   │  (Next.js)   │         │            (Express)                     │    │
│   │              │         │                                          │    │
│   │ • Brief Form │  HTTP   │  POST /api/run      → Start pipeline     │    │
│   │ • Live Feed  │◄───────►│  GET  /api/events   → SSE stream         │    │
│   │ • Name Cards │         │  GET  /api/result   → Final result       │    │
│   │ • Shortlist  │         │  DELETE /api/run    → Delete run         │    │
│   │ • Report     │         │                                          │    │
│   └──────────────┘         └────────────────┬─────────────────────────┘    │
│                                             │                              │
│                                             ▼                              │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                    workers/orchestrator                             │  │
│   │                                                                     │  │
│   │  ┌─────────┐   ┌─────────┐   ┌──────────┐   ┌────────┐   ┌──────┐  │  │
│   │  │ BRIEF   │──►│  NAME   │──►│   NAME   │──►│ EXPERT │──►│REPORT│  │  │
│   │  │ PARSER  │   │GENERATOR│   │RESEARCHER│   │SELECTOR│   │WRITER│  │  │
│   │  └─────────┘   └─────────┘   └──────────┘   └────────┘   └──────┘  │  │
│   │       │              │          │ (×N)           │            │     │  │
│   │       ▼              ▼          ▼                ▼            ▼     │  │
│   │  SessionProfile  Candidates  NameCards    ExpertSelection  Report  │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                          │                                                 │
│         ┌────────────────┼────────────────┐                                │
│         ▼                ▼                ▼                                │
│   ┌──────────┐    ┌───────────┐    ┌───────────┐                           │
│   │ packages │    │ packages  │    │ packages  │                           │
│   │ /schemas │    │  /tools   │    │ /prompts  │                           │
│   │          │    │           │    │           │                           │
│   │ • Zod    │    │ • Web     │    │ • Agent   │                           │
│   │   types  │    │   search  │    │   prompts │                           │
│   │ • I/O    │    │ • SSA     │    │   (.md)   │                           │
│   │   schemas│    │   data    │    │           │                           │
│   └──────────┘    │ • IPA     │    └───────────┘                           │
│                   └───────────┘                                            │
│                         │                                                  │
└─────────────────────────┼──────────────────────────────────────────────────┘
                          │
                          ▼
                 ┌────────────────┐
                 │  OpenRouter    │
                 │     API        │
                 │   (LLM calls)  │
                 └────────────────┘
```

---

## Pipeline Flow

The orchestrator runs a 5-stage sequential pipeline:

```
          Input                                   Output
            │                                       │
            ▼                                       │
┌───────────────────────┐                          │
│  "We're the Smith     │                          │
│   family, expecting   │                          │
│   a girl. Love nature │                          │
│   names, have a son   │                          │
│   named Rowan..."     │                          │
└───────────┬───────────┘                          │
            │                                      │
            ▼                                      │
   ┌─────────────────┐                             │
   │  1. BRIEF       │  Extracts structured data:  │
   │     PARSER      │  • Family: surname,         │
   │                 │    siblings, honor names    │
   │                 │  • Preferences: style       │
   │                 │    lanes, length, nicknames │
   │                 │  • Vetoes: hard/soft        │
   └────────┬────────┘                             │
            │ SessionProfile                       │
            ▼                                      │
   ┌─────────────────┐                             │
   │  2. NAME        │  Generates 40-80 candidates │
   │     GENERATOR   │  organized by style lanes:  │
   │                 │  • traditional feminine     │
   │                 │  • literary                 │
   │                 │  • nature                   │
   │                 │  • modern-classic           │
   │                 │  • heritage                 │
   └────────┬────────┘                             │
            │ Candidate[]                          │
            ▼                                      │
   ┌─────────────────┐    ┌────────────────────┐   │
   │  3. NAME        │───►│     NameCard       │   │
   │     RESEARCHER  │    │ • IPA, syllables   │   │
   │     (×N)        │    │ • meaning, origins │   │
   │                 │    │ • popularity data  │   │
   │  Serial: 1-24   │    │ • notable bearers  │   │
   │  Parallel: 1-80 │    │ • nickname analysis│   │
   │                 │    │ • combo suggestions│   │
   └────────┬────────┘    └────────────────────┘   │
            │ NameCard[]                           │
            ▼                                      │
   ┌─────────────────┐                             │
   │  4. EXPERT      │  Curates down to:           │
   │     SELECTOR    │  • 8-12 finalists with why  │
   │                 │  • Near-misses with reasons │
   └────────┬────────┘                             │
            │ ExpertSelection                      │
            ▼                                      │
   ┌─────────────────┐                             │
   │  5. REPORT      │  Generates warm narrative:  │
   │     COMPOSER    │  • Summary                  │
   │                 │  • Finalist justifications  │
   │                 │  • Combo recommendations    │
   │                 │  • Tie-break tips           │
   └────────┬────────┘                             │
            │                                      │
            ▼                                      │
   ┌─────────────────┐                             │
   │    RunResult    │◄────────────────────────────┘
   │                 │
   │ Complete output │
   │ ready for export│
   └─────────────────┘
```

### Execution Modes

| Mode | Concurrency | Max Candidates | Use Case |
|------|-------------|----------------|----------|
| `serial` | 1 | 24 | Quick previews, debugging |
| `parallel` | Up to 8 | 80 | Full comprehensive analysis |

---

## Project Structure

```
namazing/
├── apps/
│   ├── server/              # Express API with SSE streaming
│   │   └── src/
│   │       ├── index.ts     # API routes
│   │       └── storage.ts   # File-based run persistence
│   └── web/                 # Next.js + Tailwind frontend
│       └── src/
│           ├── app/         # App router pages
│           └── components/  # React components
├── workers/
│   ├── orchestrator/        # Pipeline controller
│   │   └── src/index.ts     # OrchestratorService class
│   └── agents/              # Future: individual agent modules
├── packages/
│   ├── schemas/             # Zod schemas & TypeScript types
│   │   └── src/index.ts     # All shared type definitions
│   ├── tools/               # Research utilities
│   │   └── src/index.ts     # searchWeb, getPopularity, etc.
│   └── prompts/             # Markdown prompt files
│       ├── brief-parser.md
│       ├── name-generator.md
│       ├── researcher.md
│       ├── expert-selector.md
│       └── report-composer.md
├── run-pipeline.ts          # CLI entry point
└── package.json             # Workspace configuration
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone and install dependencies
git clone <repo-url>
cd namazing
npm install
```

### Running Locally

```bash
# Start both API server and web client
npm run dev
```

- **API Server:** http://localhost:4000
- **Web Client:** http://localhost:3000

### Quick Test (Stub Mode)

Without API keys, the system runs in stub mode with sample data:

1. Open http://localhost:3000
2. Paste a brief like: "We're the Johnson family expecting a girl. We have a son named Oliver. Love classic names with literary flair."
3. Click "Start" and watch the pipeline run

---

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# ─────────────────────────────────────────────────────────
# LLM Configuration (OpenRouter)
# ─────────────────────────────────────────────────────────
OPENROUTER_API_KEY=your-openrouter-key    # Required for live mode

# Per-agent model overrides (optional)
BRIEF_PARSER_MODEL=z-ai/glm-4.5-air:free
NAME_GENERATOR_MODEL=z-ai/glm-4.5-air:free
NAME_RESEARCHER_MODEL=z-ai/glm-4.5-air:free
EXPERT_SELECTOR_MODEL=z-ai/glm-4.5-air:free
REPORT_COMPOSER_MODEL=z-ai/glm-4.5-air:free

# ─────────────────────────────────────────────────────────
# Web Search Configuration
# ─────────────────────────────────────────────────────────
SEARCH_PROVIDER=serpapi                    # Options: serpapi (or omit for stub)
SERPAPI_KEY=your-serpapi-key

# ─────────────────────────────────────────────────────────
# Orchestrator Settings
# ─────────────────────────────────────────────────────────
AGENT_CONCURRENCY=8                        # Max parallel research tasks (default: 8)

# ─────────────────────────────────────────────────────────
# Server Configuration
# ─────────────────────────────────────────────────────────
PORT=4000                                  # API server port
GEMINI_TMPDIR=/tmp/namazing               # Directory for run storage & data files

# ─────────────────────────────────────────────────────────
# Frontend Configuration
# ─────────────────────────────────────────────────────────
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

### Fallback Behavior

| Missing Key | Behavior |
|-------------|----------|
| `OPENROUTER_API_KEY` | All LLM stages return stubbed sample data |
| `SERPAPI_KEY` | Web search returns placeholder results |
| `GEMINI_TMPDIR` | Uses current directory for data files |

---

## API Reference

### Base URL

```
http://localhost:4000
```

### Endpoints

#### Health Check

```http
GET /healthz
```

**Response:**
```json
{ "status": "ok" }
```

---

#### Start a Run

```http
POST /api/run
Content-Type: application/json
```

**Request Body:**
```json
{
  "brief": "We're the Smith family expecting a girl...",
  "mode": "serial"  // or "parallel"
}
```

**Response:**
```json
{
  "runId": "550e8400-e29b-41d4-a716-446655440000",
  "mode": "serial"
}
```

---

#### Subscribe to Events (SSE)

```http
GET /api/events/:runId
Accept: text/event-stream
```

**Event Stream:**
```
data: {"t":"activity","runId":"...","agent":"brief-parser","msg":"parsing brief"}

data: {"t":"result","runId":"...","agent":"brief-parser","payload":{...}}

data: {"t":"start","runId":"...","agent":"researcher","name":"Eleanor"}

data: {"t":"partial","runId":"...","agent":"researcher","name":"Eleanor","field":"card","value":{...}}

data: {"t":"done","runId":"...","agent":"researcher","name":"Eleanor"}

data: {"t":"result","runId":"...","agent":"report-composer","payload":{...}}
```

---

#### Get Final Result

```http
GET /api/result/:runId
```

**Response (completed):**
```json
{
  "profile": { ... },
  "candidates": [ ... ],
  "selection": { ... },
  "report": { ... }
}
```

**Response (still running):**
```json
{
  "status": "running"
}
```

**Response (not found):**
```json
{ "error": "run not found" }
```

---

#### Delete a Run

```http
DELETE /api/run/:runId
```

**Response:** `204 No Content`

---

## Data Schemas

### SessionProfile

Parsed representation of the client brief.

```typescript
{
  raw_brief: string;                    // Original input text
  family?: {
    surname?: string;                   // Family surname
    siblings?: string[];                // Existing children's names
    honor_names?: string[];             // Names to honor/incorporate
    special_initials_include?: string[];// Preferred initials
    special_initials_avoid?: string[];  // Initials to avoid
  };
  preferences?: {
    style_lanes?: string[];             // e.g., ["classic", "literary", "nature"]
    avoid_endings?: string[];           // e.g., ["-den", "-ley"]
    nickname_tolerance?: "low" | "medium" | "high";
    length_pref?: "short" | "short-to-medium" | "any";
    cultural_bounds?: string[];         // e.g., ["Irish", "Hebrew"]
  };
  themes?: string[];                    // e.g., ["strength", "wisdom"]
  vetoes?: {
    hard?: string[];                    // Absolute no's
    soft?: string[];                    // Prefer to avoid
  };
  region?: string[];                    // e.g., ["US", "UK"]
  target_popularity_band?: string;      // e.g., "top 100" or "outside top 500"
  comments?: string;
}
```

### NameCard

Complete research for a single name candidate.

```typescript
{
  name: string;                         // The name
  ipa: string;                          // IPA pronunciation
  syllables: number;                    // Syllable count
  meaning?: string;                     // Name meaning
  origins?: string[];                   // Cultural/linguistic origins
  variants?: string[];                  // Spelling variants
  nicknames?: {
    intended?: string[];                // Desired nicknames
    likely?: string[];                  // Natural shortenings
    avoid?: string[];                   // Undesirable nicknames
  };
  popularity?: {
    latest_rank?: number;               // Current SSA rank
    peak_rank?: number;                 // Historical peak
    trend_notes?: string;               // "rising", "classic steady", etc.
  };
  notable_bearers?: {
    positive?: string[];                // Admirable figures
    fictional?: string[];               // Beloved characters
    negative?: string[];                // Concerning associations
  };
  cultural_notes?: string[];            // Cultural context
  surname_fit?: {
    surname?: string;
    notes: string;                      // Cadence/flow analysis
  };
  sibset_fit?: {
    siblings?: string[];
    notes: string;                      // Sibling set harmony
  };
  honor_mapping?: string[];             // How it honors family names
  combo_suggestions?: Array<{
    first: string;
    middle: string;
    why: string;
  }>;
  eliminations?: string[];              // Reasons this might not work
  research_log?: string[];              // Research notes/sources
}
```

### ExpertSelection

Curated shortlist output.

```typescript
{
  finalists: Array<{
    name: string;
    why: string;                        // Justification
    combo?: {                           // Recommended first-middle pair
      first: string;
      middle: string;
      why: string;
    };
  }>;
  near_misses: Array<{
    name: string;
    reason: string;                     // Why it didn't make the cut
  }>;
}
```

### RunResult

Complete consultation output.

```typescript
{
  profile: SessionProfile;
  candidates: NameCard[];
  selection: ExpertSelection;
  report: {
    summary: string;
    loved_names?: string[];
    finalists: Array<{ name, why, combo? }>;
    combos?: Array<{ first, middle, why }>;
    tradeoffs?: string[];
    tie_break_tips?: string[];
  };
}
```

### ActivityEvent

Real-time event types emitted during pipeline execution.

```typescript
type ActivityEvent =
  | { t: "activity"; runId: string; agent: string; msg: string }
  | { t: "start"; runId: string; agent: string; name?: string }
  | { t: "log"; runId: string; agent: string; name?: string; msg: string }
  | { t: "partial"; runId: string; agent: string; name?: string; field: string; value: unknown }
  | { t: "done"; runId: string; agent: string; name?: string }
  | { t: "result"; runId: string; agent: string; payload: unknown }
  | { t: "error"; runId: string; agent: string; msg: string }
```

---

## CLI Usage

Run the pipeline headlessly from the command line:

```bash
# With stub data (no API keys needed)
npm run cli

# With live agents (requires OPENROUTER_API_KEY)
OPENROUTER_API_KEY=your-key npm run cli
```

The CLI reads from `run-pipeline.ts` and logs events to stdout.

---

## Development Guide

### Available Scripts

```bash
npm run dev      # Start API + web in development mode
npm run build    # Build all packages
npm run lint     # Run ESLint
npm run cli      # Run pipeline from CLI
```

### Adding a New Agent

1. Create prompt file in `packages/prompts/`:
   ```markdown
   System: You are a [role description]...

   Instruction: Given the input, produce [output description]...
   ```

2. Add agent logic in `workers/orchestrator/src/index.ts`:
   - Add model config to `DEFAULT_MODELS`
   - Create `runYourAgent()` method
   - Wire into `execute()` pipeline

3. Define schemas in `packages/schemas/src/index.ts` if needed

### Adding a New Tool

1. Export function from `packages/tools/src/index.ts`:
   ```typescript
   export async function yourTool(input: string): Promise<YourOutput> {
     // Implementation
   }
   ```

2. Import and use in orchestrator research phase

### Prompt Format

Prompts use a simple two-section format:

```markdown
System: [System message for the LLM]

Instruction: [User instruction template]
```

The orchestrator loads these at runtime and injects user input after the instruction.

---

## Troubleshooting

### No live data appearing?

1. Check `NEXT_PUBLIC_API_BASE_URL` points to the API server
2. Ensure CORS is enabled (default: yes)
3. Check browser console for EventSource errors

### SSE connection drops?

1. Run dev server locally without proxies
2. Confirm browser allows connections to port 4000
3. Check for network timeouts in production

### LLM errors?

1. Without `OPENROUTER_API_KEY`, all calls return stubs (expected)
2. Check OpenRouter dashboard for rate limits
3. Verify model names in environment variables

### Research data looks wrong?

1. Without `SERPAPI_KEY`, web search returns placeholders
2. Popularity data requires `baby-names.csv` in `GEMINI_TMPDIR`
3. Check `research_log` field in NameCards for debugging info

### Build failures?

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Check workspace linkage
npm ls @namazing/schemas
```

---

## License

MIT
