# ── Stage 1: build ──────────────────────────────────────────────
FROM node:20-bookworm-slim AS build

# Install Python 3.11 + pip (needed at build time for venv setup)
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 python3-venv python3-pip && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package manifests first for better layer caching
COPY package.json package-lock.json* ./
COPY apps/server/package.json apps/server/
COPY apps/web/package.json apps/web/
COPY packages/schemas/package.json packages/schemas/
COPY packages/tools/package.json packages/tools/
COPY packages/prompts/package.json packages/prompts/
COPY workers/orchestrator/package.json workers/orchestrator/
COPY workers/agents/package.json workers/agents/

RUN npm install

# Copy the rest of the source
COPY . .

# Build TypeScript packages in dependency order
RUN npm run build --workspace packages/schemas && \
    npm run build --workspace packages/tools && \
    npm run build --workspace workers/agents && \
    npm run build --workspace workers/orchestrator && \
    npm run build --workspace apps/server

# Set up Python virtual environment
RUN python3 -m venv /app/namazing-py/.venv && \
    /app/namazing-py/.venv/bin/pip install --no-cache-dir -e /app/namazing-py

# ── Stage 2: production ────────────────────────────────────────
FROM node:20-bookworm-slim AS production

RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 python3-venv && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built artifacts and node_modules from build stage
COPY --from=build /app /app

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["node", "apps/server/dist/index.js"]
