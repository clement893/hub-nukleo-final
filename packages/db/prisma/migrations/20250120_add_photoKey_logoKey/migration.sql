-- AlterTable
ALTER TABLE "contacts" ADD COLUMN IF NOT EXISTS "photoKey" TEXT;

-- AlterTable
ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "logoKey" TEXT;


