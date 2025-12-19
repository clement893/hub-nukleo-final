#!/bin/sh

# Script to start the Next.js server
# Railway will provide the PORT environment variable

set -e  # Exit on error

echo "🚀 Starting Next.js server..."

# Use PORT from environment or default to 3000
PORT=${PORT:-3000}

echo "📡 Server will listen on port $PORT"
echo "📂 Current directory: $(pwd)"
echo "📦 Checking Next.js installation..."

# Change to web app directory
cd /app/apps/web || {
  echo "❌ Failed to change to /app/apps/web"
  exit 1
}

# Export PORT so Next.js can use it
export PORT

# Start Next.js server with explicit port using pnpm exec
# This ensures we use the local Next.js installation
echo "✅ Starting Next.js with pnpm exec..."
exec pnpm exec next start -p "$PORT"
