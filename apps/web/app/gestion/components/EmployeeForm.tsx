"use client";

import { Input, Select, Button } from "@nukleo/ui";
import type { EmployeeFormData } from "@nukleo/gestion/client";

interface EmployeeFormProps {
  formData: EmployeeFormData;
  onChange: (data: EmployeeFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export function EmployeeForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  isEditing = false,
}: EmployeeFormProps) {
  const handleChange = (field: keyof EmployeeFormData, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="employee-email" className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
          Email *
        </label>
        <Input
          id="employee-email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          required
          disabled={isEditing}
          aria-required="true"
          aria-invalid={formData.email && !formData.email.includes("@") ? "true" : "false"}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="employee-firstName" className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
            Prénom
          </label>
          <Input
            id="employee-firstName"
            value={formData.firstName || ""}
            onChange={(e) => handleChange("firstName", e.target.value)}
            aria-label="Prénom de l'employé"
          />
        </div>
        <div>
          <label htmlFor="employee-lastName" className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
            Nom de famille
          </label>
          <Input
            id="employee-lastName"
            value={formData.lastName || ""}
            onChange={(e) => handleChange("lastName", e.target.value)}
            aria-label="Nom de famille de l'employé"
          />
        </div>
      </div>
      <div>
        <label htmlFor="employee-name" className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
          Nom complet (si prénom/nom non renseignés)
        </label>
        <Input
          id="employee-name"
          value={formData.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          aria-label="Nom complet de l'employé"
        />
      </div>
      <div>
        <label htmlFor="employee-linkedin" className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
          LinkedIn (URL)
        </label>
        <Input
          id="employee-linkedin"
          type="url"
          value={formData.linkedin || ""}
          onChange={(e) => handleChange("linkedin", e.target.value)}
          placeholder="https://linkedin.com/in/..."
          aria-label="URL du profil LinkedIn"
        />
      </div>
      <div>
        <label htmlFor="employee-department" className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
          Département
        </label>
        <Input
          id="employee-department"
          value={formData.department || ""}
          onChange={(e) => handleChange("department", e.target.value)}
          placeholder="Ex: Commercial, Technique, RH..."
          aria-label="Département de l'employé"
        />
      </div>
      <div>
        <label htmlFor="employee-title" className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
          Titre/Poste
        </label>
        <Input
          id="employee-title"
          value={formData.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Ex: Développeur Senior, Chef de projet..."
          aria-label="Titre ou poste de l'employé"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="employee-birthday" className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
            Anniversaire
          </label>
          <Input
            id="employee-birthday"
            type="date"
            value={formData.birthday || ""}
            onChange={(e) => handleChange("birthday", e.target.value)}
            aria-label="Date d'anniversaire de l'employé"
          />
        </div>
        <div>
          <label htmlFor="employee-hireDate" className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
            Date d'embauche
          </label>
          <Input
            id="employee-hireDate"
            type="date"
            value={formData.hireDate || ""}
            onChange={(e) => handleChange("hireDate", e.target.value)}
            aria-label="Date d'embauche de l'employé"
          />
        </div>
      </div>
      <div>
        <label htmlFor="employee-role" className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
          Rôle *
        </label>
        <Select
          id="employee-role"
          value={formData.role}
          onChange={(e) => handleChange("role", e.target.value)}
          options={[
            { value: "USER", label: "Utilisateur" },
            { value: "MANAGER", label: "Manager" },
            { value: "ADMIN", label: "Administrateur" },
          ]}
          aria-required="true"
          aria-label="Rôle de l'employé"
        />
      </div>
      <div>
        <label htmlFor="employee-image" className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
          Photo (URL)
        </label>
        <Input
          id="employee-image"
          type="url"
          value={formData.image || ""}
          onChange={(e) => handleChange("image", e.target.value)}
          placeholder="https://..."
          aria-label="URL de la photo de l'employé"
        />
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" variant="primary">
          {isEditing ? "Modifier" : "Créer"}
        </Button>
      </div>
    </form>
  );
}

