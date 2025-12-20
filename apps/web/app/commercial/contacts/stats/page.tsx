"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@nukleo/ui";
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
} from "recharts";
import { getContactsAction } from "../actions";
import { calculateContactStats, type Contact } from "@/lib/stats";

export default function ContactsStatsPage() {
  const [contacts, setContacts] = React.useState<Contact[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        const result = await getContactsAction();
        if (result.success && result.data) {
          // Filter out contacts with null firstName or lastName and ensure proper typing
          const validContacts = result.data
            .filter((contact) => contact.firstName !== null && contact.lastName !== null)
            .map((contact) => ({
              id: contact.id,
              firstName: contact.firstName!,
              lastName: contact.lastName!,
              email: contact.email,
              phone: contact.phone,
              position: contact.position,
              company: contact.company as { id: string; name: string } | null,
            }));
          setContacts(validContacts);
        }
      } catch (error) {
        console.error("Error loading contacts:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading) {
    return <p className="text-gray-500 dark:text-gray-400">Chargement...</p>;
  }

  const stats = calculateContactStats(contacts);

  // Prepare data for charts
  const companyData = stats.byCompany.slice(0, 10).map((item) => ({
    name: item.company.length > 20 ? item.company.substring(0, 20) + "..." : item.company,
    value: item.count,
    fullName: item.company,
  }));

  const positionData = stats.byPosition.slice(0, 10).map((item) => ({
    name: item.position.length > 20 ? item.position.substring(0, 20) + "..." : item.position,
    value: item.count,
    fullName: item.position,
  }));

  const completenessData = [
    {
      name: "Avec email",
      value: stats.withEmail,
      percentage: ((stats.withEmail / stats.total) * 100).toFixed(1),
    },
    {
      name: "Sans email",
      value: stats.total - stats.withEmail,
      percentage: (((stats.total - stats.withEmail) / stats.total) * 100).toFixed(1),
    },
  ];

  const phoneCompletenessData = [
    {
      name: "Avec téléphone",
      value: stats.withPhone,
      percentage: ((stats.withPhone / stats.total) * 100).toFixed(1),
    },
    {
      name: "Sans téléphone",
      value: stats.total - stats.withPhone,
      percentage: (((stats.total - stats.withPhone) / stats.total) * 100).toFixed(1),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Statistiques des contacts</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Analyse détaillée de vos contacts commerciaux
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total contacts</div>
          </CardContent>
        </Card>
        <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.withEmail}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Avec email ({((stats.withEmail / stats.total) * 100).toFixed(0)}%)
            </div>
          </CardContent>
        </Card>
        <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {stats.withPhone}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Avec téléphone ({((stats.withPhone / stats.total) * 100).toFixed(0)}%)
            </div>
          </CardContent>
        </Card>
        <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {stats.withCompany}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Avec entreprise ({((stats.withCompany / stats.total) * 100).toFixed(0)}%)
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Companies Distribution */}
        {companyData.length > 0 && (
          <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Répartition par entreprise</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={companyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [value, "Contacts"]}
                    labelFormatter={(label) => {
                      const item = companyData.find((d) => d.name === label);
                      return item?.fullName || label;
                    }}
                  />
                  <Bar dataKey="value" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Positions Distribution */}
        {positionData.length > 0 && (
          <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Répartition par poste</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={positionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [value, "Contacts"]}
                    labelFormatter={(label) => {
                      const item = positionData.find((d) => d.name === label);
                      return item?.fullName || label;
                    }}
                  />
                  <Bar dataKey="value" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Email Completeness */}
        <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Complétude des emails</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={completenessData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {completenessData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? "#00C49F" : "#FF8042"}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Phone Completeness */}
        <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Complétude des téléphones</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={phoneCompletenessData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {phoneCompletenessData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? "#0088FE" : "#FF8042"}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Companies */}
        {stats.byCompany.length > 0 && (
          <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Top entreprises</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.byCompany.slice(0, 10).map((item, index) => (
                  <div
                    key={item.company}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 dark:text-gray-400">#{index + 1}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{item.company}</span>
                    </div>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">
                      {item.count} contact{item.count > 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Positions */}
        {stats.byPosition.length > 0 && (
          <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Top postes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.byPosition.slice(0, 10).map((item, index) => (
                  <div
                    key={item.position}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 dark:text-gray-400">#{index + 1}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{item.position}</span>
                    </div>
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      {item.count} contact{item.count > 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

