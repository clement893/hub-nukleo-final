# Package @nukleo/db

Package de gestion de la base de données avec Prisma.

## Structure

```
packages/db/
├── prisma/
│   ├── schema.prisma      # Schéma Prisma avec tous les modèles
│   └── seed.ts            # Script de seed pour les données de test
├── src/
│   ├── index.ts           # Export du client Prisma et types
│   └── types.ts           # Types uniquement (pour Client Components)
└── package.json
```

## Modèles de Données

### User
- Utilisateurs de l'application
- Rôles : ADMIN, MANAGER, USER
- Relations : opportunities, contacts, companies, projects, tasks

### Opportunity
- Opportunités commerciales
- Stages : NEW, QUALIFIED, PROPOSAL, NEGOTIATION, WON, LOST
- Relations : company, contact, owner (User)

### Contact
- Contacts commerciaux
- Relations : company, owner (User), opportunities

### Company
- Entreprises clientes
- Relations : owner (User), contacts, opportunities, projects

### Project
- Projets
- Status : PLANNING, IN_PROGRESS, ON_HOLD, COMPLETED, CANCELLED
- Relations : company, manager (User), tasks

### Task
- Tâches de projet
- Status : TODO, IN_PROGRESS, REVIEW, DONE
- Priority : LOW, MEDIUM, HIGH, URGENT
- Relations : project, assignee (User)

## Scripts Disponibles

### Génération du Client Prisma
```bash
pnpm db:generate
```
Génère le client Prisma à partir du schéma.

### Push du Schéma (Développement)
```bash
pnpm db:push
```
Pousse le schéma vers la base de données sans créer de migration. Utile pour le développement rapide.

### Créer une Migration
```bash
pnpm db:migrate
```
Crée une nouvelle migration et l'applique à la base de données de développement.

### Déployer les Migrations (Production)
```bash
pnpm db:migrate:deploy
```
Applique les migrations en attente à la base de données de production.

### Prisma Studio
```bash
pnpm db:studio
```
Ouvre Prisma Studio dans le navigateur pour visualiser et gérer les données.

### Seed la Base de Données
```bash
pnpm db:seed
```
Remplit la base de données avec des données de test.

### Reset la Base de Données
```bash
pnpm db:reset
```
Supprime toutes les données et réapplique les migrations et le seed.

## Configuration

### Variables d'Environnement

La variable `DATABASE_URL` doit être configurée pour se connecter à la base de données PostgreSQL.

Format :
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

### Exemple pour Railway
```
postgresql://postgres:PASSWORD@turntable.proxy.rlwy.net:49842/railway
```

## Utilisation

### Dans les Services (Server-side)
```typescript
import { prisma } from "@nukleo/db";

const users = await prisma.user.findMany();
```

### Dans les Client Components (Types uniquement)
```typescript
import type { OpportunityStage } from "@nukleo/db/types";

const stage: OpportunityStage = "NEW";
```

## Migrations

Les migrations sont stockées dans `prisma/migrations/`. Elles sont créées automatiquement lors de l'exécution de `pnpm db:migrate`.

Pour créer une migration initiale :
```bash
cd packages/db
pnpm db:migrate --name init
```

## Seed

Le script de seed (`prisma/seed.ts`) crée :
- 3 utilisateurs (admin, manager, user)
- 2 entreprises
- 2 contacts
- 3 opportunités (dont une gagnée)
- 1 projet
- 2 tâches

Pour exécuter le seed :
```bash
cd packages/db
pnpm db:seed
```

## Notes Importantes

- ⚠️ Ne jamais modifier directement les migrations existantes
- 🔒 Toujours valider les changements de schéma avant de créer une migration
- 📊 Utiliser Prisma Studio pour visualiser les données pendant le développement
- 🔄 En production, utiliser `db:migrate:deploy` au lieu de `db:migrate`
