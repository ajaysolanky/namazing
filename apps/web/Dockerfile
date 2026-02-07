# ── Stage 1: dependencies ───────────────────────────────────────
FROM node:20-bookworm-slim AS deps

WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/server/package.json apps/server/
COPY apps/web/package.json apps/web/
COPY packages/schemas/package.json packages/schemas/
COPY packages/tools/package.json packages/tools/
COPY packages/prompts/package.json packages/prompts/
COPY workers/orchestrator/package.json workers/orchestrator/
COPY workers/agents/package.json workers/agents/

RUN npm install

# ── Stage 2: build ──────────────────────────────────────────────
FROM node:20-bookworm-slim AS build

WORKDIR /app

# Next.js bakes NEXT_PUBLIC_* into the client bundle at build time
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_POSTHOG_HOST

# npm workspaces hoists everything to root node_modules
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build schemas first (web depends on it), then web
RUN npm run build --workspace packages/schemas && \
    npm run build --workspace apps/web

# ── Stage 3: production ────────────────────────────────────────
FROM node:20-bookworm-slim AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy Next.js standalone output
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build /app/apps/web/public ./apps/web/public

EXPOSE 3000

CMD ["node", "apps/web/server.js"]
