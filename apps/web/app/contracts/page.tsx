import { Button, Badge } from "@nukleo/ui";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/GlassCard";
import { getContractsAction, getContractsStatsAction, getExpiringContractsAction } from "./actions";
import Link from "next/link";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@nukleo/ui";

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

export default async function ContractsPage() {
  const [contractsResult, statsResult, expiringResult] = await Promise.all([
    getContractsAction(),
    getContractsStatsAction(),
    getExpiringContractsAction(30),
  ]);

  const contracts = contractsResult.success && contractsResult.data ? contractsResult.data : [];
  const stats = statsResult.success ? statsResult.data : null;
  const expiring = expiringResult.success && expiringResult.data ? expiringResult.data : [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contrats</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gestion des contrats et signatures
          </p>
        </div>
        <Link href="/contracts/new">
          <Button variant="primary">+ Nouveau contrat</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard>
          <GlassCardContent className="pt-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Total contrats</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {stats?.totalContracts || 0}
            </div>
          </GlassCardContent>
        </GlassCard>

        <GlassCard>
          <GlassCardContent className="pt-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Actifs</div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
              {stats?.activeContracts || 0}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(stats?.totalValue || 0)}
            </div>
          </GlassCardContent>
        </GlassCard>

        <GlassCard>
          <GlassCardContent className="pt-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">En attente</div>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">
              {stats?.pendingSignature || 0}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Signatures</div>
          </GlassCardContent>
        </GlassCard>

        <GlassCard>
          <GlassCardContent className="pt-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Expirent bientôt</div>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
              {stats?.expiringSoon || 0}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Dans 30 jours</div>
          </GlassCardContent>
        </GlassCard>
      </div>

      {/* Expiring Contracts Alert */}
      {expiring.length > 0 && (
        <GlassCard className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <GlassCardContent className="pt-6">
            <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
              ⚠️ Contrats expirant bientôt
            </h3>
            <ul className="space-y-1">
              {expiring.map((contract) => (
                <li key={contract.id} className="text-sm">
                  <Link
                    href={`/contracts/${contract.id}`}
                    className="hover:underline text-blue-600 dark:text-blue-400"
                  >
                    {contract.title} ({contract.company.name}) - Expire le{" "}
                    {new Date(contract.endDate).toLocaleDateString("fr-CA")}
                  </Link>
                </li>
              ))}
            </ul>
          </GlassCardContent>
        </GlassCard>
      )}

      {/* Contracts Table */}
      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle>Liste des contrats</GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          {contracts.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              Aucun contrat trouvé
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numéro</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead className="text-right">Valeur</TableHead>
                    <TableHead className="text-center">Statut</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contracts.map((contract) => (
                    <TableRow
                      key={contract.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    >
                      <TableCell className="font-mono">{contract.number}</TableCell>
                      <TableCell className="font-semibold text-gray-900 dark:text-white">
                        {contract.title}
                      </TableCell>
                      <TableCell>{contract.company.name}</TableCell>
                      <TableCell>{typeLabels[contract.type] || contract.type}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(contract.startDate).toLocaleDateString("fr-CA")}
                        {" → "}
                        {new Date(contract.endDate).toLocaleDateString("fr-CA")}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: contract.currency || "USD",
                        }).format(contract.value)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={statusColors[contract.status]}>
                          {statusLabels[contract.status] || contract.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Link href={`/contracts/${contract.id}`}>
                          <Button variant="outline" size="sm">Voir</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </GlassCardContent>
      </GlassCard>
    </div>
  );
}

