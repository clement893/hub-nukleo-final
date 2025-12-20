# Workflow de Développement Collaboratif

## Structure des Branches

### Branches Principales
- **`main`** : Branche de production stable (ne jamais push directement dessus)
- **`staging`** : Branche d'intégration et de test (fusion des fonctionnalités avant production)
  - **Utilisée par l'IA** pour optimisations, améliorations et bug fixes
- **`manus-dev`** : Branche de développement pour Manus (nouvelles fonctionnalités)

## Workflow Recommandé

### Pour Manus (développement continu)
1. **Travailler sur `manus-dev`** :
   ```bash
   git checkout manus-dev
   git pull origin main  # Récupérer les dernières modifications de main
   # Faire ses modifications
   git add .
   git commit -m "feat: description de la fonctionnalité"
   git push origin manus-dev
   ```

2. **Créer des branches de fonctionnalité si nécessaire** :
   ```bash
   git checkout manus-dev
   git checkout -b manus/feature-nom-fonctionnalite
   # Développer
   git push origin manus/feature-nom-fonctionnalite
   ```

### Pour l'IA (optimisations, améliorations, bug fixes)
1. **Travailler directement sur `staging`** :
   ```bash
   git checkout staging
   git pull origin staging  # S'assurer d'avoir la dernière version
   # Faire les optimisations/améliorations/bug fixes
   git add .
   git commit -m "fix: description du bug fix" 
   # ou "perf: optimisation de..." 
   # ou "refactor: amélioration de..."
   git push origin staging
   ```

2. **Pour des changements majeurs, créer une branche dédiée** :
   ```bash
   git checkout staging
   git pull origin staging
   git checkout -b ai/refactor-nom-changement-majeur
   # Développer
   git push origin ai/refactor-nom-changement-majeur
   # Puis fusionner dans staging une fois prêt
   ```

### Fusion dans Staging (avant production)
1. **Mettre à jour staging depuis main** (quand nécessaire) :
   ```bash
   git checkout staging
   git pull origin main
   git push origin staging
   ```

2. **Fusionner les nouvelles fonctionnalités de Manus** :
   ```bash
   git checkout staging
   git merge manus-dev
   # Résoudre les conflits si nécessaire
   git push origin staging
   ```

3. **L'IA travaille directement sur staging** (pas besoin de merge)

4. **Tester sur staging** (Railway peut déployer automatiquement staging)

### Mise en Production
1. **Une fois staging validée, fusionner dans main** :
   ```bash
   git checkout main
   git pull origin main
   git merge staging
   git push origin main
   ```

2. **Mettre à jour toutes les branches de développement** :
   ```bash
   git checkout manus-dev
   git merge main
   git push origin manus-dev
   ```

## Règles Importantes

### ✅ À FAIRE
- Toujours partir de `main` à jour pour créer une nouvelle branche
- Faire des commits fréquents et descriptifs
- Fusionner régulièrement `main` dans sa branche de développement
- Tester sur `staging` avant de fusionner dans `main`
- Communiquer les changements majeurs avant de fusionner

### ❌ À ÉVITER
- Ne jamais push directement sur `main` (sauf hotfix urgents)
- Ne pas fusionner `manus-dev` directement dans `main` sans passer par `staging`
- Ne pas travailler sur la même branche en même temps
- Ne pas ignorer les conflits de merge

## Gestion des Conflits

Si des conflits surviennent lors d'un merge :
1. Identifier les fichiers en conflit : `git status`
2. Ouvrir les fichiers et résoudre les conflits manuellement
3. Marquer comme résolu : `git add <fichier>`
4. Finaliser le merge : `git commit`

## Workflow Recommandé pour Manus

**Option 1 : Branche de développement continue (`manus-dev`)**
- Manus travaille toujours sur `manus-dev`
- Fusionne régulièrement `main` dans `manus-dev` pour rester à jour
- Quand une fonctionnalité est prête, fusionne `manus-dev` dans `staging`

**Option 2 : Branches de fonctionnalité**
- Manus crée une nouvelle branche pour chaque fonctionnalité : `manus/feature-xxx`
- Fusionne `main` régulièrement dans sa branche
- Une fois terminée, fusionne dans `staging`

## Workflow Recommandé pour l'IA

**Travail direct sur `staging` pour :**
- ✅ Bug fixes
- ✅ Optimisations de performance
- ✅ Améliorations de code (refactoring)
- ✅ Corrections de types TypeScript
- ✅ Améliorations UX/UI mineures

**Créer une branche dédiée uniquement pour :**
- 🔄 Refactorings majeurs
- 🔄 Changements architecturaux importants
- 🔄 Nouvelles fonctionnalités complexes

**Processus :**
1. Toujours partir de `staging` à jour : `git pull origin staging`
2. Faire les modifications directement sur `staging`
3. Commit et push sur `staging`
4. Railway déploie automatiquement pour tester
5. Une fois validé, fusionner `staging` → `main`

## Exemple de Cycle Complet

1. **Manus** développe une nouvelle fonctionnalité sur `manus-dev`
2. **IA** corrige un bug directement sur `staging` (ou fait une optimisation)
3. **Manus** fusionne `manus-dev` dans `staging` quand sa fonctionnalité est prête
4. Tests sur `staging` (déployé automatiquement sur Railway)
5. Si tout est OK, fusion `staging` → `main`
6. Mise à jour de `manus-dev` avec `main` pour rester synchronisé

## Avantages de ce Workflow

- ✅ **Séparation claire** : Manus = nouvelles fonctionnalités, IA = améliorations/bug fixes
- ✅ **Pas de conflits** : Chacun travaille sur sa branche dédiée
- ✅ **Tests automatiques** : `staging` déployée automatiquement sur Railway
- ✅ **Production stable** : `main` reste toujours stable
- ✅ **Rapidité** : L'IA peut corriger directement sur `staging` sans étapes supplémentaires

