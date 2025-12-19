"use client";

import * as React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Badge,
} from "@nukleo/ui";
import {
  CompanyModal,
  type CompanyFormData,
} from "@nukleo/commercial";
import {
  getCompaniesListAction,
  createCompanyAction,
  updateCompanyAction,
} from "./actions";

interface Company {
  id: string;
  name: string;
  industry?: string | null;
  website?: string | null;
  phone?: string | null;
  city?: string | null;
  country?: string | null;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingCompany, setEditingCompany] = React.useState<Company | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        const result = await getCompaniesListAction();

        if (result.success && result.data) {
          setCompanies(result.data);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCompany = () => {
    setEditingCompany(null);
    setIsModalOpen(true);
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data: CompanyFormData) => {
    try {
      if (editingCompany) {
        const result = await updateCompanyAction(editingCompany.id, {
          name: data.name,
          industry: data.industry,
          website: data.website,
          phone: data.phone,
          address: data.address,
          city: data.city,
          country: data.country,
        });

        if (result.success && result.data) {
          setCompanies((prev) =>
            prev.map((company) =>
              company.id === editingCompany.id
                ? {
                    ...company,
                    name: data.name,
                    industry: data.industry || null,
                    website: data.website || null,
                    phone: data.phone || null,
                    city: data.city || null,
                    country: data.country || null,
                  }
                : company
            )
          );
        }
      } else {
        const result = await createCompanyAction({
          name: data.name,
          industry: data.industry,
          website: data.website,
          phone: data.phone,
          address: data.address,
          city: data.city,
          country: data.country,
        });

        if (result.success && result.data) {
          setCompanies((prev) => [
            {
              id: result.data!.id,
              name: result.data!.name,
              industry: result.data!.industry,
              website: result.data!.website,
              phone: result.data!.phone,
              city: result.data!.city,
              country: result.data!.country,
            },
            ...prev,
          ]);
        }
      }

      setIsModalOpen(false);
      setEditingCompany(null);
    } catch (error) {
      console.error("Error saving company:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Entreprises</h1>
            <p className="text-gray-600 mt-2">
              Gérez vos entreprises clientes et prospects
            </p>
          </div>
          <Button variant="primary" onClick={handleCreateCompany}>
            Nouvelle entreprise
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <Input
              placeholder="Rechercher une entreprise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Liste des entreprises</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredCompanies.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  {searchTerm
                    ? "Aucune entreprise trouvée"
                    : "Aucune entreprise pour le moment"}
                </p>
                {!searchTerm && (
                  <Button variant="outline" onClick={handleCreateCompany}>
                    Créer votre première entreprise
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Industrie</TableHead>
                    <TableHead>Ville</TableHead>
                    <TableHead>Pays</TableHead>
                    <TableHead>Site web</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <div className="font-medium">{company.name}</div>
                      </TableCell>
                      <TableCell>
                        {company.industry ? (
                          <Badge variant="default">{company.industry}</Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{company.city || "-"}</TableCell>
                      <TableCell>{company.country || "-"}</TableCell>
                      <TableCell>
                        {company.website ? (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            {company.website}
                          </a>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <Link href={`/commercial/companies/${company.id}`}>
                          <Button variant="ghost" size="sm">
                            Voir
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCompany(null);
        }}
        onSubmit={handleModalSubmit}
        initialData={
          editingCompany
            ? {
                name: editingCompany.name,
                industry: editingCompany.industry || undefined,
                website: editingCompany.website || undefined,
                phone: editingCompany.phone || undefined,
                city: editingCompany.city || undefined,
                country: editingCompany.country || undefined,
              }
            : undefined
        }
      />
    </>
  );
}
