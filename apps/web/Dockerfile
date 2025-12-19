FROM node:18-alpine

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace configuration files from monorepo root
# Railway builds from apps/web, so we need to go up two levels
COPY ../../package.json ../../pnpm-lock.yaml ../../pnpm-workspace.yaml ../../turbo.json ./
COPY ../../packages ./packages
COPY . ./apps/web

# Install dependencies from root
RUN pnpm install --frozen-lockfile

# Build the web app
WORKDIR /app/apps/web
RUN pnpm build

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
