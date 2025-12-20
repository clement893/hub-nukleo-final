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
  Modal,
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
} from "../actions";
import { CompanyLogo } from "../../../../components/CompanyLogo";
import { UnifiedSearchBar } from "../../../../components/UnifiedSearchBar";

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

export default function CompaniesGalleryPage() {
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
  const [selectedCompany, setSelectedCompany] = React.useState<Company | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);
  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);

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
    (company) => {
      if (isUnifiedSearchActive) {
        return unifiedSearchResults.has(company.id);
      }
      return (
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
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
              logoKey: (result.data as any).logoKey,
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

  const handleImageClick = async (company: Company) => {
    if (!company.logoKey) return;
    
    setSelectedCompany(company);
    setIsImageModalOpen(true);
    
    // Fetch presigned URL for the logo
    try {
      const response = await fetch(`/api/files/${encodeURIComponent(company.logoKey)}/presigned?type=download&expiresIn=3600`);
      const data = await response.json();
      if (data.success && data.url) {
        setLogoUrl(data.url);
      }
    } catch (error) {
      console.error("Error fetching logo URL:", error);
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Galerie des entreprises</h1>
            <p className="text-gray-600 dark:text-gray-200 mt-2">
              Visualisez les logos de vos entreprises ({filteredCompanies.length} entreprise{filteredCompanies.length > 1 ? "s" : ""})
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={handleCreateCompany}>
              Nouvelle entreprise
            </Button>
          </div>
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

      {/* Unified Search Bar */}
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

      {/* Gallery Grid */}
      <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Galerie des entreprises</CardTitle>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredCompanies.map((company) => {
                const hasLogo = !!company.logoKey;
                return (
                  <div
                    key={company.id}
                    className={`group relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 ${
                      hasLogo ? 'cursor-pointer' : ''
                    }`}
                    onClick={() => hasLogo && handleImageClick(company)}
                  >
                    <div className="aspect-square relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center p-8">
                      {hasLogo ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <CompanyLogo
                            companyName={company.name}
                            logoKey={company.logoKey}
                            size={120}
                            className="transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <CompanyLogo
                            companyName={company.name}
                            logoKey={null}
                            size={120}
                          />
                        </div>
                      )}
                      {hasLogo && (
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gray-700 dark:text-gray-300 text-sm font-medium">
                            Cliquer pour agrandir
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                        {company.name}
                      </h3>
                      {company.industry && (
                        <div className="mb-2">
                          <Badge variant="default">{company.industry}</Badge>
                        </div>
                      )}
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        {company.city && company.country && (
                          <p>{company.city}, {company.country}</p>
                        )}
                        {company.website && (
                          <p className="truncate">{company.website}</p>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <Link href={`/commercial/companies/${company.id}`}>
                          <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                            Voir
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCompany(company);
                          }}
                        >
                          Modifier
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Modal for Full Size View */}
      <Modal
        isOpen={isImageModalOpen}
        onClose={() => {
          setIsImageModalOpen(false);
          setSelectedCompany(null);
          setLogoUrl(null);
        }}
        title={selectedCompany?.name || ""}
        size="lg"
      >
        {selectedCompany && logoUrl && (
          <div className="flex flex-col items-center">
            <div className="w-full max-w-2xl aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center p-8">
              <img
                src={logoUrl}
                alt={`${selectedCompany.name} logo`}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
            <div className="mt-4 w-full text-center">
              {selectedCompany.industry && (
                <div className="mb-2">
                  <Badge variant="default">{selectedCompany.industry}</Badge>
                </div>
              )}
              {selectedCompany.city && selectedCompany.country && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {selectedCompany.city}, {selectedCompany.country}
                </p>
              )}
              {selectedCompany.website && (
                <a
                  href={selectedCompany.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {selectedCompany.website}
                </a>
              )}
              {selectedCompany.phone && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {selectedCompany.phone}
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>

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

