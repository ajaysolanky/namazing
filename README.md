# Namazing

An AI-powered baby-naming studio that turns a free-form family brief into researched NameCards, a curated shortlist, and a warm client-ready report. The repository is organised as a multi-package workspace with shared schemas, tool shims, an Express API, orchestrator stubs, and a Next.js web client featuring live activity via server-sent events (SSE).

> **Status:** The orchestration logic is stubbed for local development. Replace the simulated data generators with real agent calls (OpenRouter, web search) when credentials are available.

## Project layout

```
apps/
  server/          # Express API, SSE stream, run management
  web/             # Next.js + Tailwind frontend
workers/
  orchestrator/    # Run controller emitting timeline events & sample NameCards
  agents/          # Future agent registry + prompt wiring
packages/
  schemas/         # Zod schemas & TypeScript types for shared payloads
  tools/           # Web search + parsing shims, phonetics helpers, SSA stub
  prompts/         # Markdown prompt packs per agent role
```

## Getting started

1. Install dependencies from the repo root (npm works with the configured workspaces):

   ```bash
   npm install
   ```

2. Create an `.env` file in the project root (or use shell exports) with any available credentials:

   ```bash
   OPENROUTER_API_KEY=your-key
   SEARCH_PROVIDER=serpapi
   SERPAPI_KEY=your-key
   AGENT_CONCURRENCY=4
   NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
   ```

   *All services gracefully fall back to stubbed behaviour if keys are absent.*

3. In one terminal, launch the dev duo (API + web) from the root:

   ```bash
   npm run dev
   ```

   - Server listens on `http://localhost:4000`
   - Web client runs on `http://localhost:3000`

## Key features implemented

- **SSE orchestration channel**: `POST /api/run` spins up a run ID; `GET /api/events/:runId` streams activity, per-name research logs, and final curation payloads; `GET /api/result/:runId` returns structured results.
- **Shared schemas**: Zod-based definitions (`SessionProfile`, `NameCard`, `RunResult`) to keep server, workers, and UI in sync.
- **Tooling shims**: web search wrapper with SerpAPI support + stub, HTML fetch & extract helper, phonetics heuristics, SSA popularity stub, negative association scanner.
- **Prompt catalogue**: Markdown prompts for the orchestrator roster ready for OpenRouter-powered agents.
- **Frontend UX**: calming studio aesthetic, brief intake, serial/parallel toggle, live timeline, progress tracker, NameCard grid, Expert Selector shortlist, report preview, and export (JSON/Markdown) options.

## Next steps

1. **Agent integration** – Replace the stubbed orchestrator with real agent invocations that call `callLLM` and use tool shims for research.
2. **Real data plumbing** – Connect `tools/searchWeb` to your preferred provider, finish `tools/ssa.ts`, and enrich phonetics + cultural guardrails.
3. **Persistence & privacy** – Add durable storage with encryption at rest plus a “Forget Run” endpoint per acceptance criteria.
4. **Testing** – Introduce automated tests (unit + integration) for orchestrator transitions, tool fallbacks, and frontend hooks.

## Troubleshooting

- **No live data?** Check that `NEXT_PUBLIC_API_BASE_URL` points to the API server and that CORS is enabled (it is by default).
- **SSE drops?** Run the dev server locally (no proxies) and confirm the browser allows EventSource connections to port 4000.
- **LLM errors**: Without `OPENROUTER_API_KEY`, the `/openrouter` helper throws; keep stub mode until credentials are available.
