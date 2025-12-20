-- AlterTable
ALTER TABLE "users" ADD COLUMN "firstName" TEXT;
ALTER TABLE "users" ADD COLUMN "lastName" TEXT;
ALTER TABLE "users" ADD COLUMN "linkedin" TEXT;
ALTER TABLE "users" ADD COLUMN "department" TEXT;
ALTER TABLE "users" ADD COLUMN "birthday" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN "hireDate" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "users_department_idx" ON "users"("department");

