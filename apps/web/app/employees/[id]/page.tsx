"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Loader,
  Alert,
  AlertTitle,
  AlertDescription,
} from "@nukleo/ui";
import { getEmployeeByIdAction } from "../actions";
import { EmployeeAvatar } from "@/components/EmployeeAvatar";
import type { Department } from "@prisma/client";

interface Employee {
  id: string;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  email: string;
  department: string | null;
  operationsDepartment: Department | null;
  linkedin: string | null;
  photoKey: string | null;
  photoUrl: string | null;
  birthday: Date | null;
  hireDate: Date | null;
  title: string | null;
  role: "ADMIN" | "MANAGER" | "USER" | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export default function EmployeeDetailPage() {
  const params = useParams();
  const employeeId = params?.id as string;
  const [employee, setEmployee] = React.useState<Employee | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadEmployee() {
      if (!employeeId) {
        setError("ID d'employé manquant");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const result = await getEmployeeByIdAction(employeeId);
        
        if (result.success && result.data) {
          setEmployee(result.data as Employee);
        } else {
          setError(result.error || "Impossible de charger l'employé");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setIsLoading(false);
      }
    }

    loadEmployee();
  }, [employeeId]);

  const getDepartmentBadge = (dept: Department | null) => {
    if (!dept) return <Badge variant="secondary">Non assigné</Badge>;
    const colors: Record<Department, string> = {
      BUREAU: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      LAB: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      STUDIO: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
    };
    return <Badge className={colors[dept]}>{dept}</Badge>;
  };

  const getRoleBadge = (role: string | null) => {
    if (!role) return null;
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
    return <Badge variant={roleColors[role] || "default"}>{roleLabels[role] || role}</Badge>;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getFullName = () => {
    if (!employee) return "";
    return employee.firstName && employee.lastName
      ? `${employee.firstName} ${employee.lastName}`
      : employee.name || employee.email;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="space-y-6">
        <Link href="/employees">
          <Button variant="ghost">← Retour à la liste</Button>
        </Link>
        <Alert variant="destructive">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error || "Employé non trouvé"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec bouton retour */}
      <div className="flex items-center justify-between">
        <Link href="/employees">
          <Button variant="ghost">← Retour à la liste</Button>
        </Link>
      </div>

      {/* Carte principale */}
      <Card className="glass card-shadow">
        <CardHeader>
          <div className="flex items-start gap-6">
            <EmployeeAvatar
              firstName={employee.firstName || ""}
              lastName={employee.lastName || ""}
              photoKey={employee.photoKey}
              photoUrl={employee.photoUrl}
              size="xl"
            />
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2">{getFullName()}</CardTitle>
              {employee.title && (
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                  {employee.title}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {getDepartmentBadge(employee.operationsDepartment)}
                {getRoleBadge(employee.role)}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations de contact */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Informations de contact
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p className="text-gray-900 dark:text-white">{employee.email}</p>
                </div>
                {employee.linkedin && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">LinkedIn</p>
                    <a
                      href={employee.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {employee.linkedin}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Informations professionnelles */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Informations professionnelles
              </h3>
              <div className="space-y-3">
                {employee.department && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Département</p>
                    <p className="text-gray-900 dark:text-white">{employee.department}</p>
                  </div>
                )}
                {employee.hireDate && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Date d'embauche</p>
                    <p className="text-gray-900 dark:text-white">{formatDate(employee.hireDate)}</p>
                  </div>
                )}
                {employee.birthday && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Date de naissance</p>
                    <p className="text-gray-900 dark:text-white">{formatDate(employee.birthday)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Informations système */}
          {(employee.createdAt || employee.updatedAt) && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Informations système
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {employee.createdAt && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Créé le</p>
                    <p className="text-gray-900 dark:text-white">{formatDate(employee.createdAt)}</p>
                  </div>
                )}
                {employee.updatedAt && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Modifié le</p>
                    <p className="text-gray-900 dark:text-white">{formatDate(employee.updatedAt)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Zone pour futures fonctionnalités de gestion */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Gestion
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Cette section sera utilisée pour les fonctionnalités de gestion futures (congés, évaluations, etc.)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

