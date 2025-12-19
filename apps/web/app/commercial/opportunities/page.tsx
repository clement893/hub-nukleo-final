"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from "@nukleo/ui";

type OpportunityStage = "NEW" | "QUALIFIED" | "PROPOSAL" | "NEGOTIATION" | "WON" | "LOST";

interface Opportunity {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: OpportunityStage;
  probability: number;
  expectedCloseDate: string;
}

const stages: OpportunityStage[] = ["NEW", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON", "LOST"];

const stageLabels: Record<OpportunityStage, string> = {
  NEW: "Nouvelle",
  QUALIFIED: "Qualifiée",
  PROPOSAL: "Proposition",
  NEGOTIATION: "Négociation",
  WON: "Gagnée",
  LOST: "Perdue",
};

const stageColors: Record<OpportunityStage, "default" | "primary" | "success" | "warning" | "error"> = {
  NEW: "default",
  QUALIFIED: "primary",
  PROPOSAL: "primary",
  NEGOTIATION: "warning",
  WON: "success",
  LOST: "error",
};

export default function OpportunitiesPage() {
  const [opportunities] = useState<Opportunity[]>([]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Opportunités</h1>
          <p className="text-gray-600 mt-2">
            Gérez votre pipeline de vente
          </p>
        </div>
        <Button variant="primary">Nouvelle opportunité</Button>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-4 min-w-max pb-4">
          {stages.map((stage) => {
            const stageOpportunities = opportunities.filter((opp) => opp.stage === stage);
            const stageValue = stageOpportunities.reduce((sum, opp) => sum + opp.value, 0);

            return (
              <div key={stage} className="flex-shrink-0 w-80">
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">{stageLabels[stage]}</CardTitle>
                      <Badge variant={stageColors[stage]}>{stageOpportunities.length}</Badge>
                    </div>
                    <CardDescription className="text-sm font-medium">
                      {stageValue.toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {stageOpportunities.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-4">
                        Aucune opportunité
                      </p>
                    ) : (
                      stageOpportunities.map((opportunity) => (
                        <Card key={opportunity.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="font-medium text-sm">{opportunity.title}</div>
                          <div className="text-xs text-gray-500 mt-1">{opportunity.company}</div>
                          <div className="text-sm font-semibold mt-2">
                            {opportunity.value.toLocaleString("fr-FR", {
                              style: "currency",
                              currency: "EUR",
                            })}
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500">
                              {opportunity.probability}% de chance
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(opportunity.expectedCloseDate).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                        </Card>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

