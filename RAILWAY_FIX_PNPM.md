# Solution définitive pour Railway avec pnpm

## Le problème

Railway utilise Railpack qui détecte automatiquement npm et ignore notre configuration pnpm. Le protocole `workspace:*` n'est pas supporté par npm.

## Solution : Configuration manuelle dans Railway Dashboard

Puisque Railway ignore les fichiers de configuration, vous devez configurer manuellement dans le Dashboard :

### 1. Variables d'environnement

Dans Railway Dashboard → Settings → Variables, ajoutez :

- **NIXPACKS_PKG_MANAGER** = `pnpm`

### 2. Build Command personnalisé

Dans Railway Dashboard → Settings → Service → Build Command, remplacez par :

```bash
corepack enable && corepack prepare pnpm@latest --activate && cd ../.. && pnpm install --frozen-lockfile && cd apps/web && pnpm build
```

### 3. Start Command

Dans Railway Dashboard → Settings → Service → Start Command :

```bash
cd apps/web && pnpm start
```

### 4. Root Directory

Assurez-vous que le **Root Directory** est configuré sur `apps/web` dans Railway.

## Alternative : Utiliser Dockerfile

Si la configuration manuelle ne fonctionne pas, créez un `Dockerfile` dans `apps/web/` :

```dockerfile
FROM node:18-alpine

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/web ./apps/web
COPY turbo.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build
WORKDIR /app/apps/web
RUN pnpm build

# Start
CMD ["pnpm", "start"]
```

Puis dans Railway, sélectionnez "Dockerfile" comme builder au lieu de "Nixpacks".

## Vérification

Après configuration, Railway devrait :
1. Utiliser pnpm au lieu de npm
2. Résoudre correctement les dépendances `workspace:*`
3. Builder l'application avec succès

