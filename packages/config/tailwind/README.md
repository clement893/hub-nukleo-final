# @nukleo/tailwind-config

Configuration Tailwind CSS partagée pour les projets Nukleo.

## Installation

```bash
pnpm add -D @nukleo/tailwind-config
```

## Utilisation

Dans votre `tailwind.config.js` ou `tailwind.config.ts` :

```js
const nukleoConfig = require("@nukleo/tailwind-config");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      ...nukleoConfig.theme.extend,
    },
  },
  plugins: [],
};
```

Ou avec TypeScript :

```ts
import type { Config } from "tailwindcss";
import nukleoConfig from "@nukleo/tailwind-config";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      ...nukleoConfig.theme.extend,
    },
  },
  plugins: [],
};

export default config;
```

## Fonctionnalités

### Palette de couleurs primaires

Couleurs primaires de 50 à 950 :

```js
primary-50, primary-100, ..., primary-950
```

### Espacements personnalisés

- `18`: 4.5rem
- `88`: 22rem
- `128`: 32rem

### Border radius

- `4xl`: 2rem
- `5xl`: 2.5rem

### Ombres prédéfinies

- `soft`: Ombre douce pour les cartes
- `medium`: Ombre moyenne pour les modals
- `strong`: Ombre forte pour les éléments élevés

### Typographie

Configuration par défaut pour la typographie avec :
- Largeur maximale optimale pour la lisibilité
- Styles pour les liens
- Styles pour le code
- Styles pour les titres

## Exemples

```jsx
// Utiliser les couleurs primaires
<div className="bg-primary-500 text-primary-50">...</div>

// Utiliser les espacements personnalisés
<div className="p-18">...</div>

// Utiliser les ombres
<div className="shadow-soft">...</div>
<div className="shadow-medium">...</div>
<div className="shadow-strong">...</div>

// Utiliser les border radius
<div className="rounded-4xl">...</div>
```

## Licence

MIT


