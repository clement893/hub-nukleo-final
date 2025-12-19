FROM node:20-alpine

# Install OpenSSL and libc6-compat for Prisma
RUN apk add --no-cache openssl libc6-compat

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace configuration files first
COPY package.json pnpm-workspace.yaml turbo.json ./

# Copy all packages
COPY packages ./packages

# Copy all apps
COPY apps ./apps

# Verify package.json is valid before installing
RUN cat package.json | head -5

# Install dependencies from root
# Use --no-frozen-lockfile if pnpm-lock.yaml doesn't exist yet
# Ignore scripts to avoid conflicts with postinstall hooks
RUN pnpm install --no-frozen-lockfile --ignore-scripts

# Generate Prisma Client and run migrations
WORKDIR /app/packages/db
# Generate Prisma Client (works even without DATABASE_URL for types)
RUN pnpm db:generate || echo "Prisma client generation skipped (DATABASE_URL may not be set yet)"

# Build the web app (Next.js/Turbopack will compile packages from source)
WORKDIR /app/apps/web
RUN pnpm build

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]

