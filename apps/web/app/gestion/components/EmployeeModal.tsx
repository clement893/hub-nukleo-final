"use client";

import { Modal } from "@nukleo/ui";
import { EmployeeForm } from "./EmployeeForm";
import type { EmployeeFormData } from "@nukleo/gestion/client";

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: EmployeeFormData;
  onChange: (data: EmployeeFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing?: boolean;
}

export function EmployeeModal({
  isOpen,
  onClose,
  formData,
  onChange,
  onSubmit,
  isEditing = false,
}: EmployeeModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Modifier l'employé" : "Nouvel employé"}
    >
      <EmployeeForm
        formData={formData}
        onChange={onChange}
        onSubmit={onSubmit}
        onCancel={onClose}
        isEditing={isEditing}
      />
    </Modal>
  );
}

