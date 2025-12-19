"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  DRAFT: "bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600",
  SUBMITTED: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50 shadow-sm",
  ACCEPTED: "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700/50 shadow-sm",
  REJECTED: "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700/50 shadow-sm",
  REVISED: "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700/50 shadow-sm",
};

const statusLabels: Record<string, string> = {
  DRAFT: "Brouillon",
  SUBMITTED: "Soumis",
  ACCEPTED: "Accepté",
  REJECTED: "Rejeté",
  REVISED: "Révisé",
};

export default function ProposalsPage() {
  const router = useRouter();
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
          // Convert Decimal values to numbers
          const mappedProposals = result.data.map((proposal: any) => ({
            ...proposal,
            totalAmount: proposal.totalAmount ? Number(proposal.totalAmount) : null,
          }));
          setProposals(mappedProposals);
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
    return <p className="text-gray-500 dark:text-gray-400">Chargement...</p>;
  }

  return (
    <>
      <div className="mb-8 flex justify-between items-center animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-2">
            Soumissions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Gérez vos soumissions commerciales ({proposals.length} soumission{proposals.length > 1 ? "s" : ""})
          </p>
        </div>
        <Link href="/commercial/proposals/new" className="hover-lift">
          <Button variant="primary" className="shadow-lg hover:shadow-xl transition-all duration-200">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle soumission
          </Button>
        </Link>
      </div>

      <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in">
        <CardHeader>
          <CardTitle>Liste des soumissions</CardTitle>
        </CardHeader>
        <CardContent>
          {proposals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">Aucune soumission pour le moment</p>
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
                  <TableRow key={proposal.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors duration-150 animate-slide-in">
                    <TableCell>
                      <Link
                        href={`/commercial/proposals/${proposal.id}`}
                        className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-all duration-200 flex items-center group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-200">{proposal.title}</span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/commercial/opportunities/${proposal.opportunity.id}`}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:underline transition-colors"
                      >
                        {proposal.opportunity.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-gray-100">
                      {proposal.opportunity.company?.name || "-"}
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-gray-100">
                      {proposal.totalAmount
                        ? new Intl.NumberFormat("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                          }).format(Number(proposal.totalAmount))
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                          statusColors[proposal.status] || statusColors.DRAFT
                        }`}
                      >
                        {statusLabels[proposal.status] || proposal.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-gray-100">
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
                          <DropdownItem
                            onClick={() => router.push(`/commercial/proposals/${proposal.id}`)}
                          >
                            Voir
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => router.push(`/commercial/proposals/${proposal.id}/edit`)}
                          >
                            Modifier
                          </DropdownItem>
                          <DropdownSeparator />
                          <DropdownItem
                            onClick={() => handleDeleteClick(proposal.id)}
                            className="text-red-600 dark:text-red-400"
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
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <Card className="w-full max-w-md glass card-shadow-hover animate-fade-in">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white text-xl font-bold">Confirmer la suppression</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
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

