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
      <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Opportunités totales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{totalOpportunities}</div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">En cours</p>
        </CardContent>
      </Card>

      <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Taux de conversion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{conversionRate}%</div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gagné / Total</p>
        </CardContent>
      </Card>

      <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Revenu total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {totalRevenue.toLocaleString("fr-FR", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 0,
            })}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Généré</p>
        </CardContent>
      </Card>

      <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{contactsCount}</div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Actifs</p>
        </CardContent>
      </Card>

      <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Entreprises
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{companiesCount}</div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">En base</p>
        </CardContent>
      </Card>
    </div>
  );
}


