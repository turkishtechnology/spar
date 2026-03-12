FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Install dependencies
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/spar/package.json ./packages/spar/package.json
COPY apps/docs/package.json ./apps/docs/package.json
COPY apps/react-app/package.json ./apps/react-app/package.json
COPY apps/next-app/package.json ./apps/next-app/package.json
COPY apps/mcp-server/package.json ./apps/mcp-server/package.json

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/mcp-server/node_modules ./apps/mcp-server/node_modules

COPY apps/docs/docs ./apps/docs/docs
COPY apps/mcp-server ./apps/mcp-server

WORKDIR /app/apps/mcp-server
RUN npx tsx src/scripts/convert-mdx.ts
RUN npx tsc

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/mcp-server/node_modules ./apps/mcp-server/node_modules
COPY --from=builder /app/apps/mcp-server/dist ./apps/mcp-server/dist
COPY --from=builder /app/apps/mcp-server/docs ./apps/mcp-server/docs
COPY --from=builder /app/apps/mcp-server/package.json ./apps/mcp-server/package.json

WORKDIR /app/apps/mcp-server

EXPOSE 3001

CMD ["node", "dist/index.js"]
