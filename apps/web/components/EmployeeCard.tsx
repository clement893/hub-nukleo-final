"use client";
import * as React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  Badge,
  Select,
} from "@nukleo/ui";
import { EmployeeAvatar } from "./EmployeeAvatar";
import type { Department } from "@prisma/client";

interface Employee {
  id: string;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  email: string;
  operationsDepartment: Department | null;
  linkedin: string | null;
  photoKey: string | null;
  photoUrl: string | null;
}

interface EmployeeCardProps {
  employee: Employee;
  onUpdateDepartment: (employeeId: string, department: Department) => void;
}

export function EmployeeCard({ employee, onUpdateDepartment }: EmployeeCardProps) {
  const getDepartmentBadge = (dept: Department | null) => {
    if (!dept) return <Badge variant="secondary">Non assigné</Badge>;
    const colors: Record<Department, string> = {
      BUREAU: "bg-blue-100 text-blue-800",
      LAB: "bg-purple-100 text-purple-800",
      STUDIO: "bg-pink-100 text-pink-800",
    };
    return <Badge className={colors[dept]}>{dept}</Badge>;
  };

  const departmentOptions = [
    { value: "", label: "Assigner un département" },
    { value: "BUREAU", label: "Bureau" },
    { value: "LAB", label: "Lab" },
    { value: "STUDIO", label: "Studio" },
  ];

  return (
    <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <Link href={`/employees/${employee.id}`} className="cursor-pointer">
            <EmployeeAvatar
              firstName={employee.firstName || ""}
              lastName={employee.lastName || ""}
              photoKey={employee.photoKey}
              photoUrl={employee.photoUrl}
              size="lg"
            />
          </Link>
          <Link 
            href={`/employees/${employee.id}`}
            className="cursor-pointer hover:underline"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4">
              {employee.firstName && employee.lastName
                ? `${employee.firstName} ${employee.lastName}`
                : employee.name || employee.email}
            </h3>
          </Link>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {employee.email}
          </p>
          <div className="mt-3">
            {getDepartmentBadge(employee.operationsDepartment)}
          </div>
          {employee.linkedin && (
            <a
              href={employee.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline mt-2"
            >
              LinkedIn
            </a>
          )}
          <div className="w-full mt-4">
            <Select
              value={employee.operationsDepartment || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value && value !== "") {
                  onUpdateDepartment(employee.id, value as Department);
                }
              }}
              options={departmentOptions}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

