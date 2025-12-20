"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ProposalForm } from "@/components/ProposalForm";
import { createProposalAction } from "../../actions";
import { getAllOpportunitiesAction } from "../../actions";
import { useToast } from "@/lib/toast";
import type { ProposalFormData } from "@nukleo/commercial";

type Opportunity = {
  id: string;
  title: string;
  company: { id: string; name: string } | null;
};

export default function NewProposalPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [opportunities, setOpportunities] = React.useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadOpportunities() {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getAllOpportunitiesAction();
        if (result.success && result.data) {
          setOpportunities(result.data);
        } else {
          const errorMessage = result.error || "Impossible de charger les opportunités";
          setError(errorMessage);
          addToast({
            variant: "error",
            title: "Erreur",
            description: errorMessage,
          });
        }
      } catch (error) {
        console.error("Error loading opportunities:", error);
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
    loadOpportunities();
  }, [addToast]);

  const handleSubmit = async (data: ProposalFormData) => {
    try {
      const result = await createProposalAction(data);
      if (result.success && result.data) {
        addToast({
          variant: "success",
          title: "Succès",
          description: "La soumission a été créée avec succès",
        });
        router.push(`/commercial/proposals/${result.data.id}`);
      } else {
        throw new Error(result.error || "Impossible de créer la soumission");
      }
    } catch (error) {
      console.error("Error creating proposal:", error);
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Nouvelle soumission</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Créez une nouvelle soumission commerciale</p>
      </div>

      <ProposalForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        opportunities={opportunities}
        isEditing={false}
      />
    </div>
  );
}
