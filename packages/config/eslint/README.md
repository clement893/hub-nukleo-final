# @nukleo/eslint-config

Configuration ESLint partagée pour les projets Nukleo.

## Installation

```bash
pnpm add -D @nukleo/eslint-config
```

## Utilisation

Créez un fichier `.eslintrc.json` à la racine de votre projet :

```json
{
  "extends": "@nukleo/eslint-config"
}
```

Ou dans `package.json` :

```json
{
  "eslintConfig": {
    "extends": "@nukleo/eslint-config"
  }
}
```

## Configuration

Cette configuration :
- Étend `next/core-web-vitals` et `next`
- Intègre Prettier pour éviter les conflits
- Désactive `@next/next/no-html-link-for-pages`

## Licence

MIT


