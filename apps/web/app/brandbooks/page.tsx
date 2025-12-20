import { Button, Badge, Card, CardContent, CardHeader, CardTitle } from "@nukleo/ui";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/GlassCard";
import { getBrandBooksAction, getBrandBooksStatsAction } from "./actions";
import Link from "next/link";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@nukleo/ui";

export default async function BrandBooksPage() {
  const [brandBooksResult, statsResult] = await Promise.all([
    getBrandBooksAction(),
    getBrandBooksStatsAction(),
  ]);

  const brandBooks = brandBooksResult.success && brandBooksResult.data ? brandBooksResult.data : [];
  const stats = statsResult.success && statsResult.data ? statsResult.data : { total: 0, active: 0, withCompany: 0 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Brand Books
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gérez vos guides de style et identités de marque
          </p>
        </div>
        <Link href="/brandbooks/new">
          <Button variant="primary">Nouveau Brand Book</Button>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="glass card-shadow">
          <GlassCardContent className="pt-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Brand Books
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
        <GlassCard className="glass card-shadow">
          <GlassCardContent className="pt-6">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Liés à une entreprise
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {stats.withCompany}
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>

      {/* Brand Books Table */}
      <GlassCard className="glass card-shadow">
        <GlassCardHeader>
          <GlassCardTitle>Liste des Brand Books</GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          {brandBooks.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>Aucun brand book trouvé</p>
              <Link href="/brandbooks/new" className="mt-4 inline-block">
                <Button variant="primary">Créer le premier brand book</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Entreprise</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Créé par</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brandBooks.map((brandBook) => (
                  <TableRow key={brandBook.id}>
                    <TableCell className="font-medium">
                      {brandBook.name}
                    </TableCell>
                    <TableCell>
                      {brandBook.company ? (
                        <span>{brandBook.company.name}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={brandBook.isActive ? "success" : "secondary"}>
                        {brandBook.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {brandBook.createdBy.name || brandBook.createdBy.email}
                    </TableCell>
                    <TableCell>
                      {new Date(brandBook.createdAt).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/brandbooks/${brandBook.id}`}>
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

