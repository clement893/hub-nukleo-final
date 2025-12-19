"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Table, TableHeader, TableBody, TableHead, TableRow, TableCell, Badge } from "@nukleo/ui";

interface Company {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  city?: string;
  country?: string;
}

export default function CompaniesPage() {
  const [companies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Entreprises</h1>
          <p className="text-gray-600 mt-2">
            Gérez vos entreprises clientes et prospects
          </p>
        </div>
        <Button variant="primary">Nouvelle entreprise</Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <Input
            placeholder="Rechercher une entreprise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des entreprises</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCompanies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                {searchTerm ? "Aucune entreprise trouvée" : "Aucune entreprise pour le moment"}
              </p>
              {!searchTerm && (
                <Button variant="outline">Créer votre première entreprise</Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Industrie</TableHead>
                  <TableHead>Ville</TableHead>
                  <TableHead>Pays</TableHead>
                  <TableHead>Site web</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <div className="font-medium">{company.name}</div>
                    </TableCell>
                    <TableCell>
                      {company.industry ? (
                        <Badge variant="default">{company.industry}</Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{company.city || "-"}</TableCell>
                    <TableCell>{company.country || "-"}</TableCell>
                    <TableCell>
                      {company.website ? (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {company.website}
                        </a>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <Link href={`/commercial/companies/${company.id}`}>
                        <Button variant="ghost" size="sm">Voir</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

