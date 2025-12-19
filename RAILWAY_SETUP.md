# Guide de configuration Railway

## Problèmes courants et solutions

### 1. Railway ne voit pas le dépôt GitHub

**Solutions :**

#### A. Vérifier que le dépôt existe sur GitHub
1. Allez sur https://github.com/clement893/hub-nukleo-final
2. Vérifiez que le dépôt est bien accessible et contient les fichiers

#### B. Connecter Railway à GitHub
1. Allez sur https://railway.app
2. Cliquez sur **"New Project"**
3. Sélectionnez **"Deploy from GitHub repo"**
4. Si vous n'êtes pas connecté à GitHub :
   - Cliquez sur **"Configure GitHub App"** ou **"Connect GitHub"**
   - Autorisez Railway à accéder à vos dépôts
   - Sélectionnez les dépôts que Railway peut voir (ou tous)
5. Recherchez `hub-nukleo-final` dans la liste
6. Si le dépôt n'apparaît pas :
   - Cliquez sur **"Refresh"** ou **"Sync repositories"**
   - Vérifiez que le dépôt n'est pas dans une organisation avec des restrictions

#### C. Vérifier les permissions GitHub
- Si le dépôt est dans une organisation, vérifiez que Railway a les permissions nécessaires
- Allez dans les paramètres de l'organisation GitHub → Third-party access → Railway

#### D. Utiliser l'import manuel
Si le dépôt n'apparaît toujours pas :
1. Dans Railway, cliquez sur **"New Project"**
2. Sélectionnez **"Empty Project"**
3. Cliquez sur **"Settings"** → **"Connect GitHub Repo"**
4. Entrez l'URL complète : `https://github.com/clement893/hub-nukleo-final`
5. Ou utilisez le format : `clement893/hub-nukleo-final`

### 2. Configuration du projet dans Railway

Une fois le dépôt connecté :

1. **Root Directory** : Laissez vide (Railway détectera automatiquement)
2. **Build Command** : Railway utilisera `nixpacks.toml` automatiquement
3. **Start Command** : `cd apps/web && pnpm start` (défini dans `railway.json`)
4. **Node Version** : 18 (défini dans `.nvmrc`)

### 3. Variables d'environnement

Si nécessaire, ajoutez des variables d'environnement dans Railway :
- Allez dans **Settings** → **Variables**
- Ajoutez les variables nécessaires (ex: `NODE_ENV=production`)

### 4. Vérification du déploiement

Après la connexion :
1. Railway devrait automatiquement détecter le dépôt
2. Il commencera le build automatiquement
3. Vérifiez les logs dans Railway pour voir le processus de build

### 5. Si le problème persiste

Vérifiez :
- ✅ Le dépôt est bien public ou Railway a accès s'il est privé
- ✅ Le compte GitHub connecté à Railway est le bon (`clement893`)
- ✅ Le nom du dépôt est exactement `hub-nukleo-final`
- ✅ Les fichiers `railway.json` et `nixpacks.toml` sont à la racine du dépôt
- ✅ Le fichier `package.json` existe à la racine

## Commandes utiles

```bash
# Vérifier que tout est bien poussé
git remote -v
git log --oneline -5

# Si besoin, forcer le push
git push origin main --force
```


