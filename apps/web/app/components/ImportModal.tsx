"use client";

import * as React from "react";
import { Modal, Button, Card, CardHeader, CardTitle, CardContent } from "@nukleo/ui";
import { useToast } from "@/lib/toast";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete?: () => void;
  importEndpoint: string;
  expectedColumns?: string[];
}

interface ImportResult {
  success: boolean;
  summary?: {
    total: number;
    success: number;
    failed: number;
    skipped: number;
  };
  created?: Array<{ id: string; firstName: string; lastName: string }>;
  errors?: Array<{ index: number; error: string }>;
  error?: string;
}

export function ImportModal({
  isOpen,
  onClose,
  onImportComplete,
  importEndpoint,
  expectedColumns = ["firstName", "lastName", "email", "phone", "position", "companyName"],
}: ImportModalProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [isImporting, setIsImporting] = React.useState(false);
  const [preview, setPreview] = React.useState<any[]>([]);
  const [skipDuplicates, setSkipDuplicates] = React.useState(true);
  const [result, setResult] = React.useState<ImportResult | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      addToast({
        variant: "error",
        title: "Erreur",
        description: "Veuillez sélectionner un fichier CSV",
      });
      return;
    }

    setFile(selectedFile);
    setResult(null);
    parseCSV(selectedFile);
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n").filter((line) => line.trim());
      
      if (lines.length === 0 || !lines[0]) {
        addToast({
          variant: "error",
          title: "Erreur",
          description: "Le fichier CSV est vide",
        });
        return;
      }

      // Parse header
      const headers = lines[0]
        .split(",")
        .map((h) => h.trim().replace(/^"|"$/g, ""));

      // Parse data rows (limit to 10 for preview)
      const previewData = lines.slice(1, 11).map((line) => {
        const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
        const row: any = {};
        headers.forEach((header, i) => {
          row[header] = values[i] || "";
        });
        return row;
      });

      setPreview(previewData);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!file) return;

    setIsImporting(true);
    setResult(null);

    try {
      const text = await file.text();
      const lines = text.split("\n").filter((line) => line.trim());
      
      if (lines.length < 2 || !lines[0]) {
        throw new Error("Le fichier CSV doit contenir au moins un en-tête et une ligne de données");
      }

      // Parse header
      const headers = lines[0]
        .split(",")
        .map((h) => h.trim().replace(/^"|"$/g, ""));

      // Parse all data rows
      const contacts = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
        const contact: any = {};
        headers.forEach((header, i) => {
          const value = values[i] || "";
          // Map common CSV column names to our expected format
          const normalizedHeader = header.toLowerCase().replace(/\s+/g, "");
          if (normalizedHeader.includes("prenom") || normalizedHeader.includes("firstname") || normalizedHeader === "prénom") {
            contact.firstName = value;
          } else if (normalizedHeader.includes("nom") || normalizedHeader.includes("lastname") || normalizedHeader === "name") {
            contact.lastName = value;
          } else if (normalizedHeader.includes("email") || normalizedHeader === "courriel") {
            contact.email = value;
          } else if (normalizedHeader.includes("phone") || normalizedHeader.includes("téléphone") || normalizedHeader.includes("telephone") || normalizedHeader === "tel") {
            contact.phone = value;
          } else if (normalizedHeader.includes("poste") || normalizedHeader.includes("position") || normalizedHeader.includes("titre") || normalizedHeader === "title") {
            contact.position = value;
          } else if (normalizedHeader.includes("company") || normalizedHeader.includes("entreprise") || normalizedHeader.includes("société") || normalizedHeader === "societe") {
            contact.companyName = value;
          } else {
            // Fallback: use header name as-is if it matches expected columns
            const expectedKey = expectedColumns.find((col) => col.toLowerCase() === normalizedHeader);
            if (expectedKey) {
              contact[expectedKey] = value;
            }
          }
        });
        return contact;
      }).filter((contact) => contact.firstName && contact.lastName); // Only keep contacts with required fields

      if (contacts.length === 0) {
        throw new Error("Aucun contact valide trouvé dans le fichier CSV");
      }

      // Send to API
      const response = await fetch(importEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contacts,
          skipDuplicates,
        }),
      });

      const data: ImportResult = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Erreur lors de l'import");
      }

      setResult(data);
      addToast({
        variant: "success",
        title: "Import réussi",
        description: `${data.summary?.success || 0} contact(s) importé(s) avec succès`,
      });

      if (onImportComplete) {
        onImportComplete();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de l'import";
      addToast({
        variant: "error",
        title: "Erreur d'import",
        description: errorMessage,
      });
      setResult({
        success: false,
        error: errorMessage,
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview([]);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <Card>
        <CardHeader>
          <CardTitle>Importer des contacts depuis un fichier CSV</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!file && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sélectionner un fichier CSV
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Le fichier CSV doit contenir les colonnes suivantes : Prénom, Nom, Email (optionnel), Téléphone (optionnel), Poste (optionnel), Entreprise (optionnel)
              </p>
            </div>
          )}

          {file && preview.length > 0 && !result && (
            <div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Aperçu du fichier : {file.name}
                </p>
                <div className="max-h-60 overflow-auto border rounded-md">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        {Object.keys(preview[0] || {}).map((key) => (
                          <th
                            key={key}
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {preview.map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((value: any, i) => (
                            <td
                              key={i}
                              className="px-3 py-2 text-xs text-gray-900 dark:text-gray-300"
                            >
                              {value || "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Affichage des 10 premières lignes
                </p>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="skipDuplicates"
                  checked={skipDuplicates}
                  onChange={(e) => setSkipDuplicates(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="skipDuplicates" className="text-sm text-gray-700 dark:text-gray-300">
                  Ignorer les doublons (basé sur l'email)
                </label>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="primary"
                  onClick={handleImport}
                  disabled={isImporting}
                >
                  {isImporting ? "Import en cours..." : "Importer"}
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  Changer de fichier
                </Button>
              </div>
            </div>
          )}

          {result && (
            <div>
              {result.success && result.summary ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                      Import terminé avec succès
                    </h3>
                    <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <p>Total : {result.summary.total}</p>
                      <p>Réussis : {result.summary.success}</p>
                      {result.summary.skipped > 0 && (
                        <p>Ignorés (doublons) : {result.summary.skipped}</p>
                      )}
                      {result.summary.failed > 0 && (
                        <p className="text-red-600 dark:text-red-400">Échoués : {result.summary.failed}</p>
                      )}
                    </div>
                  </div>

                  {result.errors && result.errors.length > 0 && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                      <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                        Erreurs ({result.errors.length})
                      </h4>
                      <div className="max-h-40 overflow-auto text-xs text-red-700 dark:text-red-300 space-y-1">
                        {result.errors.slice(0, 10).map((error, index) => (
                          <p key={index}>
                            Ligne {error.index + 2} : {error.error}
                          </p>
                        ))}
                        {result.errors.length > 10 && (
                          <p>... et {result.errors.length - 10} autres erreurs</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="primary" onClick={handleClose}>
                      Fermer
                    </Button>
                    <Button variant="outline" onClick={handleReset}>
                      Importer un autre fichier
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {result.error || "Erreur lors de l'import"}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" onClick={handleReset}>
                      Réessayer
                    </Button>
                    <Button variant="outline" onClick={handleClose}>
                      Fermer
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Modal>
  );
}

