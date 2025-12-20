/**
 * Script to apply the OpportunityStage enum migration
 * This script can be run manually if the automatic migration fails
 * 
 * Usage: pnpm tsx scripts/apply-enum-migration.ts
 */

import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

async function applyMigration() {
  try {
    console.log("🔄 Applying OpportunityStage enum migration...");

    // Read the migration SQL file
    const migrationPath = join(
      __dirname,
      "../prisma/migrations/20250120_update_opportunity_stage_enum/migration.sql"
    );
    const migrationSQL = readFileSync(migrationPath, "utf-8");

    // Split SQL into individual statements
    const statements = migrationSQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    console.log(`📄 Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.length === 0) continue;

      console.log(`\n📝 Executing statement ${i + 1}/${statements.length}...`);
      console.log(statement.substring(0, 100) + "...");

      try {
        await prisma.$executeRawUnsafe(statement);
        console.log(`✅ Statement ${i + 1} executed successfully`);
      } catch (error: any) {
        // If enum already exists or column already updated, that's okay
        if (
          error.message?.includes("already exists") ||
          error.message?.includes("does not exist") ||
          error.message?.includes("invalid input value")
        ) {
          console.log(`⚠️  Statement ${i + 1} skipped (${error.message})`);
        } else {
          throw error;
        }
      }
    }

    console.log("\n✅ Migration applied successfully!");
  } catch (error) {
    console.error("❌ Error applying migration:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

applyMigration()
  .then(() => {
    console.log("✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Migration failed:", error);
    process.exit(1);
  });

