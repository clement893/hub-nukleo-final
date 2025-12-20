"use client";

import { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@nukleo/ui";
import { setupAdminAction } from "./actions";

export default function SetupAdminPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSetup = async () => {
    setLoading(true);
    try {
      const res = await setupAdminAction();
      setResult(res);
    } catch (error) {
      setResult({ success: false, error: "Erreur lors de la configuration" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuration Admin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Cette page permet de configurer les permissions administrateur pour :
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>clement@nukleo.com → Rôle ADMIN</li>
              <li>test@manus.ai → Compte de test ADMIN</li>
            </ul>

            <Button
              onClick={handleSetup}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Configuration en cours..." : "Configurer les permissions"}
            </Button>

            {result && (
              <div
                className={`p-4 rounded-lg ${
                  result.success
                    ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                    : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400"
                }`}
              >
                {result.success ? (
                  <div className="space-y-2">
                    <p className="font-semibold">✅ Configuration réussie !</p>
                    {result.data && (
                      <div className="text-sm space-y-1">
                        <p>Utilisateurs configurés :</p>
                        <ul className="list-disc list-inside">
                          {result.data.map((user: any) => (
                            <li key={user.id}>
                              {user.name} ({user.email}) - {user.role}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <p className="text-sm mt-4">
                      Vous pouvez maintenant accéder au module Admin avec ces comptes.
                    </p>
                  </div>
                ) : (
                  <p>❌ {result.error || "Erreur inconnue"}</p>
                )}
              </div>
            )}

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Note: Cette page devrait être supprimée en production.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
