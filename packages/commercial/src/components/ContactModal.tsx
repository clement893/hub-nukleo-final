"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Button, Input, Select, type SelectOption } from "@nukleo/ui";
import { contactSchema, type ContactFormData } from "../schemas/contact";

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
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: initialData || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      position: "",
      companyId: undefined,
    },
  });

  React.useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        position: "",
        companyId: undefined,
      });
    }
  }, [initialData, isOpen, reset]);

  const companyOptions: SelectOption[] = [
    { value: "", label: "Sélectionner une entreprise" },
    ...companies.map((c) => ({ value: c.id, label: c.name })),
  ];

  const onFormSubmit = async (data: ContactFormData) => {
    await onSubmit(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Modifier le contact" : "Nouveau contact"}
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Prénom"
            {...register("firstName")}
            error={errors.firstName?.message}
            required
          />

          <Input
            label="Nom"
            {...register("lastName")}
            error={errors.lastName?.message}
            required
          />
        </div>

        <Input
          label="Email"
          type="email"
          {...register("email")}
          error={errors.email?.message}
        />

        <Input
          label="Téléphone"
          type="tel"
          {...register("phone")}
          error={errors.phone?.message}
        />

        <Input
          label="Poste"
          {...register("position")}
          error={errors.position?.message}
        />

        <Controller
          name="companyId"
          control={control}
          render={({ field }) => (
            <Select
              label="Entreprise"
              options={companyOptions}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value || undefined)}
              error={errors.companyId?.message}
            />
          )}
        />

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
