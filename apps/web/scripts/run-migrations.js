#!/usr/bin/env node

/**
 * Script to sync Prisma schema to database before starting the application
 * This ensures the database schema is up to date
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔄 Syncing database schema...');

try {
  // Change to the db package directory
  const dbPath = path.join(__dirname, '../../packages/db');
  
  // Use db:push to sync schema (works without migrations)
  // This is safer for Railway deployments
  execSync('pnpm db:push --accept-data-loss', {
    cwd: dbPath,
    stdio: 'inherit',
    env: process.env,
  });
  
  console.log('✅ Database schema synced successfully');
} catch (error) {
  console.error('❌ Error syncing database schema:', error.message);
  // Try migrations as fallback
  console.log('🔄 Trying migrations as fallback...');
  try {
    const dbPath = path.join(__dirname, '../../packages/db');
    execSync('pnpm db:migrate:deploy', {
      cwd: dbPath,
      stdio: 'inherit',
      env: process.env,
    });
    console.log('✅ Database migrations completed successfully');
  } catch (migrateError) {
    console.error('❌ Error running migrations:', migrateError.message);
    console.log('⚠️  Continuing startup despite database sync error...');
    console.log('⚠️  Please ensure the database schema is up to date manually');
  }
}

