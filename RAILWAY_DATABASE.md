# Configuration de la Base de Données Railway

## Variable d'Environnement Requise

Dans Railway, vous devez configurer la variable d'environnement suivante :

### `DATABASE_URL`

**Valeur à configurer dans Railway :**
```
postgresql://postgres:jgQLrQahWKPtBryEKFSMuonagOOSHGiN@turntable.proxy.rlwy.net:49842/railway
```

## Configuration dans Railway

1. Allez dans votre projet Railway
2. Cliquez sur votre service (web)
3. Allez dans l'onglet "Variables"
4. Ajoutez une nouvelle variable :
   - **Nom** : `DATABASE_URL`
   - **Valeur** : `postgresql://postgres:jgQLrQahWKPtBryEKFSMuonagOOSHGiN@turntable.proxy.rlwy.net:49842/railway`
5. Sauvegardez

## Migration de la Base de Données

Après avoir configuré la variable d'environnement, vous devez exécuter les migrations Prisma :

### Option 1 : Via Railway CLI (recommandé)

```bash
# Installer Railway CLI si nécessaire
npm i -g @railway/cli

# Se connecter
railway login

# Lier le projet
railway link

# Exécuter les migrations
cd packages/db
railway run pnpm db:push
```

### Option 2 : Via Railway Dashboard

1. Allez dans votre service Railway
2. Ouvrez le terminal
3. Exécutez :
```bash
cd packages/db
pnpm db:push
```

### Option 3 : Localement avec Railway Proxy

```bash
# Installer Railway CLI
npm i -g @railway/cli

# Se connecter
railway login

# Lier le projet
railway link

# Créer un proxy vers la base de données
railway connect

# Dans un autre terminal, exécuter les migrations
cd packages/db
DATABASE_URL="postgresql://postgres:jgQLrQahWKPtBryEKFSMuonagOOSHGiN@turntable.proxy.rlwy.net:49842/railway" pnpm db:push
```

## Vérification

Pour vérifier que la connexion fonctionne :

```bash
cd packages/db
pnpm db:studio
```

Cela ouvrira Prisma Studio dans votre navigateur, vous permettant de visualiser et gérer vos données.

## Notes Importantes

- ⚠️ **Sécurité** : Ne commitez jamais la variable `DATABASE_URL` dans votre dépôt Git
- 🔒 **Mot de passe** : Le mot de passe dans l'URL est sensible, gardez-le secret
- 🔄 **Migrations** : Exécutez toujours les migrations après avoir modifié le schéma Prisma
- 📊 **Production** : En production, utilisez toujours les variables d'environnement de Railway

