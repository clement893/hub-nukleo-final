# Architecture des Modules - Hub Nukleo

## Vue d'ensemble

Le Hub Nukleo est organisé en **7 modules principaux**, chacun avec sa propre logique métier, ses routes et ses composants UI.

## Structure du Monorepo

```
hub-nukleo-final/
├── apps/
│   └── web/                          # Application Next.js
│       └── app/
│           ├── commercial/           # Module 1: Commercial
│           ├── operations/          # Module 2: Opérations
│           ├── administration/      # Module 3: Administration
│           ├── finances/            # Module 4: Finances
│           ├── gestion/             # Module 5: Gestion
│           ├── communications/     # Module 6: Communications
│           └── clients/             # Module 7: Clients
│
├── packages/
│   ├── commercial/                  # Package Module 1: Commercial
│   │   └── src/
│   │       ├── services/            # Logique métier
│   │       ├── schemas/             # Schémas de validation
│   │       └── components/          # Composants réutilisables
│   │
│   ├── operations/                  # Package Module 2: Opérations
│   │   └── src/
│   │       ├── services/
│   │       ├── schemas/
│   │       └── components/
│   │
│   ├── administration/              # Package Module 3: Administration
│   ├── finances/                    # Package Module 4: Finances
│   ├── gestion/                     # Package Module 5: Gestion
│   ├── communications/              # Package Module 6: Communications
│   ├── clients/                     # Package Module 7: Clients
│   │
│   ├── db/                          # Package partagé: Base de données
│   └── ui/                          # Package partagé: Composants UI
```

## Modules

### Module 1: Commercial ✅ (Existant)
**Package:** `@nukleo/commercial`  
**Routes:** `/commercial/*`

**Fonctionnalités:**
- Opportunités (pipeline de vente)
- Contacts
- Entreprises
- Soumissions (proposals)
- Tableau de bord commercial
- Statistiques

**Structure:**
- `packages/commercial/src/services/` - Services métier
- `apps/web/app/commercial/` - Routes et composants UI

---

### Module 2: Opérations ✅ (Existant)
**Package:** `@nukleo/operations` (à créer)  
**Routes:** `/operations/*`

**Fonctionnalités:**
- Liste des opérations/projets
- Détails d'une opération
- Gestion des tâches
- Diagramme de Gantt
- Tableau de bord opérations

**Structure:**
- `packages/operations/src/services/` - Services métier
- `apps/web/app/operations/` - Routes et composants UI

---

### Module 3: Administration ⚠️ (À créer)
**Package:** `@nukleo/administration`  
**Routes:** `/administration/*`

**Fonctionnalités prévues:**
- Gestion des utilisateurs
- Gestion des rôles et permissions
- Paramètres système
- Logs et audit
- Configuration de l'application

**Structure à créer:**
```
packages/administration/
├── package.json
└── src/
    ├── services/
    │   ├── users.ts
    │   ├── roles.ts
    │   └── permissions.ts
    ├── schemas/
    │   └── user.ts
    └── index.ts

apps/web/app/administration/
├── layout.tsx
├── dashboard/
├── users/
├── roles/
└── settings/
```

---

### Module 4: Finances ⚠️ (À créer)
**Package:** `@nukleo/finances`  
**Routes:** `/finances/*`

**Fonctionnalités prévues:**
- Facturation
- Devis
- Avoirs
- Règlements
- Comptabilité
- Tableau de bord financier

**Structure à créer:**
```
packages/finances/
├── package.json
└── src/
    ├── services/
    │   ├── invoices.ts
    │   ├── quotes.ts
    │   ├── payments.ts
    │   └── accounting.ts
    ├── schemas/
    │   ├── invoice.ts
    │   └── payment.ts
    └── index.ts

apps/web/app/finances/
├── layout.tsx
├── dashboard/
├── invoices/
├── quotes/
├── payments/
└── accounting/
```

---

### Module 5: Gestion ⚠️ (À créer)
**Package:** `@nukleo/gestion`  
**Routes:** `/gestion/*`

**Fonctionnalités prévues:**
- Ressources humaines
- Planning
- Congés
- Temps de travail
- Évaluations

**Structure à créer:**
```
packages/gestion/
├── package.json
└── src/
    ├── services/
    │   ├── employees.ts
    │   ├── planning.ts
    │   ├── leaves.ts
    │   └── timesheets.ts
    ├── schemas/
    │   └── employee.ts
    └── index.ts

apps/web/app/gestion/
├── layout.tsx
├── dashboard/
├── employees/
├── planning/
├── leaves/
└── timesheets/
```

---

### Module 6: Communications ⚠️ (À créer)
**Package:** `@nukleo/communications`  
**Routes:** `/communications/*`

**Fonctionnalités prévues:**
- Emails
- Campagnes marketing
- Templates
- Historique des communications
- Analytics

**Structure à créer:**
```
packages/communications/
├── package.json
└── src/
    ├── services/
    │   ├── emails.ts
    │   ├── campaigns.ts
    │   └── templates.ts
    ├── schemas/
    │   └── campaign.ts
    └── index.ts

apps/web/app/communications/
├── layout.tsx
├── dashboard/
├── emails/
├── campaigns/
└── templates/
```

---

### Module 7: Clients ⚠️ (À créer)
**Package:** `@nukleo/clients`  
**Routes:** `/clients/*`

**Fonctionnalités prévues:**
- Portail client
- Tickets de support
- Documentation
- Commandes
- Historique des interactions

**Structure à créer:**
```
packages/clients/
├── package.json
└── src/
    ├── services/
    │   ├── tickets.ts
    │   ├── orders.ts
    │   └── portal.ts
    ├── schemas/
    │   └── ticket.ts
    └── index.ts

apps/web/app/clients/
├── layout.tsx
├── dashboard/
├── tickets/
├── orders/
└── portal/
```

## Principes d'Architecture

### 1. Séparation des responsabilités
- **Packages (`packages/`)**: Logique métier, services, schémas de validation
- **Apps (`apps/web/app/`)**: Routes Next.js, composants UI spécifiques au module

### 2. Imports entre modules
```typescript
// ✅ Correct - Import depuis les packages workspace
import { getAllOpportunities } from "@nukleo/commercial";
import { prisma } from "@nukleo/db";
import { Button } from "@nukleo/ui";

// ❌ Incorrect - Import direct entre apps
import { something } from "../../../projects/..."
```

### 3. Packages partagés
- `@nukleo/db`: Accès à la base de données (Prisma)
- `@nukleo/ui`: Composants UI réutilisables
- Packages de configuration: `@nukleo/eslint-config`, `@nukleo/typescript-config`, etc.

### 4. Structure d'un package type
```typescript
// packages/[module]/package.json
{
  "name": "@nukleo/[module]",
  "exports": {
    ".": "./src/index.ts",
    "./services": "./src/services/index.ts",
    "./schemas": "./src/schemas/index.ts"
  },
  "dependencies": {
    "@nukleo/db": "workspace:*",
    "@nukleo/ui": "workspace:*"
  }
}
```

### 5. Structure d'une route module
```typescript
// apps/web/app/[module]/layout.tsx
import { Sidebar } from "@/app/components/Sidebar";

export default function ModuleLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

## Navigation globale

La Sidebar (`apps/web/app/commercial/components/Sidebar.tsx`) doit être mise à jour pour inclure tous les modules :

```typescript
const modules = [
  { name: "Commercial", href: "/commercial", icon: "..." },
  { name: "Opérations", href: "/operations", icon: "..." },
  { name: "Administration", href: "/administration", icon: "..." },
  { name: "Finances", href: "/finances", icon: "..." },
  { name: "Gestion", href: "/gestion", icon: "..." },
  { name: "Communications", href: "/communications", icon: "..." },
  { name: "Clients", href: "/clients", icon: "..." },
];
```

## Prochaines étapes

1. ✅ Module Commercial - Existant et fonctionnel
2. ✅ Module Opérations - Existant (créer le package `@nukleo/operations`)
3. ⚠️ Créer les 5 modules manquants selon cette architecture
4. ⚠️ Mettre à jour la Sidebar pour inclure tous les modules
5. ⚠️ Créer les schémas Prisma pour chaque module dans `packages/db/prisma/schema.prisma`

## Notes importantes

- Chaque module doit être indépendant et réutilisable
- Les packages peuvent dépendre de `@nukleo/db` et `@nukleo/ui`
- Les packages ne doivent PAS dépendre d'autres packages de modules
- La logique métier reste dans les packages, l'UI dans les apps
- Utiliser Turborepo pour optimiser les builds et le cache

