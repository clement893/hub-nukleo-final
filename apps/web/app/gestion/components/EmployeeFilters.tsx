"use client";

import { Input, Select } from "@nukleo/ui";
import { GlassCard, GlassCardContent } from "@/components/GlassCard";

interface EmployeeFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterRole: string;
  onRoleFilterChange: (value: string) => void;
}

export function EmployeeFilters({
  searchTerm,
  onSearchChange,
  filterRole,
  onRoleFilterChange,
}: EmployeeFiltersProps) {
  return (
    <GlassCard className="mb-6">
      <GlassCardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full"
            />
          </div>
          <Select
            value={filterRole}
            onChange={(e) => onRoleFilterChange(e.target.value)}
            options={[
              { value: "all", label: "Tous les rôles" },
              { value: "ADMIN", label: "Administrateur" },
              { value: "MANAGER", label: "Manager" },
              { value: "USER", label: "Utilisateur" },
            ]}
            className="w-full sm:w-48"
          />
        </div>
      </GlassCardContent>
    </GlassCard>
  );
}

