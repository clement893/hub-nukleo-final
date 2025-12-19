"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
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
  updateProjectSchema,
  type UpdateProjectData,
} from "@nukleo/commercial";
import { getProjectAction, updateProjectAction } from "../../actions";
import { useToast } from "@/lib/toast";

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProjectData>({
    resolver: zodResolver(updateProjectSchema),
  });

  React.useEffect(() => {
    async function loadProject() {
      try {
        const result = await getProjectAction(projectId);
        if (result.success && result.data) {
          const project = result.data;
          reset({
            id: project.id,
            name: project.name,
            description: project.description || "",
            status: project.status as any,
            startDate: project.startDate ? new Date(project.startDate) : null,
            endDate: project.endDate ? new Date(project.endDate) : null,
            budget: project.budget ? Number(project.budget) : null,
            companyId: project.companyId ?? undefined,
          });
        } else {
          addToast({
            variant: "error",
            title: "Erreur",
            description: result.error || "Impossible de charger le projet",
          });
          router.push("/projects");
        }
      } catch (error) {
        console.error("Error loading project:", error);
        addToast({
          variant: "error",
          title: "Erreur",
          description: "Une erreur est survenue lors du chargement",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadProject();
  }, [projectId, router, addToast, reset]);

  const onSubmit = async (data: UpdateProjectData) => {
    setIsSubmitting(true);
    try {
      const result = await updateProjectAction(projectId, data);
      if (result.success && result.data) {
        addToast({
          variant: "success",
          title: "Succès",
          description: "Le projet a été mis à jour avec succès",
        });
        router.push(`/projects/${projectId}`);
      } else {
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Impossible de mettre à jour le projet",
        });
      }
    } catch (error) {
      console.error("Error updating project:", error);
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
          <h1 className="text-3xl font-bold text-gray-900">Modifier le projet</h1>
          <p className="text-gray-600 mt-2">Modifiez les informations du projet</p>
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
          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}

