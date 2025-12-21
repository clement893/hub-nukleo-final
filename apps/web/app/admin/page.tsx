"use client";

import * as React from "react";
import { Card, CardContent, Loader, ErrorAlert } from "@nukleo/ui";
import { getSystemStatsAction } from "./actions";
import Link from "next/link";

export default function AdminPage() {
  const [stats, setStats] = React.useState<{
    success: boolean;
    data?: {
      totalUsers: number;
      activeUsers: number;
      totalRoles: number;
      recentLogins: number;
    };
    error?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadStats() {
      try {
        setIsLoading(true);
        const result = await getSystemStatsAction();
        setStats(result);
      } catch (error) {
        console.error("Error loading admin stats:", error);
        setStats({
          success: false,
          error: error instanceof Error ? error.message : "Erreur lors du chargement des statistiques",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader className="mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats || !stats.success) {
    return (
      <div className="container mx-auto p-6">
        <ErrorAlert
          title="Erreur"
          description={stats?.error || "Erreur lors de la récupération des statistiques"}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Administration
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Gestion système et configuration
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass card-shadow">
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Utilisateurs
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {stats.data?.totalUsers || 0}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">
              {stats.data?.activeUsers || 0} actifs
            </div>
          </CardContent>
        </Card>

        <Card className="glass card-shadow">
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Rôles
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {stats.data?.totalRoles || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="glass card-shadow">
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Connexions 24h
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {stats.data?.recentLogins || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="glass card-shadow">
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Statut
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
              ✓
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Système opérationnel
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/users">
          <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300 cursor-pointer">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                👥 Utilisateurs
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gérer les utilisateurs et leurs permissions
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/roles">
          <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300 cursor-pointer">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                🔐 Rôles
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configurer les rôles et permissions
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/audit">
          <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300 cursor-pointer">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                📋 Logs d&apos;audit
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Consulter l&apos;historique des actions
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

