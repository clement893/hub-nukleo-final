#!/bin/sh

# Script to start the Next.js server
# Railway will provide the PORT environment variable

# Don't exit on error immediately - we want to see what's happening
set +e

echo "🚀 Starting Next.js server..."

# Use PORT from environment or default to 8080 (Railway default)
PORT=${PORT:-8080}

echo "📡 Server will listen on port $PORT"
echo "📂 Current directory: $(pwd)"
echo "📦 Checking Next.js installation..."

# Change to web app directory
cd /app/apps/web || {
  echo "❌ Failed to change to /app/apps/web"
  exit 1
}

# Check if .next directory exists
if [ ! -d ".next" ]; then
  echo "❌ Error: .next directory not found. Build may have failed."
  echo "📋 Listing current directory:"
  ls -la
  exit 1
fi

# Export PORT so Next.js can use it
export PORT

# Start Next.js server with explicit port using pnpm exec
# This ensures we use the local Next.js installation
echo "✅ Starting Next.js with pnpm exec..."
echo "🔍 Next.js version:"
pnpm exec next --version || echo "⚠️  Could not get Next.js version"

# Use exec to replace shell process with Next.js
exec pnpm exec next start -p "$PORT"
