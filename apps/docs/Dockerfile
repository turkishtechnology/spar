# Stage 1: Build
FROM node:22-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

WORKDIR /app

# Copy root workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy packages (glide dependency)
COPY packages/glide/package.json ./packages/glide/
COPY packages/glide/src ./packages/glide/src
COPY packages/glide/tsconfig.json ./packages/glide/
COPY packages/glide/rspack.config.mjs ./packages/glide/

# Copy docs app (exclude build folder)
COPY apps/docs/package.json ./apps/docs/
COPY apps/docs/docusaurus.config.ts ./apps/docs/
COPY apps/docs/sidebars.ts ./apps/docs/
COPY apps/docs/tsconfig.json ./apps/docs/
COPY apps/docs/docs ./apps/docs/docs
COPY apps/docs/src ./apps/docs/src
COPY apps/docs/static ./apps/docs/static
COPY apps/docs/i18n ./apps/docs/i18n

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build glide package first (docs depends on it)
RUN pnpm --filter @turkish-technology/glide build

# Build docs
RUN pnpm --filter @turkish-technology/docs build

# Stage 2: Production
FROM nginx:alpine AS production

# Copy built static files to nginx
COPY --from=builder /app/apps/docs/build /usr/share/nginx/html

# Copy custom nginx config for SPA routing
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
    \
    gzip on; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript; \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
