#!/bin/sh

# Script to start the Next.js server
# Tries standalone first, falls back to next start

echo "🚀 Starting Next.js server..."

# Check if standalone directory exists
if [ -d ".next/standalone" ]; then
  echo "📦 Standalone build found, searching for server.js..."
  
  # Try to find server.js in standalone directory
  SERVER_PATH=$(find .next/standalone -name "server.js" -type f 2>/dev/null | head -n 1)
  
  if [ -n "$SERVER_PATH" ]; then
    echo "✅ Found standalone server at: $SERVER_PATH"
    # Change to the directory containing server.js for proper path resolution
    SERVER_DIR=$(dirname "$SERVER_PATH")
    cd "$SERVER_DIR" || exit 1
    node server.js
    exit 0
  else
    echo "⚠️  server.js not found in standalone directory"
  fi
fi

# Fallback to next start
echo "⚠️  Standalone server not found, using next start..."
next start

