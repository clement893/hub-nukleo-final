# Solution définitive pour Railway Monorepo

## Le problème
Railway essaie de lire le `package.json` à la racine et échoue avec "expected value at line 1 column 1".

## Solutions à essayer dans l'ordre

### Solution 1 : Root Directory dans Railway (CRITIQUE)

**C'est la solution la plus importante :**

1. Dans Railway Dashboard :
   - Allez dans votre **Service**
   - Cliquez sur **Settings** (ou l'icône ⚙️)
   - Trouvez la section **"Root Directory"**
   - Entrez exactement : `apps/web`
   - **SAVE** les changements

2. **Redeploy** le service après avoir changé le Root Directory

### Solution 2 : Vérifier que le Root Directory est bien appliqué

Après avoir configuré le Root Directory, Railway devrait :
- Lire le `package.json` depuis `apps/web/package.json`
- Détecter automatiquement Next.js
- Utiliser les scripts définis dans `apps/web/package.json`

### Solution 3 : Si Railway ne détecte toujours pas Next.js

Ajoutez ces variables d'environnement dans Railway :
- `NODE_ENV=production`
- `PORT=3000` (ou le port que Railway assigne)

### Solution 4 : Vérifier les logs complets

Dans Railway, regardez les logs complets du build pour voir :
- Quel `package.json` Railway essaie de lire
- Si le Root Directory est bien appliqué
- Les erreurs exactes

### Solution 5 : Alternative - Créer un service séparé

Si rien ne fonctionne, vous pouvez :
1. Créer un nouveau service dans Railway
2. Connecter le même repo GitHub
3. Configurer le Root Directory sur `apps/web` dès le début
4. Railway devrait alors détecter Next.js correctement

## Configuration actuelle

- ✅ `nixpacks.toml` configuré pour monorepo
- ✅ `railway.toml` avec startCommand
- ✅ `.nvmrc` avec Node.js 18
- ✅ `apps/web/package.json` avec Next.js

**Le seul élément manquant est la configuration du Root Directory dans Railway Dashboard.**

