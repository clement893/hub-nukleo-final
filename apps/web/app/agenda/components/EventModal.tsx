"use client";

import * as React from "react";
import { Button, Input, Select, Textarea } from "@nukleo/ui";
import { format } from "date-fns";

// Icon as SVG component
const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  opportunities?: Array<{ id: string; title: string }>;
  projects?: Array<{ id: string; name: string }>;
}

const EVENT_TYPES = [
  { value: "MEETING", label: "Réunion" },
  { value: "CALL", label: "Appel" },
  { value: "DEADLINE", label: "Date limite" },
  { value: "REMINDER", label: "Rappel" },
  { value: "TASK_DUE", label: "Tâche à faire" },
  { value: "PERSONAL", label: "Personnel" },
  { value: "OTHER", label: "Autre" },
];

const COLORS = [
  { value: "#6B5DD3", label: "Violet (Défaut)" },
  { value: "#EF4444", label: "Rouge" },
  { value: "#F59E0B", label: "Orange" },
  { value: "#10B981", label: "Vert" },
  { value: "#3B82F6", label: "Bleu" },
  { value: "#8B5CF6", label: "Pourpre" },
  { value: "#EC4899", label: "Rose" },
];

export function EventModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  opportunities = [],
  projects = [],
}: EventModalProps) {
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    allDay: false,
    type: "MEETING",
    location: "",
    notes: "",
    color: "#6B5DD3",
    opportunityId: "",
    projectId: "",
    contactId: "",
    companyId: "",
    participantIds: [] as string[],
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (initialData) {
      const startDate = new Date(initialData.startDate);
      const endDate = new Date(initialData.endDate);

      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        startDate: format(startDate, "yyyy-MM-dd"),
        startTime: format(startDate, "HH:mm"),
        endDate: format(endDate, "yyyy-MM-dd"),
        endTime: format(endDate, "HH:mm"),
        allDay: initialData.allDay || false,
        type: initialData.type || "MEETING",
        location: initialData.location || "",
        notes: initialData.notes || "",
        color: initialData.color || "#6B5DD3",
        opportunityId: initialData.opportunityId || "",
        projectId: initialData.projectId || "",
        contactId: initialData.contactId || "",
        companyId: initialData.companyId || "",
        participantIds: initialData.participants?.map((p: any) => p.id) || [],
      });
    } else {
      // Reset form for new event
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

      setFormData({
        title: "",
        description: "",
        startDate: format(now, "yyyy-MM-dd"),
        startTime: format(now, "HH:mm"),
        endDate: format(oneHourLater, "yyyy-MM-dd"),
        endTime: format(oneHourLater, "HH:mm"),
        allDay: false,
        type: "MEETING",
        location: "",
        notes: "",
        color: "#6B5DD3",
        opportunityId: "",
        projectId: "",
        contactId: "",
        companyId: "",
        participantIds: [],
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const startDateTime = formData.allDay
        ? new Date(formData.startDate)
        : new Date(`${formData.startDate}T${formData.startTime}`);

      const endDateTime = formData.allDay
        ? new Date(formData.endDate)
        : new Date(`${formData.endDate}T${formData.endTime}`);

      await onSubmit({
        ...formData,
        startDate: startDateTime,
        endDate: endDateTime,
        opportunityId: formData.opportunityId || undefined,
        projectId: formData.projectId || undefined,
        contactId: formData.contactId || undefined,
        companyId: formData.companyId || undefined,
      });

      onClose();
    } catch (error) {
      console.error("Error submitting event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {initialData ? "Modifier l'événement" : "Nouvel événement"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre *</label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              placeholder="Titre de l'événement"
            />
          </div>

          {/* Type and Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <Select
                id="type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                options={EVENT_TYPES}
              />
            </div>
            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Couleur</label>
              <Select
                id="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                options={COLORS}
              />
            </div>
          </div>

          {/* All Day */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="allDay"
              checked={formData.allDay}
              onChange={(e) =>
                setFormData({ ...formData, allDay: e.target.checked })
              }
              className="rounded border-gray-300"
            />
            <label htmlFor="allDay" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Toute la journée
            </label>
          </div>

          {/* Start Date/Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date de début *</label>
              <Input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                required
              />
            </div>
            {!formData.allDay && (
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Heure de début</label>
                <Input
                  type="time"
                  id="startTime"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                />
              </div>
            )}
          </div>

          {/* End Date/Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date de fin *</label>
              <Input
                type="date"
                id="endDate"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                required
              />
            </div>
            {!formData.allDay && (
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Heure de fin</label>
                <Input
                  type="time"
                  id="endTime"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              placeholder="Description de l'événement"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lieu</label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="Lieu de l'événement"
            />
          </div>

          {/* Relations */}
          <div className="grid grid-cols-2 gap-4">
            {opportunities.length > 0 && (
              <div>
                <label htmlFor="opportunityId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Opportunité</label>
                <Select
                  id="opportunityId"
                  value={formData.opportunityId}
                  onChange={(e) =>
                    setFormData({ ...formData, opportunityId: e.target.value })
                  }
                  options={[
                    { value: "", label: "Aucune" },
                    ...opportunities.map((opp) => ({
                      value: opp.id,
                      label: opp.title,
                    })),
                  ]}
                />
              </div>
            )}

            {projects.length > 0 && (
              <div>
                <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Projet</label>
                <Select
                  id="projectId"
                  value={formData.projectId}
                  onChange={(e) =>
                    setFormData({ ...formData, projectId: e.target.value })
                  }
                  options={[
                    { value: "", label: "Aucun" },
                    ...projects.map((project) => ({
                      value: project.id,
                      label: project.name,
                    })),
                  ]}
                />
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={2}
              placeholder="Notes supplémentaires"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting
                ? "Enregistrement..."
                : initialData
                ? "Mettre à jour"
                : "Créer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
