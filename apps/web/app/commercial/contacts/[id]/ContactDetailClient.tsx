"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Avatar,
} from "@nukleo/ui";
import Link from "next/link";
import {
  ContactModal,
  type ContactFormData,
  updateContact,
  deleteContact,
} from "@nukleo/commercial";
import { useRouter } from "next/navigation";

interface ContactDetailClientProps {
  contact: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string | null;
    phone?: string | null;
    position?: string | null;
    company?: { id: string; name: string } | null;
    opportunities: Array<{
      id: string;
      title: string;
      value: number | null;
      stage: string;
      company: string | null;
    }>;
  };
  companies: Array<{ id: string; name: string }>;
}

export function ContactDetailClient({
  contact,
  companies,
}: ContactDetailClientProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (
      !confirm(
        `Êtes-vous sûr de vouloir supprimer ${contact.firstName} ${contact.lastName} ?`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteContact(contact.id);
      router.push("/commercial/contacts");
    } catch (error) {
      console.error("Error deleting contact:", error);
      setIsDeleting(false);
    }
  };

  const handleModalSubmit = async (data: ContactFormData) => {
    try {
      await updateContact(contact.id, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        position: data.position,
        companyId: data.companyId,
      });

      setIsModalOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/commercial/contacts">
            <Button variant="ghost" size="sm">
              ← Retour
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar
                    size="lg"
                    fallback={`${contact.firstName[0]}${contact.lastName[0]}`}
                  />
                  <div>
                    <CardTitle>
                      {contact.firstName} {contact.lastName}
                    </CardTitle>
                    <CardContent className="pt-2">
                      <p className="text-sm text-gray-500">
                        {contact.position || "Aucun poste"}
                      </p>
                    </CardContent>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contact.email && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Email
                      </label>
                      <p className="text-sm">
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {contact.email}
                        </a>
                      </p>
                    </div>
                  )}
                  {contact.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Téléphone
                      </label>
                      <p className="text-sm">
                        <a
                          href={`tel:${contact.phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {contact.phone}
                        </a>
                      </p>
                    </div>
                  )}
                  {contact.company && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Entreprise
                      </label>
                      <p className="text-sm">
                        <Link
                          href={`/commercial/companies/${contact.company.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {contact.company.name}
                        </Link>
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Opportunités</CardTitle>
              </CardHeader>
              <CardContent>
                {contact.opportunities.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Aucune opportunité associée
                  </p>
                ) : (
                  <div className="space-y-2">
                    {contact.opportunities.map((opp) => (
                      <Link
                        key={opp.id}
                        href="/commercial/opportunities"
                        className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-sm">
                              {opp.title}
                            </div>
                            {opp.company && (
                              <p className="text-xs text-gray-500 mt-1">
                                {opp.company}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            {opp.value && (
                              <div className="text-sm font-semibold">
                                {opp.value.toLocaleString("fr-FR", {
                                  style: "currency",
                                  currency: "EUR",
                                })}
                              </div>
                            )}
                            <div className="text-xs text-gray-500 mt-1">
                              {opp.stage}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleEdit}
                >
                  Modifier
                </Button>
                <Link href="/commercial/opportunities">
                  <Button variant="outline" className="w-full">
                    Créer une opportunité
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  className="w-full"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Suppression..." : "Supprimer"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={{
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email || undefined,
          phone: contact.phone || undefined,
          position: contact.position || undefined,
          companyId: contact.company?.id,
        }}
        companies={companies}
      />
    </>
  );
}

