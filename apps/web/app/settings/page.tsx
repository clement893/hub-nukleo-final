import { Button } from "@nukleo/ui";
import { GlassCard, GlassCardContent } from "@/components/GlassCard";
import { getSettingsByCategoryAction } from "./actions";
import Link from "next/link";
import { SettingsTabs } from "./SettingsTabs";

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
        <SettingsTabs categories={categories} settingsByCategory={settingsByCategory} />
      )}
    </div>
  );
}

