"use client";

import * as React from "react";
import {
  Button,
  Select,
  Badge,
  Loader,
  Alert,
  AlertTitle,
  AlertDescription,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@nukleo/ui";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/GlassCard";
import { useToast } from "@/lib/toast";
import {
  getUnassignedTasksAction,
  assignMultipleTasksAction,
} from "./actions";
import { assignTaskToDepartmentAction } from "../actions";
import type { Department } from "@prisma/client";
import Link from "next/link";

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  dueDate: Date | null;
  project: {
    id: string;
    name: string;
  };
}

export default function AssignTasksPage() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [selectedTasks, setSelectedTasks] = React.useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [filterProject, setFilterProject] = React.useState<string>("all");
  const [bulkDepartment, setBulkDepartment] = React.useState<Department | "">("");
  const { addToast } = useToast();

  // Charger les tâches non assignées
  const loadTasks = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getUnassignedTasksAction();
      if (result.success) {
        setTasks(result.data as Task[]);
      } else {
        setError(result.error || "Erreur");
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Impossible de charger les tâches",
        });
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
  }, [addToast]);

  React.useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Assigner une tâche individuellement
  const handleAssignTask = async (taskId: string, department: Department) => {
    try {
      const result = await assignTaskToDepartmentAction(taskId, department);
      if (result.success) {
        addToast({
          variant: "success",
          title: "Tâche assignée",
          description: `La tâche a été assignée au département ${department}`,
        });
        loadTasks(); // Recharger la liste
      } else {
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Impossible d'assigner la tâche",
        });
      }
    } catch (err) {
      addToast({
        variant: "error",
        title: "Erreur",
        description: "Une erreur est survenue",
      });
    }
  };

  // Assigner plusieurs tâches en masse
  const handleBulkAssign = async () => {
    if (!bulkDepartment || selectedTasks.size === 0) {
      addToast({
        variant: "error",
        title: "Erreur",
        description: "Sélectionnez un département et au moins une tâche",
      });
      return;
    }

    try {
      const taskIds = Array.from(selectedTasks);
      const result = await assignMultipleTasksAction(taskIds, bulkDepartment);
      if (result.success) {
        addToast({
          variant: "success",
          title: "Tâches assignées",
          description: `${taskIds.length} tâche(s) assignée(s) au département ${bulkDepartment}`,
        });
        setSelectedTasks(new Set());
        setBulkDepartment("");
        loadTasks();
      } else {
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Impossible d'assigner les tâches",
        });
      }
    } catch (err) {
      addToast({
        variant: "error",
        title: "Erreur",
        description: "Une erreur est survenue",
      });
    }
  };

  // Toggle sélection d'une tâche
  const toggleTaskSelection = (taskId: string) => {
    const newSelection = new Set(selectedTasks);
    if (newSelection.has(taskId)) {
      newSelection.delete(taskId);
    } else {
      newSelection.add(taskId);
    }
    setSelectedTasks(newSelection);
  };

  // Sélectionner toutes les tâches filtrées
  const selectAllFiltered = () => {
    const filteredTaskIds = filteredTasks.map((t) => t.id);
    setSelectedTasks(new Set(filteredTaskIds));
  };

  // Projets uniques pour le filtre
  const projects = React.useMemo(() => {
    const projectMap = new Map<string, string>();
    tasks.forEach((task) => {
      if (!projectMap.has(task.project.id)) {
        projectMap.set(task.project.id, task.project.name);
      }
    });
    return Array.from(projectMap.entries()).map(([id, name]) => ({ id, name }));
  }, [tasks]);

  // Tâches filtrées
  const filteredTasks = React.useMemo(() => {
    if (filterProject === "all") return tasks;
    return tasks.filter((t) => t.project.id === filterProject);
  }, [tasks, filterProject]);

  const getPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
      LOW: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      MEDIUM: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      HIGH: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      URGENT: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    if (priority in colors && colors[priority]) {
      return colors[priority];
    }
    return colors.MEDIUM;
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
      <Alert variant="destructive">
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Assigner les Tâches
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {filteredTasks.length} tâche(s) non assignée(s)
          </p>
        </div>
        <Link href="/operations">
          <Button variant="outline">← Retour au Kanban</Button>
        </Link>
      </div>

      {/* Actions en masse */}
      <GlassCard className="glass card-shadow">
        <GlassCardHeader>
          <GlassCardTitle>Assignation en masse</GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1 w-full sm:w-auto">
              <Select
                value={bulkDepartment}
                onChange={(e) => setBulkDepartment(e.target.value as Department)}
                options={[
                  { value: "", label: "Sélectionner un département" },
                  { value: "BUREAU", label: "Bureau" },
                  { value: "LAB", label: "Lab" },
                  { value: "STUDIO", label: "Studio" },
                ]}
                aria-label="Sélectionner un département pour l'assignation en masse"
              />
            </div>
            <Button
              onClick={handleBulkAssign}
              disabled={selectedTasks.size === 0 || !bulkDepartment}
              variant="primary"
            >
              Assigner {selectedTasks.size} tâche(s)
            </Button>
            <Button variant="outline" onClick={selectAllFiltered}>
              Tout sélectionner
            </Button>
          </div>
        </GlassCardContent>
      </GlassCard>

      {/* Filtres */}
      <GlassCard className="glass card-shadow">
        <GlassCardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Filtrer par projet:
            </label>
            <Select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              options={[
                { value: "all", label: "Tous les projets" },
                ...projects.map((project) => ({
                  value: project.id,
                  label: project.name,
                })),
              ]}
              className="w-full sm:w-64"
              aria-label="Filtrer les tâches par projet"
            />
          </div>
        </GlassCardContent>
      </GlassCard>

      {/* Tableau des tâches */}
      <GlassCard className="glass card-shadow">
        <GlassCardContent className="pt-6">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              🎉 Toutes les tâches sont assignées !
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedTasks.size === filteredTasks.length && filteredTasks.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            selectAllFiltered();
                          } else {
                            setSelectedTasks(new Set());
                          }
                        }}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        aria-label="Sélectionner toutes les tâches"
                      />
                    </TableHead>
                    <TableHead>Tâche</TableHead>
                    <TableHead>Projet</TableHead>
                    <TableHead>Priorité</TableHead>
                    <TableHead>Échéance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedTasks.has(task.id)}
                          onChange={() => toggleTaskSelection(task.id)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          aria-label={`Sélectionner la tâche ${task.title}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {task.title}
                          </div>
                          {task.description && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-md">
                              {task.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{task.project.name}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString("fr-FR")
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAssignTask(task.id, "BUREAU")}
                            aria-label={`Assigner la tâche ${task.title} au Bureau`}
                          >
                            Bureau
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAssignTask(task.id, "LAB")}
                            aria-label={`Assigner la tâche ${task.title} au Lab`}
                          >
                            Lab
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAssignTask(task.id, "STUDIO")}
                            aria-label={`Assigner la tâche ${task.title} au Studio`}
                          >
                            Studio
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </GlassCardContent>
      </GlassCard>
    </div>
  );
}

