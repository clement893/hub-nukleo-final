"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Modal,
} from "@nukleo/ui";
import {
  getTasksAction,
  updateTaskAction,
  deleteTaskAction,
  getProjectAction,
} from "../../actions";
import { useToast } from "@/lib/toast";
import { TaskForm } from "@/components/projects/TaskForm";

const statusColors: Record<string, string> = {
  TODO: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  REVIEW: "bg-yellow-100 text-yellow-800",
  DONE: "bg-green-100 text-green-800",
};

const statusLabels: Record<string, string> = {
  TODO: "À faire",
  IN_PROGRESS: "En cours",
  REVIEW: "En révision",
  DONE: "Terminé",
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

const statusOrder = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"];

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: Date | null;
  assigneeId: string | null;
  assignee: {
    id: string;
    name: string | null;
    email: string;
  } | null;
};

function SortableTaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-3 border rounded-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-move"
      onClick={() => onEdit(task)}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-sm">{task.title}</h4>
        <Badge className={priorityColors[task.priority] || "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}>
          {priorityLabels[task.priority] || task.priority}
        </Badge>
      </div>
      {task.description && (
        <p className="text-xs text-gray-500 mb-2 line-clamp-2">
          {task.description}
        </p>
      )}
      {task.assignee && (
        <p className="text-xs text-gray-500 mb-2">
          👤 {task.assignee.name || task.assignee.email}
        </p>
      )}
      {task.dueDate && (
        <p className="text-xs text-gray-500">
          📅 {new Date(task.dueDate).toLocaleDateString("fr-FR")}
        </p>
      )}
      <div className="flex gap-2 mt-2">
        {statusOrder.map((s) => (
          <button
            key={s}
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(task.id, s);
            }}
            className={`text-xs px-2 py-1 rounded ${
              task.status === s
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {statusLabels[s]?.charAt(0) || s.charAt(0)}
          </button>
        ))}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="text-xs px-2 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200 ml-auto"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}

export default function ProjectTasksPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { addToast } = useToast();
  const [project, setProject] = React.useState<any>(null);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      return;
    }

    try {
      const result = await deleteTaskAction(taskId);
      if (result.success) {
        addToast({
          variant: "success",
          title: "Succès",
          description: "La tâche a été supprimée avec succès",
        });
        setTasks(tasks.filter((t) => t.id !== taskId));
      } else {
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Impossible de supprimer la tâche",
        });
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      addToast({
        variant: "error",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
      });
    }
  };

  const handleTaskSaved = async () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
    // Reload tasks
    const result = await getTasksAction(projectId);
    if (result.success && result.data) {
      setTasks(result.data);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const result = await updateTaskAction(taskId, {
        ...task,
        status: newStatus,
      });

      if (result.success) {
        setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // Find the task being dragged
    const draggedTask = tasks.find((t) => t.id === active.id);
    if (!draggedTask) return;

    // Find the target status (column)
    const targetStatus = over.id as string;
    if (statusOrder.includes(targetStatus)) {
      await handleStatusChange(draggedTask.id, targetStatus);
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  if (isLoading) {
    return <p className="text-gray-500">Chargement...</p>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tâches - {project?.name || "Projet"}
            </h1>
            <p className="text-gray-600 mt-2">Gérez les tâches du projet</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.push(`/projects/${projectId}`)} variant="outline">
              Retour au projet
            </Button>
            <Button onClick={() => router.push(`/projects/${projectId}/gantt`)} variant="outline">
              Vue Gantt
            </Button>
            <Button onClick={handleCreateTask} variant="primary">
              + Nouvelle tâche
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statusOrder.map((status) => {
            const statusTasks = getTasksByStatus(status);
            return (
              <Card key={status} className="min-h-[400px]">
                <CardHeader>
                  <CardTitle className="text-lg flex justify-between items-center">
                    <span>{statusLabels[status]}</span>
                    <Badge className={statusColors[status]}>
                      {statusTasks.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <SortableContext
                    items={statusTasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                    id={status}
                  >
                    {statusTasks.map((task) => (
                      <SortableTaskCard
                        key={task.id}
                        task={task}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </SortableContext>
                  {statusTasks.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-8">
                      Aucune tâche
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {isTaskModalOpen && (
          <Modal
            isOpen={isTaskModalOpen}
            onClose={() => {
              setIsTaskModalOpen(false);
              setEditingTask(null);
            }}
            title={editingTask ? "Modifier la tâche" : "Nouvelle tâche"}
          >
            <TaskForm
              projectId={projectId}
              task={editingTask || undefined}
              onSave={handleTaskSaved}
              onCancel={() => {
                setIsTaskModalOpen(false);
                setEditingTask(null);
              }}
            />
          </Modal>
        )}
      </div>
    </DndContext>
  );
}
