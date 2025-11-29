# Stage 1: Build stage
FROM node:22-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

WORKDIR /app

# Copy root workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy all package.json files for workspace resolution
COPY apps/docs/package.json ./apps/docs/
COPY packages/spar/package.json ./packages/spar/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY packages/spar ./packages/spar
COPY apps/docs ./apps/docs

# Build spar package first (dependency)
RUN pnpm --filter @turkish-technology/spar build

# Build docs
RUN pnpm --filter @turkish-technology/docs build

# Stage 2: Production stage with nginx
FROM nginx:alpine AS production

# Copy custom nginx config
COPY apps/docs/nginx.conf /etc/nginx/nginx.conf

# Copy built static files from builder
COPY --from=builder /app/apps/docs/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
