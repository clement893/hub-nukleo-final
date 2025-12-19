import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from "@nukleo/ui";
import Link from "next/link";

interface CompanyDetailPageProps {
  params: {
    id: string;
  };
}

export default function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  // TODO: Fetch company data using params.id
  void params.id; // Will be used when implementing data fetching
  const company = null;

  if (!company) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Entreprise non trouvée</p>
              <Link href="/commercial/companies">
                <Button variant="outline">Retour à la liste</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/commercial/companies">
          <Button variant="ghost" size="sm">← Retour</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Acme Corporation</CardTitle>
                  <CardContent className="pt-2">
                    <Badge variant="default">Technologie</Badge>
                  </CardContent>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Site web</label>
                  <p className="text-sm">
                    <a
                      href="https://example.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      https://example.com
                    </a>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Téléphone</label>
                  <p className="text-sm">+33 1 23 45 67 89</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Adresse</label>
                  <p className="text-sm">
                    123 Rue Example<br />
                    75001 Paris<br />
                    France
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Aucun contact associé</p>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Opportunités</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Aucune opportunité associée</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full">Modifier</Button>
              <Button variant="outline" className="w-full">Créer un contact</Button>
              <Button variant="outline" className="w-full">Créer une opportunité</Button>
              <Button variant="danger" className="w-full">Supprimer</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

