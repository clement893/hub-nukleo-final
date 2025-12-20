"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
  Select,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Loader,
  Alert,
  AlertTitle,
  AlertDescription,
} from "@nukleo/ui";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/GlassCard";
import { getProjectsAction } from "../actions";
import { useToast } from "@/lib/toast";
import type { ProjectStatus, ProjectType } from "@prisma/client";

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  type: ProjectType | null;
  startDate: Date | null;
  endDate: Date | null;
  budget: number | null;
  department: string | null;
  company: {
    id: string;
    name: string;
  } | null;
  manager: {
    id: string;
    name: string | null;
    email: string;
  };
  lead: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

const statusColors: Record<ProjectStatus, string> = {
  PLANNING: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  IN_PROGRESS: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  ON_HOLD: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const statusLabels: Record<ProjectStatus, string> = {
  PLANNING: "Planification",
  IN_PROGRESS: "En cours",
  ON_HOLD: "En attente",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
};

const typeLabels: Record<ProjectType, string> = {
  INTERNAL: "Interne",
  CLIENT: "Client",
  MAINTENANCE: "Maintenance",
  R_AND_D: "R&D",
  OTHER: "Autre",
};

export default function ProjectsPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");

  const loadProjects = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getProjectsAction();
      if (result.success && result.data) {
        const mappedProjects = result.data.map((project: any) => ({
          ...project,
          budget: project.budget ? Number(project.budget) : null,
          startDate: project.startDate ? new Date(project.startDate) : null,
          endDate: project.endDate ? new Date(project.endDate) : null,
          createdAt: new Date(project.createdAt),
          updatedAt: new Date(project.updatedAt),
        }));
        setProjects(mappedProjects);
      } else {
        setError(result.error || "Erreur lors du chargement");
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Impossible de charger les projets",
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
    loadProjects();
  }, [loadProjects]);

  // Filtrer les projets
  const filteredProjects = React.useMemo(() => {
    let filtered = projects;

    // Filtre par statut
    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // Filtre par type
    if (typeFilter !== "all") {
      filtered = filtered.filter((p) => p.type === typeFilter);
    }

    // Recherche par nom, description, entreprise
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.company?.name.toLowerCase().includes(query) ||
          p.manager.name?.toLowerCase().includes(query) ||
          p.manager.email.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [projects, statusFilter, typeFilter, searchQuery]);

  // Statistiques
  const stats = React.useMemo(() => {
    const statsMap: Record<ProjectStatus, number> = {
      PLANNING: 0,
      IN_PROGRESS: 0,
      ON_HOLD: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };

    projects.forEach((project) => {
      statsMap[project.status] = (statsMap[project.status] || 0) + 1;
    });

    return statsMap;
  }, [projects]);

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projets</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {filteredProjects.length} projet(s) sur {projects.length} au total
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push("/operations/projects/new")}
        >
          Nouveau projet
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <GlassCard>
          <GlassCardContent className="pt-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Planification</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {stats.PLANNING}
            </div>
          </GlassCardContent>
        </GlassCard>
        <GlassCard>
          <GlassCardContent className="pt-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">En cours</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {stats.IN_PROGRESS}
            </div>
          </GlassCardContent>
        </GlassCard>
        <GlassCard>
          <GlassCardContent className="pt-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">En attente</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {stats.ON_HOLD}
            </div>
          </GlassCardContent>
        </GlassCard>
        <GlassCard>
          <GlassCardContent className="pt-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Terminés</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {stats.COMPLETED}
            </div>
          </GlassCardContent>
        </GlassCard>
        <GlassCard>
          <GlassCardContent className="pt-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Annulés</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {stats.CANCELLED}
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>

      {/* Filtres */}
      <GlassCard>
        <GlassCardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Rechercher un projet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: "all", label: "Tous les statuts" },
                { value: "PLANNING", label: "Planification" },
                { value: "IN_PROGRESS", label: "En cours" },
                { value: "ON_HOLD", label: "En attente" },
                { value: "COMPLETED", label: "Terminé" },
                { value: "CANCELLED", label: "Annulé" },
              ]}
            />
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: "all", label: "Tous les types" },
                { value: "INTERNAL", label: "Interne" },
                { value: "CLIENT", label: "Client" },
                { value: "MAINTENANCE", label: "Maintenance" },
                { value: "R_AND_D", label: "R&D" },
                { value: "OTHER", label: "Autre" },
              ]}
            />
          </div>
        </GlassCardContent>
      </GlassCard>

      {/* Table des projets */}
      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle>Liste des projets</GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              Aucun projet trouvé
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Entreprise</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Département</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow
                      key={project.id}
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => router.push(`/operations/projects/${project.id}`)}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {project.name}
                          </div>
                          {project.description && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                              {project.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {project.company ? (
                          <span className="text-gray-900 dark:text-white">
                            {project.company.name}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[project.status]}>
                          {statusLabels[project.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {project.type ? (
                          <span className="text-gray-900 dark:text-white">
                            {typeLabels[project.type]}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="text-gray-900 dark:text-white">
                            {project.manager.name || project.manager.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {project.department ? (
                          <Badge variant="secondary">{project.department}</Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-900 dark:text-white">
                          {formatCurrency(project.budget)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <div>Début: {formatDate(project.startDate)}</div>
                          <div>Fin: {formatDate(project.endDate)}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/operations/projects/${project.id}`);
                          }}
                        >
                          Voir
                        </Button>
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

