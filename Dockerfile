FROM node:20-alpine

# Install dependencies for Prisma and native modules
RUN apk add --no-cache \
    openssl \
    libc6-compat \
    python3 \
    make \
    g++ \
    && ln -sf python3 /usr/bin/python

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
RUN pnpm install --no-frozen-lockfile --ignore-scripts --shamefully-hoist

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

# Make scripts executable
RUN chmod +x /app/apps/web/scripts/run-migrations.sh && \
    chmod +x /app/apps/web/scripts/start-server.sh

# Expose port (Railway will use PORT env var, default to 3000)
EXPOSE 3000

# Start the application using the start script from package.json
# The start script will handle database initialization
WORKDIR /app/apps/web
CMD ["pnpm", "start"]

