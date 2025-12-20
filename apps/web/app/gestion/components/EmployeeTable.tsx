"use client";

import * as React from "react";
import {
  Button,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  DropdownMenu,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from "@nukleo/ui";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/GlassCard";
import { Pagination } from "./Pagination";

export type Employee = {
  id: string;
  email: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  linkedin: string | null;
  department: string | null;
  title: string | null;
  birthday: Date | null;
  hireDate: Date | null;
  role: "ADMIN" | "MANAGER" | "USER";
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const roleLabels: Record<string, string> = {
  ADMIN: "Administrateur",
  MANAGER: "Manager",
  USER: "Utilisateur",
};

const roleColors: Record<string, "default" | "primary" | "success" | "warning" | "error"> = {
  ADMIN: "error",
  MANAGER: "warning",
  USER: "default",
};

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onCreateClick?: () => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function EmployeeTable({
  employees,
  onEdit,
  onDelete,
  onCreateClick,
  currentPage,
  totalPages,
  onPageChange,
}: EmployeeTableProps) {
  const getFullName = (employee: Employee) => {
    return employee.firstName && employee.lastName
      ? `${employee.firstName} ${employee.lastName}`
      : employee.name || "Sans nom";
  };

  if (employees.length === 0) {
    return (
      <GlassCard>
        <GlassCardContent>
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Aucun employé trouvé
            </p>
            {onCreateClick && (
              <Button variant="primary" onClick={onCreateClick}>
                Créer un employé
              </Button>
            )}
          </div>
        </GlassCardContent>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <GlassCardHeader>
        <GlassCardTitle>
          Liste des employés ({employees.length})
        </GlassCardTitle>
      </GlassCardHeader>
      <GlassCardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Anniversaire</TableHead>
                <TableHead>Embauche</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => {
                const fullName = getFullName(employee);
                const EmployeeAvatar = () => {
                  const [imageError, setImageError] = React.useState(false);
                  const [imageSrc, setImageSrc] = React.useState(employee.image);

                  React.useEffect(() => {
                    setImageError(false);
                    setImageSrc(employee.image);
                  }, [employee.image]);

                  if (!imageSrc || imageError) {
                    return (
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                          {fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                      <img
                        src={imageSrc}
                        alt={fullName}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                        onLoad={() => setImageError(false)}
                      />
                    </div>
                  );
                };

                return (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <EmployeeAvatar />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>
                        <div>{fullName}</div>
                        {employee.linkedin && (
                          <a
                            href={employee.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-white">{employee.email}</TableCell>
                    <TableCell className="text-gray-900 dark:text-white">{employee.department || "-"}</TableCell>
                    <TableCell className="text-gray-900 dark:text-white font-medium">
                      {employee.title || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={roleColors[employee.role]}>
                        {roleLabels[employee.role]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-white">
                      {employee.birthday
                        ? new Date(employee.birthday).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "numeric",
                          })
                        : "-"}
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-white whitespace-nowrap">
                      {employee.hireDate
                        ? new Date(employee.hireDate).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "numeric",
                            year: "numeric",
                          })
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownTrigger>
                          <Button variant="outline" size="sm">
                            Actions
                          </Button>
                        </DropdownTrigger>
                        <DropdownContent>
                          <DropdownItem onClick={() => onEdit(employee)}>
                            Modifier
                          </DropdownItem>
                          <DropdownSeparator />
                          <DropdownItem
                            onClick={() => onDelete(employee)}
                            className="text-red-600 dark:text-red-400"
                          >
                            Supprimer
                          </DropdownItem>
                        </DropdownContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {currentPage !== undefined && totalPages !== undefined && onPageChange && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </GlassCardContent>
    </GlassCard>
  );
}

