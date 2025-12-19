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
  Avatar,
} from "@nukleo/ui";
import {
  ContactModal,
  type ContactFormData,
  getAllContacts,
  createContact,
  updateContact,
  getAllCompanies,
} from "@nukleo/commercial";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  position?: string | null;
  company?: { id: string; name: string } | null;
}

export default function ContactsPage() {
  const [contacts, setContacts] = React.useState<Contact[]>([]);
  const [companies, setCompanies] = React.useState<
    Array<{ id: string; name: string }>
  >([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingContact, setEditingContact] = React.useState<Contact | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        const [contactsData, companiesData] = await Promise.all([
          getAllContacts(),
          getAllCompanies(),
        ]);

        setContacts(
          contactsData.map((contact) => ({
            id: contact.id,
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email,
            phone: contact.phone,
            position: contact.position,
            company: contact.company,
          }))
        );

        setCompanies(
          companiesData.map((c) => ({ id: c.id, name: c.name }))
        );
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateContact = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data: ContactFormData) => {
    try {
      // TODO: Get current user ID from auth context
      const ownerId = "temp-user-id"; // Replace with actual user ID

      if (editingContact) {
        await updateContact(editingContact.id, {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          position: data.position,
          companyId: data.companyId,
        });

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
                          companies.find((c) => c.id === data.companyId)?.name ||
                          "",
                      }
                    : null,
                }
              : contact
          )
        );
      } else {
        const newContact = await createContact({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          position: data.position,
          companyId: data.companyId,
          ownerId,
        });

        setContacts((prev) => [
          {
            id: newContact.id,
            firstName: newContact.firstName,
            lastName: newContact.lastName,
            email: newContact.email,
            phone: newContact.phone,
            position: newContact.position,
            company: companies.find((c) => c.id === data.companyId)
              ? {
                  id: data.companyId!,
                  name:
                    companies.find((c) => c.id === data.companyId)?.name || "",
                }
              : null,
          },
          ...prev,
        ]);
      }

      setIsModalOpen(false);
      setEditingContact(null);
    } catch (error) {
      console.error("Error saving contact:", error);
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
            <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
            <p className="text-gray-600 mt-2">Gérez vos contacts commerciaux</p>
          </div>
          <Button variant="primary" onClick={handleCreateContact}>
            Nouveau contact
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <Input
              placeholder="Rechercher un contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Liste des contacts</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredContacts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  {searchTerm
                    ? "Aucun contact trouvé"
                    : "Aucun contact pour le moment"}
                </p>
                {!searchTerm && (
                  <Button variant="outline" onClick={handleCreateContact}>
                    Créer votre premier contact
                  </Button>
                )}
              </div>
            ) : (
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
                  {filteredContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar
                            fallback={`${contact.firstName[0]}${contact.lastName[0]}`}
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
                        <Link href={`/commercial/contacts/${contact.id}`}>
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
    </>
  );
}
