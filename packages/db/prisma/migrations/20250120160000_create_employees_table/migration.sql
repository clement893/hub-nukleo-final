-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "linkedin" TEXT,
    "department" TEXT,
    "title" TEXT,
    "birthday" TIMESTAMP(3),
    "hireDate" TIMESTAMP(3),
    "role" "Role" NOT NULL DEFAULT 'USER',
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE INDEX "employees_department_idx" ON "employees"("department");

-- CreateIndex
CREATE INDEX "employees_role_idx" ON "employees"("role");

-- Migrate data from users to employees (only users with employee fields)
INSERT INTO "employees" (
    "id",
    "email",
    "name",
    "firstName",
    "lastName",
    "linkedin",
    "department",
    "title",
    "birthday",
    "hireDate",
    "role",
    "image",
    "createdAt",
    "updatedAt"
)
SELECT 
    "id",
    "email",
    "name",
    "firstName",
    "lastName",
    "linkedin",
    "department",
    "title",
    "birthday",
    "hireDate",
    "role",
    "image",
    "createdAt",
    "updatedAt"
FROM "users"
WHERE "firstName" IS NOT NULL 
   OR "lastName" IS NOT NULL 
   OR "title" IS NOT NULL 
   OR "birthday" IS NOT NULL 
   OR "hireDate" IS NOT NULL;

