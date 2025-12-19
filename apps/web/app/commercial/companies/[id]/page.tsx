import { Card, CardContent, Button } from "@nukleo/ui";
import Link from "next/link";
import { getCompanyById } from "@nukleo/commercial";
import { CompanyDetailClient } from "./CompanyDetailClient";

interface CompanyDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CompanyDetailPage({
  params,
}: CompanyDetailPageProps) {
  const { id } = await params;
  const company = await getCompanyById(id);

  if (!company) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">Entreprise non trouvée</p>
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
    <CompanyDetailClient
      company={{
        id: company.id,
        name: company.name,
        industry: company.industry,
        website: company.website,
        phone: company.phone,
        address: company.address,
        city: company.city,
        country: company.country,
        contacts: company.contacts.map((contact) => ({
          id: contact.id,
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          position: contact.position,
        })),
        opportunities: company.opportunities.map((opp) => ({
          id: opp.id,
          title: opp.title,
          value: opp.value ? Number(opp.value) : null,
          stage: opp.stage,
          contact: opp.contact
            ? `${opp.contact.firstName} ${opp.contact.lastName}`
            : null,
        })),
      }}
    />
  );
}
