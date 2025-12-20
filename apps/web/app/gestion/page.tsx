import { Card, CardContent, CardHeader, CardTitle, Button } from "@nukleo/ui";
import Link from "next/link";

export default function GestionPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Module Gestion
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Gérez les ressources humaines et les employés de l'organisation
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Employees */}
        <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300">
          <CardHeader>
            <CardTitle>Employés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Gérez la base de données des employés, leurs informations personnelles, départements et rôles.
            </p>
            <Link href="/gestion/employees">
              <Button variant="primary" className="w-full">
                Gérer les employés
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

