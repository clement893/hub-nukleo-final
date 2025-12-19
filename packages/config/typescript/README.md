# @nukleo/typescript-config

Configurations TypeScript partagées pour les projets Nukleo.

## Installation

```bash
pnpm add -D @nukleo/typescript-config
```

## Configurations disponibles

### base.json

Configuration de base avec :
- Target ES2020
- Mode strict activé
- Vérifications strictes des types
- Support des modules ESNext

### nextjs.json

Configuration pour les applications Next.js :
- Étend `base.json`
- Support JSX pour React
- Configuration des paths pour Next.js
- Optimisé pour le développement Next.js

### react-library.json

Configuration pour les bibliothèques React :
- Étend `base.json`
- Support JSX React
- Génération de déclarations TypeScript
- Optimisé pour les packages npm

## Utilisation

### Pour Next.js

Créez un `tsconfig.json` :

```json
{
  "extends": "@nukleo/typescript-config/nextjs.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Pour une bibliothèque React

Créez un `tsconfig.json` :

```json
{
  "extends": "@nukleo/typescript-config/react-library.json",
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Configuration de base

```json
{
  "extends": "@nukleo/typescript-config/base.json",
  "compilerOptions": {
    // Vos options personnalisées
  }
}
```

## Licence

MIT

