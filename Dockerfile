FROM node:18-alpine

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace configuration files
COPY package.json pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps/web ./apps/web

# Install dependencies from root
# Use --no-frozen-lockfile if pnpm-lock.yaml doesn't exist yet
# Ignore scripts to avoid conflicts
RUN pnpm install --no-frozen-lockfile --ignore-scripts

# Build the web app
WORKDIR /app/apps/web
RUN pnpm build

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]

