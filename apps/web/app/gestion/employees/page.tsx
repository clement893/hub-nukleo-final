"use client";

import * as React from "react";
import {
  getEmployeesAction,
  createEmployeeAction,
  updateEmployeeAction,
  deleteEmployeeAction,
} from "./actions";
import { useToast } from "@/lib/toast";
import type { EmployeeFormData } from "@nukleo/gestion/client";
import { Loader } from "@nukleo/ui";
import { PageHeader } from "../components/PageHeader";
import { EmployeeFilters } from "../components/EmployeeFilters";
import { EmployeeTable, type Employee } from "../components/EmployeeTable";
import { EmployeeModal } from "../components/EmployeeModal";
import { EmployeeDeleteModal } from "../components/EmployeeDeleteModal";

const initialFormData: EmployeeFormData = {
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
  const [formData, setFormData] = React.useState<EmployeeFormData>(initialFormData);
  const { addToast } = useToast();

  React.useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const result = await getEmployeesAction();
        console.log("getEmployeesAction result:", result);
        if (result.success && result.data) {
          console.log("Employees loaded:", result.data.length);
          setEmployees(result.data);
          if (result.data.length === 0) {
            addToast({
              variant: "info",
              title: "Information",
              description: "Aucun employé trouvé dans la base de données",
            });
          }
        } else {
          console.error("Failed to load employees:", result.error);
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
          description: error instanceof Error ? error.message : "Une erreur est survenue lors du chargement des données",
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
      const fullName =
        employee.firstName && employee.lastName
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
    setFormData(initialFormData);
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
      birthday: employee.birthday
        ? new Date(employee.birthday).toISOString().split("T")[0]
        : "",
      hireDate: employee.hireDate
        ? new Date(employee.hireDate).toISOString().split("T")[0]
        : "",
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
            prev.map((emp) => (emp.id === editingEmployee.id ? result.data : emp))
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
        setFormData(initialFormData);
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

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
    setFormData(initialFormData);
  };

  if (isLoading) {
    return (
      <div 
        className="flex items-center justify-center min-h-screen" 
        role="status" 
        aria-live="polite"
        aria-label="Chargement des employés"
      >
        <Loader size="lg" />
        <span className="sr-only">Chargement des employés...</span>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Employés"
        description="Gérez les employés de l'entreprise"
        actionLabel="Nouvel employé"
        onAction={handleCreateEmployee}
      />

      <EmployeeFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterRole={filterRole}
        onRoleFilterChange={setFilterRole}
      />

      <EmployeeTable
        employees={paginatedEmployees}
        onEdit={handleEditEmployee}
        onDelete={handleDeleteClick}
        onCreateClick={handleCreateEmployee}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        isEditing={!!editingEmployee}
      />

      <EmployeeDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setEmployeeToDelete(null);
        }}
        employee={employeeToDelete}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
