"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
} from "@nukleo/ui";
import { getProjectAction } from "../actions";
import { useToast } from "@/lib/toast";

const statusColors: Record<string, string> = {
  PLANNING: "bg-gray-100 text-gray-800",
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
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadProject() {
      try {
        const result = await getProjectAction(projectId);
        if (result.success && result.data) {
          const mappedProject = {
            ...result.data,
            budget: result.data.budget ? Number(result.data.budget) : null,
          };
          setProject(mappedProject);
        } else {
          addToast({
            variant: "error",
            title: "Erreur",
            description: result.error || "Impossible de charger le projet",
          });
          router.push("/projects");
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
    return <p className="text-gray-500">Chargement...</p>;
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
          <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-gray-600 mt-2">{project.description || "Aucune description"}</p>
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
        <Card>
          <CardHeader>
            <CardTitle>Statut</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={statusColors[project.status] || "bg-gray-100 text-gray-800"}>
              {statusLabels[project.status] || project.status}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progression</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{completedTasks} / {totalTasks} tâches terminées</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {project.budget && (
          <Card>
            <CardHeader>
              <CardTitle>Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {project.budget.toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                })}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {project.company && (
            <div>
              <span className="font-medium">Client:</span> {project.company.name}
            </div>
          )}
          {project.startDate && (
            <div>
              <span className="font-medium">Date de début:</span>{" "}
              {new Date(project.startDate).toLocaleDateString("fr-FR")}
            </div>
          )}
          {project.endDate && (
            <div>
              <span className="font-medium">Date de fin:</span>{" "}
              {new Date(project.endDate).toLocaleDateString("fr-FR")}
            </div>
          )}
          <div>
            <span className="font-medium">Créé le:</span>{" "}
            {new Date(project.createdAt).toLocaleDateString("fr-FR")}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Tâches récentes</CardTitle>
          <Button
            onClick={() => router.push(`/projects/${projectId}/tasks`)}
            variant="outline"
          >
            Voir toutes les tâches
          </Button>
        </CardHeader>
        <CardContent>
          {project.tasks && project.tasks.length > 0 ? (
            <div className="space-y-2">
              {project.tasks.slice(0, 5).map((task: any) => (
                <div
                  key={task.id}
                  className="flex justify-between items-center p-3 border rounded-md"
                >
                  <div>
                    <p className="font-medium">{task.title}</p>
                    {task.assignee && (
                      <p className="text-sm text-gray-500">
                        Assigné à: {task.assignee.name}
                      </p>
                    )}
                  </div>
                  <Badge className={statusColors[task.status] || "bg-gray-100 text-gray-800"}>
                    {task.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucune tâche pour le moment</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

