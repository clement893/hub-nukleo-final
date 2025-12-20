"use client";

import * as React from "react";
import {
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Loader,
  Alert,
  AlertTitle,
  AlertDescription,
} from "@nukleo/ui";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/GlassCard";
import { useToast } from "@/lib/toast";
import {
  getTasksByDepartmentAction,
  moveTaskToZoneAction,
  getDepartmentStatsAction,
} from "./actions";
import type { Department, TaskZone, TaskStatus, TaskPriority } from "@prisma/client";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  zone: TaskZone | null;
  department: Department | null;
  createdAt: Date;
  updatedAt: Date;
  assignee: {
    id: string;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    image: string | null;
    email: string;
  } | null;
  project: {
    id: string;
    name: string;
  };
}

interface TasksByZone {
  SHELF: Task[];
  STORAGE: Task[];
  DOCK: Task[];
  ACTIVE: Task[];
}

const departmentLabels: Record<Department, string> = {
  BUREAU: "Bureau",
  LAB: "Lab",
  STUDIO: "Studio",
};

const zoneLabels: Record<TaskZone, string> = {
  SHELF: "En attente",
  STORAGE: "Bloqué",
  DOCK: "Prêt",
  ACTIVE: "En cours",
};

const priorityColors: Record<TaskPriority, string> = {
  LOW: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  MEDIUM: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  HIGH: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  URGENT: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const priorityLabels: Record<TaskPriority, string> = {
  LOW: "Basse",
  MEDIUM: "Moyenne",
  HIGH: "Haute",
  URGENT: "Urgente",
};

export default function OperationsPage() {
  const [department, setDepartment] = React.useState<Department>("BUREAU");
  const [tasks, setTasks] = React.useState<TasksByZone | null>(null);
  const [stats, setStats] = React.useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [draggedTask, setDraggedTask] = React.useState<Task | null>(null);
  const { addToast } = useToast();

  // Charger les tâches du département
  const loadTasks = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [tasksResult, statsResult] = await Promise.all([
        getTasksByDepartmentAction(department),
        getDepartmentStatsAction(department),
      ]);

      if (tasksResult.success && tasksResult.data) {
        setTasks(tasksResult.data as unknown as TasksByZone);
      } else {
        setError(tasksResult.error || "Erreur");
      }

      if (statsResult.success && statsResult.data) {
        setStats(statsResult.data);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(message);
      addToast({
        variant: "error",
        title: "Erreur",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [department, addToast]);

  React.useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Gestion du drag & drop
  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (zone: TaskZone) => {
    if (!draggedTask) return;

    try {
      const result = await moveTaskToZoneAction(draggedTask.id, zone);

      if (result.success) {
        addToast({
          variant: "success",
          title: "Tâche déplacée",
          description: `La tâche a été déplacée vers ${zoneLabels[zone]}`,
        });
        loadTasks(); // Recharger les tâches
      } else {
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Impossible de déplacer la tâche",
        });
      }
    } catch (err) {
      addToast({
        variant: "error",
        title: "Erreur",
        description: "Une erreur est survenue",
      });
    } finally {
      setDraggedTask(null);
    }
  };

  const getAssigneeName = (assignee: Task["assignee"]): string => {
    if (!assignee) return "";
    if (assignee.firstName && assignee.lastName) {
      return `${assignee.firstName} ${assignee.lastName}`;
    }
    return assignee.name || "";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" role="status" aria-live="polite">
        <Loader size="lg" />
        <span className="sr-only">Chargement des tâches...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error">
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-2">
          Opérations
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Gérez le flux de travail des tâches par département
        </p>
      </div>

      {/* Tabs par département */}
      <Tabs
        value={department}
        onValueChange={(value) => setDepartment(value as Department)}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="BUREAU">Bureau</TabsTrigger>
          <TabsTrigger value="LAB">Lab</TabsTrigger>
          <TabsTrigger value="STUDIO">Studio</TabsTrigger>
        </TabsList>

        <TabsContent value={department} className="mt-6">
          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {(["SHELF", "STORAGE", "DOCK", "ACTIVE"] as TaskZone[]).map((zone) => (
              <GlassCard key={zone} className="glass card-shadow">
                <GlassCardContent className="pt-6">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {zoneLabels[zone]}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stats[zone] || 0}
                  </div>
                </GlassCardContent>
              </GlassCard>
            ))}
          </div>

          {/* Kanban Board */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(["SHELF", "STORAGE", "DOCK", "ACTIVE"] as TaskZone[]).map((zone) => (
              <div
                key={zone}
                className="space-y-2"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(zone)}
              >
                {/* Zone Header */}
                <GlassCard className="glass card-shadow">
                  <GlassCardHeader>
                    <GlassCardTitle className="text-lg">
                      {zoneLabels[zone]} ({tasks?.[zone]?.length || 0})
                    </GlassCardTitle>
                  </GlassCardHeader>
                </GlassCard>

                {/* Task Cards */}
                <div className="space-y-2 min-h-[200px]">
                  {tasks?.[zone]?.map((task) => (
                    <GlassCard
                      key={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task)}
                      className="glass card-shadow hover:card-shadow-hover cursor-move transition-all duration-200"
                    >
                      <GlassCardContent className="pt-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {task.title}
                        </h3>
                        
                        <div className="space-y-2">
                          <Badge variant="secondary" className="text-xs">
                            {task.project.name}
                          </Badge>
                          
                          <Badge className={`text-xs ${priorityColors[task.priority]}`}>
                            {priorityLabels[task.priority]}
                          </Badge>

                          {task.assignee && (
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              👤 {getAssigneeName(task.assignee)}
                            </div>
                          )}

                          {task.dueDate && (
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              📅 {new Date(task.dueDate).toLocaleDateString("fr-FR")}
                            </div>
                          )}

                          {task.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </GlassCardContent>
                    </GlassCard>
                  ))}

                  {(!tasks?.[zone] || tasks[zone].length === 0) && (
                    <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-8">
                      Aucune tâche
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
