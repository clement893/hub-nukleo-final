"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Button, Input, Textarea } from "@nukleo/ui";
import { companySchema, type CompanyFormData } from "../schemas/company";

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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: initialData || {
      name: "",
      industry: "",
      website: "",
      phone: "",
      address: "",
      city: "",
      country: "",
    },
  });

  React.useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        name: "",
        industry: "",
        website: "",
        phone: "",
        address: "",
        city: "",
        country: "",
      });
    }
  }, [initialData, isOpen, reset]);

  const onFormSubmit = async (data: CompanyFormData) => {
    await onSubmit(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Modifier l'entreprise" : "Nouvelle entreprise"}
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <Input
          label="Nom de l'entreprise"
          {...register("name")}
          error={errors.name?.message}
          required
        />

        <Input
          label="Industrie"
          {...register("industry")}
          error={errors.industry?.message}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Site web"
            type="url"
            {...register("website")}
            error={errors.website?.message}
            placeholder="https://example.com"
          />

          <Input
            label="Téléphone"
            type="tel"
            {...register("phone")}
            error={errors.phone?.message}
          />
        </div>

        <Textarea
          label="Adresse"
          {...register("address")}
          error={errors.address?.message}
          rows={2}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Ville"
            {...register("city")}
            error={errors.city?.message}
          />

          <Input
            label="Pays"
            {...register("country")}
            error={errors.country?.message}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : initialData ? "Modifier" : "Créer"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
