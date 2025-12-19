# Guide : Utiliser Dockerfile avec Railway

## Solution simple : Dockerfile

J'ai créé un `Dockerfile` dans `apps/web/` qui force l'utilisation de pnpm. C'est la solution la plus simple !

## Configuration dans Railway

### Option 1 : Utiliser le Dockerfile (RECOMMANDÉ)

1. Dans Railway Dashboard, allez dans votre **Service**
2. Allez dans **Settings** → **Service**
3. Dans la section **Build**, changez le **Builder** de "Nixpacks" à **"Dockerfile"**
4. Railway détectera automatiquement le `Dockerfile` dans `apps/web/`
5. **Root Directory** doit être `apps/web`

C'est tout ! Railway utilisera maintenant pnpm automatiquement.

### Option 2 : Configuration manuelle des commandes

Si vous préférez garder Nixpacks, allez dans **Settings** → **Service** :

**Build Command** :
```
corepack enable && corepack prepare pnpm@latest --activate && cd ../.. && pnpm install --frozen-lockfile && cd apps/web && pnpm build
```

**Start Command** :
```
cd apps/web && pnpm start
```

## Vérification

Après configuration, Railway devrait :
- ✅ Utiliser pnpm au lieu de npm
- ✅ Résoudre les dépendances `workspace:*`
- ✅ Builder l'application avec succès

## Avantages du Dockerfile

- ✅ Force l'utilisation de pnpm
- ✅ Configuration versionnée dans Git
- ✅ Plus prévisible et reproductible
- ✅ Pas besoin de configurer manuellement dans Railway

