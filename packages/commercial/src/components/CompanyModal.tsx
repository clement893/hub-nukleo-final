"use client";

import * as React from "react";
import { Modal, Button, Input, Textarea } from "@nukleo/ui";

export interface CompanyFormData {
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CompanyFormData) => void;
  initialData?: CompanyFormData;
}

export function CompanyModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: CompanyModalProps) {
  const [formData, setFormData] = React.useState<CompanyFormData>({
    name: "",
    industry: "",
    website: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    ...initialData,
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        industry: "",
        website: "",
        phone: "",
        address: "",
        city: "",
        country: "",
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Modifier l'entreprise" : "Nouvelle entreprise"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nom de l'entreprise"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <Input
          label="Industrie"
          value={formData.industry || ""}
          onChange={(e) =>
            setFormData({ ...formData, industry: e.target.value })
          }
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Site web"
            type="url"
            value={formData.website || ""}
            onChange={(e) =>
              setFormData({ ...formData, website: e.target.value })
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
        </div>

        <Textarea
          label="Adresse"
          value={formData.address || ""}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          rows={2}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Ville"
            value={formData.city || ""}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />

          <Input
            label="Pays"
            value={formData.country || ""}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
          />
        </div>

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

