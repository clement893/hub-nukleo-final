"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
} from "@nukleo/ui";
import {
  timeEntrySchema,
  updateTimeEntrySchema,
  type TimeEntryFormData,
} from "@nukleo/commercial";
import {
  createTimeEntryAction,
  updateTimeEntryAction,
} from "@/app/projects/actions";
import { useToast } from "@/lib/toast";

type TimeEntry = {
  id: string;
  date: Date;
  hours: number;
  description: string | null;
  taskId: string;
};

type TimeEntryFormProps = {
  taskId: string;
  timeEntry?: TimeEntry;
  onSave: () => void;
  onCancel: () => void;
};

export function TimeEntryForm({
  taskId,
  timeEntry,
  onSave,
  onCancel,
}: TimeEntryFormProps) {
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TimeEntryFormData>({
    resolver: zodResolver(timeEntry ? updateTimeEntrySchema : timeEntrySchema),
    defaultValues: timeEntry
      ? {
          date: new Date(timeEntry.date),
          hours: Number(timeEntry.hours),
          description: timeEntry.description || "",
          taskId: timeEntry.taskId,
        }
      : {
          date: new Date(),
          hours: 0,
          description: "",
          taskId: taskId,
        },
  });

  const onSubmit = async (data: TimeEntryFormData) => {
    setIsSubmitting(true);
    try {
      const result = timeEntry
        ? await updateTimeEntryAction(timeEntry.id, data)
        : await createTimeEntryAction(data);

      if (result.success) {
        addToast({
          variant: "success",
          title: "Succès",
          description: timeEntry
            ? "La saisie de temps a été mise à jour avec succès"
            : "La saisie de temps a été créée avec succès",
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
      console.error("Error saving time entry:", error);
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
          Date *
        </label>
        <Input
          type="date"
          {...register("date", { valueAsDate: true })}
          error={errors.date?.message}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Heures *
        </label>
        <Input
          type="number"
          step="0.25"
          min="0"
          {...register("hours", { valueAsNumber: true })}
          placeholder="0.00"
          error={errors.hours?.message}
        />
        <p className="text-xs text-gray-500 mt-1">
          Utilisez 0.25 pour 15 minutes, 0.5 pour 30 minutes, etc.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          {...register("description")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Description du travail effectué"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : timeEntry ? "Modifier" : "Ajouter"}
        </Button>
      </div>
    </form>
  );
}

