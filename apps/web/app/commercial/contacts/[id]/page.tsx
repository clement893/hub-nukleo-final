import { Card, CardHeader, CardTitle, CardContent, Button, Avatar, Badge } from "@nukleo/ui";
import Link from "next/link";

interface ContactDetailPageProps {
  params: {
    id: string;
  };
}

export default function ContactDetailPage({ params }: ContactDetailPageProps) {
  // TODO: Fetch contact data using params.id
  const contact = null;

  if (!contact) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Contact non trouvé</p>
              <Link href="/commercial/contacts">
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
        <Link href="/commercial/contacts">
          <Button variant="ghost" size="sm">← Retour</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar size="lg" fallback="JD" />
                <div>
                  <CardTitle>John Doe</CardTitle>
                  <CardContent className="pt-2">
                    <p className="text-sm text-gray-500">Directeur Commercial</p>
                  </CardContent>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm">john.doe@example.com</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Téléphone</label>
                  <p className="text-sm">+33 6 12 34 56 78</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Entreprise</label>
                  <p className="text-sm">Acme Corporation</p>
                </div>
              </div>
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
              <Button variant="outline" className="w-full">Créer une opportunité</Button>
              <Button variant="danger" className="w-full">Supprimer</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

