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
    <Card>
      <CardHeader>
        <CardTitle>Pipeline de vente</CardTitle>
        <CardDescription>
          Montant par étape du processus de vente
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Aucune donnée disponible
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis
                tickFormatter={(value) =>
                  `${(value / 1000).toFixed(0)}k €`
                }
              />
              <Tooltip
                formatter={(value: number) => [
                  `${value.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  })}`,
                  "Montant",
                ]}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

