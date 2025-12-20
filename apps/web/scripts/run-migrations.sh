#!/bin/sh

# Script to sync Prisma schema to database before starting the application
# This ensures the database schema is up to date

# Don't exit on error - we want to handle errors gracefully
set +e

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

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  DATABASE_URL not set, skipping database sync..."
  exit 0
fi

# Try db:push first (works without migrations)
echo "📦 Attempting db:push..."
if pnpm db:push --accept-data-loss 2>&1; then
  echo "✅ Database schema synced successfully"
  exit 0
fi

# Fallback to migrations
echo "🔄 Trying migrations as fallback..."
MIGRATE_OUTPUT=$(pnpm db:migrate:deploy 2>&1)
MIGRATE_EXIT_CODE=$?

if [ $MIGRATE_EXIT_CODE -eq 0 ]; then
  echo "✅ Database migrations completed successfully"
  exit 0
fi

# If migration fails with P3005 (schema not empty), try to apply migration SQL directly
if echo "$MIGRATE_OUTPUT" | grep -q "P3005\|database schema is not empty"; then
  echo "⚠️  Database schema is not empty, attempting to apply migration SQL directly..."
  
  # Find the latest migration SQL file for OpportunityStage enum update
  LATEST_MIGRATION=$(ls -t "$DB_DIR/prisma/migrations"/*update_opportunity_stage_enum*/migration.sql 2>/dev/null | head -1)
  
  if [ -z "$LATEST_MIGRATION" ]; then
    # Fallback to any migration SQL file
    LATEST_MIGRATION=$(ls -t "$DB_DIR/prisma/migrations"/*/migration.sql 2>/dev/null | head -1)
  fi
  
  if [ -n "$LATEST_MIGRATION" ] && [ -f "$LATEST_MIGRATION" ]; then
    echo "📄 Found migration: $LATEST_MIGRATION"
    echo "🔄 Applying migration SQL directly using psql..."
    
    # Extract connection details from DATABASE_URL and use psql
    if command -v psql >/dev/null 2>&1 && [ -n "$DATABASE_URL" ]; then
      if psql "$DATABASE_URL" -f "$LATEST_MIGRATION" 2>&1; then
        echo "✅ Migration SQL applied successfully"
        exit 0
      else
        echo "⚠️  Failed to apply migration SQL with psql"
      fi
    else
      echo "⚠️  psql not available, cannot apply migration SQL directly"
      echo "💡 Migration file location: $LATEST_MIGRATION"
      echo "💡 You may need to apply this migration manually via Railway's database console"
    fi
  else
    echo "⚠️  No migration SQL file found"
  fi
fi

echo "⚠️  Continuing startup despite database sync error..."
echo "⚠️  Please ensure the database schema is up to date manually"
echo "📋 Migration output:"
echo "$MIGRATE_OUTPUT"
exit 0

