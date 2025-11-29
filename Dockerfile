# Dockerfile for Docusaurus deployment on Dokploy (Node.js serve)
FROM node:22-alpine AS base

# Enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy workspace and package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/spar/package.json ./packages/spar/package.json
COPY apps/docs/package.json ./apps/docs/package.json

# Install dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build the source code
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/spar/node_modules ./packages/spar/node_modules
COPY --from=deps /app/apps/docs/node_modules ./apps/docs/node_modules

# Copy source files
COPY . .

# Ensure build directory exists for Dokploy's .env file creation
RUN mkdir -p /app/apps/docs/build

# Build spar package first (dependency)
RUN pnpm --filter @turkish-technology/spar build

# Build docs
RUN pnpm --filter @turkish-technology/docs build

# Production image - Node.js serve
FROM base AS runner
WORKDIR /app

# Copy only production dependencies
COPY --from=deps /app/apps/docs/node_modules ./apps/docs/node_modules
COPY --from=deps /app/apps/docs/package.json ./apps/docs/package.json

# Copy built files
COPY --from=builder /app/apps/docs/build ./apps/docs/build

# Set working directory to docs
WORKDIR /app/apps/docs

# Install serve globally for static file serving
RUN pnpm add -g serve

EXPOSE 3000

# Serve the built files
CMD ["serve", "-s", "build", "-l", "3000"]
