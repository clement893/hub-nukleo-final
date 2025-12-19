# Hub Nukleo Final

Monorepo Turborepo avec Next.js 16 et Turbopack, prêt pour le déploiement sur Railway.

## 🚀 Technologies

- **Next.js 16** - Framework React avec App Router et Server Components
- **Turbopack** - Bundler ultra-rapide pour le développement
- **Turborepo** - Monorepo tooling pour gérer plusieurs applications
- **Tailwind CSS** - Framework CSS utilitaire moderne
- **TypeScript** - Typage statique pour une meilleure DX
- **pnpm** - Gestionnaire de paquets rapide et efficace
- **Vitest** - Framework de tests rapide et moderne
- **GitHub Actions** - CI/CD automatisé

## 📁 Structure

```
hub-nukleo-final/
├── apps/
│   └── web/              # Application Next.js 16
│       ├── app/          # App Router (Next.js 13+)
│       ├── components/   # Composants React réutilisables
│       ├── lib/          # Utilitaires et helpers
│       └── ...
├── packages/             # Packages partagés
│   ├── ui/              # Composants UI réutilisables
│   ├── db/              # Configuration Prisma
│   └── commercial/      # Logique métier commerciale
├── turbo.json           # Configuration Turborepo
├── pnpm-workspace.yaml  # Configuration workspace pnpm
├── .github/workflows/   # Workflows GitHub Actions
└── ...
```

## 🛠️ Développement

### Prérequis

- Node.js 20+ (voir `.nvmrc`)
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

#### Développement
- `pnpm dev` - Démarrer le serveur de développement avec Turbopack
- `pnpm build` - Build de production
- `pnpm start` - Démarrer le serveur de production

#### Qualité de code
- `pnpm lint` - Linter le code avec ESLint
- `pnpm lint:fix` - Corriger automatiquement les erreurs de linting
- `pnpm format` - Formater le code avec Prettier
- `pnpm format:check` - Vérifier le formatage sans modifier les fichiers
- `pnpm type-check` - Vérifier les types TypeScript

#### Tests
- `pnpm test` - Exécuter les tests unitaires
- `pnpm test:watch` - Exécuter les tests en mode watch
- `pnpm test:coverage` - Générer un rapport de couverture de code

## 🧪 Tests

Le projet utilise Vitest pour les tests unitaires et d'intégration.

### Structure des tests

Les tests sont organisés dans des dossiers `__tests__` à côté des fichiers sources :

```
apps/web/lib/
├── stats.ts
└── __tests__/
    └── stats.test.ts
```

### Exécuter les tests

```bash
# Tous les tests
pnpm test

# Mode watch (développement)
pnpm test:watch

# Avec couverture
pnpm test:coverage
```

## 🔄 CI/CD

Le projet utilise GitHub Actions pour l'intégration continue.

### Workflows disponibles

- **CI** (`.github/workflows/ci.yml`) - Exécute automatiquement :
  - Linting et vérification du formatage
  - Vérification des types TypeScript
  - Tests unitaires
  - Build de production

Le workflow se déclenche automatiquement sur :
- Push vers `main` ou `develop`
- Pull requests vers `main` ou `develop`

## 📝 Formatage et Linting

### Prettier

Le projet utilise Prettier pour le formatage automatique du code.

Configuration : `.prettierrc.json`

```bash
# Formater tous les fichiers
pnpm format

# Vérifier le formatage
pnpm format:check
```

### ESLint

Le projet utilise ESLint pour la détection d'erreurs et l'application de règles de code.

```bash
# Linter le code
pnpm lint

# Corriger automatiquement
pnpm lint:fix
```

## 🚂 Déploiement sur Railway

Le projet est configuré pour être déployé automatiquement sur Railway :

1. Connectez votre repository GitHub (`clement893/hub-nukleo-final`) à Railway
2. Railway détectera automatiquement la configuration dans `railway.json` et `nixpacks.toml`
3. Configurez les variables d'environnement dans le dashboard Railway si nécessaire
4. Le déploiement se fera automatiquement à chaque push sur la branche principale

### Configuration Railway

- **Build Command** : Automatiquement détecté via `nixpacks.toml`
- **Start Command** : `cd apps/web && pnpm start`
- **Node Version** : 20 (défini dans `.nvmrc`)

## 📚 Documentation

### Composants UI

Les composants du package `@nukleo/ui` sont documentés avec JSDoc. Consultez les fichiers source pour la documentation complète.

### Exemples d'utilisation

#### Button

```tsx
import { Button } from "@nukleo/ui";

// Bouton primaire
<Button variant="primary" onClick={handleClick}>
  Cliquer
</Button>

// Bouton avec état de chargement
<Button variant="primary" loading={isSubmitting}>
  Envoyer
</Button>

// Bouton avec icône
<Button variant="outline" leftIcon={<PlusIcon />}>
  Ajouter
</Button>
```

#### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@nukleo/ui";

<Card>
  <CardHeader>
    <CardTitle>Titre de la carte</CardTitle>
  </CardHeader>
  <CardContent>
    Contenu de la carte
  </CardContent>
</Card>
```

## 📦 Packages

### @nukleo/ui

Bibliothèque de composants UI réutilisables avec Tailwind CSS.

### @nukleo/db

Configuration Prisma et schéma de base de données.

### @nukleo/commercial

Logique métier pour la gestion commerciale (contacts, opportunités, entreprises).

## 🔧 Configuration

### TypeScript

Configuration partagée dans `packages/typescript-config`.

### ESLint

Configuration partagée dans `packages/eslint-config`.

### Tailwind CSS

Configuration partagée dans `packages/tailwind-config`.

## 📝 Bonnes pratiques appliquées

- ✅ Structure de composants modulaire et réutilisable
- ✅ Utilisation de TypeScript pour le typage
- ✅ Tailwind CSS pour le styling
- ✅ Configuration ESLint et Prettier
- ✅ App Router de Next.js 13+ (structure moderne)
- ✅ Configuration optimisée pour Railway
- ✅ CI/CD avec GitHub Actions
- ✅ Tests unitaires avec Vitest
- ✅ Documentation JSDoc pour les composants
- ✅ Formatage automatique avec Prettier

## 🤝 Contribution

1. Créer une branche depuis `main`
2. Faire vos modifications
3. Exécuter `pnpm lint` et `pnpm format` avant de committer
4. Créer une pull request

## 📄 Licence

Ce projet est privé.
