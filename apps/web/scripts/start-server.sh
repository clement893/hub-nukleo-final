#!/bin/sh

# Script to start the Next.js server
# Railway will provide the PORT environment variable

# Exit on error after logging
set -e

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

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "❌ Error: node_modules directory not found."
  echo "📋 Listing current directory:"
  ls -la
  exit 1
fi

# Export PORT so Next.js can use it
export PORT

# Verify Next.js is available
echo "✅ Starting Next.js with pnpm exec..."
echo "🔍 Next.js version:"
if ! pnpm exec next --version; then
  echo "❌ Next.js not found. Checking pnpm installation..."
  pnpm --version || echo "⚠️  pnpm not found"
  exit 1
fi

# Start Next.js server with explicit port
# Use exec to replace shell process with Next.js
# This ensures Railway can properly manage the process
echo "🌐 Starting Next.js server on port $PORT..."
# Use node_modules/.bin/next directly to avoid pnpm exec issues
exec node_modules/.bin/next start -p "$PORT" --hostname 0.0.0.0
