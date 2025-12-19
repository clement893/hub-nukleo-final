#!/bin/sh

# Script to sync Prisma schema to database before starting the application
# This ensures the database schema is up to date

echo "🔄 Syncing database schema..."

# Use absolute path from /app root (as defined in Dockerfile)
DB_DIR="/app/packages/db"

# Check if directory exists
if [ ! -d "$DB_DIR" ]; then
  echo "❌ Database directory not found: $DB_DIR"
  echo "⚠️  Continuing startup without database sync..."
  echo "⚠️  Please ensure the database schema is up to date manually"
  exit 0
fi

echo "📁 Using database directory: $DB_DIR"
cd "$DB_DIR" || {
  echo "❌ Could not change to database directory: $DB_DIR"
  echo "⚠️  Continuing startup without database sync..."
  exit 0
}

# Try db:push first (works without migrations)
echo "📦 Attempting db:push..."
if pnpm db:push --accept-data-loss 2>&1; then
  echo "✅ Database schema synced successfully"
  exit 0
fi

# Fallback to migrations
echo "🔄 Trying migrations as fallback..."
if pnpm db:migrate:deploy 2>&1; then
  echo "✅ Database migrations completed successfully"
  exit 0
fi

echo "⚠️  Continuing startup despite database sync error..."
echo "⚠️  Please ensure the database schema is up to date manually"
exit 0

