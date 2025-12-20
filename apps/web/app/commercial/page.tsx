import { Card, CardContent, CardHeader, CardTitle } from "@nukleo/ui";
import Link from "next/link";
import { Button } from "@nukleo/ui";

export default function CommercialPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Module Commercial
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Gérez vos contacts, entreprises, opportunités et propositions commerciales
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dashboard */}
        <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300">
          <CardHeader>
            <CardTitle>Tableau de bord</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Vue d'ensemble des statistiques commerciales, opportunités récentes et propositions en cours.
            </p>
            <Link href="/commercial/dashboard">
              <Button variant="primary" className="w-full">
                Accéder au tableau de bord
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Contacts */}
        <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300">
          <CardHeader>
            <CardTitle>Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Gérez votre base de contacts clients et prospects.
            </p>
            <Link href="/commercial/contacts">
              <Button variant="primary" className="w-full">
                Gérer les contacts
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Companies */}
        <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300">
          <CardHeader>
            <CardTitle>Entreprises</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Gérez les entreprises et organisations clientes.
            </p>
            <Link href="/commercial/companies">
              <Button variant="primary" className="w-full">
                Gérer les entreprises
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Opportunities */}
        <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300">
          <CardHeader>
            <CardTitle>Opportunités</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Suivez vos opportunités commerciales et leur progression dans le pipeline.
            </p>
            <Link href="/commercial/opportunities">
              <Button variant="primary" className="w-full">
                Gérer les opportunités
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Proposals */}
        <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300">
          <CardHeader>
            <CardTitle>Propositions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Créez et gérez vos propositions commerciales et devis.
            </p>
            <Link href="/commercial/proposals">
              <Button variant="primary" className="w-full">
                Gérer les propositions
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Search */}
        <Card className="glass card-shadow hover:card-shadow-hover transition-all duration-300">
          <CardHeader>
            <CardTitle>Recherche</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Recherchez rapidement dans vos contacts, entreprises et opportunités.
            </p>
            <Link href="/commercial/search">
              <Button variant="primary" className="w-full">
                Rechercher
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

