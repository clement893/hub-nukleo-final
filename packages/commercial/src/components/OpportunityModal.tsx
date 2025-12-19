"use client";

import * as React from "react";
import {
  Modal,
  Button,
  Input,
  Textarea,
  Select,
  type SelectOption,
} from "@nukleo/ui";
import type { OpportunityStage } from "@nukleo/db";

export interface OpportunityFormData {
  title: string;
  description?: string;
  value?: number;
  stage: OpportunityStage;
  probability?: number;
  expectedCloseDate?: string;
  companyId?: string;
  contactId?: string;
}

export interface OpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OpportunityFormData) => void;
  initialData?: OpportunityFormData;
  companies?: Array<{ id: string; name: string }>;
  contacts?: Array<{ id: string; firstName: string; lastName: string }>;
}

const stages: OpportunityStage[] = [
  "NEW",
  "QUALIFIED",
  "PROPOSAL",
  "NEGOTIATION",
  "WON",
  "LOST",
];

const stageOptions: SelectOption[] = [
  { value: "NEW", label: "Nouvelle" },
  { value: "QUALIFIED", label: "Qualifiée" },
  { value: "PROPOSAL", label: "Proposition" },
  { value: "NEGOTIATION", label: "Négociation" },
  { value: "WON", label: "Gagnée" },
  { value: "LOST", label: "Perdue" },
];

export function OpportunityModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  companies = [],
  contacts = [],
}: OpportunityModalProps) {
  const [formData, setFormData] = React.useState<OpportunityFormData>({
    title: "",
    description: "",
    value: undefined,
    stage: "NEW",
    probability: 0,
    expectedCloseDate: undefined,
    companyId: undefined,
    contactId: undefined,
    ...initialData,
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: "",
        description: "",
        value: undefined,
        stage: "NEW",
        probability: 0,
        expectedCloseDate: undefined,
        companyId: undefined,
        contactId: undefined,
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

  const contactOptions: SelectOption[] = [
    { value: "", label: "Sélectionner un contact" },
    ...contacts.map((c) => ({
      value: c.id,
      label: `${c.firstName} ${c.lastName}`,
    })),
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nouvelle opportunité">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Titre"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          required
        />

        <Textarea
          label="Description"
          value={formData.description || ""}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={4}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Valeur (€)"
            type="number"
            value={formData.value || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                value: e.target.value ? parseFloat(e.target.value) : undefined,
              })
            }
          />

          <Input
            label="Probabilité (%)"
            type="number"
            min="0"
            max="100"
            value={formData.probability || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                probability: e.target.value
                  ? parseInt(e.target.value, 10)
                  : undefined,
              })
            }
          />
        </div>

        <Select
          label="Étape"
          options={stageOptions}
          value={formData.stage}
          onChange={(value) =>
            setFormData({ ...formData, stage: value as OpportunityStage })
          }
          required
        />

        <Input
          label="Date de clôture prévue"
          type="date"
          value={
            formData.expectedCloseDate
              ? new Date(formData.expectedCloseDate).toISOString().split("T")[0]
              : ""
          }
          onChange={(e) =>
            setFormData({ ...formData, expectedCloseDate: e.target.value })
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

        <Select
          label="Contact"
          options={contactOptions}
          value={formData.contactId || ""}
          onChange={(value) =>
            setFormData({
              ...formData,
              contactId: value || undefined,
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

