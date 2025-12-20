-- CreateEnum
CREATE TYPE "Department" AS ENUM ('BUREAU', 'LAB', 'STUDIO');

-- CreateEnum
CREATE TYPE "TaskZone" AS ENUM ('SHELF', 'STORAGE', 'DOCK', 'ACTIVE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN "operationsDepartment" "Department";

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN "department" "Department";
ALTER TABLE "tasks" ADD COLUMN "zone" "TaskZone" DEFAULT 'SHELF';

-- CreateIndex
CREATE INDEX "users_operationsDepartment_idx" ON "users"("operationsDepartment");

-- CreateIndex
CREATE INDEX "tasks_department_idx" ON "tasks"("department");
CREATE INDEX "tasks_zone_idx" ON "tasks"("zone");

-- Note: La relation TaskAssignee existe déjà, pas besoin de la recréer

