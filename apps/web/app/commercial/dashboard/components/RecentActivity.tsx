"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@nukleo/ui";
import Link from "next/link";

interface RecentActivityProps {
  opportunities: Array<{
    id: string;
    title: string;
    value: number;
    stage: string;
    createdAt: Date;
    company: { name: string } | null;
    contact: { firstName: string; lastName: string } | null;
  }>;
  contacts: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: Date;
    company: { name: string } | null;
  }>;
  companies: Array<{
    id: string;
    name: string;
    createdAt: Date;
  }>;
}

export function RecentActivity({
  opportunities,
  contacts,
  companies,
}: RecentActivityProps) {
  const allActivities = [
    ...opportunities.map((opp) => ({
      type: "opportunity" as const,
      id: opp.id,
      title: opp.title,
      subtitle: opp.company?.name || "Sans entreprise",
      value: opp.value,
      date: opp.createdAt,
      url: `/commercial/opportunities`,
    })),
    ...contacts.map((contact) => ({
      type: "contact" as const,
      id: contact.id,
      title: `${contact.firstName} ${contact.lastName}`,
      subtitle: contact.company?.name || "Sans entreprise",
      date: contact.createdAt,
      url: `/commercial/contacts/${contact.id}`,
    })),
    ...companies.map((company) => ({
      type: "company" as const,
      id: company.id,
      title: company.name,
      subtitle: "Entreprise",
      date: company.createdAt,
      url: `/commercial/companies/${company.id}`,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité récente</CardTitle>
        <CardDescription>
          Dernières actions sur les opportunités, contacts et entreprises
        </CardDescription>
      </CardHeader>
      <CardContent>
        {allActivities.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">
            Aucune activité récente
          </p>
        ) : (
          <div className="space-y-4">
            {allActivities.map((activity) => (
              <Link
                key={`${activity.type}-${activity.id}`}
                href={activity.url}
                className="block p-3 rounded-lg bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border border-gray-200/50 dark:border-gray-700/50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {activity.title}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {activity.type === "opportunity"
                          ? "Opportunité"
                          : activity.type === "contact"
                          ? "Contact"
                          : "Entreprise"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {activity.subtitle}
                      {activity.type === "opportunity" && activity.value && (
                        <span className="ml-2 font-semibold">
                          {activity.value.toLocaleString("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                          })}
                        </span>
                      )}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(activity.date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

