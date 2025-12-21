"use client";

import * as React from "react";
import { Card } from "@nukleo/ui";
import type { OpportunityStage } from "@nukleo/db/types";

export interface OpportunityCardProps {
  id: string;
  title: string;
  company?: string | null;
  contact?: { firstName: string | null; lastName: string | null } | null;
  value?: number | null;
  expectedCloseDate?: Date | null;
  stage: OpportunityStage;
  onClick?: () => void;
}

export function OpportunityCard({
  title,
  company,
  contact,
  value,
  expectedCloseDate,
  onClick,
}: OpportunityCardProps) {
  return (
    <Card
      className="p-4 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700"
      onClick={onClick}
    >
      {/* Title */}
      <div className="font-semibold text-sm text-gray-900 dark:text-white mb-2 line-clamp-2">
        {title}
      </div>

      {/* Company or Contact */}
      {(company || contact) && (
        <div className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300 mb-2">
          <span className="text-gray-400 dark:text-gray-500">🏢</span>
          <span className="font-medium">
            {company || `${contact?.firstName || ''} ${contact?.lastName || ''}`}
          </span>
        </div>
      )}

      {/* Value */}
      {value && (
        <div className="text-base font-bold text-primary dark:text-primary-light mb-3">
          {value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          })}
        </div>
      )}

      {/* Footer: Date */}
      {expectedCloseDate && (
        <div className="flex items-center gap-1 text-xs pt-2 border-t border-gray-200 dark:border-gray-700">
          <span className="text-gray-400 dark:text-gray-500">📅</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {expectedCloseDate.toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>
      )}
    </Card>
  );
}
