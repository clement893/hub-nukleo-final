"use client";

import * as React from "react";
import { Modal, Button, Input, Select, type SelectOption } from "@nukleo/ui";

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  position?: string;
  companyId?: string;
}

export interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContactFormData) => void;
  initialData?: ContactFormData;
  companies?: Array<{ id: string; name: string }>;
}

export function ContactModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  companies = [],
}: ContactModalProps) {
  const [formData, setFormData] = React.useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    companyId: undefined,
    ...initialData,
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        position: "",
        companyId: undefined,
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const companyOptions: SelectOption[] = [
    { value: "", label: "Sélectionner une entreprise" },
    ...companies.map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Modifier le contact" : "Nouveau contact"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Prénom"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            required
          />

          <Input
            label="Nom"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            required
          />
        </div>

        <Input
          label="Email"
          type="email"
          value={formData.email || ""}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />

        <Input
          label="Téléphone"
          type="tel"
          value={formData.phone || ""}
          onChange={(e) =>
            setFormData({ ...formData, phone: e.target.value })
          }
        />

        <Input
          label="Poste"
          value={formData.position || ""}
          onChange={(e) =>
            setFormData({ ...formData, position: e.target.value })
          }
        />

        <Select
          label="Entreprise"
          options={companyOptions}
          value={formData.companyId || ""}
          onChange={(value) =>
            setFormData({
              ...formData,
              companyId: value || undefined,
            })
          }
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" variant="primary">
            {initialData ? "Modifier" : "Créer"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

