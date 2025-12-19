# Hub Nukleo Final

Monorepo Turborepo avec Next.js 16 et Turbopack, prêt pour le déploiement sur Railway.

## 🚀 Technologies

- **Next.js 15** - Framework React avec App Router et Server Components
- **Turbopack** - Bundler ultra-rapide pour le développement
- **Turborepo** - Monorepo tooling pour gérer plusieurs applications
- **Tailwind CSS** - Framework CSS utilitaire moderne
- **TypeScript** - Typage statique pour une meilleure DX
- **pnpm** - Gestionnaire de paquets rapide et efficace

## 📁 Structure

```
hub-nukleo-final/
├── apps/
│   └── web/              # Application Next.js 15
│       ├── app/          # App Router (Next.js 13+)
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   └── globals.css
│       ├── components/   # Composants React réutilisables
│       │   ├── Hero.tsx
│       │   ├── Features.tsx
│       │   ├── CTA.tsx
│       │   └── index.ts
│       └── ...
├── packages/             # Packages partagés (à venir)
├── turbo.json           # Configuration Turborepo
├── pnpm-workspace.yaml  # Configuration workspace pnpm
├── railway.json         # Configuration Railway
└── nixpacks.toml        # Configuration Nixpacks pour Railway
```

## 🛠️ Développement

### Prérequis

- Node.js 18+ (voir `.nvmrc`)
- pnpm 8.15.0+

### Installation

```bash
# Installer les dépendances
pnpm install

# Démarrer le serveur de développement avec Turbopack
pnpm dev
```

L'application sera accessible sur http://localhost:3000

### Commandes disponibles

- `pnpm dev` - Démarrer le serveur de développement avec Turbopack
- `pnpm build` - Build de production
- `pnpm lint` - Linter le code
- `pnpm format` - Formater le code avec Prettier

## 🚂 Déploiement sur Railway

Le projet est configuré pour être déployé automatiquement sur Railway :

1. Connectez votre repository GitHub (`clement893/hub-nukleo-final`) à Railway
2. Railway détectera automatiquement la configuration dans `railway.json` et `nixpacks.toml`
3. Configurez les variables d'environnement dans le dashboard Railway si nécessaire
4. Le déploiement se fera automatiquement à chaque push sur la branche principale

### Configuration Railway

- **Build Command** : Automatiquement détecté via `nixpacks.toml`
- **Start Command** : `cd apps/web && pnpm start`
- **Node Version** : 18 (défini dans `.nvmrc`)

## 📝 Bonnes pratiques appliquées

- ✅ Structure de composants modulaire et réutilisable
- ✅ Utilisation de TypeScript pour le typage
- ✅ Tailwind CSS pour le styling
- ✅ Configuration ESLint et Prettier
- ✅ App Router de Next.js 13+ (structure moderne)
- ✅ Configuration optimisée pour Railway
- ✅ CI/CD avec GitHub Actions

