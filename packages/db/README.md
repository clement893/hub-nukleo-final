# @nukleo/db

Package de base de données pour les applications Nukleo utilisant Prisma et PostgreSQL.

## Installation

```bash
pnpm add @nukleo/db
```

## Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du monorepo avec :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/nukleo?schema=public"
```

### Génération du client Prisma

```bash
pnpm db:generate
```

## Scripts disponibles

- `pnpm db:generate` - Génère le client Prisma
- `pnpm db:push` - Pousse le schéma vers la base de données (développement)
- `pnpm db:migrate` - Crée et applique une migration
- `pnpm db:migrate:deploy` - Applique les migrations (production)
- `pnpm db:studio` - Ouvre Prisma Studio
- `pnpm db:seed` - Seed la base de données (si configuré)
- `pnpm db:reset` - Réinitialise la base de données

## Utilisation

```tsx
import { prisma } from "@nukleo/db";

// Exemple : Créer un utilisateur
const user = await prisma.user.create({
  data: {
    email: "user@example.com",
    name: "John Doe",
    role: "USER",
  },
});

// Exemple : Récupérer les opportunités avec relations
const opportunities = await prisma.opportunity.findMany({
  include: {
    company: true,
    contact: true,
    owner: true,
  },
});
```

## Modèles disponibles

### User
- `id`, `email`, `name`, `role` (ADMIN, MANAGER, USER)
- Relations : opportunities, contacts, companies, projects, tasks

### Opportunity
- `id`, `title`, `description`, `value`, `stage` (NEW, QUALIFIED, PROPOSAL, NEGOTIATION, WON, LOST), `probability`, `expectedCloseDate`, `actualCloseDate`
- Relations : company, contact, owner

### Contact
- `id`, `firstName`, `lastName`, `email`, `phone`, `position`
- Relations : company, owner, opportunities

### Company
- `id`, `name`, `industry`, `website`, `phone`, `address`, `city`, `country`
- Relations : owner, contacts, opportunities, projects

### Project
- `id`, `name`, `description`, `status` (PLANNING, IN_PROGRESS, ON_HOLD, COMPLETED, CANCELLED), `startDate`, `endDate`, `budget`
- Relations : company, manager, tasks

### Task
- `id`, `title`, `description`, `status` (TODO, IN_PROGRESS, REVIEW, DONE), `priority` (LOW, MEDIUM, HIGH, URGENT), `dueDate`
- Relations : project, assignee

## Types TypeScript

Tous les types Prisma sont exportés :

```tsx
import type { User, Opportunity, Role, OpportunityStage } from "@nukleo/db";
```

## Migration

Pour créer une nouvelle migration :

```bash
pnpm db:migrate --name migration_name
```

## Seed (optionnel)

Créez un fichier `prisma/seed.ts` pour seed la base de données :

```tsx
import { prisma } from "../src/index";

async function main() {
  // Seed data here
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## Licence

MIT

