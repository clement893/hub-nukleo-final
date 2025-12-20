import { Button, Badge } from "@nukleo/ui";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/GlassCard";
import { getInvoicesAction, getBillingStatsAction } from "./actions";
import Link from "next/link";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@nukleo/ui";

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

export default async function BillingPage() {
  const [invoicesResult, statsResult] = await Promise.all([
    getInvoicesAction(),
    getBillingStatsAction(),
  ]);

  const invoices = invoicesResult.success ? invoicesResult.data : [];
  const stats = statsResult.success ? statsResult.data : null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Facturation</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gestion des factures et paiements
          </p>
        </div>
        <Link href="/billing/new">
          <Button variant="primary">+ Nouvelle facture</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard>
          <GlassCardContent className="pt-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Total factures</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {stats?.totalInvoices || 0}
            </div>
          </GlassCardContent>
        </GlassCard>

        <GlassCard>
          <GlassCardContent className="pt-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenus payés</div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
              {new Intl.NumberFormat("fr-CA", {
                style: "currency",
                currency: "CAD",
              }).format(stats?.totalRevenue || 0)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {stats?.paidInvoices || 0} factures
            </div>
          </GlassCardContent>
        </GlassCard>

        <GlassCard>
          <GlassCardContent className="pt-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">En attente</div>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">
              {new Intl.NumberFormat("fr-CA", {
                style: "currency",
                currency: "CAD",
              }).format(stats?.pendingRevenue || 0)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {stats?.sentInvoices || 0} factures
            </div>
          </GlassCardContent>
        </GlassCard>

        <GlassCard>
          <GlassCardContent className="pt-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">En retard</div>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
              {stats?.overdueInvoices || 0}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Factures</div>
          </GlassCardContent>
        </GlassCard>
      </div>

      {/* Invoices Table */}
      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle>Liste des factures</GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          {invoices.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              Aucune facture trouvée
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numéro</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Projet</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    <TableHead className="text-center">Statut</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow
                      key={invoice.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    >
                      <TableCell className="font-mono">{invoice.number}</TableCell>
                      <TableCell>{invoice.company.name}</TableCell>
                      <TableCell>{invoice.project?.name || "-"}</TableCell>
                      <TableCell>
                        {new Date(invoice.issueDate).toLocaleDateString("fr-CA")}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {new Intl.NumberFormat("fr-CA", {
                          style: "currency",
                          currency: "CAD",
                        }).format(invoice.total)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={statusColors[invoice.status]}>
                          {statusLabels[invoice.status] || invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Link href={`/billing/${invoice.id}`}>
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

