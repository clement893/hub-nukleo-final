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
        <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
          Email *
        </label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          required
          disabled={isEditing}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
            Prénom
          </label>
          <Input
            value={formData.firstName || ""}
            onChange={(e) => handleChange("firstName", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
            Nom de famille
          </label>
          <Input
            value={formData.lastName || ""}
            onChange={(e) => handleChange("lastName", e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
          Nom complet (si prénom/nom non renseignés)
        </label>
        <Input
          value={formData.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
          LinkedIn (URL)
        </label>
        <Input
          type="url"
          value={formData.linkedin || ""}
          onChange={(e) => handleChange("linkedin", e.target.value)}
          placeholder="https://linkedin.com/in/..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
          Département
        </label>
        <Input
          value={formData.department || ""}
          onChange={(e) => handleChange("department", e.target.value)}
          placeholder="Ex: Commercial, Technique, RH..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
          Titre/Poste
        </label>
        <Input
          value={formData.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Ex: Développeur Senior, Chef de projet..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
            Anniversaire
          </label>
          <Input
            type="date"
            value={formData.birthday || ""}
            onChange={(e) => handleChange("birthday", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
            Date d'embauche
          </label>
          <Input
            type="date"
            value={formData.hireDate || ""}
            onChange={(e) => handleChange("hireDate", e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
          Rôle *
        </label>
        <Select
          value={formData.role}
          onChange={(e) => handleChange("role", e.target.value)}
          options={[
            { value: "USER", label: "Utilisateur" },
            { value: "MANAGER", label: "Manager" },
            { value: "ADMIN", label: "Administrateur" },
          ]}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
          Photo (URL)
        </label>
        <Input
          type="url"
          value={formData.image || ""}
          onChange={(e) => handleChange("image", e.target.value)}
          placeholder="https://..."
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

