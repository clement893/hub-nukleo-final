"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  Select,
  Textarea,
  Loader,
  Alert,
  AlertTitle,
  AlertDescription,
} from "@nukleo/ui";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/GlassCard";
import { createInvoiceAction, getCompaniesAction, getProjectsAction } from "../actions";
import { useToast } from "@/lib/toast";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingData, setIsLoadingData] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [companies, setCompanies] = React.useState<Array<{ id: string; name: string }>>([]);
  const [projects, setProjects] = React.useState<Array<{ id: string; name: string }>>([]);
  const [contacts, setContacts] = React.useState<Array<{ id: string; firstName: string; lastName: string }>>([]);

  const [formData, setFormData] = React.useState({
    companyId: "",
    projectId: "",
    contactId: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    paymentTerms: "Net 30",
    notes: "",
    terms: "",
  });

  const [items, setItems] = React.useState<InvoiceItem[]>([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);

  // Calculer les montants
  const subtotal = React.useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  }, [items]);

  const taxRate = 0.15; // 15%
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  // Charger les données
  React.useEffect(() => {
    async function loadData() {
      try {
        setIsLoadingData(true);
        const [companiesResult, projectsResult] = await Promise.all([
          getCompaniesAction(),
          getProjectsAction(),
        ]);
        if (companiesResult.success && companiesResult.data) {
          setCompanies(companiesResult.data);
        }
        if (projectsResult.success && projectsResult.data) {
          setProjects(projectsResult.data);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setIsLoadingData(false);
      }
    }
    loadData();
  }, []);

  const handleAddItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyId) {
      addToast({
        variant: "error",
        title: "Erreur",
        description: "Veuillez sélectionner un client",
      });
      return;
    }

    if (items.some((item) => !item.description || item.quantity <= 0 || item.unitPrice <= 0)) {
      addToast({
        variant: "error",
        title: "Erreur",
        description: "Veuillez remplir tous les champs des articles",
      });
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await createInvoiceAction({
        companyId: formData.companyId,
        projectId: formData.projectId || undefined,
        contactId: formData.contactId || undefined,
        issueDate: new Date(formData.issueDate),
        dueDate: new Date(formData.dueDate),
        paymentTerms: formData.paymentTerms || undefined,
        notes: formData.notes || undefined,
        terms: formData.terms || undefined,
        items: items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      });

      if (result.success) {
        addToast({
          variant: "success",
          title: "Succès",
          description: "Facture créée avec succès",
        });
        router.push(`/billing/${result.data.id}`);
      } else {
        setError(result.error || "Erreur lors de la création de la facture");
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Erreur lors de la création de la facture",
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(message);
      addToast({
        variant: "error",
        title: "Erreur",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Nouvelle facture</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Créer une nouvelle facture</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations générales */}
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Informations générales</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Client *
                </label>
                <Select
                  value={formData.companyId}
                  onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                  options={[
                    { value: "", label: "Sélectionner un client" },
                    ...companies.map((c) => ({ value: c.id, label: c.name })),
                  ]}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Projet
                </label>
                <Select
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  options={[
                    { value: "", label: "Aucun projet" },
                    ...projects.map((p) => ({ value: p.id, label: p.name })),
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date d'émission *
                </label>
                <Input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date d'échéance *
                </label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Conditions de paiement
                </label>
                <Select
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  options={[
                    { value: "Net 15", label: "Net 15" },
                    { value: "Net 30", label: "Net 30" },
                    { value: "Net 60", label: "Net 60" },
                    { value: "À réception", label: "À réception" },
                  ]}
                />
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* Articles */}
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Articles</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <Input
                    value={item.description}
                    onChange={(e) => handleItemChange(index, "description", e.target.value)}
                    placeholder="Description de l'article"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantité *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Prix unitaire *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, "unitPrice", parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Total
                  </label>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                    {new Intl.NumberFormat("fr-CA", {
                      style: "currency",
                      currency: "CAD",
                    }).format(item.quantity * item.unitPrice)}
                  </div>
                </div>
                <div className="md:col-span-1">
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleRemoveItem(index)}
                    >
                      ×
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={handleAddItem}>
              + Ajouter un article
            </Button>
          </GlassCardContent>
        </GlassCard>

        {/* Totaux */}
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Résumé</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Sous-total:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {new Intl.NumberFormat("fr-CA", {
                    style: "currency",
                    currency: "CAD",
                  }).format(subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">TPS/TVH (15%):</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {new Intl.NumberFormat("fr-CA", {
                    style: "currency",
                    currency: "CAD",
                  }).format(taxAmount)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-900 dark:text-white">Total:</span>
                <span className="text-gray-900 dark:text-white">
                  {new Intl.NumberFormat("fr-CA", {
                    style: "currency",
                    currency: "CAD",
                  }).format(total)}
                </span>
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* Notes */}
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Notes et conditions</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="Notes additionnelles..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Conditions générales
              </label>
              <Textarea
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                rows={3}
                placeholder="Conditions générales..."
              />
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? "Création..." : "Créer la facture"}
          </Button>
        </div>
      </form>
    </div>
  );
}

