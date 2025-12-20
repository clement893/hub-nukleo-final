"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Badge,
  Modal,
  Input,
  Select,
} from "@nukleo/ui";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/GlassCard";
import {
  getProjectAction,
  getTasksAction,
  getMilestonesAction,
  createMilestoneAction,
  updateMilestoneAction,
  deleteMilestoneAction,
  getProjectNotesAction,
  createProjectNoteAction,
  deleteProjectNoteAction,
  getActivityLogsAction,
} from "../actions";
import { useToast } from "@/lib/toast";
import { TimeEntryForm } from "@/components/projects/TimeEntryForm";

const statusColors: Record<string, string> = {
  PLANNING: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  ON_HOLD: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  PLANNING: "Planification",
  IN_PROGRESS: "En cours",
  ON_HOLD: "En attente",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
};

const typeLabels: Record<string, string> = {
  INTERNAL: "Interne",
  CLIENT: "Client",
  MAINTENANCE: "Maintenance",
  R_AND_D: "R&D",
  OTHER: "Autre",
};

const milestoneStatusLabels: Record<string, string> = {
  PLANNED: "Planifié",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
};

const activityTypeLabels: Record<string, string> = {
  CREATED: "Créé",
  UPDATED: "Modifié",
  DELETED: "Supprimé",
  STATUS_CHANGED: "Statut changé",
  MILESTONE_ADDED: "Jalon ajouté",
  MILESTONE_COMPLETED: "Jalon complété",
  NOTE_ADDED: "Note ajoutée",
  TASK_ADDED: "Tâche ajoutée",
  TASK_COMPLETED: "Tâche complétée",
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { addToast } = useToast();
  const [project, setProject] = React.useState<any>(null);
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [milestones, setMilestones] = React.useState<any[]>([]);
  const [notes, setNotes] = React.useState<any[]>([]);
  const [activityLogs, setActivityLogs] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isTimeEntryModalOpen, setIsTimeEntryModalOpen] = React.useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = React.useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = React.useState(false);
  const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null);
  const [editingMilestone, setEditingMilestone] = React.useState<any | null>(null);
  const [milestoneFormData, setMilestoneFormData] = React.useState<{
    title: string;
    description: string;
    status: string;
    dueDate: string;
  }>({
    title: "",
    description: "",
    status: "PLANNED",
    dueDate: "",
  });
  const [noteContent, setNoteContent] = React.useState("");

  const loadProject = React.useCallback(async () => {
    try {
      const [projectResult, tasksResult, milestonesResult, notesResult, logsResult] = await Promise.all([
        getProjectAction(projectId),
        getTasksAction(projectId),
        getMilestonesAction(projectId),
        getProjectNotesAction(projectId),
        getActivityLogsAction(projectId),
      ]);

      if (projectResult.success && projectResult.data) {
        const mappedProject = {
          ...projectResult.data,
          budget: projectResult.data.budget ? Number(projectResult.data.budget) : null,
        };
        setProject(mappedProject);
      } else {
        addToast({
          variant: "error",
          title: "Erreur",
          description: projectResult.error || "Impossible de charger le projet",
        });
        router.push("/operations");
      }

      if (tasksResult.success && tasksResult.data) {
        setTasks(tasksResult.data);
      }
      if (milestonesResult.success && milestonesResult.data) {
        setMilestones(milestonesResult.data);
      }
      if (notesResult.success && notesResult.data) {
        setNotes(notesResult.data);
      }
      if (logsResult.success && logsResult.data) {
        setActivityLogs(logsResult.data);
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
  }, [projectId, router, addToast]);

  React.useEffect(() => {
    loadProject();
  }, [loadProject]);

  const handleMilestoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...milestoneFormData,
        projectId,
        dueDate: milestoneFormData.dueDate || undefined,
      };

      let result;
      if (editingMilestone) {
        result = await updateMilestoneAction(editingMilestone.id, data);
      } else {
        result = await createMilestoneAction(data);
      }

      if (result.success) {
        addToast({
          variant: "success",
          title: "Succès",
          description: editingMilestone ? "Jalon modifié" : "Jalon créé",
        });
        setIsMilestoneModalOpen(false);
        setEditingMilestone(null);
        setMilestoneFormData({ title: "", description: "", status: "PLANNED", dueDate: "" });
        loadProject();
      } else {
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Une erreur est survenue",
        });
      }
    } catch (error) {
      console.error("Error saving milestone:", error);
      addToast({
        variant: "error",
        title: "Erreur",
        description: "Une erreur est survenue",
      });
    }
  };

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    try {
      const result = await createProjectNoteAction({
        content: noteContent,
        projectId,
      });

      if (result.success) {
        addToast({
          variant: "success",
          title: "Succès",
          description: "Note ajoutée",
        });
        setNoteContent("");
        setIsNoteModalOpen(false);
        loadProject();
      } else {
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Une erreur est survenue",
        });
      }
    } catch (error) {
      console.error("Error creating note:", error);
      addToast({
        variant: "error",
        title: "Erreur",
        description: "Une erreur est survenue",
      });
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce jalon ?")) return;

    try {
      const result = await deleteMilestoneAction(id);
      if (result.success) {
        addToast({
          variant: "success",
          title: "Succès",
          description: "Jalon supprimé",
        });
        loadProject();
      } else {
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Impossible de supprimer le jalon",
        });
      }
    } catch (error) {
      console.error("Error deleting milestone:", error);
      addToast({
        variant: "error",
        title: "Erreur",
        description: "Une erreur est survenue",
      });
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette note ?")) return;

    try {
      const result = await deleteProjectNoteAction(id);
      if (result.success) {
        addToast({
          variant: "success",
          title: "Succès",
          description: "Note supprimée",
        });
        loadProject();
      } else {
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Impossible de supprimer la note",
        });
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      addToast({
        variant: "error",
        title: "Erreur",
        description: "Une erreur est survenue",
      });
    }
  };

  if (isLoading) {
    return <p className="text-gray-500 dark:text-gray-400">Chargement...</p>;
  }

  if (!project) {
    return null;
  }

  const completedTasks = project.tasks?.filter((t: any) => t.status === "DONE").length || 0;
  const totalTasks = project.tasks?.length || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const leadName = project.lead
    ? project.lead.firstName && project.lead.lastName
      ? `${project.lead.firstName} ${project.lead.lastName}`
      : project.lead.name || "-"
    : "-";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-2">
            {project.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">{project.description || "Aucune description"}</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push(`/operations/${projectId}/tasks`)}
            variant="primary"
          >
            Voir les tâches
          </Button>
          <Button
            onClick={() => router.push(`/operations/${projectId}/edit`)}
            variant="outline"
          >
            Modifier
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Statut</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <Badge className={statusColors[project.status] || "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}>
              {statusLabels[project.status] || project.status}
            </Badge>
          </GlassCardContent>
        </GlassCard>

        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Progression</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                <span>{completedTasks} / {totalTasks} tâches terminées</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>

        {project.budget && (
          <GlassCard>
            <GlassCardHeader>
              <GlassCardTitle>Budget</GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {project.budget.toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                })}
              </p>
            </GlassCardContent>
          </GlassCard>
        )}
      </div>

      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle>Informations complètes</GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.type && (
              <div className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Type:</span> {typeLabels[project.type] || project.type}
              </div>
            )}
            {project.department && (
              <div className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Département:</span> {project.department}
              </div>
            )}
            {project.company && (
              <div className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Client:</span> {project.company.name}
              </div>
            )}
            {project.lead && (
              <div className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Lead:</span> {leadName}
              </div>
            )}
            {project.startDate && (
              <div className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Date de début:</span>{" "}
                {new Date(project.startDate).toLocaleDateString("fr-FR")}
              </div>
            )}
            {project.endDate && (
              <div className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Date de fin:</span>{" "}
                {new Date(project.endDate).toLocaleDateString("fr-FR")}
              </div>
            )}
            <div className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Créé le:</span>{" "}
              {new Date(project.createdAt).toLocaleDateString("fr-FR")}
            </div>
          </div>
          {project.links && Object.keys(project.links).length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="font-medium text-gray-700 dark:text-gray-300">Liens:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(project.links).map(([key, value]) => (
                  <a
                    key={key}
                    href={value as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {key}
                  </a>
                ))}
              </div>
            </div>
          )}
        </GlassCardContent>
      </GlassCard>

      {/* Milestones Section */}
      <GlassCard>
        <GlassCardHeader className="flex justify-between items-center">
          <GlassCardTitle>Jalons (Milestones)</GlassCardTitle>
          <Button
            onClick={() => {
              setEditingMilestone(null);
              setMilestoneFormData({ title: "", description: "", status: "PLANNED", dueDate: "" });
              setIsMilestoneModalOpen(true);
            }}
            variant="primary"
            size="sm"
          >
            + Ajouter un jalon
          </Button>
        </GlassCardHeader>
        <GlassCardContent>
          {milestones.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">Aucun jalon pour le moment</p>
          ) : (
            <div className="space-y-3">
              {milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="flex justify-between items-start p-4 border rounded-md bg-white dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{milestone.title}</h4>
                      <Badge variant="outline">
                        {milestoneStatusLabels[milestone.status] || milestone.status}
                      </Badge>
                    </div>
                    {milestone.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{milestone.description}</p>
                    )}
                    <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                      {milestone.dueDate && (
                        <span>Échéance: {new Date(milestone.dueDate).toLocaleDateString("fr-FR")}</span>
                      )}
                      {milestone.completedAt && (
                        <span>Complété le: {new Date(milestone.completedAt).toLocaleDateString("fr-FR")}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setEditingMilestone(milestone);
                        setMilestoneFormData({
                          title: milestone.title,
                          description: milestone.description || "",
                          status: milestone.status,
                          dueDate: milestone.dueDate
                            ? new Date(milestone.dueDate).toISOString().split("T")[0]
                            : "",
                        });
                        setIsMilestoneModalOpen(true);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Modifier
                    </Button>
                    <Button
                      onClick={() => handleDeleteMilestone(milestone.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 dark:text-red-400"
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCardContent>
      </GlassCard>

      {/* Notes Section */}
      <GlassCard>
        <GlassCardHeader className="flex justify-between items-center">
          <GlassCardTitle>Discussion (Notes)</GlassCardTitle>
          <Button
            onClick={() => {
              setNoteContent("");
              setIsNoteModalOpen(true);
            }}
            variant="primary"
            size="sm"
          >
            + Ajouter une note
          </Button>
        </GlassCardHeader>
        <GlassCardContent>
          {notes.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">Aucune note pour le moment</p>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => {
                const authorName = note.author
                  ? note.author.firstName && note.author.lastName
                    ? `${note.author.firstName} ${note.author.lastName}`
                    : note.author.name || "Utilisateur"
                  : "Utilisateur";

                return (
                  <div
                    key={note.id}
                    className="p-4 border rounded-md bg-white dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {note.author?.image ? (
                          <img
                            src={note.author.image}
                            alt={authorName}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              {authorName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{authorName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(note.createdAt).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDeleteNote(note.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 dark:text-red-400"
                      >
                        Supprimer
                      </Button>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{note.content}</p>
                  </div>
                );
              })}
            </div>
          )}
        </GlassCardContent>
      </GlassCard>

      {/* Activity Logs Section */}
      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle>Historique d'activité</GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          {activityLogs.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">Aucune activité enregistrée</p>
          ) : (
            <div className="space-y-3">
              {activityLogs.map((log) => {
                const userName = log.user
                  ? log.user.firstName && log.user.lastName
                    ? `${log.user.firstName} ${log.user.lastName}`
                    : log.user.name || "Utilisateur"
                  : "Utilisateur";

                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 border rounded-md bg-white dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50"
                  >
                    <div className="flex-shrink-0">
                      {log.user?.image ? (
                        <img
                          src={log.user.image}
                          alt={userName}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            {userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{userName}</span>
                        <Badge variant="outline" className="text-xs">
                          {activityTypeLabels[log.type] || log.type}
                        </Badge>
                      </div>
                      {log.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{log.description}</p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(log.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </GlassCardContent>
      </GlassCard>

      {/* Tasks Section */}
      <GlassCard>
        <GlassCardHeader className="flex justify-between items-center">
          <GlassCardTitle>Tâches récentes</GlassCardTitle>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push(`/operations/${projectId}/gantt`)}
              variant="outline"
            >
              Vue Gantt
            </Button>
            <Button
              onClick={() => router.push(`/operations/${projectId}/tasks`)}
              variant="outline"
            >
              Voir toutes les tâches
            </Button>
          </div>
        </GlassCardHeader>
        <GlassCardContent>
          {tasks && tasks.length > 0 ? (
            <div className="space-y-2">
              {tasks.slice(0, 5).map((task: any) => {
                const totalHours = task.timeEntries?.reduce(
                  (sum: number, te: any) => sum + Number(te.hours || 0),
                  0
                ) || 0;
                return (
                  <div
                    key={task.id}
                    className="flex justify-between items-center p-3 border rounded-md bg-white dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{task.title}</p>
                      <div className="flex gap-4 mt-1">
                        {task.assignee && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            👤 {task.assignee.name}
                          </p>
                        )}
                        {totalHours > 0 && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ⏱️ {totalHours}h
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[task.status] || "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}>
                        {task.status}
                      </Badge>
                      <Button
                        onClick={() => {
                          setSelectedTaskId(task.id);
                          setIsTimeEntryModalOpen(true);
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 dark:text-blue-400"
                      >
                        + Temps
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Aucune tâche pour le moment</p>
          )}
        </GlassCardContent>
      </GlassCard>

      {/* Modals */}
      {isTimeEntryModalOpen && selectedTaskId && (
        <Modal
          isOpen={isTimeEntryModalOpen}
          onClose={() => {
            setIsTimeEntryModalOpen(false);
            setSelectedTaskId(null);
          }}
          title="Saisir du temps"
        >
          <TimeEntryForm
            taskId={selectedTaskId}
            onSave={async () => {
              setIsTimeEntryModalOpen(false);
              setSelectedTaskId(null);
              const result = await getTasksAction(projectId);
              if (result.success && result.data) {
                setTasks(result.data);
              }
            }}
            onCancel={() => {
              setIsTimeEntryModalOpen(false);
              setSelectedTaskId(null);
            }}
          />
        </Modal>
      )}

      {isMilestoneModalOpen && (
        <Modal
          isOpen={isMilestoneModalOpen}
          onClose={() => {
            setIsMilestoneModalOpen(false);
            setEditingMilestone(null);
            setMilestoneFormData({ title: "", description: "", status: "PLANNED", dueDate: "" });
          }}
          title={editingMilestone ? "Modifier le jalon" : "Nouveau jalon"}
        >
          <form onSubmit={handleMilestoneSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Titre *</label>
              <Input
                value={milestoneFormData.title}
                onChange={(e) =>
                  setMilestoneFormData({ ...milestoneFormData, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={milestoneFormData.description}
                onChange={(e) =>
                  setMilestoneFormData({ ...milestoneFormData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Statut</label>
              <Select
                value={milestoneFormData.status}
                onChange={(e) =>
                  setMilestoneFormData({ ...milestoneFormData, status: e.target.value })
                }
                options={[
                  { value: "PLANNED", label: "Planifié" },
                  { value: "IN_PROGRESS", label: "En cours" },
                  { value: "COMPLETED", label: "Terminé" },
                  { value: "CANCELLED", label: "Annulé" },
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date d'échéance</label>
              <Input
                type="date"
                value={milestoneFormData.dueDate}
                onChange={(e) =>
                  setMilestoneFormData({ ...milestoneFormData, dueDate: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsMilestoneModalOpen(false);
                  setEditingMilestone(null);
                  setMilestoneFormData({ title: "", description: "", status: "PLANNED", dueDate: "" });
                }}
              >
                Annuler
              </Button>
              <Button type="submit" variant="primary">
                {editingMilestone ? "Modifier" : "Créer"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {isNoteModalOpen && (
        <Modal
          isOpen={isNoteModalOpen}
          onClose={() => {
            setIsNoteModalOpen(false);
            setNoteContent("");
          }}
          title="Nouvelle note"
        >
          <form onSubmit={handleNoteSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Contenu *</label>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                rows={6}
                required
                placeholder="Écrivez votre note ici..."
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsNoteModalOpen(false);
                  setNoteContent("");
                }}
              >
                Annuler
              </Button>
              <Button type="submit" variant="primary">
                Ajouter
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
