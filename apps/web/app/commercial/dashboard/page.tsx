import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@nukleo/ui";

export default function CommercialDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Commercial</h1>
        <p className="text-gray-600 mt-2">
          Vue d'ensemble de votre activité commerciale
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500">
              Opportunités totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-gray-500 mt-1">En cours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-5">
              Valeur totale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0 €</div>
            <p className="text-sm text-gray-500 mt-1">Pipeline</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500">
              Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-gray-500 mt-1">Actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500">
              Entreprises
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-gray-500 mt-1">En base</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Opportunités récentes</CardTitle>
            <CardDescription>
              Dernières opportunités créées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-sm">Aucune opportunité pour le moment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>
              Dernières actions sur les contacts et entreprises
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-sm">Aucune activité récente</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

