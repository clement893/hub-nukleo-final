# Configuration Railway avec pnpm

## Problème

Railway détecte npm par défaut, mais notre monorepo utilise pnpm avec le protocole `workspace:*` qui n'est pas supporté par npm.

## Solution

### Option 1 : Configurer Railway pour utiliser pnpm (RECOMMANDÉ)

Dans Railway Dashboard :
1. Allez dans **Settings** → **Service**
2. Ajoutez une variable d'environnement :
   - **Name**: `NIXPACKS_PKG_MANAGER`
   - **Value**: `pnpm`
3. Ou ajoutez dans **Build Command** :
   ```
   corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile && cd apps/web && pnpm build
   ```

### Option 2 : Utiliser le fichier nixpacks.toml

Le fichier `nixpacks.toml` est déjà configuré pour utiliser pnpm. Railway devrait le détecter automatiquement.

### Option 3 : Créer un package-lock.json pour npm (non recommandé)

Si vous devez absolument utiliser npm, vous devrez :
1. Convertir les dépendances `workspace:*` en chemins relatifs
2. Créer un `package-lock.json`
3. Mais cela va à l'encontre de l'utilisation de pnpm dans le monorepo

## Vérification

Après configuration, Railway devrait :
1. Détecter pnpm via `nixpacks.toml`
2. Installer les dépendances avec `pnpm install`
3. Résoudre correctement les dépendances `workspace:*`
4. Builder l'application avec `pnpm build`

## Commandes de build Railway

Si Railway ne détecte pas automatiquement pnpm, configurez manuellement :

**Build Command** :
```bash
corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile && cd apps/web && pnpm build
```

**Start Command** :
```bash
cd apps/web && pnpm start
```


