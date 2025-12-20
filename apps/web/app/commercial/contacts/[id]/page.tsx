import {
  Card,
  CardContent,
  Button,
} from "@nukleo/ui";
import Link from "next/link";
import {
  getContactById,
  getAllCompanies,
} from "@nukleo/commercial";
import { ContactDetailClient } from "./ContactDetailClient";

interface ContactDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ContactDetailPage({
  params,
}: ContactDetailPageProps) {
  const { id } = await params;
  const contact = await getContactById(id);
  const companies = await getAllCompanies();

  if (!contact) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">Contact non trouvé</p>
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
    <ContactDetailClient
      contact={{
        id: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        position: contact.position,
        photoKey: contact.photoKey,
        company: contact.company,
        opportunities: contact.opportunities.map((opp: { id: string; title: string; value: unknown; stage: string; company: { name: string } | null }) => ({
          id: opp.id,
          title: opp.title,
          value: opp.value ? Number(opp.value) : null,
          stage: opp.stage,
          company: opp.company?.name || null,
        })),
      }}
      companies={companies.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name }))}
    />
  );
}
