FROM node:20-alpine

# Install OpenSSL and libc6-compat for Prisma
RUN apk add --no-cache openssl libc6-compat

# Enable corepack for pnpm and install specific version
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

WORKDIR /app

# Copy workspace configuration files first
COPY package.json pnpm-workspace.yaml turbo.json ./

# Copy all packages
COPY packages ./packages

# Copy all apps
COPY apps ./apps

# Install dependencies from root
# Use --no-frozen-lockfile if pnpm-lock.yaml doesn't exist yet
# Ignore scripts to avoid conflicts with postinstall hooks
RUN pnpm install --no-frozen-lockfile --ignore-scripts || (echo "Installation failed, checking package.json..." && cat package.json && exit 1)

# Generate Prisma Client and run migrations
WORKDIR /app/packages/db
# Generate Prisma Client (works even without DATABASE_URL for types)
RUN pnpm db:generate || echo "Prisma client generation skipped (DATABASE_URL may not be set yet)"

# Run database migrations if DATABASE_URL is available
# This will be executed at container startup, not during build
WORKDIR /app/apps/web

# Build the web app (Next.js/Turbopack will compile packages from source)
WORKDIR /app/apps/web
RUN pnpm build

# Verify standalone build exists and show structure
RUN echo "Checking .next directory structure:" && \
    ls -la .next/ || echo ".next directory not found" && \
    ls -la .next/standalone/ || echo ".next/standalone directory not found" && \
    find .next -name "server.js" -type f || echo "server.js not found"

# Expose port (Railway will use PORT env var, default to 3000)
EXPOSE 3000

# Create startup script that runs migrations and starts the app
WORKDIR /app/apps/web
RUN echo '#!/bin/sh\nset -e\ncd /app/packages/db\nif [ -n "$DATABASE_URL" ]; then\n  echo "Running database migrations..."\n  pnpm db:migrate:deploy || echo "Migrations failed or already applied"\nelse\n  echo "DATABASE_URL not set, skipping migrations"\nfi\ncd /app/apps/web\nexec pnpm start' > /start.sh && chmod +x /start.sh

# Start the application
CMD ["/start.sh"]

