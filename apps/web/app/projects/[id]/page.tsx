"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Badge,
  Modal,
} from "@nukleo/ui";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/GlassCard";
import { getProjectAction, getTasksAction } from "../actions";
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

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { addToast } = useToast();
  const [project, setProject] = React.useState<any>(null);
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isTimeEntryModalOpen, setIsTimeEntryModalOpen] = React.useState(false);
  const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadProject() {
      try {
        const [projectResult, tasksResult] = await Promise.all([
          getProjectAction(projectId),
          getTasksAction(projectId),
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
          router.push("/projects");
        }

        if (tasksResult.success && tasksResult.data) {
          setTasks(tasksResult.data);
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
  }, [projectId, router, addToast]);

  if (isLoading) {
    return <p className="text-gray-500 dark:text-gray-400">Chargement...</p>;
  }

  if (!project) {
    return null;
  }

  const completedTasks = project.tasks?.filter((t: any) => t.status === "DONE").length || 0;
  const totalTasks = project.tasks?.length || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

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
            onClick={() => router.push(`/projects/${projectId}/tasks`)}
            variant="primary"
          >
            Voir les tâches
          </Button>
          <Button
            onClick={() => router.push(`/projects/${projectId}/edit`)}
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
          <GlassCardTitle>Informations</GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent className="space-y-4">
          {project.company && (
            <div className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Client:</span> {project.company.name}
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
        </GlassCardContent>
      </GlassCard>

      <GlassCard>
        <GlassCardHeader className="flex justify-between items-center">
          <GlassCardTitle>Tâches récentes</GlassCardTitle>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push(`/projects/${projectId}/gantt`)}
              variant="outline"
            >
              Vue Gantt
            </Button>
            <Button
              onClick={() => router.push(`/projects/${projectId}/tasks`)}
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
              // Reload tasks
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
    </div>
  );
}

