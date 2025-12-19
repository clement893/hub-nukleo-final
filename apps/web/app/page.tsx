import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
} from "@nukleo/ui";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Hub Nukleo
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Plateforme moderne de gestion commerciale, projets et équipe
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Button variant="primary" size="lg">
            Commencer
          </Button>
          <Button variant="outline" size="lg">
            En savoir plus
          </Button>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Commercial Module */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Commercial</CardTitle>
              <CardDescription>
                Gérez vos opportunités, contacts et entreprises
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Suivez vos ventes, analysez vos performances et développez votre
                portefeuille client avec des outils puissants de gestion CRM.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Accéder au module
              </Button>
            </CardFooter>
          </Card>

          {/* Projects Module */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Projets</CardTitle>
              <CardDescription>
                Planifiez et suivez vos projets efficacement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Organisez vos projets, assignez des tâches, suivez les budgets
                et les délais pour une gestion optimale de vos livraisons.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Accéder au module
              </Button>
            </CardFooter>
          </Card>

          {/* Team Module */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Équipe</CardTitle>
              <CardDescription>
                Collaborez et coordonnez votre équipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Gérez les membres de votre équipe, leurs rôles et permissions,
                et facilitez la collaboration entre les différents départements.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Accéder au module
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </main>
  );
}
