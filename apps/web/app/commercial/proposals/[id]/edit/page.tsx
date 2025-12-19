"use client";

"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Select,
} from "@nukleo/ui";
import {
  updateProposalSchema,
  type ProposalFormData,
  type ProposalItemFormData,
} from "@nukleo/commercial";
import { getProposalAction, updateProposalAction } from "../../actions";
import { useToast } from "@/lib/toast";
import { getAllOpportunities } from "@nukleo/commercial";

type Opportunity = {
  id: string;
  title: string;
  company: { id: string; name: string } | null;
};

export default function EditProposalPage() {
  const router = useRouter();
  const params = useParams();
  const proposalId = params.id as string;
  const { addToast } = useToast();
  const [opportunities, setOpportunities] = React.useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProposalFormData>({
    resolver: zodResolver(updateProposalSchema.omit({ id: true })),
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

  React.useEffect(() => {
    async function loadData() {
      try {
        const [proposalResult, opps] = await Promise.all([
          getProposalAction(proposalId),
          getAllOpportunities(),
        ]);

        if (proposalResult.success && proposalResult.data) {
          const proposal = proposalResult.data;
          reset({
            title: proposal.title,
            description: proposal.description || "",
            status: proposal.status,
            totalAmount: proposal.totalAmount ? Number(proposal.totalAmount) : null,
            validUntil: proposal.validUntil ? new Date(proposal.validUntil) : null,
            opportunityId: proposal.opportunityId,
            sections: proposal.sections.map((section) => ({
              id: section.id,
              title: section.title,
              description: section.description || "",
              order: section.order,
              items: section.items.map((item) => ({
                id: item.id,
                title: item.title,
                description: item.description || "",
                type: item.type,
                quantity: item.quantity || null,
                unitPrice: item.unitPrice ? Number(item.unitPrice) : null,
                totalPrice: item.totalPrice ? Number(item.totalPrice) : null,
                order: item.order,
              })),
            })),
            processes: proposal.processes.map((process) => ({
              id: process.id,
              title: process.title,
              description: process.description || "",
              order: process.order,
              estimatedDuration: process.estimatedDuration || null,
            })),
          });
        } else {
          addToast({
            variant: "error",
            title: "Erreur",
            description: proposalResult.error || "Impossible de charger la soumission",
          });
          router.push("/commercial/proposals");
        }

        setOpportunities(opps);
      } catch (error) {
        console.error("Error loading data:", error);
        addToast({
          variant: "error",
          title: "Erreur",
          description: "Une erreur est survenue lors du chargement",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [proposalId, router, addToast, reset]);

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

  const onSubmit = async (data: ProposalFormData) => {
    setIsSubmitting(true);
    try {
      const result = await updateProposalAction(proposalId, data);
      if (result.success && result.data) {
        addToast({
          variant: "success",
          title: "Succès",
          description: "La soumission a été mise à jour avec succès",
        });
        router.push(`/commercial/proposals/${proposalId}`);
      } else {
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Impossible de mettre à jour la soumission",
        });
      }
    } catch (error) {
      console.error("Error updating proposal:", error);
      addToast({
        variant: "error",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <p className="text-gray-500">Chargement...</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Modifier la soumission</h1>
          <p className="text-gray-600 mt-2">Modifiez les informations de la soumission</p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Annuler
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Select
              {...register("opportunityId")}
              error={errors.opportunityId?.message}
              placeholder="Sélectionner une opportunité"
              options={opportunities.map((opp) => ({
                value: opp.id,
                label: `${opp.title}${opp.company ? ` - ${opp.company.name}` : ""}`,
              }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre *
            </label>
            <Input
              {...register("title")}
              placeholder="Titre de la soumission"
              error={errors.title?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register("description")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Description de la soumission"
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
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Montant total
              </label>
              <Input
                type="number"
                step="0.01"
                {...register("totalAmount", { valueAsNumber: true })}
                placeholder="Calculé automatiquement"
                readOnly
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valide jusqu'au
            </label>
            <Input
              type="date"
              {...register("validUntil", { valueAsDate: true })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sections - Same as in new page */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Sections et livrables</CardTitle>
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
          >
            + Ajouter une section
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {sections.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
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
        </CardContent>
      </Card>

      {/* Processes - Same as in new page */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Processus de réalisation</CardTitle>
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
          >
            + Ajouter un processus
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {processes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
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
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2 pb-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Annuler
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}

// Reuse components from new page - we'll extract them to a shared file later
function SectionForm({
  sectionIndex,
  register,
  control,
  errors,
  watch,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  sectionIndex: number;
  register: any;
  control: any;
  errors: any;
  watch: any;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  const {
    fields: items,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.items`,
  });

  return (
    <Card className="border-2">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-lg">Section {sectionIndex + 1}</CardTitle>
        <div className="flex gap-2">
          {onMoveUp && (
            <Button type="button" variant="ghost" size="sm" onClick={onMoveUp}>
              ↑
            </Button>
          )}
          {onMoveDown && (
            <Button type="button" variant="ghost" size="sm" onClick={onMoveDown}>
              ↓
            </Button>
          )}
          <Button type="button" variant="ghost" size="sm" onClick={onRemove} className="text-red-600">
            Supprimer
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre de la section *
          </label>
          <Input
            {...register(`sections.${sectionIndex}.title`)}
            placeholder="Titre de la section"
            error={errors.sections?.[sectionIndex]?.title?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register(`sections.${sectionIndex}.description`)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            placeholder="Description de la section"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Livrables
            </label>
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
            >
              + Ajouter un livrable
            </Button>
          </div>

          {items.length === 0 ? (
            <p className="text-gray-500 text-sm py-4 text-center">
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

function ItemForm({
  sectionIndex,
  itemIndex,
  register,
  control,
  errors,
  onRemove,
  watch,
}: {
  sectionIndex: number;
  itemIndex: number;
  register: any;
  control: any;
  errors: any;
  onRemove: () => void;
  watch: any;
}) {
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
    <div className="border border-gray-200 rounded-md p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm">Livrable {itemIndex + 1}</h4>
        <Button type="button" variant="ghost" size="sm" onClick={onRemove} className="text-red-600">
          Supprimer
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Titre *
          </label>
          <Input
            {...register(`sections.${sectionIndex}.items.${itemIndex}.title`)}
            placeholder="Titre du livrable"
            error={errors.sections?.[sectionIndex]?.items?.[itemIndex]?.title?.message}
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
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          {...register(`sections.${sectionIndex}.items.${itemIndex}.description`)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          rows={2}
          placeholder="Description du livrable"
        />
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Quantité
          </label>
          <Input
            type="number"
            {...register(`sections.${sectionIndex}.items.${itemIndex}.quantity`, {
              valueAsNumber: true,
            })}
            placeholder="1"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Prix unitaire
          </label>
          <Input
            type="number"
            step="0.01"
            {...register(`sections.${sectionIndex}.items.${itemIndex}.unitPrice`, {
              valueAsNumber: true,
            })}
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Prix total
          </label>
          <Input
            type="number"
            step="0.01"
            {...register(`sections.${sectionIndex}.items.${itemIndex}.totalPrice`, {
              valueAsNumber: true,
            })}
            placeholder={calculatedTotal > 0 ? calculatedTotal.toString() : "0.00"}
          />
        </div>

        <div className="flex items-end">
          {calculatedTotal > 0 && (
            <p className="text-xs text-gray-500">
              Calculé: {calculatedTotal.toFixed(2)} €
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ProcessForm({
  processIndex,
  register,
  errors,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  processIndex: number;
  register: any;
  errors: any;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  return (
    <Card className="border-2">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-lg">Processus {processIndex + 1}</CardTitle>
        <div className="flex gap-2">
          {onMoveUp && (
            <Button type="button" variant="ghost" size="sm" onClick={onMoveUp}>
              ↑
            </Button>
          )}
          {onMoveDown && (
            <Button type="button" variant="ghost" size="sm" onClick={onMoveDown}>
              ↓
            </Button>
          )}
          <Button type="button" variant="ghost" size="sm" onClick={onRemove} className="text-red-600">
            Supprimer
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre du processus *
          </label>
          <Input
            {...register(`processes.${processIndex}.title`)}
            placeholder="Titre du processus"
            error={errors.processes?.[processIndex]?.title?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register(`processes.${processIndex}.description`)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Description du processus"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Durée estimée (en jours)
          </label>
          <Input
            type="number"
            {...register(`processes.${processIndex}.estimatedDuration`, {
              valueAsNumber: true,
            })}
            placeholder="Nombre de jours"
          />
        </div>
      </CardContent>
    </Card>
  );
}

