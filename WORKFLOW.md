# Workflow de Développement Collaboratif

## Structure des Branches

### Branches Principales
- **`main`** : Branche de développement active (site en dev)
  - **Utilisée par l'IA** pour optimisations, améliorations et bug fixes
  - **Utilisée par Manus** pour nouvelles fonctionnalités (directement ou via `manus-dev`)
- **`staging`** : Branche de backup/sauvegarde
  - Copie de `main` à intervalles réguliers
  - Point de restauration en cas de problème
- **`manus-dev`** : Branche de développement optionnelle pour Manus (nouvelles fonctionnalités)

## Workflow Recommandé

### Pour Manus (développement continu)

**Option 1 : Travailler directement sur `main`** (recommandé pour petites fonctionnalités)
```bash
git checkout main
git pull origin main
# Faire ses modifications
git add .
git commit -m "feat: description de la fonctionnalité"
git push origin main
```

**Option 2 : Travailler sur `manus-dev` puis fusionner dans `main`** (pour fonctionnalités complexes)
```bash
git checkout manus-dev
git pull origin main  # Rester à jour avec main
# Développer la fonctionnalité
git add .
git commit -m "feat: description de la fonctionnalité"
git push origin manus-dev

# Quand prêt, fusionner dans main
git checkout main
git pull origin main
git merge manus-dev
git push origin main
```

### Pour l'IA (optimisations, améliorations, bug fixes)

**Travailler directement sur `main`** :
```bash
git checkout main
git pull origin main  # S'assurer d'avoir la dernière version
# Faire les optimisations/améliorations/bug fixes
git add .
git commit -m "fix: description du bug fix" 
# ou "perf: optimisation de..." 
# ou "refactor: amélioration de..."
git push origin main
```

**Pour des changements majeurs, créer une branche dédiée** :
```bash
git checkout main
git pull origin main
git checkout -b ai/refactor-nom-changement-majeur
# Développer
git push origin ai/refactor-nom-changement-majeur
# Puis fusionner dans main une fois prêt
git checkout main
git merge ai/refactor-nom-changement-majeur
git push origin main
```

### Gestion de Staging (Backup)

**Créer un backup régulier de `main` dans `staging`** :
```bash
git checkout staging
git pull origin main  # Récupérer les dernières modifications de main
git reset --hard main  # Copier exactement main dans staging
git push origin staging --force
```

**Restauration depuis staging en cas de problème** :
```bash
git checkout main
git reset --hard staging  # Restaurer main depuis staging
git push origin main --force
```

## Règles Importantes

### ✅ À FAIRE
- Toujours `git pull origin main` avant de commencer à travailler
- Faire des commits fréquents et descriptifs
- Créer des backups réguliers : copier `main` → `staging`
- Communiquer les changements majeurs avant de push
- Tester localement avant de push sur `main`

### ❌ À ÉVITER
- Ne pas push sans avoir testé localement
- Ne pas ignorer les conflits de merge
- Ne pas oublier de créer des backups réguliers sur `staging`
- Ne pas travailler sur la même partie du code en même temps sans coordination

## Gestion des Conflits

Si des conflits surviennent lors d'un merge ou d'un pull :
1. Identifier les fichiers en conflit : `git status`
2. Ouvrir les fichiers et résoudre les conflits manuellement
3. Marquer comme résolu : `git add <fichier>`
4. Finaliser : `git commit` (pour merge) ou continuer le pull

## Workflow Recommandé pour Manus

**Pour petites fonctionnalités** :
- Travailler directement sur `main`
- Pull avant de commencer
- Commit et push fréquents

**Pour fonctionnalités complexes** :
- Créer une branche `manus/feature-xxx` depuis `main`
- Développer sur la branche
- Fusionner dans `main` quand prêt

## Workflow Recommandé pour l'IA

**Travail direct sur `main` pour :**
- ✅ Bug fixes
- ✅ Optimisations de performance
- ✅ Améliorations de code (refactoring)
- ✅ Corrections de types TypeScript
- ✅ Améliorations UX/UI
- ✅ Corrections de build/erreurs

**Créer une branche dédiée uniquement pour :**
- 🔄 Refactorings majeurs qui nécessitent plusieurs commits
- 🔄 Changements architecturaux importants
- 🔄 Nouvelles fonctionnalités complexes

**Processus :**
1. Toujours partir de `main` à jour : `git pull origin main`
2. Faire les modifications directement sur `main`
3. Commit et push sur `main`
4. Railway déploie automatiquement depuis `main`

## Backup Régulier

**Créer un backup de `main` dans `staging`** (à faire régulièrement ou après des changements importants) :
```bash
git checkout staging
git reset --hard main
git push origin staging --force
```

Cela permet d'avoir un point de restauration en cas de problème sur `main`.

## Exemple de Cycle Complet

1. **Manus** développe une fonctionnalité directement sur `main` (ou sur `manus-dev` puis merge)
2. **IA** corrige un bug directement sur `main`
3. **Backup** : Copier `main` → `staging` (régulièrement)
4. Railway déploie automatiquement depuis `main` (site en dev)
5. Si problème, restaurer depuis `staging`

## Avantages de ce Workflow

- ✅ **Simplicité** : Tout le monde travaille sur `main` (site en dev)
- ✅ **Rapidité** : Pas d'étapes supplémentaires, push direct sur `main`
- ✅ **Backup** : `staging` sert de point de restauration
- ✅ **Flexibilité** : Manus peut choisir de travailler directement sur `main` ou sur une branche dédiée
- ✅ **Déploiement automatique** : Railway déploie directement depuis `main`
