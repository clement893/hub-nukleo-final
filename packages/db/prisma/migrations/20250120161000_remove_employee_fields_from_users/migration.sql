-- Remove employee-specific fields from users table
-- These fields are now in the employees table

ALTER TABLE "users" DROP COLUMN IF EXISTS "firstName";
ALTER TABLE "users" DROP COLUMN IF EXISTS "lastName";
ALTER TABLE "users" DROP COLUMN IF EXISTS "linkedin";
ALTER TABLE "users" DROP COLUMN IF EXISTS "department";
ALTER TABLE "users" DROP COLUMN IF EXISTS "title";
ALTER TABLE "users" DROP COLUMN IF EXISTS "birthday";
ALTER TABLE "users" DROP COLUMN IF EXISTS "hireDate";

