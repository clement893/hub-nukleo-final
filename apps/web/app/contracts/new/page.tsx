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
import { createContractAction, getCompaniesAction, getProjectsAction } from "../actions";
import { useToast } from "@/lib/toast";

interface Signer {
  name: string;
  email: string;
  role: string;
}

export default function NewContractPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingData, setIsLoadingData] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [companies, setCompanies] = React.useState<Array<{ id: string; name: string }>>([]);
  const [projects, setProjects] = React.useState<Array<{ id: string; name: string }>>([]);

  const [formData, setFormData] = React.useState({
    title: "",
    type: "SERVICE",
    companyId: "",
    projectId: "",
    contactId: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    value: 0,
    currency: "CAD",
    terms: "",
    notes: "",
    autoRenew: false,
    renewalPeriod: 12,
  });

  const [signers, setSigners] = React.useState<Signer[]>([
    { name: "", email: "", role: "" },
  ]);

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

  const handleAddSigner = () => {
    setSigners([...signers, { name: "", email: "", role: "" }]);
  };

  const handleRemoveSigner = (index: number) => {
    if (signers.length > 1) {
      setSigners(signers.filter((_, i) => i !== index));
    }
  };

  const handleSignerChange = (index: number, field: keyof Signer, value: string) => {
    const newSigners = [...signers];
    newSigners[index] = { ...newSigners[index], [field]: value };
    setSigners(newSigners);
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

    if (!formData.title) {
      addToast({
        variant: "error",
        title: "Erreur",
        description: "Veuillez saisir un titre",
      });
      return;
    }

    if (signers.some((s) => !s.name || !s.email)) {
      addToast({
        variant: "error",
        title: "Erreur",
        description: "Veuillez remplir tous les champs des signataires",
      });
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await createContractAction({
        title: formData.title,
        type: formData.type,
        companyId: formData.companyId,
        projectId: formData.projectId || undefined,
        contactId: formData.contactId || undefined,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        value: formData.value,
        currency: formData.currency,
        terms: formData.terms || undefined,
        notes: formData.notes || undefined,
        autoRenew: formData.autoRenew,
        renewalPeriod: formData.renewalPeriod || undefined,
        signers: signers.map((s) => ({
          name: s.name,
          email: s.email,
          role: s.role || undefined,
        })),
      });

      if (result.success) {
        addToast({
          variant: "success",
          title: "Succès",
          description: "Contrat créé avec succès",
        });
        router.push(`/contracts/${result.data.id}`);
      } else {
        setError(result.error || "Erreur lors de la création du contrat");
        addToast({
          variant: "error",
          title: "Erreur",
          description: result.error || "Erreur lors de la création du contrat",
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Nouveau contrat</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Créer un nouveau contrat</p>
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
                  Titre *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Titre du contrat"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type *
                </label>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  options={[
                    { value: "SERVICE", label: "Service" },
                    { value: "MAINTENANCE", label: "Maintenance" },
                    { value: "LICENSE", label: "Licence" },
                    { value: "PARTNERSHIP", label: "Partenariat" },
                    { value: "NDA", label: "NDA" },
                    { value: "OTHER", label: "Autre" },
                  ]}
                  required
                />
              </div>

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
                  Date de début *
                </label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date de fin *
                </label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Valeur *
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Devise
                </label>
                <Select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  options={[
                    { value: "CAD", label: "CAD" },
                    { value: "USD", label: "USD" },
                    { value: "EUR", label: "EUR" },
                  ]}
                />
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* Signataires */}
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Signataires</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="space-y-4">
            {signers.map((signer, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nom *
                  </label>
                  <Input
                    value={signer.name}
                    onChange={(e) => handleSignerChange(index, "name", e.target.value)}
                    placeholder="Nom du signataire"
                    required
                  />
                </div>
                <div className="md:col-span-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={signer.email}
                    onChange={(e) => handleSignerChange(index, "email", e.target.value)}
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rôle
                  </label>
                  <Input
                    value={signer.role}
                    onChange={(e) => handleSignerChange(index, "role", e.target.value)}
                    placeholder="CEO, Manager, etc."
                  />
                </div>
                <div className="md:col-span-1">
                  {signers.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleRemoveSigner(index)}
                    >
                      ×
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={handleAddSigner}>
              + Ajouter un signataire
            </Button>
          </GlassCardContent>
        </GlassCard>

        {/* Options */}
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Options</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoRenew"
                checked={formData.autoRenew}
                onChange={(e) => setFormData({ ...formData, autoRenew: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300"
              />
              <label htmlFor="autoRenew" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Renouvellement automatique
              </label>
            </div>
            {formData.autoRenew && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Période de renouvellement (mois)
                </label>
                <Input
                  type="number"
                  min="1"
                  value={formData.renewalPeriod}
                  onChange={(e) => setFormData({ ...formData, renewalPeriod: parseInt(e.target.value) || 12 })}
                />
              </div>
            )}
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
                Conditions générales
              </label>
              <Textarea
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                rows={5}
                placeholder="Conditions générales du contrat..."
              />
            </div>
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
            {isLoading ? "Création..." : "Créer le contrat"}
          </Button>
        </div>
      </form>
    </div>
  );
}

