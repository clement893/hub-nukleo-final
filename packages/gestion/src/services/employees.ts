import { prisma } from "@nukleo/db";
import type { EmployeeFormData, UpdateEmployeeData } from "../schemas/employee";

export async function getEmployeesStats() {
  const totalEmployees = await prisma.user.count();
  const employeesByRole = await prisma.user.groupBy({
    by: ["role"],
    _count: {
      id: true,
    },
  });

  return {
    total: totalEmployees,
    byRole: employeesByRole.reduce(
      (acc, item) => {
        acc[item.role] = item._count.id;
        return acc;
      },
      {} as Record<string, number>
    ),
  };
}

export async function getRecentEmployees(limit = 5) {
  return prisma.user.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function getAllEmployees() {
  // Return all employees (users), even if they have invalid relations
  // This ensures employees imported by Manus are visible
  return prisma.user.findMany({
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }, { name: "asc" }, { email: "asc" }],
    select: {
      id: true,
      email: true,
      name: true,
      firstName: true,
      lastName: true,
      linkedin: true,
      department: true,
      title: true,
      birthday: true,
      hireDate: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getEmployeeById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      firstName: true,
      lastName: true,
      linkedin: true,
      department: true,
      title: true,
      birthday: true,
      hireDate: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function createEmployee(data: EmployeeFormData) {
  return prisma.user.create({
    data: {
      email: data.email,
      name: data.name || (data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : null),
      firstName: data.firstName || null,
      lastName: data.lastName || null,
      linkedin: data.linkedin || null,
      department: data.department || null,
      title: data.title || null,
      birthday: data.birthday ? new Date(data.birthday) : null,
      hireDate: data.hireDate ? new Date(data.hireDate) : null,
      role: data.role,
      image: data.image || null,
    },
    select: {
      id: true,
      email: true,
      name: true,
      firstName: true,
      lastName: true,
      linkedin: true,
      department: true,
      title: true,
      birthday: true,
      hireDate: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function updateEmployee(id: string, data: UpdateEmployeeData) {
  const updateData: any = {};
  
  if (data.email) updateData.email = data.email;
  if (data.name !== undefined) updateData.name = data.name;
  if (data.firstName !== undefined) updateData.firstName = data.firstName || null;
  if (data.lastName !== undefined) updateData.lastName = data.lastName || null;
  if (data.linkedin !== undefined) updateData.linkedin = data.linkedin || null;
  if (data.department !== undefined) updateData.department = data.department || null;
  if (data.title !== undefined) updateData.title = data.title || null;
  if (data.birthday !== undefined) updateData.birthday = data.birthday ? new Date(data.birthday) : null;
  if (data.hireDate !== undefined) updateData.hireDate = data.hireDate ? new Date(data.hireDate) : null;
  if (data.role) updateData.role = data.role;
  if (data.image !== undefined) updateData.image = data.image || null;
  
  // Mettre à jour le nom complet si prénom ou nom de famille changent
  if (data.firstName !== undefined || data.lastName !== undefined) {
    const current = await prisma.user.findUnique({ where: { id }, select: { firstName: true, lastName: true } });
    const firstName = data.firstName !== undefined ? data.firstName : current?.firstName;
    const lastName = data.lastName !== undefined ? data.lastName : current?.lastName;
    if (firstName && lastName) {
      updateData.name = `${firstName} ${lastName}`;
    }
  }

  return prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      firstName: true,
      lastName: true,
      linkedin: true,
      department: true,
      title: true,
      birthday: true,
      hireDate: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function deleteEmployee(id: string) {
  return prisma.user.delete({
    where: { id },
  });
}

