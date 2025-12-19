"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
} from "@nukleo/ui";
import Link from "next/link";
import {
  CompanyModal,
} from "@nukleo/commercial";
import type { CompanyFormData } from "@nukleo/commercial/schemas";
import {
  updateCompanyAction,
  deleteCompanyAction,
} from "../actions";
import { useRouter } from "next/navigation";

interface CompanyDetailClientProps {
  company: {
    id: string;
    name: string;
    industry?: string | null;
    website?: string | null;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    country?: string | null;
    contacts: Array<{
      id: string;
      firstName: string;
      lastName: string;
      email?: string | null;
      position?: string | null;
    }>;
    opportunities: Array<{
      id: string;
      title: string;
      value: number | null;
      stage: string;
      contact: string | null;
    }>;
  };
}

export function CompanyDetailClient({ company }: CompanyDetailClientProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${company.name} ?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteCompanyAction(company.id);
      if (result.success) {
        router.push("/commercial/companies");
      } else {
        setIsDeleting(false);
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      setIsDeleting(false);
    }
  };

  const handleModalSubmit = async (data: CompanyFormData) => {
    try {
      const result = await updateCompanyAction(company.id, {
        name: data.name,
        industry: data.industry,
        website: data.website,
        phone: data.phone,
        address: data.address,
        city: data.city,
        country: data.country,
      });

      if (result.success) {
        setIsModalOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating company:", error);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/commercial/companies">
            <Button variant="ghost" size="sm">
              ← Retour
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{company.name}</CardTitle>
                    {company.industry && (
                      <CardContent className="pt-2">
                        <Badge variant="default">{company.industry}</Badge>
                      </CardContent>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {company.website && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Site web
                      </label>
                      <p className="text-sm">
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {company.website}
                        </a>
                      </p>
                    </div>
                  )}
                  {company.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Téléphone
                      </label>
                      <p className="text-sm">
                        <a
                          href={`tel:${company.phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {company.phone}
                        </a>
                      </p>
                    </div>
                  )}
                  {(company.address || company.city || company.country) && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Adresse
                      </label>
                      <p className="text-sm">
                        {company.address && (
                          <>
                            {company.address}
                            <br />
                          </>
                        )}
                        {company.city && company.city}
                        {company.city && company.country && ", "}
                        {company.country && company.country}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Contacts ({company.contacts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {company.contacts.length === 0 ? (
                  <p className="text-sm text-gray-500">Aucun contact associé</p>
                ) : (
                  <div className="space-y-2">
                    {company.contacts.map((contact) => (
                      <Link
                        key={contact.id}
                        href={`/commercial/contacts/${contact.id}`}
                        className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-sm">
                              {contact.firstName} {contact.lastName}
                            </div>
                            {contact.position && (
                              <p className="text-xs text-gray-500 mt-1">
                                {contact.position}
                              </p>
                            )}
                            {contact.email && (
                              <p className="text-xs text-gray-500 mt-1">
                                {contact.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>
                  Opportunités ({company.opportunities.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {company.opportunities.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Aucune opportunité associée
                  </p>
                ) : (
                  <div className="space-y-2">
                    {company.opportunities.map((opp) => (
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
                            {opp.contact && (
                              <p className="text-xs text-gray-500 mt-1">
                                Contact: {opp.contact}
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
                <Button variant="outline" className="w-full" onClick={handleEdit}>
                  Modifier
                </Button>
                <Link href="/commercial/contacts">
                  <Button variant="outline" className="w-full">
                    Créer un contact
                  </Button>
                </Link>
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

      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={{
          name: company.name,
          industry: company.industry || undefined,
          website: company.website || undefined,
          phone: company.phone || undefined,
          address: company.address || undefined,
          city: company.city || undefined,
          country: company.country || undefined,
        }}
      />
    </>
  );
}

