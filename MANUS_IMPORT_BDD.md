# Instructions d'import de contacts dans la base de données - MANUS

## Connexion à la base de données

MANUS doit se connecter directement à la base de données PostgreSQL via l'URL publique fournie par Railway.

**URL de connexion :** (à fournir par Railway)
```
postgresql://postgres:PASSWORD@HOST:PORT/DATABASE
```

## Structure de la table `contacts`

### Schéma de la table

```sql
CREATE TABLE contacts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  position TEXT,
  "companyId" TEXT,
  "ownerId" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  
  CONSTRAINT contacts_companyId_fkey 
    FOREIGN KEY ("companyId") REFERENCES companies(id) ON DELETE SET NULL,
  CONSTRAINT contacts_ownerId_fkey 
    FOREIGN KEY ("ownerId") REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX contacts_ownerId_idx ON contacts("ownerId");
CREATE INDEX contacts_companyId_idx ON contacts("companyId");
CREATE INDEX contacts_email_idx ON contacts(email);
```

### Champs requis

| Champ | Type | Description | Requis |
|------|------|-------------|--------|
| `id` | TEXT | Identifiant unique (généré automatiquement si non fourni) | Non |
| `firstName` | TEXT | Prénom du contact | **OUI** |
| `lastName` | TEXT | Nom du contact | **OUI** |
| `ownerId` | TEXT | ID de l'utilisateur propriétaire (doit exister dans `users`) | **OUI** |
| `email` | TEXT | Email du contact | Non |
| `phone` | TEXT | Téléphone du contact | Non |
| `position` | TEXT | Poste/fonction du contact | Non |
| `companyId` | TEXT | ID de l'entreprise (doit exister dans `companies` si fourni) | Non |
| `createdAt` | TIMESTAMP | Date de création (généré automatiquement si non fourni) | Non |
| `updatedAt` | TIMESTAMP | Date de mise à jour (généré automatiquement si non fourni) | Non |

## Instructions d'import

### Étape 1 : Obtenir l'ID d'un utilisateur propriétaire

Avant d'importer les contacts, vous devez obtenir l'ID d'un utilisateur existant qui sera le propriétaire des contacts importés.

```sql
-- Lister tous les utilisateurs disponibles
SELECT id, email, name, role FROM users;

-- Exemple de résultat :
-- id: "clx1234567890abcdef"
-- email: "admin@nukleo.com"
-- name: "Admin User"
-- role: "ADMIN"
```

**Important :** Notez l'`id` de l'utilisateur que vous souhaitez utiliser comme propriétaire. Vous en aurez besoin pour tous les contacts importés.

### Étape 2 : Vérifier/Créer les entreprises (si nécessaire)

Si vos contacts sont associés à des entreprises, vous devez d'abord créer ou récupérer les IDs des entreprises.

```sql
-- Vérifier si une entreprise existe
SELECT id, name FROM companies WHERE name = 'Nom de l''entreprise';

-- Créer une nouvelle entreprise si elle n'existe pas
INSERT INTO companies (id, name, "ownerId", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'Nom de l''entreprise',
  'OWNER_ID_ICI',  -- Remplacez par l'ID utilisateur obtenu à l'étape 1
  NOW(),
  NOW()
)
RETURNING id;
```

### Étape 3 : Import des contacts

#### Option A : Insertion simple (un contact à la fois)

```sql
INSERT INTO contacts (
  id,
  "firstName",
  "lastName",
  email,
  phone,
  position,
  "companyId",
  "ownerId",
  "createdAt",
  "updatedAt"
)
VALUES (
  gen_random_uuid()::text,  -- Génère un ID unique automatiquement
  'Jean',
  'Dupont',
  'jean.dupont@example.com',
  '+33 6 12 34 56 78',
  'Directeur Commercial',
  'COMPANY_ID_ICI',  -- Optionnel : ID de l'entreprise ou NULL
  'OWNER_ID_ICI',    -- ID utilisateur obtenu à l'étape 1
  NOW(),
  NOW()
);
```

#### Option B : Insertion en masse (plusieurs contacts)

```sql
INSERT INTO contacts (
  "firstName",
  "lastName",
  email,
  phone,
  position,
  "companyId",
  "ownerId"
)
VALUES
  ('Jean', 'Dupont', 'jean.dupont@example.com', '+33 6 12 34 56 78', 'Directeur Commercial', 'COMPANY_ID_1', 'OWNER_ID'),
  ('Marie', 'Martin', 'marie.martin@example.com', '+33 6 87 65 43 21', 'Responsable Marketing', 'COMPANY_ID_2', 'OWNER_ID'),
  ('Pierre', 'Durand', 'pierre.durand@example.com', NULL, 'CEO', NULL, 'OWNER_ID'),
  ('Sophie', 'Bernard', 'sophie.bernard@example.com', '+33 6 11 22 33 44', NULL, 'COMPANY_ID_1', 'OWNER_ID');
```

**Note :** Les champs `id`, `createdAt` et `updatedAt` seront générés automatiquement si non fournis.

#### Option C : Import depuis un fichier CSV (via psql)

Si vous avez un fichier CSV, vous pouvez utiliser `COPY` :

```sql
-- Créer une table temporaire
CREATE TEMP TABLE temp_contacts (
  "firstName" TEXT,
  "lastName" TEXT,
  email TEXT,
  phone TEXT,
  position TEXT,
  "companyName" TEXT
);

-- Copier les données depuis le CSV
COPY temp_contacts FROM '/chemin/vers/fichier.csv' WITH (FORMAT csv, HEADER true);

-- Insérer dans la table contacts avec résolution des entreprises
INSERT INTO contacts (
  "firstName",
  "lastName",
  email,
  phone,
  position,
  "companyId",
  "ownerId"
)
SELECT 
  tc."firstName",
  tc."lastName",
  tc.email,
  tc.phone,
  tc.position,
  c.id AS "companyId",
  'OWNER_ID' AS "ownerId"  -- Remplacez par l'ID utilisateur
FROM temp_contacts tc
LEFT JOIN companies c ON c.name = tc."companyName" AND c."ownerId" = 'OWNER_ID';

-- Nettoyer
DROP TABLE temp_contacts;
```

### Étape 4 : Vérification de l'import

```sql
-- Compter les contacts importés
SELECT COUNT(*) FROM contacts WHERE "ownerId" = 'OWNER_ID';

-- Voir les derniers contacts importés
SELECT 
  id,
  "firstName",
  "lastName",
  email,
  phone,
  position,
  "companyId",
  "createdAt"
FROM contacts
WHERE "ownerId" = 'OWNER_ID'
ORDER BY "createdAt" DESC
LIMIT 10;

-- Vérifier les contacts sans entreprise
SELECT 
  id,
  "firstName",
  "lastName",
  email
FROM contacts
WHERE "companyId" IS NULL AND "ownerId" = 'OWNER_ID';
```

## Contraintes et règles importantes

### 1. Clé étrangère `ownerId`
- **OBLIGATOIRE** : Chaque contact doit avoir un `ownerId` valide
- L'ID doit exister dans la table `users`
- Si l'utilisateur est supprimé, tous ses contacts seront supprimés (CASCADE)

### 2. Clé étrangère `companyId`
- **OPTIONNEL** : Peut être `NULL`
- Si fourni, l'ID doit exister dans la table `companies`
- Si l'entreprise est supprimée, le contact reste mais `companyId` devient `NULL`

### 3. Format des emails
- Les emails peuvent être `NULL`
- Pas de contrainte d'unicité au niveau base de données
- L'application gère les doublons au niveau applicatif

### 4. Format des téléphones
- Format libre (texte)
- Recommandé : format international (ex: `+33 6 12 34 56 78`)

### 5. Génération des IDs
- Si vous ne fournissez pas d'ID, utilisez `gen_random_uuid()::text`
- Les IDs doivent être uniques (clé primaire)

## Exemple complet d'import

```sql
-- 1. Obtenir l'ID utilisateur
SELECT id FROM users WHERE email = 'admin@nukleo.com';
-- Résultat : 'clx1234567890abcdef'

-- 2. Créer une entreprise si nécessaire
INSERT INTO companies (id, name, "ownerId")
VALUES (
  gen_random_uuid()::text,
  'Acme Corporation',
  'clx1234567890abcdef'
)
RETURNING id;
-- Résultat : 'clx9876543210fedcba'

-- 3. Importer les contacts
INSERT INTO contacts (
  "firstName",
  "lastName",
  email,
  phone,
  position,
  "companyId",
  "ownerId"
)
VALUES
  ('Jean', 'Dupont', 'jean.dupont@acme.com', '+33 6 12 34 56 78', 'CEO', 'clx9876543210fedcba', 'clx1234567890abcdef'),
  ('Marie', 'Martin', 'marie.martin@acme.com', '+33 6 87 65 43 21', 'CTO', 'clx9876543210fedcba', 'clx1234567890abcdef'),
  ('Pierre', 'Durand', 'pierre.durand@acme.com', NULL, 'CFO', 'clx9876543210fedcba', 'clx1234567890abcdef');

-- 4. Vérifier
SELECT COUNT(*) FROM contacts WHERE "ownerId" = 'clx1234567890abcdef';
```

## Gestion des erreurs courantes

### Erreur : "violates foreign key constraint"
- **Cause** : `ownerId` ou `companyId` n'existe pas
- **Solution** : Vérifier que les IDs existent dans les tables `users` ou `companies`

### Erreur : "null value in column violates not-null constraint"
- **Cause** : `firstName`, `lastName` ou `ownerId` est NULL
- **Solution** : S'assurer que ces champs sont toujours fournis

### Erreur : "duplicate key value violates unique constraint"
- **Cause** : Tentative d'insertion d'un ID déjà existant
- **Solution** : Utiliser `gen_random_uuid()::text` pour générer des IDs uniques

## Script SQL prêt à l'emploi

Voici un script SQL complet que MANUS peut adapter :

```sql
-- ============================================
-- SCRIPT D'IMPORT DE CONTACTS
-- ============================================

-- Étape 1 : Définir l'ID utilisateur propriétaire
-- REMPLACER PAR L'ID RÉEL
\set OWNER_ID 'clx1234567890abcdef'

-- Étape 2 : Créer les entreprises si nécessaire
-- (Répéter pour chaque entreprise)
INSERT INTO companies (id, name, "ownerId")
SELECT 
  gen_random_uuid()::text,
  'Nom Entreprise',
  :'OWNER_ID'
WHERE NOT EXISTS (
  SELECT 1 FROM companies WHERE name = 'Nom Entreprise' AND "ownerId" = :'OWNER_ID'
)
RETURNING id;

-- Étape 3 : Importer les contacts
INSERT INTO contacts (
  "firstName",
  "lastName",
  email,
  phone,
  position,
  "companyId",
  "ownerId"
)
SELECT 
  'Prénom',
  'Nom',
  'email@example.com',
  '+33 6 12 34 56 78',
  'Poste',
  (SELECT id FROM companies WHERE name = 'Nom Entreprise' AND "ownerId" = :'OWNER_ID' LIMIT 1),
  :'OWNER_ID'
WHERE NOT EXISTS (
  SELECT 1 FROM contacts 
  WHERE email = 'email@example.com' 
  AND "ownerId" = :'OWNER_ID'
);

-- Étape 4 : Vérification
SELECT 
  COUNT(*) as total_contacts,
  COUNT(DISTINCT "companyId") as companies_linked
FROM contacts
WHERE "ownerId" = :'OWNER_ID';
```

## Support

Pour toute question ou problème lors de l'import, contactez l'équipe technique avec :
- Le message d'erreur complet
- Le script SQL utilisé
- Le nombre de contacts à importer

