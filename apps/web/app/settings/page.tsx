import { Button, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from "@nukleo/ui";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/GlassCard";
import { getSettingsByCategoryAction } from "./actions";
import Link from "next/link";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@nukleo/ui";

const categoryLabels: Record<string, string> = {
  general: "Général",
  email: "Email",
  billing: "Facturation",
  security: "Sécurité",
  appearance: "Apparence",
  notifications: "Notifications",
  integrations: "Intégrations",
};

export default async function SettingsPage() {
  const settingsResult = await getSettingsByCategoryAction();
  const settingsByCategory = settingsResult.success && settingsResult.data ? settingsResult.data : {};

  const categories = Object.keys(settingsByCategory).sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Paramètres
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Configurez les paramètres de l'application
          </p>
        </div>
        <Link href="/settings/new">
          <Button variant="primary">Nouveau Paramètre</Button>
        </Link>
      </div>

      {/* Settings by Category */}
      {categories.length === 0 ? (
        <GlassCard className="glass card-shadow">
          <GlassCardContent className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Aucun paramètre configuré
            </p>
            <Link href="/settings/new">
              <Button variant="primary">Créer le premier paramètre</Button>
            </Link>
          </GlassCardContent>
        </GlassCard>
      ) : (
        <Tabs defaultValue={categories[0]} className="space-y-6">
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
                      {settingsByCategory[category].map((setting) => (
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
      )}
    </div>
  );
}

