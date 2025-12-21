"use client";

import * as React from "react";
import Link from "next/link";
import {
  Button,
  Badge,
  Loader,
} from "@nukleo/ui";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/GlassCard";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  getDashboardStatsAction,
  getRecentOpportunitiesAction,
  getRecentProposalsAction,
} from "./actions";
import { useToast } from "@/lib/toast";
import type { DashboardStats } from "./actions";
import type { OpportunityStage } from "@prisma/client";

const stageLabels: Record<OpportunityStage, string> = {
  IDEAS_CONTACT_PROJECT: "Idée/Contact/Projet",
  FOLLOW_UP_EMAILS: "Relances emails",
  MEETING_BOOKED: "RDV planifié",
  IN_DISCUSSION: "En discussion",
  PROPOSAL_TO_DO: "Proposition à faire",
  PROPOSAL_SENT: "Proposition envoyée",
  CONTRACT_TO_DO: "Contrat à faire",
  CLOSED_WON: "Gagnée",
  CLOSED_LOST: "Perdue",
  RENEWALS_POTENTIAL_UPCOMING: "Renouvellements potentiels",
  WAITING_OR_SILENT: "En attente/Silencieux",
};

const statusLabels: Record<string, string> = {
  DRAFT: "Brouillon",
  SUBMITTED: "Soumis",
  ACCEPTED: "Accepté",
  REJECTED: "Rejeté",
  REVISED: "Révisé",
};

const statusColors: Record<string, "default" | "primary" | "success" | "warning" | "error"> = {
  DRAFT: "default",
  SUBMITTED: "primary",
  ACCEPTED: "success",
  REJECTED: "error",
  REVISED: "warning",
};

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "error";
}

function StatCard({ title, value, subtitle, icon, variant = "default" }: StatCardProps) {
  const variantClasses = {
    default: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    primary: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
    success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    warning: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
    error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
  };

  return (
    <GlassCard className="glass card-shadow hover:card-shadow-hover transition-all duration-300">
      <GlassCardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div className={`p-3 rounded-lg ${variantClasses[variant]}`}>{icon}</div>
          )}
        </div>
      </GlassCardContent>
    </GlassCard>
  );
}

export default function CommercialDashboardPage() {
  const { addToast } = useToast();
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [recentOpportunities, setRecentOpportunities] = React.useState<Array<{
    id: string;
    title: string;
    stage: OpportunityStage;
    value: number | null;
    company: { id: string; name: string } | null;
    createdAt: Date | null;
  }>>([]);
  const [recentProposals, setRecentProposals] = React.useState<Array<{
    id: string;
    title: string;
    status: string;
    totalAmount: number | null;
    createdAt: Date | null;
  }>>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);

        const [statsResult, oppsResult, proposalsResult] = await Promise.all([
          getDashboardStatsAction(),
          getRecentOpportunitiesAction(5),
          getRecentProposalsAction(5),
        ]);

        if (statsResult.success && statsResult.data) {
          setStats(statsResult.data);
        } else {
          throw new Error(statsResult.error || "Impossible de charger les statistiques");
        }

        if (oppsResult.success && oppsResult.data) {
          setRecentOpportunities(oppsResult.data);
        }

        if (proposalsResult.success && proposalsResult.data) {
          setRecentProposals(proposalsResult.data);
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        const message = err instanceof Error ? err.message : "Une erreur est survenue lors du chargement";
        setError(message);
        addToast({
          variant: "error",
          title: "Erreur",
          description: message,
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [addToast]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" role="status" aria-live="polite">
        <Loader size="lg" />
        <span className="sr-only">Chargement du tableau de bord...</span>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="glass card-shadow p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Erreur</h1>
        <p className="text-gray-600 dark:text-gray-400">{error || "Impossible de charger les données"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tableau de bord Commercial</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Vue d'ensemble de votre activité commerciale</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Opportunités"
          value={stats.opportunities.total}
          subtitle={`${stats.opportunities.byStage.CLOSED_WON} gagnées`}
          icon={
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          variant="primary"
        />
        <StatCard
          title="Valeur totale"
          value={formatCurrency(stats.opportunities.totalValue)}
          subtitle={`${formatCurrency(stats.opportunities.wonValue)} gagnées`}
          icon={
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          variant="success"
        />
        <StatCard
          title="Taux de conversion"
          value={`${stats.opportunities.conversionRate}%`}
          subtitle="Opportunités gagnées"
          icon={
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
          variant="primary"
        />
        <StatCard
          title="Contacts"
          value={stats.contacts.total}
          subtitle={`${stats.contacts.withEmail} avec email`}
          icon={
            <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          variant="warning"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Entreprises"
          value={stats.companies.total}
          variant="default"
        />
        <StatCard
          title="Soumissions"
          value={stats.proposals.total}
          subtitle={`${stats.proposals.accepted} acceptées`}
          variant="default"
        />
        <StatCard
          title="Montant soumissions"
          value={formatCurrency(stats.proposals.totalAmount)}
          variant="success"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Opportunities by Stage Chart */}
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Répartition des opportunités par étape</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={Object.entries(stats.opportunities.byStage)
                  .filter(([_, count]) => count > 0)
                  .map(([stage, count]) => ({
                    name: stageLabels[stage as OpportunityStage] || stage,
                    count,
                  }))}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                  className="text-xs"
                />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCardContent>
        </GlassCard>

        {/* Proposals Status Pie Chart */}
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Statut des soumissions</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Brouillon", value: stats.proposals.draft, color: "#6b7280" },
                    { name: "Soumis", value: stats.proposals.submitted, color: "#3b82f6" },
                    { name: "Accepté", value: stats.proposals.accepted, color: "#10b981" },
                    { name: "Rejeté", value: stats.proposals.rejected, color: "#ef4444" },
                  ].filter((item) => item.value > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: "Brouillon", value: stats.proposals.draft, color: "#6b7280" },
                    { name: "Soumis", value: stats.proposals.submitted, color: "#3b82f6" },
                    { name: "Accepté", value: stats.proposals.accepted, color: "#10b981" },
                    { name: "Rejeté", value: stats.proposals.rejected, color: "#ef4444" },
                  ]
                    .filter((item) => item.value > 0)
                    .map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </GlassCardContent>
        </GlassCard>
      </div>

      {/* Recent Opportunities and Proposals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Opportunities */}
        <GlassCard>
          <GlassCardHeader className="flex justify-between items-center">
            <GlassCardTitle>Opportunités récentes</GlassCardTitle>
            <Link href="/commercial/opportunities">
              <Button variant="outline" size="sm" aria-label="Voir toutes les opportunités">
                Voir tout
              </Button>
            </Link>
          </GlassCardHeader>
          <GlassCardContent>
            {recentOpportunities.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                Aucune opportunité récente
              </p>
            ) : (
              <div className="space-y-4">
                {recentOpportunities.map((opp) => (
                  <Link
                    key={opp.id}
                    href={`/commercial/opportunities`}
                    className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:card-shadow-hover transition-all duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                          {opp.title}
                        </h3>
                        {opp.company && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {opp.company.name}
                          </p>
                        )}
                        <div className="flex items-center gap-2">
                          <Badge variant="default">{stageLabels[opp.stage]}</Badge>
                          {opp.value && (
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {formatCurrency(opp.value)}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-4">
                        {formatDate(opp.createdAt)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </GlassCardContent>
        </GlassCard>

        {/* Recent Proposals */}
        <GlassCard>
          <GlassCardHeader className="flex justify-between items-center">
            <GlassCardTitle>Soumissions récentes</GlassCardTitle>
            <Link href="/commercial/proposals">
              <Button variant="outline" size="sm" aria-label="Voir toutes les soumissions">
                Voir tout
              </Button>
            </Link>
          </GlassCardHeader>
          <GlassCardContent>
            {recentProposals.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                Aucune soumission récente
              </p>
            ) : (
              <div className="space-y-4">
                {recentProposals.map((proposal) => (
                  <Link
                    key={proposal.id}
                    href={`/commercial/proposals/${proposal.id}`}
                    className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:card-shadow-hover transition-all duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                          {proposal.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge variant={statusColors[proposal.status] || "default"}>
                            {statusLabels[proposal.status] || proposal.status}
                          </Badge>
                          {proposal.totalAmount && (
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {formatCurrency(proposal.totalAmount)}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-4">
                        {formatDate(proposal.createdAt)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </GlassCardContent>
        </GlassCard>
      </div>

      {/* Quick Actions */}
      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle>Actions rapides</GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link href="/commercial/opportunities">
              <Button variant="primary" className="w-full" aria-label="Voir les opportunités">
                Opportunités
              </Button>
            </Link>
            <Link href="/commercial/contacts">
              <Button variant="outline" className="w-full" aria-label="Voir les contacts">
                Contacts
              </Button>
            </Link>
            <Link href="/commercial/companies">
              <Button variant="outline" className="w-full" aria-label="Voir les entreprises">
                Entreprises
              </Button>
            </Link>
            <Link href="/commercial/proposals">
              <Button variant="outline" className="w-full" aria-label="Voir les soumissions">
                Soumissions
              </Button>
            </Link>
          </div>
        </GlassCardContent>
      </GlassCard>
    </div>
  );
}
