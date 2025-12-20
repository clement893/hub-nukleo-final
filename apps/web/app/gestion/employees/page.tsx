"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Badge,
  Modal,
  Select,
  DropdownMenu,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from "@nukleo/ui";
import {
  getEmployeesAction,
  createEmployeeAction,
  updateEmployeeAction,
  deleteEmployeeAction,
} from "./actions";
import { useToast } from "@/lib/toast";
import type { EmployeeFormData } from "@nukleo/gestion/client";

type Employee = {
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

export default function EmployeesPage() {
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterRole, setFilterRole] = React.useState<string>("all");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [employeeToDelete, setEmployeeToDelete] = React.useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = React.useState<Employee | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(50);
  const { addToast } = useToast();

  // Form state
  const [formData, setFormData] = React.useState<EmployeeFormData>({
    email: "",
    name: "",
    firstName: "",
    lastName: "",
    linkedin: "",
    department: "",
    title: "",
    birthday: "",
    hireDate: "",
    role: "USER",
    image: "",
  });

  React.useEffect(() => {
    async function loadData() {
      try {
        const result = await getEmployeesAction();
        if (result.success && result.data) {
          setEmployees(result.data);
        } else {
          addToast({
            variant: "error",
            title: "Erreur",
            description: result.error || "Impossible de charger les employés",
          });
        }
      } catch (error) {
        console.error("Error loading data:", error);
        addToast({
          variant: "error",
          title: "Erreur",
          description: "Une erreur est survenue lors du chargement des données",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [addToast]);

  // Filtering
  const filteredEmployees = React.useMemo(() => {
    return employees.filter((employee) => {
      const fullName = employee.firstName && employee.lastName 
        ? `${employee.firstName} ${employee.lastName}` 
        : employee.name || "";
      
      const matchesSearch =
        !searchTerm ||
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.title?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = filterRole === "all" || employee.role === filterRole;

      return matchesSearch && matchesRole;
    });
  }, [employees, searchTerm, filterRole]);

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEmployees, currentPage, itemsPerPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole]);

  const handleCreateEmployee = () => {
    setEditingEmployee(null);
    setFormData({
      email: "",
      name: "",
      firstName: "",
      lastName: "",
      linkedin: "",
      department: "",
      title: "",
      birthday: "",
      hireDate: "",
      role: "USER",
      image: "",
    });
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      email: employee.email,
      name: employee.name || "",
      firstName: employee.firstName || "",
      lastName: employee.lastName || "",
      linkedin: employee.linkedin || "",
      department: employee.department || "",
      title: employee.title || "",
      birthday: employee.birthday ? new Date(employee.birthday).toISOString().split("T")[0] : "",
      hireDate: employee.hireDate ? new Date(employee.hireDate).toISOString().split("T")[0] : "",
      role: employee.role,
      image: employee.image || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return;

    try {
      const result = await deleteEmployeeAction(employeeToDelete.id);
      if (result.success) {
        setEmployees((prev) =>
          prev.filter((employee) => employee.id !== employeeToDelete.id)
        );
        addToast({
          variant: "success",
          title: "Succès",
          description: "Employé supprimé avec succès",
        });
      } else {
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Impossible de supprimer l'employé",
        });
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      addToast({
        variant: "error",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
      });
    } finally {
      setIsDeleteModalOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let result;
      if (editingEmployee) {
        result = await updateEmployeeAction(editingEmployee.id, formData);
      } else {
        result = await createEmployeeAction(formData);
      }

      if (result.success && result.data) {
        if (editingEmployee) {
          setEmployees((prev) =>
            prev.map((emp) =>
              emp.id === editingEmployee.id ? result.data : emp
            )
          );
          addToast({
            variant: "success",
            title: "Succès",
            description: "Employé modifié avec succès",
          });
        } else {
          setEmployees((prev) => [result.data, ...prev]);
          addToast({
            variant: "success",
            title: "Succès",
            description: "Employé créé avec succès",
          });
        }
        setIsModalOpen(false);
        setEditingEmployee(null);
        setFormData({
          email: "",
          name: "",
          firstName: "",
          lastName: "",
          linkedin: "",
          department: "",
          title: "",
          birthday: "",
          hireDate: "",
          role: "USER",
          image: "",
        });
      } else {
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Une erreur est survenue",
        });
      }
    } catch (error) {
      console.error("Error saving employee:", error);
      addToast({
        variant: "error",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 dark:text-gray-400">Chargement...</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-2">
            Employés
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
            Gérez les employés de l'entreprise
          </p>
        </div>
        <Button variant="primary" onClick={handleCreateEmployee} className="w-full sm:w-auto">
          Nouvel employé
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              options={[
                { value: "all", label: "Tous les rôles" },
                { value: "ADMIN", label: "Administrateur" },
                { value: "MANAGER", label: "Manager" },
                { value: "USER", label: "Utilisateur" },
              ]}
              className="w-full sm:w-48"
            />
          </div>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Liste des employés ({filteredEmployees.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paginatedEmployees.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Aucun employé trouvé
              </p>
              <Button variant="primary" onClick={handleCreateEmployee}>
                Créer un employé
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Photo</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Anniversaire</TableHead>
                      <TableHead>Embauche</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedEmployees.map((employee) => {
                      const fullName = employee.firstName && employee.lastName 
                        ? `${employee.firstName} ${employee.lastName}` 
                        : employee.name || "Sans nom";
                      
                      return (
                      <TableRow key={employee.id}>
                        <TableCell>
                          {employee.image ? (
                            <img 
                              src={employee.image} 
                              alt={fullName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                                {fullName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
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
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>
                          {employee.department || "-"}
                        </TableCell>
                        <TableCell>
                          {employee.title || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={roleColors[employee.role]}>
                            {roleLabels[employee.role]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {employee.birthday 
                            ? new Date(employee.birthday).toLocaleDateString("fr-FR", { day: "numeric", month: "numeric" })
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {employee.hireDate 
                            ? new Date(employee.hireDate).toLocaleDateString("fr-FR")
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownTrigger asChild>
                              <Button variant="outline" size="sm">
                                Actions
                              </Button>
                            </DropdownTrigger>
                            <DropdownContent align="end">
                              <DropdownItem onClick={() => handleEditEmployee(employee)}>
                                Modifier
                              </DropdownItem>
                              <DropdownSeparator />
                              <DropdownItem
                                onClick={() => handleDeleteClick(employee)}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Page {currentPage} sur {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEmployee(null);
          setFormData({
            email: "",
            name: "",
            firstName: "",
            lastName: "",
            linkedin: "",
            department: "",
            title: "",
            birthday: "",
            hireDate: "",
            role: "USER",
            image: "",
          });
        }}
        title={editingEmployee ? "Modifier l'employé" : "Nouvel employé"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Email *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              disabled={!!editingEmployee}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Prénom
              </label>
              <Input
                value={formData.firstName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Nom de famille
              </label>
              <Input
                value={formData.lastName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Nom complet (si prénom/nom non renseignés)
            </label>
            <Input
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              LinkedIn (URL)
            </label>
            <Input
              type="url"
              value={formData.linkedin || ""}
              onChange={(e) =>
                setFormData({ ...formData, linkedin: e.target.value })
              }
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Département
            </label>
            <Input
              value={formData.department || ""}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              placeholder="Ex: Commercial, Technique, RH..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Titre/Poste
            </label>
            <Input
              value={formData.title || ""}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Ex: Développeur Senior, Chef de projet..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Anniversaire
              </label>
              <Input
                type="date"
                value={formData.birthday || ""}
                onChange={(e) =>
                  setFormData({ ...formData, birthday: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Date d'embauche
              </label>
              <Input
                type="date"
                value={formData.hireDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, hireDate: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Rôle *
            </label>
            <Select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value as "ADMIN" | "MANAGER" | "USER" })
              }
              options={[
                { value: "USER", label: "Utilisateur" },
                { value: "MANAGER", label: "Manager" },
                { value: "ADMIN", label: "Administrateur" },
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Photo (URL)
            </label>
            <Input
              type="url"
              value={formData.image || ""}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              placeholder="https://..."
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingEmployee(null);
              }}
            >
              Annuler
            </Button>
            <Button type="submit" variant="primary">
              {editingEmployee ? "Modifier" : "Créer"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setEmployeeToDelete(null);
        }}
        title="Supprimer l'employé"
      >
        <p className="mb-4">
          Êtes-vous sûr de vouloir supprimer l'employé{" "}
          <strong>
            {employeeToDelete?.firstName && employeeToDelete?.lastName
              ? `${employeeToDelete.firstName} ${employeeToDelete.lastName}`
              : employeeToDelete?.name || employeeToDelete?.email}
          </strong> ?
          Cette action est irréversible.
        </p>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setIsDeleteModalOpen(false);
              setEmployeeToDelete(null);
            }}
          >
            Annuler
          </Button>
          <Button variant="error" onClick={handleDeleteConfirm}>
            Supprimer
          </Button>
        </div>
      </Modal>
    </>
  );
}

