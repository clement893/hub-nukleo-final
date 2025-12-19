"use client";

import * as React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  DropdownMenu,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from "@nukleo/ui";
import { getProposalsAction, deleteProposalAction } from "./actions";
import { useToast } from "@/lib/toast";

type Proposal = {
  id: string;
  title: string;
  status: string;
  totalAmount: number | null;
  createdAt: Date;
  opportunity: {
    id: string;
    title: string;
    company: {
      id: string;
      name: string;
    } | null;
  };
};

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  SUBMITTED: "bg-blue-100 text-blue-800",
  ACCEPTED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  REVISED: "bg-yellow-100 text-yellow-800",
};

const statusLabels: Record<string, string> = {
  DRAFT: "Brouillon",
  SUBMITTED: "Soumis",
  ACCEPTED: "Accepté",
  REJECTED: "Rejeté",
  REVISED: "Révisé",
};

export default function ProposalsPage() {
  const [proposals, setProposals] = React.useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [proposalToDelete, setProposalToDelete] = React.useState<string | null>(null);
  const { addToast } = useToast();

  React.useEffect(() => {
    async function loadData() {
      try {
        const result = await getProposalsAction();
        if (result.success && result.data) {
          setProposals(result.data);
        } else {
          addToast({
            variant: "error",
            title: "Erreur",
            description: result.error || "Impossible de charger les soumissions",
          });
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

  const handleDeleteClick = (id: string) => {
    setProposalToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!proposalToDelete) return;

    try {
      const result = await deleteProposalAction(proposalToDelete);
      if (result.success) {
        setProposals(proposals.filter((p) => p.id !== proposalToDelete));
        addToast({
          variant: "success",
          title: "Succès",
          description: "La soumission a été supprimée",
        });
      } else {
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Impossible de supprimer la soumission",
        });
      }
    } catch (error) {
      console.error("Error deleting proposal:", error);
      addToast({
        variant: "error",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
      });
    } finally {
      setDeleteModalOpen(false);
      setProposalToDelete(null);
    }
  };

  if (isLoading) {
    return <p className="text-gray-500">Chargement...</p>;
  }

  return (
    <>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Soumissions</h1>
          <p className="text-gray-600 mt-2">
            Gérez vos soumissions commerciales ({proposals.length} soumission{proposals.length > 1 ? "s" : ""})
          </p>
        </div>
        <Link href="/commercial/proposals/new">
          <Button variant="primary">Nouvelle soumission</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des soumissions</CardTitle>
        </CardHeader>
        <CardContent>
          {proposals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Aucune soumission pour le moment</p>
              <Link href="/commercial/proposals/new">
                <Button variant="primary">Créer une soumission</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Opportunité</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proposals.map((proposal) => (
                  <TableRow key={proposal.id}>
                    <TableCell>
                      <Link
                        href={`/commercial/proposals/${proposal.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {proposal.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/commercial/opportunities/${proposal.opportunity.id}`}
                        className="text-gray-600 hover:underline"
                      >
                        {proposal.opportunity.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {proposal.opportunity.company?.name || "-"}
                    </TableCell>
                    <TableCell>
                      {proposal.totalAmount
                        ? new Intl.NumberFormat("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                          }).format(Number(proposal.totalAmount))
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusColors[proposal.status] || statusColors.DRAFT
                        }`}
                      >
                        {statusLabels[proposal.status] || proposal.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(proposal.createdAt).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownTrigger>
                          <Button variant="ghost" size="sm">
                            ⋮
                          </Button>
                        </DropdownTrigger>
                        <DropdownContent>
                          <DropdownItem asChild>
                            <Link href={`/commercial/proposals/${proposal.id}`}>
                              Voir
                            </Link>
                          </DropdownItem>
                          <DropdownItem asChild>
                            <Link href={`/commercial/proposals/${proposal.id}/edit`}>
                              Modifier
                            </Link>
                          </DropdownItem>
                          <DropdownSeparator />
                          <DropdownItem
                            onClick={() => handleDeleteClick(proposal.id)}
                            className="text-red-600"
                          >
                            Supprimer
                          </DropdownItem>
                        </DropdownContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Confirmer la suppression</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Êtes-vous sûr de vouloir supprimer cette soumission ? Cette action est irréversible.
              </p>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setProposalToDelete(null);
                  }}
                >
                  Annuler
                </Button>
                <Button variant="primary" onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

