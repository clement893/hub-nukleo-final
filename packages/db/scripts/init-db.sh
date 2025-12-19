#!/bin/sh

# Script pour initialiser la base de données
# Usage: ./scripts/init-db.sh

echo "🚀 Initialisation de la base de données..."

# Vérifier que DATABASE_URL est définie
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Erreur: DATABASE_URL n'est pas définie"
  echo "   Veuillez définir la variable d'environnement DATABASE_URL"
  exit 1
fi

echo "✅ DATABASE_URL trouvée"

# Générer le client Prisma
echo "📦 Génération du client Prisma..."
pnpm db:generate

# Créer la migration initiale
echo "📝 Création de la migration initiale..."
pnpm db:migrate --name init

# Seed la base de données
echo "🌱 Seed de la base de données..."
pnpm db:seed

echo "✅ Base de données initialisée avec succès!"
echo ""
echo "Pour visualiser les données, exécutez: pnpm db:studio"

