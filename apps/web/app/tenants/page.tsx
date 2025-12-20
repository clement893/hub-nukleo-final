import { Button, Badge, Card, CardContent, CardHeader, CardTitle } from "@nukleo/ui";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/GlassCard";
import { getTenantsAction, getTenantsStatsAction } from "./actions";
import Link from "next/link";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@nukleo/ui";

export default async function TenantsPage() {
  const [tenantsResult, statsResult] = await Promise.all([
    getTenantsAction(),
    getTenantsStatsAction(),
  ]);

  const tenants = tenantsResult.success && tenantsResult.data ? tenantsResult.data : [];
  const stats = statsResult.success && statsResult.data ? statsResult.data : { total: 0, active: 0 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tenants
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gérez les organisations et la multi-tenancy
          </p>
        </div>
        <Link href="/tenants/new">
          <Button variant="primary">Nouveau Tenant</Button>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="glass card-shadow">
          <GlassCardContent className="pt-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Tenants
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {stats.total}
            </div>
          </GlassCardContent>
        </GlassCard>
        <GlassCard className="glass card-shadow">
          <GlassCardContent className="pt-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Actifs
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {stats.active}
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>

      {/* Tenants Table */}
      <GlassCard className="glass card-shadow">
        <GlassCardHeader>
          <GlassCardTitle>Liste des Tenants</GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          {tenants.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>Aucun tenant trouvé</p>
              <Link href="/tenants/new" className="mt-4 inline-block">
                <Button variant="primary">Créer le premier tenant</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Domaine</TableHead>
                  <TableHead>Utilisateurs</TableHead>
                  <TableHead>Entreprises</TableHead>
                  <TableHead>Projets</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">
                      {tenant.name}
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {tenant.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      {tenant.domain ? (
                        <span>{tenant.domain}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>{tenant._count.users}</TableCell>
                    <TableCell>{tenant._count.companies}</TableCell>
                    <TableCell>{tenant._count.projects}</TableCell>
                    <TableCell>
                      <Badge variant={tenant.isActive ? "success" : "secondary"}>
                        {tenant.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/tenants/${tenant.id}`}>
                        <Button variant="secondary" size="sm">
                          Voir
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </GlassCardContent>
      </GlassCard>
    </div>
  );
}

