"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Modal,
  Button,
  Input,
  Textarea,
  Select,
  type SelectOption,
} from "@nukleo/ui";
import {
  opportunitySchema,
  type OpportunityFormData,
} from "../schemas/opportunity";

export interface OpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OpportunityFormData) => void;
  initialData?: OpportunityFormData;
  companies?: Array<{ id: string; name: string }>;
  contacts?: Array<{ id: string; firstName: string; lastName: string }>;
}

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
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<OpportunityFormData>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      value: undefined,
      stage: "NEW",
      probability: undefined,
      expectedCloseDate: undefined,
      companyId: undefined,
      contactId: undefined,
    },
  });

  React.useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        title: "",
        description: "",
        value: undefined,
        stage: "NEW",
        probability: undefined,
        expectedCloseDate: undefined,
        companyId: undefined,
        contactId: undefined,
      });
    }
  }, [initialData, isOpen, reset]);

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

  const onFormSubmit = async (data: OpportunityFormData) => {
    await onSubmit(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Modifier l'opportunité" : "Nouvelle opportunité"}
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <Input
          label="Titre"
          {...register("title")}
          error={errors.title?.message}
          required
        />

        <Textarea
          label="Description"
          {...register("description")}
          error={errors.description?.message}
          rows={4}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Valeur (€)"
            type="number"
            step="0.01"
            {...register("value", { valueAsNumber: true })}
            error={errors.value?.message}
          />

          <Input
            label="Probabilité (%)"
            type="number"
            min="0"
            max="100"
            {...register("probability", { valueAsNumber: true })}
            error={errors.probability?.message}
          />
        </div>

        <Controller
          name="stage"
          control={control}
          render={({ field }) => (
            <Select
              label="Étape"
              options={stageOptions}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              error={errors.stage?.message}
              required
            />
          )}
        />

        <Input
          label="Date de clôture prévue"
          type="date"
          {...register("expectedCloseDate")}
          error={errors.expectedCloseDate?.message}
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

        <Controller
          name="contactId"
          control={control}
          render={({ field }) => (
            <Select
              label="Contact"
              options={contactOptions}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value || undefined)}
              error={errors.contactId?.message}
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
