# Solution pour "No active deployment"

## Problème
Railway ne démarre pas automatiquement le déploiement pour un monorepo.

## Solutions

### Solution 1 : Configurer le Root Directory dans Railway

1. Dans Railway, allez dans votre projet
2. Cliquez sur le service (ou créez-en un nouveau)
3. Allez dans **Settings** → **Service**
4. Dans **Root Directory**, entrez : `apps/web`
5. Cliquez sur **Save**
6. Railway devrait maintenant détecter le projet Next.js et démarrer le build

### Solution 2 : Déclencher manuellement le déploiement

1. Dans Railway, allez dans **Deployments**
2. Cliquez sur **"Deploy"** ou **"Redeploy"**
3. Ou faites un nouveau commit et push :
   ```bash
   git commit --allow-empty -m "Trigger Railway deployment"
   git push origin main
   ```

### Solution 3 : Vérifier la configuration

Assurez-vous que dans Railway :
- **Root Directory** : `apps/web` (pour pointer vers l'application Next.js)
- **Build Command** : Laissé vide (Railway utilisera `nixpacks.toml`)
- **Start Command** : `cd apps/web && pnpm start` (ou laissé vide, Railway utilisera la config)

### Solution 4 : Créer un nouveau service

Si le service n'existe pas :
1. Dans Railway, cliquez sur **"New Service"**
2. Sélectionnez **"GitHub Repo"**
3. Choisissez `clement893/hub-nukleo-final`
4. Dans les paramètres, définissez **Root Directory** : `apps/web`
5. Railway devrait automatiquement détecter Next.js et démarrer le build

### Vérification

Une fois configuré, vous devriez voir :
- Un build en cours dans **Deployments**
- Les logs de build dans **Logs**
- Une URL de déploiement une fois le build terminé

