#!/bin/sh

# Script to start the Next.js server
# Railway will provide the PORT environment variable

echo "🚀 Starting Next.js server..."

# Use PORT from environment or default to 3000
PORT=${PORT:-3000}

echo "📡 Server will listen on port $PORT"

# Export PORT so Next.js can use it
export PORT

# Start Next.js server
# Next.js automatically uses PORT environment variable
# Using exec to replace shell process with Next.js process
exec next start
