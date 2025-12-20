"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Badge,
  Loader,
  Alert,
  AlertTitle,
  AlertDescription,
} from "@nukleo/ui";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/GlassCard";
import {
  getContractAction,
  signContractAction,
  updateContractAction,
} from "../actions";
import { useToast } from "@/lib/toast";

const statusLabels: Record<string, string> = {
  DRAFT: "Brouillon",
  PENDING_SIGNATURE: "En attente de signature",
  SIGNED: "Signé",
  ACTIVE: "Actif",
  EXPIRED: "Expiré",
  CANCELLED: "Annulé",
};

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  PENDING_SIGNATURE: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  SIGNED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  EXPIRED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  CANCELLED: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
};

const typeLabels: Record<string, string> = {
  SERVICE: "Service",
  MAINTENANCE: "Maintenance",
  LICENSE: "Licence",
  PARTNERSHIP: "Partenariat",
  NDA: "NDA",
  OTHER: "Autre",
};

export default function ContractDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [contract, setContract] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);

  React.useEffect(() => {
    async function loadContract() {
      try {
        setIsLoading(true);
        setError(null);
        const result = await getContractAction(params.id);
        if (result.success && result.data) {
          setContract(result.data);
        } else {
          setError(result.error || "Contrat introuvable");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Une erreur est survenue";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }
    loadContract();
  }, [params.id]);

  const handleSign = async (signatureId: string) => {
    try {
      setIsUpdating(true);
      const result = await signContractAction(params.id, signatureId, {
        signedAt: new Date(),
      });
      if (result.success) {
        addToast({
          variant: "success",
          title: "Succès",
          description: "Signature enregistrée",
        });
        // Recharger le contrat
        const reloadResult = await getContractAction(params.id);
        if (reloadResult.success && reloadResult.data) {
          setContract(reloadResult.data);
        }
      } else {
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Erreur lors de la signature",
        });
      }
    } catch (err) {
      addToast({
        variant: "error",
        title: "Erreur",
        description: "Une erreur est survenue",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkAsActive = async () => {
    try {
      setIsUpdating(true);
      const result = await updateContractAction(params.id, {
        status: "ACTIVE",
      });
      if (result.success) {
        addToast({
          variant: "success",
          title: "Succès",
          description: "Contrat marqué comme actif",
        });
        const reloadResult = await getContractAction(params.id);
        if (reloadResult.success && reloadResult.data) {
          setContract(reloadResult.data);
        }
      } else {
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Erreur lors de la mise à jour",
        });
      }
    } catch (err) {
      addToast({
        variant: "error",
        title: "Erreur",
        description: "Une erreur est survenue",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error || "Contrat introuvable"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const allSigned = contract.signatures.every((s: any) => s.signedAt !== null);
  const hasUnsignedSignatures = contract.signatures.some((s: any) => !s.signedAt);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {contract.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {contract.number} - {contract.company.name}
          </p>
        </div>
        <div className="flex gap-2">
          {allSigned && contract.status === "SIGNED" && (
            <Button
              variant="primary"
              onClick={handleMarkAsActive}
              disabled={isUpdating}
            >
              Activer le contrat
            </Button>
          )}
          <Button variant="outline" onClick={() => router.back()}>
            Retour
          </Button>
        </div>
      </div>

      {/* Status Badge */}
      <div>
        <Badge className={statusColors[contract.status]}>
          {statusLabels[contract.status] || contract.status}
        </Badge>
      </div>

      {/* Contract Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informations client */}
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Informations client</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="space-y-2">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Client</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {contract.company.name}
              </div>
            </div>
            {contract.contact && (
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Contact</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {contract.contact.firstName} {contract.contact.lastName}
                </div>
              </div>
            )}
            {contract.project && (
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Projet</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {contract.project.name}
                </div>
              </div>
            )}
          </GlassCardContent>
        </GlassCard>

        {/* Informations contrat */}
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Informations contrat</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="space-y-2">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Numéro</div>
              <div className="font-mono font-semibold text-gray-900 dark:text-white">
                {contract.number}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Type</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {typeLabels[contract.type] || contract.type}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Date de début</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {new Date(contract.startDate).toLocaleDateString("fr-CA")}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Date de fin</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {new Date(contract.endDate).toLocaleDateString("fr-CA")}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Valeur</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {new Intl.NumberFormat("fr-CA", {
                  style: "currency",
                  currency: contract.currency,
                }).format(contract.value)}
              </div>
            </div>
            {contract.signedDate && (
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Date de signature</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {new Date(contract.signedDate).toLocaleDateString("fr-CA")}
                </div>
              </div>
            )}
            {contract.autoRenew && (
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Renouvellement automatique</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  Oui ({contract.renewalPeriod} mois)
                </div>
              </div>
            )}
          </GlassCardContent>
        </GlassCard>
      </div>

      {/* Signatures */}
      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle>Signatures</GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          <div className="space-y-4">
            {contract.signatures.map((signature: any) => (
              <div
                key={signature.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {signature.signerName}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {signature.signerEmail}
                  </div>
                  {signature.signerRole && (
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {signature.signerRole}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  {signature.signedAt ? (
                    <div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Signé
                      </Badge>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(signature.signedAt).toLocaleDateString("fr-CA")}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                        En attente
                      </Badge>
                      {hasUnsignedSignatures && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => handleSign(signature.id)}
                          disabled={isUpdating}
                        >
                          Marquer comme signé
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </GlassCardContent>
      </GlassCard>

      {/* Documents */}
      {(contract.documentUrl || contract.signedDocumentUrl) && (
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Documents</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="space-y-2">
            {contract.documentUrl && (
              <div>
                <a
                  href={contract.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  📄 Document original
                </a>
              </div>
            )}
            {contract.signedDocumentUrl && (
              <div>
                <a
                  href={contract.signedDocumentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  ✍️ Document signé
                </a>
              </div>
            )}
          </GlassCardContent>
        </GlassCard>
      )}

      {/* Terms */}
      {contract.terms && (
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Conditions générales</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {contract.terms}
            </p>
          </GlassCardContent>
        </GlassCard>
      )}

      {/* Notes */}
      {contract.notes && (
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Notes</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {contract.notes}
            </p>
          </GlassCardContent>
        </GlassCard>
      )}
    </div>
  );
}

