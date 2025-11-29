# Dockerfile for Docusaurus deployment on Dokploy
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

# Production image
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files
COPY --from=builder /app/apps/docs/build /usr/share/nginx/html

# Verify files exist
RUN ls -la /usr/share/nginx/html && ls -la /etc/nginx/conf.d/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
