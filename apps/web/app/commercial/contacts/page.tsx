"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Force dynamic rendering to avoid SSR issues with ToastProvider
export const dynamic = "force-dynamic";
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
  Select,
  Modal,
  DropdownMenu,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from "@nukleo/ui";
import {
  ContactModal,
} from "@nukleo/commercial/client";
import type { ContactFormData } from "@nukleo/commercial/client";
import {
  getContactsAction,
  getCompaniesAction,
  createContactAction,
  updateContactAction,
  deleteContactAction,
} from "./actions";
import { useToast } from "../../../lib/toast";
import { exportToCSV, exportToPDF } from "../../../lib/export";
import { calculateContactStats, type Contact } from "../../../lib/stats";
import { ContactAvatar } from "../../../components/ContactAvatar";
import { UnifiedSearchBar } from "../../../components/UnifiedSearchBar";

export default function ContactsPage() {
  const pathname = usePathname();
  const [contacts, setContacts] = React.useState<Contact[]>([]);
  const [companies, setCompanies] = React.useState<
    Array<{ id: string; name: string }>
  >([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [unifiedSearchResults, setUnifiedSearchResults] = React.useState<Set<string>>(new Set());
  const [isUnifiedSearchActive, setIsUnifiedSearchActive] = React.useState(false);
  const [filterCompany, setFilterCompany] = React.useState<string>("");
  const [filterPosition, setFilterPosition] = React.useState<string>("");
  const [hasEmail, setHasEmail] = React.useState<boolean | null>(null);
  const [hasPhone, setHasPhone] = React.useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [contactToDelete, setContactToDelete] = React.useState<Contact | null>(null);
  const [editingContact, setEditingContact] = React.useState<Contact | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(50); // Pagination: 50 items per page
  const { addToast } = useToast();

  React.useEffect(() => {
    async function loadData() {
      try {
        const [contactsResult, companiesResult] = await Promise.all([
          getContactsAction(),
          getCompaniesAction(),
        ]);

        if (contactsResult.success && contactsResult.data) {
          // Filter out contacts with null firstName or lastName and ensure proper typing
          const validContacts = contactsResult.data
            .filter((contact) => contact.firstName !== null && contact.lastName !== null)
            .map((contact) => ({
              id: contact.id,
              firstName: contact.firstName!,
              lastName: contact.lastName!,
              email: contact.email,
              phone: contact.phone,
              position: contact.position,
              company: contact.company as { id: string; name: string } | null,
            }));
          setContacts(validContacts);
        } else {
          addToast({
            variant: "error",
            title: "Erreur",
            description: contactsResult.error || "Impossible de charger les contacts",
          });
        }

        if (companiesResult.success && companiesResult.data) {
          setCompanies(companiesResult.data);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        addToast({
          variant: "error",
          title: "Erreur",
          description: "Une erreur est survenue lors du chargement des données",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [addToast]);

  // Advanced filtering
  const filteredContacts = React.useMemo(() => {
    return contacts.filter((contact) => {
      // Unified search filter (if active)
      const matchesUnifiedSearch = 
        !isUnifiedSearchActive || unifiedSearchResults.has(contact.id);

      // Search term filter (fallback if unified search not active)
      const matchesSearch =
        isUnifiedSearchActive || 
        !searchTerm ||
        contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.position?.toLowerCase().includes(searchTerm.toLowerCase());

      // Company filter
      const matchesCompany =
        !filterCompany || contact.company?.id === filterCompany;

      // Position filter
      const matchesPosition =
        !filterPosition || contact.position === filterPosition;

      // Email filter
      const matchesEmail =
        hasEmail === null || (hasEmail ? !!contact.email : !contact.email);

      // Phone filter
      const matchesPhone =
        hasPhone === null || (hasPhone ? !!contact.phone : !contact.phone);

      return (
        matchesUnifiedSearch &&
        matchesSearch &&
        matchesCompany &&
        matchesPosition &&
        matchesEmail &&
        matchesPhone
      );
    });
  }, [contacts, searchTerm, unifiedSearchResults, isUnifiedSearchActive, filterCompany, filterPosition, hasEmail, hasPhone]);

  // Pagination
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const paginatedContacts = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredContacts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredContacts, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCompany, filterPosition, hasEmail, hasPhone]);

  // Get unique positions for filter
  const uniquePositions = React.useMemo(() => {
    const positions = new Set<string>();
    contacts.forEach((contact) => {
      if (contact.position) {
        positions.add(contact.position);
      }
    });
    return Array.from(positions).sort();
  }, [contacts]);

  const handleCreateContact = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (contact: Contact) => {
    setContactToDelete(contact);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!contactToDelete) return;

    try {
      const result = await deleteContactAction(contactToDelete.id);
      if (result.success) {
        setContacts((prev) =>
          prev.filter((contact) => contact.id !== contactToDelete.id)
        );
        addToast({
          variant: "success",
          title: "Contact supprimé",
          description: `${contactToDelete.firstName} ${contactToDelete.lastName} a été supprimé avec succès`,
        });
        setIsDeleteModalOpen(false);
        setContactToDelete(null);
      } else {
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Impossible de supprimer le contact",
        });
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      addToast({
        variant: "error",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
      });
    }
  };

  const handleModalSubmit = async (data: ContactFormData) => {
    try {
      if (editingContact) {
        const result = await updateContactAction(editingContact.id, {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          position: data.position,
          companyId: data.companyId,
        });

        if (result.success && result.data) {
          setContacts((prev) =>
            prev.map((contact) =>
              contact.id === editingContact.id
                ? {
                    ...contact,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email || null,
                    phone: data.phone || null,
                    position: data.position || null,
                    company: companies.find((c) => c.id === data.companyId)
                      ? {
                          id: data.companyId!,
                          name:
                            companies.find((c) => c.id === data.companyId)
                              ?.name || "",
                        }
                      : null,
                  }
                : contact
            )
          );
          addToast({
            variant: "success",
            title: "Contact modifié",
            description: "Le contact a été modifié avec succès",
          });
        } else {
          addToast({
            variant: "error",
            title: "Erreur",
            description: result.error || "Impossible de modifier le contact",
          });
        }
      } else {
        const result = await createContactAction({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          position: data.position,
          companyId: data.companyId,
        });

        if (result.success && result.data) {
          setContacts((prev) => [
            {
              id: result.data!.id,
              firstName: result.data!.firstName,
              lastName: result.data!.lastName,
              email: result.data!.email,
              phone: result.data!.phone,
              position: result.data!.position,
              company: companies.find((c) => c.id === data.companyId)
                ? {
                    id: data.companyId!,
                    name:
                      companies.find((c) => c.id === data.companyId)?.name ||
                      "",
                  }
                : null,
            },
            ...prev,
          ]);
          addToast({
            variant: "success",
            title: "Contact créé",
            description: "Le contact a été créé avec succès",
          });
        } else {
          addToast({
            variant: "error",
            title: "Erreur",
            description: result.error || "Impossible de créer le contact",
          });
        }
      }

      setIsModalOpen(false);
      setEditingContact(null);
    } catch (error) {
      console.error("Error saving contact:", error);
      addToast({
        variant: "error",
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
      });
    }
  };

  const handleExportCSV = () => {
    const exportData = filteredContacts.map((contact) => ({
      Prénom: contact.firstName,
      Nom: contact.lastName,
      Email: contact.email || "",
      Téléphone: contact.phone || "",
      Poste: contact.position || "",
      Entreprise: contact.company?.name || "",
    }));

    exportToCSV(exportData, `contacts_${new Date().toISOString().split("T")[0]}.csv`);
    addToast({
      variant: "success",
      title: "Export réussi",
      description: "Le fichier CSV a été téléchargé",
    });
  };

  const handleExportPDF = () => {
    const exportData = filteredContacts.map((contact) => ({
      Prénom: contact.firstName,
      Nom: contact.lastName,
      Email: contact.email || "",
      Téléphone: contact.phone || "",
      Poste: contact.position || "",
      Entreprise: contact.company?.name || "",
    }));

    exportToPDF(exportData, "Liste des contacts", `contacts_${new Date().toISOString().split("T")[0]}.pdf`);
    addToast({
      variant: "success",
      title: "Export réussi",
      description: "Le fichier PDF est prêt à être imprimé",
    });
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setUnifiedSearchResults(new Set());
    setIsUnifiedSearchActive(false);
    setFilterCompany("");
    setFilterPosition("");
    setHasEmail(null);
    setHasPhone(null);
  };

  const hasActiveFilters =
    searchTerm ||
    filterCompany ||
    filterPosition ||
    hasEmail !== null ||
    hasPhone !== null;

  if (isLoading) {
    return <p className="text-gray-500">Chargement...</p>;
  }

  const stats = calculateContactStats(filteredContacts);

  const isGalleryView = pathname?.includes('/gallery');
  const isTableView = !isGalleryView && pathname?.includes('/contacts') && !pathname?.includes('/stats');

  return (
    <>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contacts</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Gérez vos contacts commerciaux ({stats.total} contact{stats.total > 1 ? "s" : ""})
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/commercial/contacts/stats" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">Statistiques</Button>
            </Link>
            <DropdownMenu>
              <DropdownTrigger>
                <Button variant="outline" className="w-full sm:w-auto">Exporter</Button>
              </DropdownTrigger>
              <DropdownContent>
                <DropdownItem onClick={handleExportCSV}>Exporter en CSV</DropdownItem>
                <DropdownItem onClick={handleExportPDF}>Exporter en PDF</DropdownItem>
              </DropdownContent>
            </DropdownMenu>
            <Button variant="primary" onClick={handleCreateContact} className="w-full sm:w-auto">
              Nouveau contact
            </Button>
          </div>
        </div>
        
        {/* Vue Selector */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 mb-6">
          <Link href="/commercial/contacts">
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
          <Link href="/commercial/contacts/gallery">
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
                  const resultContactIds = new Set(results.contacts.map(c => c.id));
                  setUnifiedSearchResults(resultContactIds);
                  setIsUnifiedSearchActive(true);
                  setSearchTerm(""); // Clear local search term
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Advanced Filters */}
        <Card className="mb-6 glass card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Entreprise
                </label>
                <Select
                  value={filterCompany}
                  onChange={(e) => setFilterCompany(e.target.value)}
                  options={[
                    { value: "", label: "Toutes les entreprises" },
                    ...companies.map((c) => ({
                      value: c.id,
                      label: c.name,
                    })),
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Poste
                </label>
                <Select
                  value={filterPosition}
                  onChange={(e) => setFilterPosition(e.target.value)}
                  options={[
                    { value: "", label: "Tous les postes" },
                    ...uniquePositions.map((p) => ({
                      value: p,
                      label: p,
                    })),
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Select
                  value={
                    hasEmail === null
                      ? ""
                      : hasEmail
                      ? "yes"
                      : "no"
                  }
                  onChange={(e) =>
                    setHasEmail(
                      e.target.value === ""
                        ? null
                        : e.target.value === "yes"
                        ? true
                        : false
                    )
                  }
                  options={[
                    { value: "", label: "Tous" },
                    { value: "yes", label: "Avec email" },
                    { value: "no", label: "Sans email" },
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <Select
                  value={
                    hasPhone === null
                      ? ""
                      : hasPhone
                      ? "yes"
                      : "no"
                  }
                  onChange={(e) =>
                    setHasPhone(
                      e.target.value === ""
                        ? null
                        : e.target.value === "yes"
                        ? true
                        : false
                    )
                  }
                  options={[
                    { value: "", label: "Tous" },
                    { value: "yes", label: "Avec téléphone" },
                    { value: "no", label: "Sans téléphone" },
                  ]}
                />
              </div>
            </div>
            {hasActiveFilters && (
              <div className="mt-4">
                <Button variant="ghost" size="sm" onClick={handleResetFilters}>
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total contacts</div>
            </CardContent>
          </Card>
          <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.withEmail}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avec email</div>
            </CardContent>
          </Card>
          <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.withPhone}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avec téléphone</div>
            </CardContent>
          </Card>
          <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.withCompany}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avec entreprise</div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Liste des contacts</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredContacts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {hasActiveFilters
                    ? "Aucun contact ne correspond aux filtres"
                    : "Aucun contact pour le moment"}
                </p>
                {!hasActiveFilters && (
                  <Button variant="outline" onClick={handleCreateContact}>
                    Créer votre premier contact
                  </Button>
                )}
                {hasActiveFilters && (
                  <Button variant="outline" onClick={handleResetFilters}>
                    Réinitialiser les filtres
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Poste</TableHead>
                    <TableHead>Entreprise</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <ContactAvatar
                            firstName={contact.firstName}
                            lastName={contact.lastName}
                            photoKey={(contact as any).photoKey}
                            size="md"
                          />
                          <div>
                            <div className="font-medium">
                              {contact.firstName} {contact.lastName}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{contact.email || "-"}</TableCell>
                      <TableCell>{contact.phone || "-"}</TableCell>
                      <TableCell>{contact.position || "-"}</TableCell>
                      <TableCell>{contact.company?.name || "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link href={`/commercial/contacts/${contact.id}`}>
                            <Button variant="ghost" size="sm">
                              Voir
                            </Button>
                          </Link>
                          <DropdownMenu>
                            <DropdownTrigger>
                              <Button variant="ghost" size="sm">
                                ⋮
                              </Button>
                            </DropdownTrigger>
                            <DropdownContent>
                              <DropdownItem
                                onClick={() => handleEditContact(contact)}
                              >
                                Modifier
                              </DropdownItem>
                              <DropdownSeparator />
                              <DropdownItem
                                onClick={() => handleDeleteClick(contact)}
                                className="text-red-600"
                              >
                                Supprimer
                              </DropdownItem>
                            </DropdownContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Affichage de {(currentPage - 1) * itemsPerPage + 1} à{" "}
              {Math.min(currentPage * itemsPerPage, filteredContacts.length)} sur{" "}
              {filteredContacts.length} contact{filteredContacts.length > 1 ? "s" : ""}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingContact(null);
        }}
        onSubmit={handleModalSubmit}
        initialData={
          editingContact
            ? {
                firstName: editingContact.firstName,
                lastName: editingContact.lastName,
                email: editingContact.email || undefined,
                phone: editingContact.phone || undefined,
                position: editingContact.position || undefined,
                companyId: editingContact.company?.id,
              }
            : undefined
        }
        companies={companies}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setContactToDelete(null);
        }}
        title="Confirmer la suppression"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setContactToDelete(null);
              }}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </Button>
          </>
        }
      >
        <p>
          Êtes-vous sûr de vouloir supprimer le contact{" "}
          <strong>
            {contactToDelete?.firstName} {contactToDelete?.lastName}
          </strong>
          ? Cette action est irréversible.
        </p>
      </Modal>
    </>
  );
}
