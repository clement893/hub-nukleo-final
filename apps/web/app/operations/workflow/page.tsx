"use client";

import * as React from "react";
import {
  Button,
  Badge,
  Modal,
  Select,
} from "@nukleo/ui";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/GlassCard";
import {
  getTasksByDepartmentAction,
  moveTaskToZoneAction,
  assignTaskToUserAction,
  getEmployeesByDepartmentAction,
} from "./actions";
import { useToast } from "@/lib/toast";
import type { Department, TaskZone, TaskStatus, TaskPriority } from "@prisma/client";

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

const zoneColors: Record<TaskZone, string> = {
  SHELF: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
  STORAGE: "bg-yellow-100 text-yellow-800",
  DOCK: "bg-blue-100 text-blue-800",
  ACTIVE: "bg-green-100 text-green-800",
};

const priorityColors: Record<string, string> = {
  LOW: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
  MEDIUM: "bg-blue-100 text-blue-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800",
};

const priorityLabels: Record<string, string> = {
  LOW: "Basse",
  MEDIUM: "Moyenne",
  HIGH: "Haute",
  URGENT: "Urgente",
};

type Task = {
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
};

export default function WorkflowPage() {
  const [selectedDepartment, setSelectedDepartment] = React.useState<Department>("BUREAU");
  const [tasks, setTasks] = React.useState<Record<TaskZone, Task[]>>({
    SHELF: [],
    STORAGE: [],
    DOCK: [],
    ACTIVE: [],
  });
  const [employees, setEmployees] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [draggedTask, setDraggedTask] = React.useState<Task | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false);
  const [taskToAssign, setTaskToAssign] = React.useState<Task | null>(null);
  const { addToast } = useToast();

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [tasksResult, employeesResult] = await Promise.all([
        getTasksByDepartmentAction(selectedDepartment),
        getEmployeesByDepartmentAction(selectedDepartment),
      ]);

      if (tasksResult.success && tasksResult.data) {
        // Type assertion nécessaire car Prisma retourne un type plus complet avec assignee et project
        setTasks(tasksResult.data as unknown as Record<TaskZone, Task[]>);
      } else {
        addToast({
          variant: "error",
          title: "Erreur",
          description: tasksResult.error || "Impossible de charger les tâches",
        });
      }

      if (employeesResult.success && employeesResult.data) {
        setEmployees(employeesResult.data);
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
  }, [selectedDepartment, addToast]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetZone: TaskZone) => {
    if (!draggedTask) return;

    try {
      const result = await moveTaskToZoneAction(draggedTask.id, targetZone);
      if (result.success) {
        addToast({
          variant: "success",
          title: "Succès",
          description: "Tâche déplacée",
        });
        loadData();
      } else {
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Impossible de déplacer la tâche",
        });
      }
    } catch (error) {
      console.error("Error moving task:", error);
      addToast({
        variant: "error",
        title: "Erreur",
        description: "Une erreur est survenue",
      });
    } finally {
      setDraggedTask(null);
    }
  };

  const handleAssignClick = (task: Task) => {
    setTaskToAssign(task);
    setIsAssignModalOpen(true);
  };

  const handleAssign = async (userId: string) => {
    if (!taskToAssign) return;

    try {
      const result = await assignTaskToUserAction(taskToAssign.id, userId);
      if (result.success) {
        addToast({
          variant: "success",
          title: "Succès",
          description: "Tâche assignée",
        });
        setIsAssignModalOpen(false);
        setTaskToAssign(null);
        loadData();
      } else {
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Impossible d'assigner la tâche",
        });
      }
    } catch (error) {
      console.error("Error assigning task:", error);
      addToast({
        variant: "error",
        title: "Erreur",
        description: "Une erreur est survenue",
      });
    }
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const assigneeName = task.assignee
      ? task.assignee.firstName && task.assignee.lastName
        ? `${task.assignee.firstName} ${task.assignee.lastName}`
        : task.assignee.name || "-"
      : null;

    return (
      <div
        draggable
        onDragStart={() => handleDragStart(task)}
        className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-move mb-2"
      >
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-gray-900 dark:text-white text-sm">{task.title}</h4>
          <Badge className={priorityColors[task.priority] || "bg-gray-100"}>
            {priorityLabels[task.priority] || task.priority}
          </Badge>
        </div>
        {task.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
            {task.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {task.project.name}
          </Badge>
          {task.dueDate && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(task.dueDate).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
              })}
            </span>
          )}
        </div>
        {assigneeName && (
          <div className="mt-2 flex items-center gap-2">
            {task.assignee?.image ? (
              <img
                src={task.assignee.image}
                alt={assigneeName}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {assigneeName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-xs text-gray-600 dark:text-gray-400">{assigneeName}</span>
          </div>
        )}
        {!task.assignee && (
          <Button
            onClick={() => handleAssignClick(task)}
            variant="outline"
            size="sm"
            className="w-full mt-2"
          >
            Assigner
          </Button>
        )}
      </div>
    );
  };

  const ZoneColumn = ({ zone, tasks: zoneTasks }: { zone: TaskZone; tasks: Task[] }) => {
    return (
      <div
        className="flex-1 min-w-[280px]"
        onDragOver={handleDragOver}
        onDrop={() => handleDrop(zone)}
      >
        <GlassCard>
          <GlassCardHeader>
            <div className="flex items-center justify-between">
              <GlassCardTitle className="text-sm font-medium">
                {zoneLabels[zone]}
              </GlassCardTitle>
              <Badge className={zoneColors[zone]}>
                {zoneTasks.length}
              </Badge>
            </div>
          </GlassCardHeader>
          <GlassCardContent className="min-h-[400px]">
            {zoneTasks.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                Aucune tâche
              </p>
            ) : (
              zoneTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))
            )}
          </GlassCardContent>
        </GlassCard>
      </div>
    );
  };

  if (isLoading) {
    return <p className="text-gray-500 dark:text-gray-400">Chargement...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-2">
            Workflow Opérations
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Gérez le flux de travail des tâches par département
          </p>
        </div>
      </div>

      {/* Sélection du département */}
      <GlassCard>
        <GlassCardContent className="pt-6">
          <div className="flex gap-2">
            {(["BUREAU", "LAB", "STUDIO"] as Department[]).map((dept) => (
              <Button
                key={dept}
                variant={selectedDepartment === dept ? "primary" : "outline"}
                onClick={() => setSelectedDepartment(dept)}
              >
                {departmentLabels[dept]}
              </Button>
            ))}
          </div>
        </GlassCardContent>
      </GlassCard>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        <ZoneColumn zone="SHELF" tasks={tasks.SHELF} />
        <ZoneColumn zone="STORAGE" tasks={tasks.STORAGE} />
        <ZoneColumn zone="DOCK" tasks={tasks.DOCK} />
        <ZoneColumn zone="ACTIVE" tasks={tasks.ACTIVE} />
      </div>

      {/* Modal d'assignation */}
      {isAssignModalOpen && taskToAssign && (
        <Modal
          isOpen={isAssignModalOpen}
          onClose={() => {
            setIsAssignModalOpen(false);
            setTaskToAssign(null);
          }}
          title="Assigner la tâche"
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Tâche: <strong>{taskToAssign.title}</strong>
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Employé
              </label>
              <Select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAssign(e.target.value);
                  }
                }}
                options={[
                  { value: "", label: "Sélectionner un employé" },
                  ...employees.map((emp) => ({
                    value: emp.id,
                    label: emp.firstName && emp.lastName
                      ? `${emp.firstName} ${emp.lastName}`
                      : emp.name || emp.email,
                  })),
                ]}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

