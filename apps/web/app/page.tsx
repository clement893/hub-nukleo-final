"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@nukleo/ui";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/GlassCard";

const modules = [
  {
    icon: "💼",
    title: "Module Commercial",
    description: "Gérez vos opportunités, contacts et entreprises commerciales",
    features: [
      "Gestion des opportunités en pipeline",
      "Base de données contacts et entreprises",
      "Suivi des propositions commerciales",
      "Tableau de bord avec statistiques",
    ],
    href: "/commercial/dashboard",
    gradient: "from-blue-500 via-blue-600 to-purple-600",
  },
  {
    icon: "📊",
    title: "Module Opérations",
    description: "Suivez vos projets, tâches et workflows opérationnels",
    features: [
      "Gestion complète des projets",
      "Suivi des tâches et jalons",
      "Workflow par département",
      "Vue Gantt et planning",
    ],
    href: "/operations",
    gradient: "from-purple-500 via-purple-600 to-pink-600",
  },
  {
    icon: "👥",
    title: "Module Gestion",
    description: "Administrez votre équipe et les ressources humaines",
    features: [
      "Gestion des employés",
      "Profils avec photos et informations",
      "Suivi des départements",
      "Anniversaires et dates clés",
    ],
    href: "/gestion/employees",
    gradient: "from-pink-500 via-pink-600 to-red-600",
  },
  {
    icon: "📝",
    title: "Propositions",
    description: "Créez et gérez vos propositions commerciales détaillées",
    features: [
      "Création de propositions structurées",
      "Sections et livrables",
      "Processus de réalisation",
      "Suivi des statuts",
    ],
    href: "/commercial/proposals",
    gradient: "from-green-500 via-green-600 to-teal-600",
  },
  {
    icon: "🖼️",
    title: "Galeries",
    description: "Visualisez vos contacts et entreprises en mode galerie",
    features: [
      "Vue galerie des contacts",
      "Photos et avatars",
      "Recherche visuelle",
      "Export et partage",
    ],
    href: "/commercial/contacts/gallery",
    gradient: "from-orange-500 via-orange-600 to-yellow-600",
  },
  {
    icon: "📈",
    title: "Statistiques",
    description: "Analysez vos données commerciales avec des statistiques détaillées",
    features: [
      "Tableaux de bord interactifs",
      "Graphiques et métriques",
      "Rapports personnalisables",
      "Export des données",
    ],
    href: "/commercial/contacts/stats",
    gradient: "from-indigo-500 via-indigo-600 to-blue-600",
  },
];

const stats = [
  {
    label: "Entités totales",
    value: "854",
    description: "Données importées",
  },
  {
    label: "Médias S3",
    value: "444",
    description: "Fichiers stockés",
  },
  {
    label: "Photos employés",
    value: "100%",
    description: "Couverture complète",
  },
  {
    label: "Modules actifs",
    value: "4",
    description: "Fonctionnalités disponibles",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="glass border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Nukleo.HUB
              </h1>
            </Link>
            <Link href="/login">
              <Button variant="outline" aria-label="Se connecter">
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Gérez votre entreprise en toute simplicité
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-8">
            Une plateforme complète pour gérer vos contacts, projets, équipes et données commerciales
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/commercial/dashboard">
              <Button variant="primary" size="lg" className="w-full sm:w-auto" aria-label="Accéder au Dashboard">
                Accéder au Dashboard
              </Button>
            </Link>
            <Link href="/components">
              <Button variant="outline" size="lg" className="w-full sm:w-auto" aria-label="Voir les composants">
                Voir les composants
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 animate-fade-in">
        <h3 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Modules disponibles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <GlassCard key={module.href} className="flex flex-col h-full animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <GlassCardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${module.gradient} flex items-center justify-center text-3xl shadow-lg`}>
                    {module.icon}
                  </div>
                  <GlassCardTitle className="text-xl">{module.title}</GlassCardTitle>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{module.description}</p>
              </GlassCardHeader>
              <GlassCardContent className="flex-grow">
                <ul className="space-y-2 mb-6">
                  {module.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <span className="text-green-500 dark:text-green-400 mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href={module.href} className="block w-full">
                  <Button variant="outline" className="w-full" aria-label={`Accéder au module ${module.title}`}>
                    Accéder au module
                  </Button>
                </Link>
              </GlassCardContent>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 animate-fade-in">
        <h3 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Statistiques de la plateforme
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <GlassCard key={stat.label} className="text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <GlassCardContent className="p-6">
                <div className="text-4xl sm:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.description}</div>
              </GlassCardContent>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="glass border-t border-gray-200/50 dark:border-gray-700/50 mt-16 animate-fade-in">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Nukleo.HUB. Tous droits réservés.
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Architecture: Turborepo + Next.js 16 + Prisma + PostgreSQL
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
