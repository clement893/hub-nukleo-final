"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@nukleo/ui";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface PipelineChartProps {
  pipelineByStage: Array<{
    stage: string;
    value: number;
    count: number;
  }>;
}

const stageLabels: Record<string, string> = {
  NEW: "Nouvelle",
  QUALIFIED: "Qualifiée",
  PROPOSAL: "Proposition",
  NEGOTIATION: "Négociation",
  WON: "Gagnée",
  LOST: "Perdue",
};

export function PipelineChart({ pipelineByStage }: PipelineChartProps) {
  const chartData = pipelineByStage.map((item) => ({
    name: stageLabels[item.stage] || item.stage,
    value: item.value,
    count: item.count,
  }));

  return (
    <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Pipeline de vente</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Montant par étape du processus de vente
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            Aucune donnée disponible
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                stroke="#6b7280"
                className="dark:stroke-gray-400"
              />
              <YAxis
                tickFormatter={(value) =>
                  `${(value / 1000).toFixed(0)}k €`
                }
                stroke="#6b7280"
                className="dark:stroke-gray-400"
              />
              <Tooltip
                formatter={(value: number) => [
                  `${value.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  })}`,
                  "Montant",
                ]}
                contentStyle={{
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}


