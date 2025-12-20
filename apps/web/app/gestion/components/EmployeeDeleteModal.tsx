"use client";

import { Modal, Button } from "@nukleo/ui";
import type { Employee } from "./EmployeeTable";

interface EmployeeDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onConfirm: () => void;
}

export function EmployeeDeleteModal({
  isOpen,
  onClose,
  employee,
  onConfirm,
}: EmployeeDeleteModalProps) {
  if (!employee) return null;

  const getEmployeeName = () => {
    if (employee.firstName && employee.lastName) {
      return `${employee.firstName} ${employee.lastName}`;
    }
    return employee.name || employee.email;
  };

  const employeeName = getEmployeeName();

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Supprimer l'employé"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      <p 
        id="delete-modal-description"
        className="mb-4 text-gray-900 dark:text-white"
      >
        Êtes-vous sûr de vouloir supprimer l'employé{" "}
        <strong className="text-gray-900 dark:text-white">{employeeName}</strong> ?
        Cette action est irréversible.
      </p>
      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={onClose}
          aria-label="Annuler la suppression"
        >
          Annuler
        </Button>
        <Button 
          variant="danger" 
          onClick={onConfirm}
          aria-label={`Confirmer la suppression de ${employeeName}`}
        >
          Supprimer
        </Button>
      </div>
    </Modal>
  );
}

