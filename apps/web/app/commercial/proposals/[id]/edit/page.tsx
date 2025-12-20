"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { ProposalForm } from "@/components/ProposalForm";
import { getProposalAction, updateProposalAction } from "../../actions";
import { getAllOpportunitiesAction } from "../../../actions";
import { useToast } from "@/lib/toast";
import type { ProposalFormData } from "@nukleo/commercial";

type Opportunity = {
  id: string;
  title: string;
  company: { id: string; name: string } | null;
};

export default function EditProposalPage() {
  const router = useRouter();
  const params = useParams();
  const proposalId = params.id as string;
  const { addToast } = useToast();
  const [opportunities, setOpportunities] = React.useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [initialData, setInitialData] = React.useState<Partial<ProposalFormData> | undefined>(undefined);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);

        const [proposalResult, oppsResult] = await Promise.all([
          getProposalAction(proposalId),
          getAllOpportunitiesAction(),
        ]);

        if (oppsResult.success && oppsResult.data) {
          setOpportunities(oppsResult.data);
        } else {
          addToast({
            variant: "error",
            title: "Erreur",
            description: oppsResult.error || "Impossible de charger les opportunités",
          });
        }

        if (proposalResult.success && proposalResult.data) {
          const proposal = proposalResult.data;
          setInitialData({
            title: proposal.title,
            description: proposal.description || "",
            status: proposal.status,
            totalAmount: proposal.totalAmount ? Number(proposal.totalAmount) : null,
            validUntil: proposal.validUntil ? new Date(proposal.validUntil) : null,
            opportunityId: proposal.opportunityId ?? undefined,
            sections: proposal.sections.map((section) => ({
              id: section.id,
              title: section.title,
              description: section.description || "",
              order: section.order,
              items: section.items.map((item) => ({
                id: item.id,
                title: item.title,
                description: item.description || "",
                type: item.type as "DELIVERABLE" | "SERVICE" | "PRODUCT" | "OTHER",
                quantity: item.quantity || null,
                unitPrice: item.unitPrice ? Number(item.unitPrice) : null,
                totalPrice: item.totalPrice ? Number(item.totalPrice) : null,
                order: item.order,
              })),
            })),
            processes: proposal.processes.map((process: { id: string; title: string; description: string | null; order: number; estimatedDuration: number | null }) => ({
              id: process.id,
              title: process.title,
              description: process.description || "",
              order: process.order,
              estimatedDuration: process.estimatedDuration || null,
            })),
          });
        } else {
          const errorMessage = proposalResult.error || "Impossible de charger la soumission";
          setError(errorMessage);
          addToast({
            variant: "error",
            title: "Erreur",
            description: errorMessage,
          });
          router.push("/commercial/proposals");
        }
      } catch (error) {
        console.error("Error loading data:", error);
        const message = error instanceof Error ? error.message : "Une erreur est survenue lors du chargement";
        setError(message);
        addToast({
          variant: "error",
          title: "Erreur",
          description: message,
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [proposalId, router, addToast]);

  const handleSubmit = async (data: ProposalFormData) => {
    try {
      const result = await updateProposalAction(proposalId, data);
      if (result.success && result.data) {
        addToast({
          variant: "success",
          title: "Succès",
          description: "La soumission a été mise à jour avec succès",
        });
        router.push(`/commercial/proposals/${proposalId}`);
      } else {
        throw new Error(result.error || "Impossible de mettre à jour la soumission");
      }
    } catch (error) {
      console.error("Error updating proposal:", error);
      throw error;
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (error && !isLoading) {
    return (
      <div className="glass card-shadow p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Erreur</h1>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Modifier la soumission</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Modifiez les informations de la soumission</p>
      </div>

      <ProposalForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        opportunities={opportunities}
        isEditing={true}
      />
    </div>
  );
}
