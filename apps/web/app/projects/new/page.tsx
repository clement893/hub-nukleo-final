"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
  projectSchema,
  type ProjectFormData,
} from "@nukleo/commercial";
import { createProjectAction } from "../actions";
import { useToast } from "@/lib/toast";

export default function NewProjectPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "PLANNING",
    },
  });

  React.useEffect(() => {
    async function loadCompanies() {
      try {
        // We'll need to create getAllCompaniesAction or import from commercial
        // For now, we'll skip this and make companyId optional
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading companies:", error);
        setIsLoading(false);
      }
    }
    loadCompanies();
  }, []);

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      const result = await createProjectAction(data);
      if (result.success && result.data) {
        addToast({
          variant: "success",
          title: "Succès",
          description: "Le projet a été créé avec succès",
        });
        router.push(`/projects/${result.data.id}`);
      } else {
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Impossible de créer le projet",
        });
      }
    } catch (error) {
      console.error("Error creating project:", error);
      addToast({
        variant: "error",
        title: "Erreur",
        description: "Une erreur est survenue lors de la création",
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
          <h1 className="text-3xl font-bold text-gray-900">Nouveau projet</h1>
          <p className="text-gray-600 mt-2">Créez un nouveau projet</p>
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
            {isSubmitting ? "Création..." : "Créer le projet"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du projet *
            </label>
            <Input
              {...register("name")}
              placeholder="Nom du projet"
              error={errors.name?.message}
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
              placeholder="Description du projet"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <Select
                {...register("status")}
                options={[
                  { value: "PLANNING", label: "Planification" },
                  { value: "IN_PROGRESS", label: "En cours" },
                  { value: "ON_HOLD", label: "En attente" },
                  { value: "COMPLETED", label: "Terminé" },
                  { value: "CANCELLED", label: "Annulé" },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget
              </label>
              <Input
                type="number"
                step="0.01"
                {...register("budget", { valueAsNumber: true })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de début
              </label>
              <Input
                type="date"
                {...register("startDate", { valueAsDate: true })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin
              </label>
              <Input
                type="date"
                {...register("endDate", { valueAsDate: true })}
              />
            </div>
          </div>
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
          {isSubmitting ? "Création..." : "Créer le projet"}
        </Button>
      </div>
    </form>
  );
}

