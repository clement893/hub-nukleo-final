"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
} from "@nukleo/ui";
import { getProjectsAction, deleteProjectAction } from "./actions";
import { useToast } from "@/lib/toast";

type Project = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  budget: number | null;
  createdAt: Date;
  company: {
    id: string;
    name: string;
  } | null;
  _count: {
    tasks: number;
  };
};

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

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { addToast } = useToast();

  React.useEffect(() => {
    async function loadData() {
      try {
        const result = await getProjectsAction();
        if (result.success && result.data) {
          const mappedProjects = result.data.map((project: any) => ({
            ...project,
            budget: project.budget ? Number(project.budget) : null,
          }));
          setProjects(mappedProjects);
        } else {
          addToast({
            variant: "error",
            title: "Erreur",
            description: result.error || "Impossible de charger les projets",
          });
        }
      } catch (error) {
        console.error("Error loading projects:", error);
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
  }, [addToast]);

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      return;
    }

    try {
      const result = await deleteProjectAction(id);
      if (result.success) {
        addToast({
          variant: "success",
          title: "Succès",
          description: "Le projet a été supprimé avec succès",
        });
        setProjects(projects.filter((p) => p.id !== id));
      } else {
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Impossible de supprimer le projet",
        });
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      addToast({
        variant: "error",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
      });
    }
  };

  if (isLoading) {
    return <p className="text-gray-500">Chargement...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projets</h1>
          <p className="text-gray-600 mt-2">Gérez vos projets et leurs tâches</p>
        </div>
        <Button
          onClick={() => router.push("/projects/new")}
          variant="primary"
        >
          + Nouveau projet
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">Aucun projet pour le moment</p>
            <Button
              onClick={() => router.push("/projects/new")}
              variant="primary"
            >
              Créer votre premier projet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Badge className={statusColors[project.status] || "bg-gray-100 text-gray-800"}>
                    {statusLabels[project.status] || project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {project.description || "Aucune description"}
                </p>
                <div className="space-y-2 mb-4">
                  {project.company && (
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Client:</span> {project.company.name}
                    </p>
                  )}
                  {project.budget && (
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Budget:</span> {project.budget.toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Tâches:</span> {project._count.tasks}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => router.push(`/projects/${project.id}`)}
                    variant="outline"
                    className="flex-1"
                  >
                    Voir
                  </Button>
                  <Button
                    onClick={() => handleDelete(project.id)}
                    variant="ghost"
                    className="text-red-600 hover:text-red-700"
                  >
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

