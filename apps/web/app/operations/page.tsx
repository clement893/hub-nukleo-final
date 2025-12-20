"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Badge,
  Input,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Select,
} from "@nukleo/ui";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/GlassCard";
import { getProjectsAction, deleteProjectAction } from "./actions";
import { useToast } from "@/lib/toast";

type Project = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  type: string | null;
  startDate: Date | null;
  endDate: Date | null;
  budget: number | null;
  department: string | null;
  links: Record<string, any> | null;
  createdAt: Date;
  company: {
    id: string;
    name: string;
  } | null;
  lead: {
    id: string;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
  } | null;
  _count: {
    tasks: number;
    milestones: number;
    notes: number;
  };
};

type SortField = "name" | "status" | "startDate" | "budget" | "createdAt" | "department" | "type";
type SortDirection = "asc" | "desc";

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

const getCurrentYear = () => new Date().getFullYear();
const getYears = () => {
  const currentYear = getCurrentYear();
  return Array.from({ length: 5 }, (_, i) => currentYear - i);
};

export default function OperationsPage() {
  const router = useRouter();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = React.useState<Project[]>([]);
  const [sortedProjects, setSortedProjects] = React.useState<Project[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = React.useState<string>("all");
  const [yearFilter, setYearFilter] = React.useState<string>("all");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [sortField, setSortField] = React.useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("desc");
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
          setFilteredProjects(mappedProjects);
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

  // Get unique departments from projects
  const departments = React.useMemo(() => {
    const depts = projects
      .map((p) => p.department)
      .filter((d): d is string => d !== null && d !== undefined && d !== "")
      .filter((d, index, self) => self.indexOf(d) === index)
      .sort();
    return depts;
  }, [projects]);

  React.useEffect(() => {
    let filtered = projects;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (project.description &&
            project.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (project.company?.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((project) => project.status === statusFilter);
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter((project) => project.type === typeFilter);
    }

    // Filter by department
    if (departmentFilter !== "all") {
      filtered = filtered.filter((project) => project.department === departmentFilter);
    }

    // Filter by year
    if (yearFilter !== "all") {
      const year = parseInt(yearFilter);
      filtered = filtered.filter((project) => {
        if (!project.startDate) return false;
        const projectYear = new Date(project.startDate).getFullYear();
        return projectYear === year;
      });
    }

    setFilteredProjects(filtered);
  }, [projects, searchQuery, statusFilter, typeFilter, departmentFilter, yearFilter]);

  // Sorting
  React.useEffect(() => {
    const sorted = [...filteredProjects].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "startDate":
          aValue = a.startDate ? new Date(a.startDate).getTime() : 0;
          bValue = b.startDate ? new Date(b.startDate).getTime() : 0;
          break;
        case "budget":
          aValue = a.budget || 0;
          bValue = b.budget || 0;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "department":
          aValue = a.department || "";
          bValue = b.department || "";
          break;
        case "type":
          aValue = a.type || "";
          bValue = b.type || "";
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setSortedProjects(sorted);
  }, [filteredProjects, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return "↕️";
    return sortDirection === "asc" ? "↑" : "↓";
  };

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
    return <p className="text-gray-500 dark:text-gray-400">Chargement...</p>;
  }

  const stats = {
    total: projects.length,
    inProgress: projects.filter((p) => p.status === "IN_PROGRESS").length,
    completed: projects.filter((p) => p.status === "COMPLETED").length,
    onHold: projects.filter((p) => p.status === "ON_HOLD").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-2">
            Projets
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Gérez vos projets et leurs tâches</p>
        </div>
        <Button
          onClick={() => router.push("/operations/new")}
          variant="primary"
        >
          + Nouveau projet
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard>
          <GlassCardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total projets</p>
          </GlassCardContent>
        </GlassCard>
        <GlassCard>
          <GlassCardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.inProgress}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">En cours</p>
          </GlassCardContent>
        </GlassCard>
        <GlassCard>
          <GlassCardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Terminés</p>
          </GlassCardContent>
        </GlassCard>
        <GlassCard>
          <GlassCardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.onHold}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">En attente</p>
          </GlassCardContent>
        </GlassCard>
      </div>

      {/* Filters and View Mode */}
      <GlassCard>
        <GlassCardContent className="pt-6">
          <div className="flex gap-4 flex-wrap items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Rechercher
              </label>
              <Input
                type="text"
                placeholder="Rechercher un projet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-[180px]">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Statut
              </label>
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
            </div>
            <div className="w-[180px]">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Type
              </label>
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
            <div className="w-[180px]">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Département
              </label>
              <Select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                options={[
                  { value: "all", label: "Tous les départements" },
                  ...departments.map((dept) => ({ value: dept, label: dept })),
                ]}
              />
            </div>
            <div className="w-[150px]">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Année
              </label>
              <Select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                options={[
                  { value: "all", label: "Toutes les années" },
                  ...getYears().map((year) => ({ value: year.toString(), label: year.toString() })),
                ]}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "primary" : "outline"}
                onClick={() => setViewMode("grid")}
                size="sm"
              >
                Grille
              </Button>
              <Button
                variant={viewMode === "list" ? "primary" : "outline"}
                onClick={() => setViewMode("list")}
                size="sm"
              >
                Liste
              </Button>
            </div>
          </div>
        </GlassCardContent>
      </GlassCard>

      {sortedProjects.length === 0 ? (
        <GlassCard>
          <GlassCardContent className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">Aucun projet trouvé</p>
            <Button
              onClick={() => router.push("/operations/new")}
              variant="primary"
            >
              Créer votre premier projet
            </Button>
          </GlassCardContent>
        </GlassCard>
      ) : viewMode === "list" ? (
        <GlassCard>
          <GlassCardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <button
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        Nom {getSortIcon("name")}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        onClick={() => handleSort("status")}
                        className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        Statut {getSortIcon("status")}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        onClick={() => handleSort("type")}
                        className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        Type {getSortIcon("type")}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        onClick={() => handleSort("department")}
                        className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        Département {getSortIcon("department")}
                      </button>
                    </TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Lead</TableHead>
                    <TableHead>
                      <button
                        onClick={() => handleSort("startDate")}
                        className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        Date début {getSortIcon("startDate")}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        onClick={() => handleSort("budget")}
                        className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        Budget {getSortIcon("budget")}
                      </button>
                    </TableHead>
                    <TableHead>Tâches</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedProjects.map((project) => {
                    const leadName = project.lead
                      ? project.lead.firstName && project.lead.lastName
                        ? `${project.lead.firstName} ${project.lead.lastName}`
                        : project.lead.name || "-"
                      : "-";
                    
                    return (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{project.name}</div>
                            {project.description && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                {project.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[project.status] || "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}>
                            {statusLabels[project.status] || project.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {project.type ? (
                            <Badge variant="outline">{typeLabels[project.type] || project.type}</Badge>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>{project.department || "-"}</TableCell>
                        <TableCell>{project.company?.name || "-"}</TableCell>
                        <TableCell>{leadName}</TableCell>
                        <TableCell>
                          {project.startDate
                            ? new Date(project.startDate).toLocaleDateString("fr-FR")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {project.budget
                            ? project.budget.toLocaleString("fr-FR", {
                                style: "currency",
                                currency: "EUR",
                              })
                            : "-"}
                        </TableCell>
                        <TableCell>{project._count.tasks}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              onClick={() => router.push(`/operations/${project.id}`)}
                              variant="outline"
                              size="sm"
                            >
                              Voir
                            </Button>
                            <Button
                              onClick={() => handleDelete(project.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                            >
                              Supprimer
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </GlassCardContent>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProjects.map((project) => (
            <GlassCard key={project.id}>
              <GlassCardHeader>
                <div className="flex justify-between items-start">
                  <GlassCardTitle className="text-lg">{project.name}</GlassCardTitle>
                  <Badge className={statusColors[project.status] || "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}>
                    {statusLabels[project.status] || project.status}
                  </Badge>
                </div>
              </GlassCardHeader>
              <GlassCardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {project.description || "Aucune description"}
                </p>
                <div className="space-y-2 mb-4">
                  {project.type && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Type:</span> {typeLabels[project.type] || project.type}
                    </p>
                  )}
                  {project.department && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Département:</span> {project.department}
                    </p>
                  )}
                  {project.company && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Client:</span> {project.company.name}
                    </p>
                  )}
                  {project.lead && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Lead:</span>{" "}
                      {project.lead.firstName && project.lead.lastName
                        ? `${project.lead.firstName} ${project.lead.lastName}`
                        : project.lead.name || "-"}
                    </p>
                  )}
                  {project.budget && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Budget:</span> {project.budget.toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </p>
                  )}
                  <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Tâches:</span> {project._count.tasks}
                    </p>
                    {project._count.milestones > 0 && (
                      <p>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Jalons:</span> {project._count.milestones}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => router.push(`/operations/${project.id}`)}
                    variant="outline"
                    className="flex-1"
                  >
                    Voir
                  </Button>
                  <Button
                    onClick={() => handleDelete(project.id)}
                    variant="ghost"
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    Supprimer
                  </Button>
                </div>
              </GlassCardContent>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

