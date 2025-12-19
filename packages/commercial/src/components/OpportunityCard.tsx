"use client";

import * as React from "react";
import { Card } from "@nukleo/ui";
import type { OpportunityStage } from "@nukleo/db/types";

export interface OpportunityCardProps {
  id: string;
  title: string;
  company?: string | null;
  contact?: { firstName: string; lastName: string } | null;
  value?: number | null;
  probability?: number | null;
  expectedCloseDate?: Date | null;
  stage: OpportunityStage;
  onClick?: () => void;
}

export function OpportunityCard({
  title,
  company,
  contact,
  value,
  probability,
  expectedCloseDate,
  onClick,
}: OpportunityCardProps) {
  return (
    <Card
      className="p-3 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="font-medium text-sm text-gray-900">{title}</div>
      {(company || contact) && (
        <div className="text-xs text-gray-500 mt-1">
          {company || `${contact?.firstName} ${contact?.lastName}`}
        </div>
      )}
      {value && (
        <div className="text-sm font-semibold mt-2 text-gray-900">
          {value.toLocaleString("fr-FR", {
            style: "currency",
            currency: "EUR",
          })}
        </div>
      )}
      <div className="flex justify-between items-center mt-2">
        {probability !== null && probability !== undefined && (
          <span className="text-xs text-gray-500">
            {probability}% de chance
          </span>
        )}
        {expectedCloseDate && (
          <span className="text-xs text-gray-500">
            {expectedCloseDate.toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
            })}
          </span>
        )}
      </div>
    </Card>
  );
}

