"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@nukleo/ui";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/GlassCard";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@nukleo/ui";
import Link from "next/link";
import { Button, Badge } from "@nukleo/ui";

const categoryLabels: Record<string, string> = {
  general: "Général",
  email: "Email",
  billing: "Facturation",
  security: "Sécurité",
  appearance: "Apparence",
  notifications: "Notifications",
  integrations: "Intégrations",
};

interface SettingsTabsProps {
  categories: string[];
  settingsByCategory: Record<string, any[]>;
}

export function SettingsTabs({ categories, settingsByCategory }: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState(categories[0] || "");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList>
        {categories.map((category) => (
          <TabsTrigger key={category} value={category}>
            {categoryLabels[category] || category}
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map((category) => (
        <TabsContent key={category} value={category}>
          <GlassCard className="glass card-shadow">
            <GlassCardHeader>
              <GlassCardTitle>
                {categoryLabels[category] || category}
              </GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Clé</TableHead>
                    <TableHead>Valeur</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Visibilité</TableHead>
                    <TableHead>Dernière modification</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(settingsByCategory[category] || []).map((setting) => (
                    <TableRow key={setting.id}>
                      <TableCell className="font-medium">
                        <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {setting.key}
                        </code>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {typeof setting.value === "object"
                            ? JSON.stringify(setting.value)
                            : String(setting.value)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {setting.description || (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={setting.isPublic ? "success" : "secondary"}>
                          {setting.isPublic ? "Public" : "Privé"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {setting.updatedBy ? (
                          <div>
                            <div className="text-sm">
                              {setting.updatedBy.name || setting.updatedBy.email}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(setting.updatedAt).toLocaleDateString("fr-FR")}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/settings/${setting.key}/edit`}>
                          <Button variant="secondary" size="sm">
                            Modifier
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </GlassCardContent>
          </GlassCard>
        </TabsContent>
      ))}
    </Tabs>
  );
}

