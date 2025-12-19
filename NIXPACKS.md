# Configuration Nixpacks pour Monorepo

## Problème
Railway essaie de lire le `package.json` à la racine du monorepo, mais l'application Next.js est dans `apps/web`.

## Solution

### Option 1 : Configurer Root Directory dans Railway (RECOMMANDÉ)

1. Dans Railway, allez dans **Settings** → **Service**
2. Définissez **Root Directory** : `apps/web`
3. Railway lira alors directement le `package.json` de `apps/web`
4. Le build devrait fonctionner automatiquement

### Option 2 : Utiliser la configuration Nixpacks mise à jour

J'ai mis à jour `nixpacks.toml` pour utiliser `pnpm --filter web` qui fonctionne mieux avec les monorepos pnpm.

### Option 3 : Créer un package.json à la racine avec les scripts nécessaires

Si Railway doit absolument lire depuis la racine, assurez-vous que le `package.json` racine contient les scripts nécessaires.

## Vérification

Après avoir configuré le Root Directory sur `apps/web`, Railway devrait :
1. Détecter automatiquement Next.js
2. Installer les dépendances avec pnpm
3. Builder l'application
4. Démarrer le serveur


