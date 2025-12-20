"use client";

import * as React from "react";
import { useForm, useFieldArray, type Control, type UseFormRegister, type FieldErrors, type UseFormWatch, type UseFormSetValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Select,
  Textarea,
  DatePicker,
  Loader,
} from "@nukleo/ui";
import {
  proposalSchema,
  updateProposalSchema,
  type ProposalFormData,
  type ProposalItemFormData,
} from "@nukleo/commercial";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "./GlassCard";

type Opportunity = {
  id: string;
  title: string;
  company: { id: string; name: string } | null;
};

interface ProposalFormProps {
  initialData?: Partial<ProposalFormData>;
  onSubmit: (data: ProposalFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  opportunities: Opportunity[];
  isEditing?: boolean;
}

export function ProposalForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  opportunities,
  isEditing = false,
}: ProposalFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const schema = isEditing ? updateProposalSchema.omit({ id: true }) : proposalSchema;

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProposalFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      title: "",
      description: "",
      status: "DRAFT",
      sections: [],
      processes: [],
    },
  });

  const watchedSections = watch("sections");

  const {
    fields: sections,
    append: appendSection,
    remove: removeSection,
    move: moveSection,
  } = useFieldArray({
    control,
    name: "sections",
  });

  const {
    fields: processes,
    append: appendProcess,
    remove: removeProcess,
    move: moveProcess,
  } = useFieldArray({
    control,
    name: "processes",
  });

  // Calculate total amount
  React.useEffect(() => {
    const total = watchedSections.reduce((sum, section) => {
      return (
        sum +
        (section.items || []).reduce((sectionSum: number, item: ProposalItemFormData) => {
          if (item.totalPrice) {
            return sectionSum + Number(item.totalPrice);
          }
          if (item.unitPrice && item.quantity) {
            return sectionSum + Number(item.unitPrice) * Number(item.quantity);
          }
          return sectionSum;
        }, 0)
      );
    }, 0);
    setValue("totalAmount", total > 0 ? total : null);
  }, [watchedSections, setValue]);

  const handleFormSubmit = async (data: ProposalFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Une erreur est survenue lors de l'enregistrement";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" role="status" aria-live="polite">
        <Loader size="lg" />
        <span className="sr-only">Chargement du formulaire...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {submitError && (
        <div className="glass card-shadow p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{submitError}</p>
        </div>
      )}

      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle>Informations générales</GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent className="space-y-4">
          <div>
            <Select
              {...register("opportunityId")}
              error={errors.opportunityId?.message}
              placeholder="Sélectionner une opportunité"
              options={opportunities.map((opp) => ({
                value: opp.id,
                label: `${opp.title}${opp.company ? ` - ${opp.company.name}` : ""}`,
              }))}
              aria-label="Opportunité"
              aria-required="true"
            />
          </div>

          <div>
            <Input
              {...register("title")}
              placeholder="Titre de la soumission"
              error={errors.title?.message}
              label="Titre"
              required
              aria-label="Titre de la soumission"
              aria-required="true"
            />
          </div>

          <div>
            <Textarea
              {...register("description")}
              placeholder="Description de la soumission"
              error={errors.description?.message}
              label="Description"
              rows={4}
              aria-label="Description de la soumission"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select
                {...register("status")}
                options={[
                  { value: "DRAFT", label: "Brouillon" },
                  { value: "SUBMITTED", label: "Soumis" },
                  { value: "ACCEPTED", label: "Accepté" },
                  { value: "REJECTED", label: "Rejeté" },
                  { value: "REVISED", label: "Révisé" },
                ]}
                aria-label="Statut"
              />
            </div>

            <div>
              <Input
                type="number"
                step="0.01"
                {...register("totalAmount", { valueAsNumber: true })}
                placeholder="Calculé automatiquement"
                readOnly
                label="Montant total"
                aria-label="Montant total (calculé automatiquement)"
              />
            </div>
          </div>

          <div>
            <DatePicker
              {...register("validUntil", { valueAsDate: true })}
              label="Valide jusqu'au"
              aria-label="Date de validité"
            />
          </div>
        </GlassCardContent>
      </GlassCard>

      <GlassCard>
        <GlassCardHeader className="flex justify-between items-center">
          <GlassCardTitle>Sections et livrables</GlassCardTitle>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              appendSection({
                title: "",
                description: "",
                order: sections.length,
                items: [],
              })
            }
            aria-label="Ajouter une section"
          >
            + Ajouter une section
          </Button>
        </GlassCardHeader>
        <GlassCardContent className="space-y-4">
          {sections.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Aucune section. Cliquez sur "Ajouter une section" pour commencer.
            </p>
          ) : (
            sections.map((section, sectionIndex) => (
              <SectionForm
                key={section.id}
                sectionIndex={sectionIndex}
                register={register}
                control={control}
                errors={errors}
                watch={watch}
                onRemove={() => removeSection(sectionIndex)}
                onMoveUp={sectionIndex > 0 ? () => moveSection(sectionIndex, sectionIndex - 1) : undefined}
                onMoveDown={sectionIndex < sections.length - 1 ? () => moveSection(sectionIndex, sectionIndex + 1) : undefined}
              />
            ))
          )}
        </GlassCardContent>
      </GlassCard>

      <GlassCard>
        <GlassCardHeader className="flex justify-between items-center">
          <GlassCardTitle>Processus de réalisation</GlassCardTitle>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              appendProcess({
                title: "",
                description: "",
                order: processes.length,
                estimatedDuration: null,
              })
            }
            aria-label="Ajouter un processus"
          >
            + Ajouter un processus
          </Button>
        </GlassCardHeader>
        <GlassCardContent className="space-y-4">
          {processes.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Aucun processus. Cliquez sur "Ajouter un processus" pour commencer.
            </p>
          ) : (
            processes.map((process, processIndex) => (
              <ProcessForm
                key={process.id}
                processIndex={processIndex}
                register={register}
                errors={errors}
                onRemove={() => removeProcess(processIndex)}
                onMoveUp={processIndex > 0 ? () => moveProcess(processIndex, processIndex - 1) : undefined}
                onMoveDown={processIndex < processes.length - 1 ? () => moveProcess(processIndex, processIndex + 1) : undefined}
              />
            ))
          )}
        </GlassCardContent>
      </GlassCard>

      <div className="flex justify-end gap-2 pb-8">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          aria-label="Annuler"
        >
          Annuler
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting} aria-label={isEditing ? "Enregistrer les modifications" : "Créer la soumission"}>
          {isSubmitting ? "Enregistrement..." : isEditing ? "Enregistrer" : "Créer la soumission"}
        </Button>
      </div>
    </form>
  );
}

interface SectionFormProps {
  sectionIndex: number;
  register: UseFormRegister<ProposalFormData>;
  control: Control<ProposalFormData>;
  errors: FieldErrors<ProposalFormData>;
  watch: UseFormWatch<ProposalFormData>;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

function SectionForm({
  sectionIndex,
  register,
  control,
  errors,
  watch,
  onRemove,
  onMoveUp,
  onMoveDown,
}: SectionFormProps) {
  const {
    fields: items,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.items`,
  });

  return (
    <Card className="glass card-shadow border-2 border-gray-200 dark:border-gray-700">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-lg text-gray-900 dark:text-white">Section {sectionIndex + 1}</CardTitle>
        <div className="flex gap-2">
          {onMoveUp && (
            <Button type="button" variant="ghost" size="sm" onClick={onMoveUp} aria-label="Déplacer vers le haut">
              ↑
            </Button>
          )}
          {onMoveDown && (
            <Button type="button" variant="ghost" size="sm" onClick={onMoveDown} aria-label="Déplacer vers le bas">
              ↓
            </Button>
          )}
          <Button type="button" variant="ghost" size="sm" onClick={onRemove} className="text-red-600 dark:text-red-400" aria-label="Supprimer la section">
            Supprimer
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input
            {...register(`sections.${sectionIndex}.title`)}
            placeholder="Titre de la section"
            error={errors.sections?.[sectionIndex]?.title?.message}
            label="Titre de la section"
            required
            aria-label="Titre de la section"
            aria-required="true"
          />
        </div>

        <div>
          <Textarea
            {...register(`sections.${sectionIndex}.description`)}
            rows={2}
            placeholder="Description de la section"
            error={errors.sections?.[sectionIndex]?.description?.message}
            label="Description"
            aria-label="Description de la section"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Livrables</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendItem({
                  title: "",
                  description: "",
                  type: "DELIVERABLE",
                  quantity: 1,
                  unitPrice: null,
                  totalPrice: null,
                  order: items.length,
                })
              }
              aria-label="Ajouter un livrable"
            >
              + Ajouter un livrable
            </Button>
          </div>

          {items.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm py-4 text-center">
              Aucun livrable. Cliquez sur "Ajouter un livrable" pour commencer.
            </p>
          ) : (
            <div className="space-y-3">
              {items.map((item, itemIndex) => (
                <ItemForm
                  key={item.id}
                  sectionIndex={sectionIndex}
                  itemIndex={itemIndex}
                  register={register}
                  errors={errors}
                  watch={watch}
                  onRemove={() => removeItem(itemIndex)}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface ItemFormProps {
  sectionIndex: number;
  itemIndex: number;
  register: UseFormRegister<ProposalFormData>;
  errors: FieldErrors<ProposalFormData>;
  watch: UseFormWatch<ProposalFormData>;
  onRemove: () => void;
}

function ItemForm({ sectionIndex, itemIndex, register, errors, watch, onRemove }: ItemFormProps) {
  const quantity = watch(`sections.${sectionIndex}.items.${itemIndex}.quantity`) || 1;
  const unitPrice = watch(`sections.${sectionIndex}.items.${itemIndex}.unitPrice`) || 0;
  const [calculatedTotal, setCalculatedTotal] = React.useState(0);

  React.useEffect(() => {
    if (quantity && unitPrice) {
      setCalculatedTotal(Number(quantity) * Number(unitPrice));
    } else {
      setCalculatedTotal(0);
    }
  }, [quantity, unitPrice]);

  return (
    <div className="glass card-shadow border border-gray-200 dark:border-gray-700 rounded-md p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm text-gray-900 dark:text-white">Livrable {itemIndex + 1}</h4>
        <Button type="button" variant="ghost" size="sm" onClick={onRemove} className="text-red-600 dark:text-red-400" aria-label="Supprimer le livrable">
          Supprimer
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Input
            {...register(`sections.${sectionIndex}.items.${itemIndex}.title`)}
            placeholder="Titre du livrable"
            error={errors.sections?.[sectionIndex]?.items?.[itemIndex]?.title?.message}
            label="Titre"
            required
            aria-label="Titre du livrable"
            aria-required="true"
          />
        </div>

        <div>
          <Select
            {...register(`sections.${sectionIndex}.items.${itemIndex}.type`)}
            options={[
              { value: "DELIVERABLE", label: "Livrable" },
              { value: "SERVICE", label: "Service" },
              { value: "PRODUCT", label: "Produit" },
              { value: "OTHER", label: "Autre" },
            ]}
            aria-label="Type de livrable"
          />
        </div>
      </div>

      <div>
        <Textarea
          {...register(`sections.${sectionIndex}.items.${itemIndex}.description`)}
          rows={2}
          placeholder="Description du livrable"
          error={errors.sections?.[sectionIndex]?.items?.[itemIndex]?.description?.message}
          label="Description"
          aria-label="Description du livrable"
        />
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div>
          <Input
            type="number"
            {...register(`sections.${sectionIndex}.items.${itemIndex}.quantity`, {
              valueAsNumber: true,
            })}
            placeholder="1"
            label="Quantité"
            aria-label="Quantité"
          />
        </div>

        <div>
          <Input
            type="number"
            step="0.01"
            {...register(`sections.${sectionIndex}.items.${itemIndex}.unitPrice`, {
              valueAsNumber: true,
            })}
            placeholder="0.00"
            label="Prix unitaire"
            aria-label="Prix unitaire"
          />
        </div>

        <div>
          <Input
            type="number"
            step="0.01"
            {...register(`sections.${sectionIndex}.items.${itemIndex}.totalPrice`, {
              valueAsNumber: true,
            })}
            placeholder={calculatedTotal > 0 ? calculatedTotal.toString() : "0.00"}
            label="Prix total"
            aria-label="Prix total"
          />
        </div>

        <div className="flex items-end">
          {calculatedTotal > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Calculé: {calculatedTotal.toFixed(2)} €
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface ProcessFormProps {
  processIndex: number;
  register: UseFormRegister<ProposalFormData>;
  errors: FieldErrors<ProposalFormData>;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

function ProcessForm({ processIndex, register, errors, onRemove, onMoveUp, onMoveDown }: ProcessFormProps) {
  return (
    <Card className="glass card-shadow border-2 border-gray-200 dark:border-gray-700">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-lg text-gray-900 dark:text-white">Processus {processIndex + 1}</CardTitle>
        <div className="flex gap-2">
          {onMoveUp && (
            <Button type="button" variant="ghost" size="sm" onClick={onMoveUp} aria-label="Déplacer vers le haut">
              ↑
            </Button>
          )}
          {onMoveDown && (
            <Button type="button" variant="ghost" size="sm" onClick={onMoveDown} aria-label="Déplacer vers le bas">
              ↓
            </Button>
          )}
          <Button type="button" variant="ghost" size="sm" onClick={onRemove} className="text-red-600 dark:text-red-400" aria-label="Supprimer le processus">
            Supprimer
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input
            {...register(`processes.${processIndex}.title`)}
            placeholder="Titre du processus"
            error={errors.processes?.[processIndex]?.title?.message}
            label="Titre du processus"
            required
            aria-label="Titre du processus"
            aria-required="true"
          />
        </div>

        <div>
          <Textarea
            {...register(`processes.${processIndex}.description`)}
            rows={3}
            placeholder="Description du processus"
            error={errors.processes?.[processIndex]?.description?.message}
            label="Description"
            aria-label="Description du processus"
          />
        </div>

        <div>
          <Input
            type="number"
            {...register(`processes.${processIndex}.estimatedDuration`, {
              valueAsNumber: true,
            })}
            placeholder="Nombre de jours"
            label="Durée estimée (en jours)"
            aria-label="Durée estimée en jours"
          />
        </div>
      </CardContent>
    </Card>
  );
}

