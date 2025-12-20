"use client";
import * as React from "react";
import {
  Card,
  CardContent,
  Input,
  Select,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Loader,
  Alert,
  AlertTitle,
  AlertDescription,
} from "@nukleo/ui";
import { useToast } from "@/lib/toast";
import { getEmployeesAction, updateEmployeeDepartmentAction } from "./actions";
import { EmployeeAvatar } from "@/components/EmployeeAvatar";
import { EmployeeCard } from "@/components/EmployeeCard";
import type { Department } from "@prisma/client";

interface Employee {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  department: string | null;
  operationsDepartment: Department | null;
  linkedin: string | null;
  photoKey: string | null;
  photoUrl: string | null;
  birthday: Date | null;
  hireDate: Date | null;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [view, setView] = React.useState<"table" | "gallery">("table");
  const [filterDepartment, setFilterDepartment] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const { addToast } = useToast();

  // Charger les employés
  const loadEmployees = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getEmployeesAction();
      if (result.success) {
        setEmployees(result.data as Employee[]);
      } else {
        setError(result.error || "Erreur");
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Impossible de charger les employés",
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(message);
      addToast({
        variant: "error",
        title: "Erreur",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  React.useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  // Mettre à jour le département d'un employé
  const handleUpdateDepartment = async (
    employeeId: string,
    department: Department
  ) => {
    try {
      const result = await updateEmployeeDepartmentAction(employeeId, department);
      if (result.success) {
        addToast({
          variant: "success",
          title: "Département mis à jour",
          description: "Le département a été mis à jour avec succès",
        });
        loadEmployees();
      } else {
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Impossible de mettre à jour",
        });
      }
    } catch (err) {
      addToast({
        variant: "error",
        title: "Erreur",
        description: "Une erreur est survenue",
      });
    }
  };

  // Filtrer les employés
  const filteredEmployees = React.useMemo(() => {
    let filtered = employees;
    // Filtre par département
    if (filterDepartment !== "all") {
      filtered = filtered.filter(
        (e) => e.operationsDepartment === filterDepartment
      );
    }
    // Recherche par nom
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.firstName?.toLowerCase().includes(query) ||
          e.lastName?.toLowerCase().includes(query) ||
          e.email.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [employees, filterDepartment, searchQuery]);

  // Statistiques par département
  const stats = React.useMemo(() => {
    const statsMap: Record<string, number> = {
      BUREAU: 0,
      LAB: 0,
      STUDIO: 0,
      none: 0,
    };
    employees.forEach((emp) => {
      const dept = emp.operationsDepartment;
      if (dept && (dept === "BUREAU" || dept === "LAB" || dept === "STUDIO")) {
        statsMap[dept]++;
      } else {
        statsMap.none++;
      }
    });
    return statsMap;
  }, [employees]);

  const getDepartmentBadge = (dept: Department | null) => {
    if (!dept) return <Badge variant="secondary">Non assigné</Badge>;
    const colors: Record<Department, string> = {
      BUREAU: "bg-blue-100 text-blue-800",
      LAB: "bg-purple-100 text-purple-800",
      STUDIO: "bg-pink-100 text-pink-800",
    };
    return <Badge className={colors[dept]}>{dept}</Badge>;
  };

  const departmentFilterOptions = [
    { value: "all", label: "Tous les départements" },
    { value: "BUREAU", label: "Bureau" },
    { value: "LAB", label: "Lab" },
    { value: "STUDIO", label: "Studio" },
  ];

  const departmentAssignOptions = [
    { value: "", label: "Assigner..." },
    { value: "BUREAU", label: "Bureau" },
    { value: "LAB", label: "Lab" },
    { value: "STUDIO", label: "Studio" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error">
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Équipe
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {employees.length} employé(s)
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass card-shadow">
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Bureau
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {stats.BUREAU}
            </div>
          </CardContent>
        </Card>
        <Card className="glass card-shadow">
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Lab
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {stats.LAB}
            </div>
          </CardContent>
        </Card>
        <Card className="glass card-shadow">
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Studio
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {stats.STUDIO}
            </div>
          </CardContent>
        </Card>
        <Card className="glass card-shadow">
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Non assignés
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {stats.none}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card className="glass card-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Rechercher par nom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              options={departmentFilterOptions}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs Vue Tableau / Galerie */}
      <Tabs value={view} onValueChange={(v) => setView(v as "table" | "gallery")}>
        <TabsList>
          <TabsTrigger value="table">Tableau</TabsTrigger>
          <TabsTrigger value="gallery">Galerie</TabsTrigger>
        </TabsList>

        {/* Vue Tableau */}
        <TabsContent value="table" className="mt-6">
          <Card className="glass card-shadow">
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Département</TableHead>
                    <TableHead>LinkedIn</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <EmployeeAvatar
                            firstName={employee.firstName || ""}
                            lastName={employee.lastName || ""}
                            photoKey={employee.photoKey}
                            size="sm"
                          />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {employee.firstName} {employee.lastName}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>
                        {getDepartmentBadge(employee.operationsDepartment)}
                      </TableCell>
                      <TableCell>
                        {employee.linkedin ? (
                          <a
                            href={employee.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Profil
                          </a>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Select
                          value={employee.operationsDepartment || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value && value !== "") {
                              handleUpdateDepartment(employee.id, value as Department);
                            }
                          }}
                          options={departmentAssignOptions}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vue Galerie */}
        <TabsContent value="gallery" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEmployees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onUpdateDepartment={handleUpdateDepartment}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

