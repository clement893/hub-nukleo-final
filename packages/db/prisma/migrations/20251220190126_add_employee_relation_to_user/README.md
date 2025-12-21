# Migration: Ajout de la relation Employee à User

## Description

Cette migration ajoute une relation optionnelle entre les modèles `User` et `Employee`, permettant de lier un utilisateur à un employé.

## Changements

1. **Ajout du champ `employeeId` dans le modèle `User`**
   - Champ optionnel (`String?`)
   - Relation avec le modèle `Employee`
   - Index créé pour optimiser les requêtes

2. **Désactivation des utilisateurs**
   - Tous les utilisateurs sont désactivés sauf Manus et Clément
   - Les utilisateurs sont identifiés par leur nom ou email contenant "manus", "clément" ou "clement" (insensible à la casse)

## Exécution

### 1. Migration SQL principale

La migration SQL principale ajoute la colonne et les contraintes :

```bash
# La migration sera exécutée automatiquement lors du déploiement
# ou manuellement avec :
pnpm prisma migrate deploy
```

### 2. Script de désactivation des utilisateurs

Pour désactiver les utilisateurs (sauf Manus et Clément), exécutez le script TypeScript :

```bash
cd packages/db/prisma/migrations/20251220190126_add_employee_relation_to_user
npx tsx deactivate_users.ts
```

**Note:** Assurez-vous que la variable d'environnement `DATABASE_URL` est configurée avant d'exécuter le script.

## Utilisation

Après la migration, vous pouvez lier un utilisateur à un employé :

```typescript
// Créer ou mettre à jour un utilisateur avec un employé
await prisma.user.update({
  where: { id: userId },
  data: {
    employeeId: employeeId,
  },
});

// Récupérer un utilisateur avec son employé
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    employee: true,
  },
});
```

## Rollback

Pour annuler cette migration :

```sql
-- Supprimer la contrainte de clé étrangère
ALTER TABLE "users" DROP CONSTRAINT "users_employeeId_fkey";

-- Supprimer l'index
DROP INDEX "users_employeeId_idx";

-- Supprimer la colonne
ALTER TABLE "users" DROP COLUMN "employeeId";
```

