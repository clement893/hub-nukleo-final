"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@nukleo/ui";

interface DashboardKPIsProps {
  totalOpportunities: number;
  conversionRate: number;
  totalRevenue: number;
  contactsCount: number;
  companiesCount: number;
}

export function DashboardKPIs({
  totalOpportunities,
  conversionRate,
  totalRevenue,
  contactsCount,
  companiesCount,
}: DashboardKPIsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-500">
            Opportunités totales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalOpportunities}</div>
          <p className="text-sm text-gray-500 mt-1">En cours</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-500">
            Taux de conversion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{conversionRate}%</div>
          <p className="text-sm text-gray-500 mt-1">Gagné / Total</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-500">
            Revenu total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {totalRevenue.toLocaleString("fr-FR", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 0,
            })}
          </div>
          <p className="text-sm text-gray-500 mt-1">Généré</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-500">
            Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{contactsCount}</div>
          <p className="text-sm text-gray-500 mt-1">Actifs</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-500">
            Entreprises
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{companiesCount}</div>
          <p className="text-sm text-gray-500 mt-1">En base</p>
        </CardContent>
      </Card>
    </div>
  );
}

