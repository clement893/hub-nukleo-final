"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
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
} from "@nukleo/commercial/client";
import type { CompanyFormData } from "@nukleo/commercial/client";
import {
  getCompaniesListAction,
  createCompanyAction,
  updateCompanyAction,
} from "./actions";
import { CompanyLogo } from "../../../components/CompanyLogo";
import { UnifiedSearchBar } from "../../../components/UnifiedSearchBar";

interface Company {
  id: string;
  name: string;
  industry?: string | null;
  website?: string | null;
  phone?: string | null;
  city?: string | null;
  country?: string | null;
  logoKey?: string | null;
}

export default function CompaniesPage() {
  const pathname = usePathname();
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [unifiedSearchResults, setUnifiedSearchResults] = React.useState<Set<string>>(new Set());
  const [isUnifiedSearchActive, setIsUnifiedSearchActive] = React.useState(false);
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

  const filteredCompanies = React.useMemo(() => {
    return companies.filter((company) => {
      // Unified search filter (if active)
      const matchesUnifiedSearch = 
        !isUnifiedSearchActive || unifiedSearchResults.has(company.id);

      // Search term filter (fallback if unified search not active)
      const matchesSearch =
        isUnifiedSearchActive ||
        !searchTerm ||
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.website?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.phone?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesUnifiedSearch && matchesSearch;
    });
  }, [companies, searchTerm, unifiedSearchResults, isUnifiedSearchActive]);

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
    return <p className="text-gray-500">Chargement...</p>;
  }

  const isGalleryView = pathname?.includes('/gallery');
  const isTableView = !isGalleryView && pathname?.includes('/companies');

  return (
    <>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Entreprises</h1>
            <p className="text-gray-600 dark:text-gray-200 mt-2">
              Gérez vos entreprises clientes et prospects
            </p>
          </div>
          <Button variant="primary" onClick={handleCreateCompany}>
            Nouvelle entreprise
          </Button>
        </div>
        
        {/* Vue Selector */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 mb-6">
          <Link href="/commercial/companies">
            <button
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                isTableView
                  ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              📋 Vue tableau
            </button>
          </Link>
          <Link href="/commercial/companies/gallery">
            <button
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                isGalleryView
                  ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              🖼️ Vue galerie
            </button>
          </Link>
        </div>
      </div>

        <Card className="mb-6 glass card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Recherche unifiée</CardTitle>
          </CardHeader>
          <CardContent>
            <UnifiedSearchBar
              placeholder="Rechercher dans les contacts et entreprises..."
              onSearch={(results) => {
                if (results.contacts.length === 0 && results.companies.length === 0) {
                  // No search term, clear unified search
                  setIsUnifiedSearchActive(false);
                  setUnifiedSearchResults(new Set());
                  setSearchTerm("");
                } else {
                  // Set unified search results
                  const resultCompanyIds = new Set(results.companies.map(c => c.id));
                  setUnifiedSearchResults(resultCompanyIds);
                  setIsUnifiedSearchActive(true);
                  setSearchTerm(""); // Clear local search term
                }
              }}
            />
          </CardContent>
        </Card>

        <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Liste des entreprises</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredCompanies.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
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
                        <div className="flex items-center gap-3">
                          <CompanyLogo
                            companyName={company.name}
                            logoKey={company.logoKey}
                            size={32}
                          />
                          <div className="font-medium">{company.name}</div>
                        </div>
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
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCompany(company)}
                          >
                            Modifier
                          </Button>
                          <Link href={`/commercial/companies/${company.id}`}>
                            <Button variant="ghost" size="sm">
                              Voir
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

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
