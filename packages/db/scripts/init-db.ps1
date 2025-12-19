# Script PowerShell pour initialiser la base de données
# Usage: .\scripts\init-db.ps1

Write-Host "🚀 Initialisation de la base de données..." -ForegroundColor Cyan

# Vérifier que DATABASE_URL est définie
if (-not $env:DATABASE_URL) {
    Write-Host "❌ Erreur: DATABASE_URL n'est pas définie" -ForegroundColor Red
    Write-Host "   Veuillez définir la variable d'environnement DATABASE_URL" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ DATABASE_URL trouvée" -ForegroundColor Green

# Générer le client Prisma
Write-Host "📦 Génération du client Prisma..." -ForegroundColor Cyan
pnpm db:generate

# Créer la migration initiale
Write-Host "📝 Création de la migration initiale..." -ForegroundColor Cyan
pnpm db:migrate --name init

# Seed la base de données
Write-Host "🌱 Seed de la base de données..." -ForegroundColor Cyan
pnpm db:seed

Write-Host "✅ Base de données initialisée avec succès!" -ForegroundColor Green
Write-Host ""
Write-Host "Pour visualiser les données, exécutez: pnpm db:studio" -ForegroundColor Yellow

