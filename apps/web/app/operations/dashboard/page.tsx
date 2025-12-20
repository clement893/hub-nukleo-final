"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Badge,
} from "@nukleo/ui";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/GlassCard";
import { getProjectsAction } from "../actions";
import { useToast } from "@/lib/toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const statusColors: Record<string, string> = {
  PLANNING: "#9CA3AF",
  IN_PROGRESS: "#3B82F6",
  ON_HOLD: "#F59E0B",
  COMPLETED: "#10B981",
  CANCELLED: "#EF4444",
};

const statusLabels: Record<string, string> = {
  PLANNING: "Planification",
  IN_PROGRESS: "En cours",
  ON_HOLD: "En attente",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
};

export default function OperationsDashboardPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [projects, setProjects] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

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

  if (isLoading) {
    return <p className="text-gray-500">Chargement...</p>;
  }

  // Calculate statistics
  const stats = {
    total: projects.length,
    inProgress: projects.filter((p) => p.status === "IN_PROGRESS").length,
    completed: projects.filter((p) => p.status === "COMPLETED").length,
    onHold: projects.filter((p) => p.status === "ON_HOLD").length,
    planning: projects.filter((p) => p.status === "PLANNING").length,
    cancelled: projects.filter((p) => p.status === "CANCELLED").length,
    totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
    totalTasks: projects.reduce((sum, p) => sum + (p._count?.tasks || 0), 0),
  };

  // Prepare chart data
  const statusData = Object.entries(statusLabels).map(([key, label]) => ({
    name: label,
    value: projects.filter((p) => p.status === key).length,
    color: statusColors[key],
  }));

  const monthlyData = React.useMemo(() => {
    const months: Record<string, number> = {};
    projects.forEach((project) => {
      const month = new Date(project.createdAt).toLocaleDateString("fr-FR", {
        month: "short",
        year: "numeric",
      });
      months[month] = (months[month] || 0) + 1;
    });
    return Object.entries(months)
      .map(([name, value]) => ({ name, value }))
      .slice(-6); // Last 6 months
  }, [projects]);

  const topProjects = projects
    .filter((p) => p._count?.tasks > 0)
    .sort((a, b) => (b._count?.tasks || 0) - (a._count?.tasks || 0))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Projets</h1>
          <p className="text-gray-600 mt-2">Vue d'ensemble et statistiques des projets</p>
        </div>
        <Button onClick={() => router.push("/operations")} variant="outline">
          Voir tous les projets
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard>
          <GlassCardContent className="pt-6">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total projets</p>
          </GlassCardContent>
        </GlassCard>
        <GlassCard>
          <GlassCardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.inProgress}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">En cours</p>
          </GlassCardContent>
        </GlassCard>
        <GlassCard>
          <GlassCardContent className="pt-6">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Terminés</p>
          </GlassCardContent>
        </GlassCard>
        <GlassCard>
          <GlassCardContent className="pt-6">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.totalBudget.toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR",
                maximumFractionDigits: 0,
              })}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Budget total</p>
          </GlassCardContent>
        </GlassCard>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Répartition par statut</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData.filter((d) => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </GlassCardContent>
        </GlassCard>

        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Projets créés par mois</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </GlassCardContent>
        </GlassCard>
      </div>

      {/* Top Projects */}
      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle>Projets avec le plus de tâches</GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          {topProjects.length > 0 ? (
            <div className="space-y-3">
              {topProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex justify-between items-center p-3 border rounded-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => router.push(`/operations/${project.id}`)}
                >
                  <div className="flex-1">
                    <p className="font-medium">{project.name}</p>
                    {project.description && (
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {project.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{project._count?.tasks || 0}</p>
                      <p className="text-xs text-gray-500">tâches</p>
                    </div>
                    <Badge className={statusColors[project.status] || "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}>
                      {statusLabels[project.status] || project.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Aucun projet avec des tâches</p>
          )}
        </GlassCardContent>
      </GlassCard>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard>
          <GlassCardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTasks}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total tâches</p>
          </GlassCardContent>
        </GlassCard>
        <GlassCard>
          <GlassCardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.onHold}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">En attente</p>
          </GlassCardContent>
        </GlassCard>
        <GlassCard>
          <GlassCardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.planning}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">En planification</p>
          </GlassCardContent>
        </GlassCard>
      </div>
    </div>
  );
}


