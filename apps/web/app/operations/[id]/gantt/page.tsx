"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
} from "@nukleo/ui";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/GlassCard";
import { getProjectAction, getTasksAction } from "../../actions";
import { useToast } from "@/lib/toast";

export default function ProjectGanttPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { addToast } = useToast();
  const [project, setProject] = React.useState<any>(null);
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        const [projectResult, tasksResult] = await Promise.all([
          getProjectAction(projectId),
          getTasksAction(projectId),
        ]);

        if (projectResult.success && projectResult.data) {
          setProject(projectResult.data);
        }

        if (tasksResult.success && tasksResult.data) {
          setTasks(tasksResult.data);
        }
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
  }, [projectId, addToast]);

  if (isLoading) {
    return <p className="text-gray-500 dark:text-gray-400">Chargement...</p>;
  }

  // Calculate timeline bounds
  const projectStart = project?.startDate
    ? new Date(project.startDate)
    : tasks.length > 0 && tasks[0].dueDate
    ? new Date(tasks[0].dueDate)
    : new Date();
  const projectEnd = project?.endDate
    ? new Date(project.endDate)
    : tasks.length > 0 && tasks[tasks.length - 1].dueDate
    ? new Date(tasks[tasks.length - 1].dueDate)
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // +30 days

  const daysDiff = Math.ceil(
    (projectEnd.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24)
  );
  const days = Array.from({ length: Math.min(daysDiff, 90) }, (_, i) => {
    const date = new Date(projectStart);
    date.setDate(date.getDate() + i);
    return date;
  });

  const getTaskPosition = (task: any) => {
    if (!task.dueDate) return { left: 0, width: 0 };
    const taskDate = new Date(task.dueDate);
    const daysFromStart = Math.ceil(
      (taskDate.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24)
    );
    const left = (daysFromStart / daysDiff) * 100;
    return { left: Math.max(0, Math.min(left, 100)), width: 5 };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-2">
            Gantt - {project?.name || "Projet"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Vue temporelle des tâches du projet</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push(`/operations/${projectId}`)} variant="outline">
            Retour au projet
          </Button>
          <Button
            onClick={() => router.push(`/operations/${projectId}/tasks`)}
            variant="outline"
          >
            Vue Kanban
          </Button>
        </div>
      </div>

      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle>Diagramme de Gantt</GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Timeline header */}
              <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                <div className="w-48 flex-shrink-0 p-2 font-medium text-sm border-r border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                  Tâche
                </div>
                <div className="flex-1 flex">
                  {days.slice(0, Math.min(30, days.length)).map((day, idx) => (
                    <div
                      key={idx}
                      className="flex-1 p-2 text-xs text-center border-r border-gray-200 dark:border-gray-700 min-w-[60px] text-gray-700 dark:text-gray-300"
                    >
                      {day.toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tasks */}
              <div className="space-y-2">
                {tasks.map((task) => {
                  const { left, width } = getTaskPosition(task);
                  return (
                    <div key={task.id} className="flex items-center border-b border-gray-100 dark:border-gray-700">
                      <div className="w-48 flex-shrink-0 p-2 text-sm border-r border-gray-200 dark:border-gray-700">
                        <div className="font-medium text-gray-900 dark:text-white">{task.title}</div>
                        {task.assignee && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {task.assignee.name}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 relative h-12">
                        {task.dueDate && (
                          <div
                            className={`absolute h-8 rounded ${
                              task.status === "DONE"
                                ? "bg-green-500"
                                : task.status === "IN_PROGRESS"
                                ? "bg-blue-500"
                                : task.status === "REVIEW"
                                ? "bg-yellow-500"
                                : "bg-gray-300 dark:bg-gray-600"
                            } opacity-75 hover:opacity-100 transition-opacity`}
                            style={{
                              left: `${left}%`,
                              width: `${width}%`,
                              minWidth: "4px",
                            }}
                            title={`${task.title} - ${new Date(task.dueDate).toLocaleDateString("fr-FR")}`}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {tasks.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  Aucune tâche avec date d'échéance pour afficher le Gantt
                </div>
              )}
            </div>
          </div>
        </GlassCardContent>
      </GlassCard>

      {/* Legend */}
      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle>Légende</GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">À faire</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">En cours</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">En révision</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Terminé</span>
            </div>
          </div>
        </GlassCardContent>
      </GlassCard>
    </div>
  );
}

