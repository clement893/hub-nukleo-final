"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Loader,
} from "@nukleo/ui";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/GlassCard";
import { getOpportunityByIdAction } from "../actions";
import { getCompaniesForOpportunitiesAction, getContactsForOpportunitiesAction } from "../actions";
import { OpportunityModal } from "@nukleo/commercial/client";
import type { OpportunityFormData } from "@nukleo/commercial/client";
import type { OpportunityStage } from "@nukleo/db/types";

const stageLabels: Record<OpportunityStage, string> = {
  IDEAS_CONTACT_PROJECT: "💡 Idées",
  FOLLOW_UP_EMAILS: "📧 Relances",
  MEETING_BOOKED: "📅 RDV planifié",
  IN_DISCUSSION: "💬 Discussion",
  PROPOSAL_TO_DO: "📝 Proposition à faire",
  PROPOSAL_SENT: "📤 Proposition envoyée",
  CONTRACT_TO_DO: "📄 Contrat à faire",
  CLOSED_WON: "✅ Gagnée",
  CLOSED_LOST: "❌ Perdue",
  RENEWALS_POTENTIAL_UPCOMING: "🔄 Renouvellements",
  WAITING_OR_SILENT: "⏸️ En attente",
};

const stageColors: Record<
  OpportunityStage,
  "default" | "primary" | "success" | "warning" | "error"
> = {
  IDEAS_CONTACT_PROJECT: "default",
  FOLLOW_UP_EMAILS: "primary",
  MEETING_BOOKED: "primary",
  IN_DISCUSSION: "primary",
  PROPOSAL_TO_DO: "warning",
  PROPOSAL_SENT: "warning",
  CONTRACT_TO_DO: "warning",
  CLOSED_WON: "success",
  CLOSED_LOST: "error",
  RENEWALS_POTENTIAL_UPCOMING: "default",
  WAITING_OR_SILENT: "default",
};

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [opportunity, setOpportunity] = React.useState<any>(null);
  const [companies, setCompanies] = React.useState<Array<{ id: string; name: string }>>([]);
  const [contacts, setContacts] = React.useState<Array<{ id: string; firstName: string; lastName: string }>>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    async function loadOpportunity() {
      try {
        setIsLoading(true);
        const [oppResult, companiesResult, contactsResult] = await Promise.all([
          getOpportunityByIdAction(id),
          getCompaniesForOpportunitiesAction(),
          getContactsForOpportunitiesAction(),
        ]);
        
        if (oppResult.success && oppResult.data) {
          setOpportunity(oppResult.data);
          setError(null);
        } else {
          setError(oppResult.error || "Opportunité non trouvée");
        }

        if (companiesResult.success && companiesResult.data) {
          setCompanies(companiesResult.data);
        }

        if (contactsResult.success && contactsResult.data) {
          setContacts(contactsResult.data);
        }
      } catch (err) {
        console.error("Error loading opportunity:", err);
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      loadOpportunity();
    }
  }, [id]);

  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 font-semibold mb-2">
                {error || "Opportunité non trouvée"}
              </p>
              <Link href="/commercial/opportunities">
                <Button variant="primary">Retour aux opportunités</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/commercial/opportunities">
              <Button variant="ghost" size="sm">
                ← Retour
              </Button>
            </Link>
            <Badge variant={stageColors[opportunity.stage as OpportunityStage]}>
              {stageLabels[opportunity.stage as OpportunityStage]}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {opportunity.title}
          </h1>
          {opportunity.description && (
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {opportunity.description}
            </p>
          )}
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Modifier
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard>
            <GlassCardHeader>
              <GlassCardTitle>Informations générales</GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Valeur
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(opportunity.value)}
                  </p>
                </div>
                {opportunity.probability !== null && opportunity.probability !== undefined && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Probabilité
                    </p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {opportunity.probability}%
                    </p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Date d'ouverture
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {formatDate(opportunity.openDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Date de clôture prévue
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {formatDate(opportunity.expectedCloseDate)}
                  </p>
                </div>
                {opportunity.actualCloseDate && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Date de clôture réelle
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {formatDate(opportunity.actualCloseDate)}
                    </p>
                  </div>
                )}
              </div>
            </GlassCardContent>
          </GlassCard>
        </div>

        {/* Right Column - Related Info */}
        <div className="space-y-6">
          {/* Company */}
          {opportunity.company && (
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle>Entreprise</GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <Link
                  href={`/commercial/companies/${opportunity.company.id}`}
                  className="text-primary hover:underline font-medium"
                >
                  {opportunity.company.name}
                </Link>
              </GlassCardContent>
            </GlassCard>
          )}

          {/* Contact */}
          {opportunity.contact && (
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle>Contact</GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <Link
                  href={`/commercial/contacts/${opportunity.contact.id}`}
                  className="text-primary hover:underline font-medium"
                >
                  {opportunity.contact.firstName} {opportunity.contact.lastName}
                </Link>
                {opportunity.contact.email && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {opportunity.contact.email}
                  </p>
                )}
              </GlassCardContent>
            </GlassCard>
          )}

          {/* Owner */}
          {opportunity.owner && (
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle>Propriétaire</GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <p className="text-gray-900 dark:text-white">
                  {opportunity.owner.name}
                </p>
              </GlassCardContent>
            </GlassCard>
          )}

          {/* Dates */}
          <GlassCard>
            <GlassCardHeader>
              <GlassCardTitle>Dates</GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent className="space-y-2 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Créée le</p>
                <p className="text-gray-900 dark:text-white">
                  {formatDate(opportunity.createdAt)}
                </p>
              </div>
              {opportunity.updatedAt && (
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Modifiée le</p>
                  <p className="text-gray-900 dark:text-white">
                    {formatDate(opportunity.updatedAt)}
                  </p>
                </div>
              )}
            </GlassCardContent>
          </GlassCard>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && opportunity && (
        <OpportunityModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={async (data: OpportunityFormData) => {
            const { updateOpportunityAction } = await import("../actions");
            const result = await updateOpportunityAction(opportunity.id, {
              title: data.title,
              description: data.description,
              value: data.value,
              stage: data.stage,
              expectedCloseDate: data.expectedCloseDate,
              companyId: data.companyId,
              contactId: data.contactId,
            });
            if (result.success) {
              setIsModalOpen(false);
              router.refresh();
              window.location.reload();
            }
          }}
          initialData={{
            title: opportunity.title,
            description: opportunity.description || undefined,
            value: opportunity.value ?? undefined,
            stage: opportunity.stage,
            expectedCloseDate: opportunity.expectedCloseDate
              ? new Date(opportunity.expectedCloseDate).toISOString().split("T")[0]
              : undefined,
            companyId: opportunity.company?.id,
            contactId: opportunity.contact?.id,
          }}
          companies={companies}
          contacts={contacts}
        />
      )}
    </div>
  );
}

