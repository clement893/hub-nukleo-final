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
  getInvoiceAction,
  markInvoiceAsSentAction,
  markInvoiceAsPaidAction,
} from "../actions";
import { useToast } from "@/lib/toast";

const statusLabels: Record<string, string> = {
  DRAFT: "Brouillon",
  SENT: "Envoyée",
  VIEWED: "Vue",
  PAID: "Payée",
  OVERDUE: "En retard",
  CANCELLED: "Annulée",
};

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  SENT: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  VIEWED: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  PAID: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  OVERDUE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  CANCELLED: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
};

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [invoiceId, setInvoiceId] = React.useState<string | null>(null);
  const [invoice, setInvoice] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);

  React.useEffect(() => {
    params.then((p) => setInvoiceId(p.id));
  }, [params]);

  React.useEffect(() => {
    if (!invoiceId) return;
    async function loadInvoice() {
      try {
        setIsLoading(true);
        setError(null);
        const result = await getInvoiceAction(invoiceId);
        if (result.success && result.data) {
          setInvoice(result.data);
        } else {
          setError(result.error || "Facture introuvable");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Une erreur est survenue";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }
    loadInvoice();
  }, [invoiceId]);

  const handleMarkAsSent = async () => {
    try {
      if (!invoiceId) return;
      setIsUpdating(true);
      const result = await markInvoiceAsSentAction(invoiceId);
      if (result.success) {
        addToast({
          variant: "success",
          title: "Succès",
          description: "Facture marquée comme envoyée",
        });
        // Recharger la facture
        const reloadResult = await getInvoiceAction(invoiceId);
        if (reloadResult.success && reloadResult.data) {
          setInvoice(reloadResult.data);
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

  const handleMarkAsPaid = async () => {
    if (!invoice || !invoiceId) return;
    
    const paidAmount = window.prompt(
      `Montant payé (Total: ${new Intl.NumberFormat("fr-CA", {
        style: "currency",
        currency: "CAD",
      }).format(invoice.total)})`,
      invoice.total.toString()
    );

    if (!paidAmount) return;

    const amount = parseFloat(paidAmount);
    if (isNaN(amount) || amount <= 0) {
      addToast({
        variant: "error",
        title: "Erreur",
        description: "Montant invalide",
      });
      return;
    }

    try {
      setIsUpdating(true);
      const result = await markInvoiceAsPaidAction(invoiceId, amount);
      if (result.success) {
        addToast({
          variant: "success",
          title: "Succès",
          description: "Facture marquée comme payée",
        });
        // Recharger la facture
        const reloadResult = await getInvoiceAction(invoiceId);
        if (reloadResult.success && reloadResult.data) {
          setInvoice(reloadResult.data);
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

  if (!invoiceId || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  if (!invoiceId || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error || "Facture introuvable"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Facture {invoice.number}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {invoice.company.name}
          </p>
        </div>
        <div className="flex gap-2">
          {invoice.status === "DRAFT" && (
            <Button
              variant="primary"
              onClick={handleMarkAsSent}
              disabled={isUpdating}
            >
              Marquer comme envoyée
            </Button>
          )}
          {(invoice.status === "SENT" || invoice.status === "VIEWED") && (
            <Button
              variant="primary"
              onClick={handleMarkAsPaid}
              disabled={isUpdating}
            >
              Marquer comme payée
            </Button>
          )}
          <Button variant="outline" onClick={() => router.back()}>
            Retour
          </Button>
        </div>
      </div>

      {/* Status Badge */}
      <div>
        <Badge className={statusColors[invoice.status]}>
          {statusLabels[invoice.status] || invoice.status}
        </Badge>
      </div>

      {/* Invoice Details */}
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
                {invoice.company.name}
              </div>
            </div>
            {invoice.contact && (
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Contact</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {invoice.contact.firstName} {invoice.contact.lastName}
                </div>
              </div>
            )}
            {invoice.project && (
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Projet</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {invoice.project.name}
                </div>
              </div>
            )}
          </GlassCardContent>
        </GlassCard>

        {/* Informations facture */}
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Informations facture</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="space-y-2">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Numéro</div>
              <div className="font-mono font-semibold text-gray-900 dark:text-white">
                {invoice.number}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Date d'émission</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {new Date(invoice.issueDate).toLocaleDateString("fr-CA")}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Date d'échéance</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {new Date(invoice.dueDate).toLocaleDateString("fr-CA")}
              </div>
            </div>
            {invoice.paymentTerms && (
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Conditions de paiement</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {invoice.paymentTerms}
                </div>
              </div>
            )}
            {invoice.sentDate && (
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Date d'envoi</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {new Date(invoice.sentDate).toLocaleDateString("fr-CA")}
                </div>
              </div>
            )}
            {invoice.paidDate && (
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Date de paiement</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {new Date(invoice.paidDate).toLocaleDateString("fr-CA")}
                </div>
              </div>
            )}
          </GlassCardContent>
        </GlassCard>
      </div>

      {/* Items */}
      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle>Articles</GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </th>
                  <th className="text-right p-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Quantité
                  </th>
                  <th className="text-right p-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Prix unitaire
                  </th>
                  <th className="text-right p-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item: any) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="p-3 text-gray-900 dark:text-white">{item.description}</td>
                    <td className="p-3 text-right text-gray-900 dark:text-white">
                      {item.quantity}
                    </td>
                    <td className="p-3 text-right text-gray-900 dark:text-white">
                      {new Intl.NumberFormat("fr-CA", {
                        style: "currency",
                        currency: "CAD",
                      }).format(item.unitPrice)}
                    </td>
                    <td className="p-3 text-right font-semibold text-gray-900 dark:text-white">
                      {new Intl.NumberFormat("fr-CA", {
                        style: "currency",
                        currency: "CAD",
                      }).format(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCardContent>
      </GlassCard>

      {/* Totaux */}
      <div className="flex justify-end">
        <GlassCard className="w-full md:w-1/2">
          <GlassCardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Sous-total:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {new Intl.NumberFormat("fr-CA", {
                    style: "currency",
                    currency: "CAD",
                  }).format(invoice.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  TPS/TVH ({invoice.taxRate * 100}%):
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {new Intl.NumberFormat("fr-CA", {
                    style: "currency",
                    currency: "CAD",
                  }).format(invoice.taxAmount)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-900 dark:text-white">Total:</span>
                <span className="text-gray-900 dark:text-white">
                  {new Intl.NumberFormat("fr-CA", {
                    style: "currency",
                    currency: "CAD",
                  }).format(invoice.total)}
                </span>
              </div>
              {invoice.paidAmount > 0 && (
                <div className="flex justify-between pt-2">
                  <span className="text-gray-600 dark:text-gray-400">Montant payé:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {new Intl.NumberFormat("fr-CA", {
                      style: "currency",
                      currency: "CAD",
                    }).format(invoice.paidAmount)}
                  </span>
                </div>
              )}
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Notes</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {invoice.notes}
            </p>
          </GlassCardContent>
        </GlassCard>
      )}

      {/* Terms */}
      {invoice.terms && (
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Conditions générales</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {invoice.terms}
            </p>
          </GlassCardContent>
        </GlassCard>
      )}
    </div>
  );
}

