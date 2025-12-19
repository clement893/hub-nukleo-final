#!/bin/sh

# Script to start Next.js server with proper PORT handling
# Railway sets PORT environment variable dynamically

echo "🚀 Starting Next.js server on port ${PORT:-3000}..."

# Next.js automatically uses PORT env var, but we can be explicit
exec next start -p ${PORT:-3000}
