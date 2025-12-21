-- AlterTable
ALTER TABLE "users" ADD COLUMN "employeeId" TEXT;

-- CreateIndex
CREATE INDEX "users_employeeId_idx" ON "users"("employeeId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

