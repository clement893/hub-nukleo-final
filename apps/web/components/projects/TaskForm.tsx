"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  Select,
} from "@nukleo/ui";
import {
  taskSchema,
  updateTaskSchema,
  type TaskFormData,
} from "@nukleo/commercial";
import {
  createTaskAction,
  updateTaskAction,
} from "@/app/projects/actions";
import { useToast } from "@/lib/toast";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: Date | null;
  assigneeId: string | null;
};

type TaskFormProps = {
  projectId: string;
  task?: Task;
  onSave: () => void;
  onCancel: () => void;
};

export function TaskForm({ projectId, task, onSave, onCancel }: TaskFormProps) {
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(task ? updateTaskSchema : taskSchema),
    defaultValues: task
      ? {
          title: task.title,
          description: task.description || "",
          status: task.status as any,
          priority: task.priority as any,
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
          projectId: projectId,
          assigneeId: task.assigneeId || undefined,
        }
      : {
          title: "",
          description: "",
          status: "TODO",
          priority: "MEDIUM",
          projectId: projectId,
        },
  });

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      const result = task
        ? await updateTaskAction(task.id, data)
        : await createTaskAction(data);

      if (result.success) {
        addToast({
          variant: "success",
          title: "Succès",
          description: task
            ? "La tâche a été mise à jour avec succès"
            : "La tâche a été créée avec succès",
        });
        onSave();
      } else {
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Une erreur est survenue",
        });
      }
    } catch (error) {
      console.error("Error saving task:", error);
      addToast({
        variant: "error",
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Titre *
        </label>
        <Input
          {...register("title")}
          placeholder="Titre de la tâche"
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
          rows={3}
          placeholder="Description de la tâche"
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
              { value: "TODO", label: "À faire" },
              { value: "IN_PROGRESS", label: "En cours" },
              { value: "REVIEW", label: "En révision" },
              { value: "DONE", label: "Terminé" },
            ]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priorité
          </label>
          <Select
            {...register("priority")}
            options={[
              { value: "LOW", label: "Basse" },
              { value: "MEDIUM", label: "Moyenne" },
              { value: "HIGH", label: "Haute" },
              { value: "URGENT", label: "Urgente" },
            ]}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date d'échéance
        </label>
        <Input
          type="date"
          {...register("dueDate", { valueAsDate: true })}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : task ? "Modifier" : "Créer"}
        </Button>
      </div>
    </form>
  );
}

