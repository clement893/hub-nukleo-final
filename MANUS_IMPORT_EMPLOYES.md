# Instructions d'import d'employés dans la base de données - MANUS

## Connexion à la base de données

MANUS doit se connecter directement à la base de données PostgreSQL via l'URL publique fournie par Railway.

**URL de connexion :** (à fournir par Railway)
```
postgresql://postgres:PASSWORD@HOST:PORT/DATABASE
```

## Structure de la table `users`

### Schéma de la table

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  "emailVerified" TIMESTAMP,
  name TEXT,
  "firstName" TEXT,        -- Prénom
  "lastName" TEXT,          -- Nom de famille
  linkedin TEXT,            -- LinkedIn URL
  department TEXT,          -- Département
  title TEXT,               -- Titre/Poste
  birthday TIMESTAMP,       -- Anniversaire
  "hireDate" TIMESTAMP,     -- Anniversaire embauche
  password TEXT,
  role TEXT NOT NULL DEFAULT 'USER',
  image TEXT,               -- Photo URL
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX users_email_idx ON users(email);
CREATE INDEX users_role_idx ON users(role);
CREATE INDEX users_department_idx ON users(department);
```

### Champs requis

| Champ | Type | Description | Requis |
|------|------|-------------|--------|
| `id` | TEXT | Identifiant unique (généré automatiquement si non fourni) | Non |
| `email` | TEXT | Email de l'employé (doit être unique) | **OUI** |
| `name` | TEXT | Nom complet de l'employé (peut être généré à partir de firstName + lastName) | Non |
| `firstName` | TEXT | Prénom de l'employé | Non |
| `lastName` | TEXT | Nom de famille de l'employé | Non |
| `linkedin` | TEXT | URL du profil LinkedIn | Non |
| `department` | TEXT | Département de l'employé (ex: Commercial, Technique, RH...) | Non |
| `title` | TEXT | Titre/Poste de l'employé (ex: Développeur Senior, Chef de projet...) | Non |
| `birthday` | TIMESTAMP | Date d'anniversaire | Non |
| `hireDate` | TIMESTAMP | Date d'embauche (anniversaire embauche) | Non |
| `role` | TEXT | Rôle: `ADMIN`, `MANAGER`, ou `USER` (défaut: `USER`) | Non |
| `image` | TEXT | URL de la photo de profil | Non |
| `password` | TEXT | Mot de passe hashé (optionnel pour import Manus) | Non |
| `emailVerified` | TIMESTAMP | Date de vérification email | Non |
| `createdAt` | TIMESTAMP | Date de création (généré automatiquement si non fourni) | Non |
| `updatedAt` | TIMESTAMP | Date de mise à jour (généré automatiquement si non fourni) | Non |

## Instructions d'import

### Étape 1 : Vérifier les employés existants

```sql
-- Lister tous les employés
SELECT id, email, name, role FROM users ORDER BY name;

-- Vérifier si un email existe déjà
SELECT id, email, name FROM users WHERE email = 'email@example.com';
```

### Étape 2 : Import des employés

#### Option A : Insertion simple (un employé à la fois)

```sql
INSERT INTO users (
  id,
  email,
  "firstName",
  "lastName",
  name,
  linkedin,
  department,
  title,
  birthday,
  "hireDate",
  role,
  image,
  "createdAt",
  "updatedAt"
)
VALUES (
  gen_random_uuid()::text,  -- Génère un ID unique automatiquement
  'jean.dupont@example.com',
  'Jean',                    -- Prénom
  'Dupont',                  -- Nom de famille
  'Jean Dupont',             -- Nom complet (peut être généré automatiquement)
  'https://linkedin.com/in/jean-dupont',  -- LinkedIn URL
  'Commercial',              -- Département
  'Développeur Senior',      -- Titre/Poste
  '1990-05-15',              -- Anniversaire (format DATE ou TIMESTAMP)
  '2020-01-15',              -- Date d'embauche
  'USER',                    -- ou 'MANAGER' ou 'ADMIN'
  'https://example.com/photo.jpg',  -- URL de la photo ou NULL
  NOW(),
  NOW()
);
```

#### Option B : Insertion en masse (plusieurs employés)

```sql
INSERT INTO users (
  email,
  "firstName",
  "lastName",
  name,
  linkedin,
  department,
  birthday,
  "hireDate",
  role,
  image
)
VALUES
  ('jean.dupont@example.com', 'Jean', 'Dupont', 'Jean Dupont', 'https://linkedin.com/in/jean-dupont', 'Commercial', 'Développeur Senior', '1990-05-15', '2020-01-15', 'USER', NULL),
  ('marie.martin@example.com', 'Marie', 'Martin', 'Marie Martin', 'https://linkedin.com/in/marie-martin', 'Technique', 'Chef de projet', '1988-03-20', '2019-06-01', 'MANAGER', NULL),
  ('pierre.durand@example.com', 'Pierre', 'Durand', 'Pierre Durand', NULL, 'RH', 'Responsable RH', '1992-11-10', '2021-09-01', 'USER', NULL),
  ('sophie.bernard@example.com', 'Sophie', 'Bernard', 'Sophie Bernard', 'https://linkedin.com/in/sophie-bernard', 'Direction', 'Directrice Générale', '1985-07-25', '2018-01-01', 'ADMIN', NULL);
```

**Note :** Les champs `id`, `createdAt` et `updatedAt` seront générés automatiquement si non fournis.

#### Option C : Import depuis un fichier CSV (via psql)

Si vous avez un fichier CSV, vous pouvez utiliser `COPY` :

```sql
-- Créer une table temporaire
CREATE TEMP TABLE temp_employees (
  email TEXT,
  name TEXT,
  role TEXT,
  image TEXT
);

-- Copier les données depuis le CSV
COPY temp_employees FROM '/chemin/vers/fichier.csv' WITH (FORMAT csv, HEADER true);

-- Insérer dans la table users
INSERT INTO users (email, name, role, image)
SELECT 
  email,
  name,
  COALESCE(role, 'USER') AS role,  -- Défaut USER si non spécifié
  NULLIF(image, '') AS image  -- NULL si vide
FROM temp_employees
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE users.email = temp_employees.email
);

-- Nettoyer
DROP TABLE temp_employees;
```

### Étape 3 : Vérification de l'import

```sql
-- Compter les employés importés
SELECT COUNT(*) FROM users;

-- Voir les derniers employés importés
SELECT 
  id,
  email,
  "firstName",
  "lastName",
  name,
  department,
  role,
  birthday,
  "hireDate",
  "createdAt"
FROM users
ORDER BY "createdAt" DESC
LIMIT 10;

-- Vérifier les employés par rôle
SELECT 
  role,
  COUNT(*) as count
FROM users
GROUP BY role
ORDER BY role;
```

## Contraintes et règles importantes

### 1. Unicité de l'email
- **OBLIGATOIRE** : Chaque email doit être unique
- Si vous tentez d'insérer un email existant, vous obtiendrez une erreur
- Utilisez `ON CONFLICT` pour gérer les doublons :

```sql
INSERT INTO users (email, name, role)
VALUES ('jean.dupont@example.com', 'Jean Dupont', 'USER')
ON CONFLICT (email) DO UPDATE
SET name = EXCLUDED.name,
    role = EXCLUDED.role,
    "updatedAt" = NOW();
```

### 2. Format des rôles
- Les valeurs valides sont : `ADMIN`, `MANAGER`, `USER`
- La valeur par défaut est `USER` si non spécifiée
- Les rôles sont sensibles à la casse

### 3. Format des emails
- Les emails doivent être valides et uniques
- Pas de contrainte de format au niveau base de données, mais l'application valide le format

### 4. Génération des IDs
- Si vous ne fournissez pas d'ID, utilisez `gen_random_uuid()::text`
- Les IDs doivent être uniques (clé primaire)

## Exemple complet d'import

```sql
-- 1. Vérifier les employés existants
SELECT COUNT(*) FROM users;

-- 2. Importer les employés
INSERT INTO users (
  email,
  "firstName",
  "lastName",
  name,
  linkedin,
  department,
  title,
  birthday,
  "hireDate",
  role,
  image
)
VALUES
  ('jean.dupont@acme.com', 'Jean', 'Dupont', 'Jean Dupont', 'https://linkedin.com/in/jean-dupont', 'Commercial', 'Développeur Senior', '1990-05-15', '2020-01-15', 'USER', NULL),
  ('marie.martin@acme.com', 'Marie', 'Martin', 'Marie Martin', 'https://linkedin.com/in/marie-martin', 'Technique', 'Chef de projet', '1988-03-20', '2019-06-01', 'MANAGER', NULL),
  ('pierre.durand@acme.com', 'Pierre', 'Durand', 'Pierre Durand', NULL, 'RH', 'Responsable RH', '1992-11-10', '2021-09-01', 'USER', NULL),
  ('sophie.bernard@acme.com', 'Sophie', 'Bernard', 'Sophie Bernard', 'https://linkedin.com/in/sophie-bernard', 'Direction', 'Directrice Générale', '1985-07-25', '2018-01-01', 'ADMIN', NULL);

-- 3. Vérifier
SELECT 
  COUNT(*) as total_employees,
  COUNT(CASE WHEN role = 'ADMIN' THEN 1 END) as admins,
  COUNT(CASE WHEN role = 'MANAGER' THEN 1 END) as managers,
  COUNT(CASE WHEN role = 'USER' THEN 1 END) as users
FROM users;
```

## Gestion des erreurs courantes

### Erreur : "duplicate key value violates unique constraint"
- **Cause** : Tentative d'insertion d'un email déjà existant
- **Solution** : Utiliser `ON CONFLICT` pour mettre à jour ou ignorer les doublons

### Erreur : "null value in column violates not-null constraint"
- **Cause** : `email` est NULL
- **Solution** : S'assurer que tous les emails sont fournis

### Erreur : "invalid input value for enum"
- **Cause** : Valeur de `role` invalide
- **Solution** : Utiliser uniquement `ADMIN`, `MANAGER`, ou `USER`

## Script SQL prêt à l'emploi

Voici un script SQL complet que MANUS peut adapter :

```sql
-- ============================================
-- SCRIPT D'IMPORT D'EMPLOYÉS
-- ============================================

-- Option 1 : Insertion simple avec gestion des conflits
INSERT INTO users (email, "firstName", "lastName", name, linkedin, department, title, birthday, "hireDate", role, image)
SELECT 
  'email@example.com',
  'Prénom',
  'Nom',
  'Prénom Nom',
  'https://linkedin.com/in/profil',
  'Département',
  'Titre/Poste',
  '1990-01-01',
  '2020-01-01',
  'USER',
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'email@example.com'
)
RETURNING id, email, "firstName", "lastName", name;

-- Option 2 : Insertion en masse avec gestion des conflits
INSERT INTO users (email, "firstName", "lastName", name, linkedin, department, title, birthday, "hireDate", role, image)
VALUES
  ('email1@example.com', 'Prénom1', 'Nom1', 'Prénom1 Nom1', 'https://linkedin.com/in/profil1', 'Commercial', 'Développeur', '1990-01-01', '2020-01-01', 'USER', NULL),
  ('email2@example.com', 'Prénom2', 'Nom2', 'Prénom2 Nom2', 'https://linkedin.com/in/profil2', 'Technique', 'Chef de projet', '1988-05-15', '2019-06-01', 'MANAGER', NULL),
  ('email3@example.com', 'Prénom3', 'Nom3', 'Prénom3 Nom3', NULL, 'RH', 'Responsable RH', '1992-11-20', '2021-09-01', 'USER', NULL)
ON CONFLICT (email) DO UPDATE
SET "firstName" = EXCLUDED."firstName",
    "lastName" = EXCLUDED."lastName",
    name = EXCLUDED.name,
    linkedin = EXCLUDED.linkedin,
    department = EXCLUDED.department,
    title = EXCLUDED.title,
    birthday = EXCLUDED.birthday,
    "hireDate" = EXCLUDED."hireDate",
    role = EXCLUDED.role,
    image = EXCLUDED.image,
    "updatedAt" = NOW();

-- Vérification finale
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN role = 'ADMIN' THEN 1 END) as admins,
  COUNT(CASE WHEN role = 'MANAGER' THEN 1 END) as managers,
  COUNT(CASE WHEN role = 'USER' THEN 1 END) as users
FROM users;
```

## Support

Pour toute question ou problème lors de l'import, contactez l'équipe technique avec :
- Le message d'erreur complet
- Le script SQL utilisé
- Le nombre d'employés à importer

## Notes importantes

- Les employés importés apparaîtront automatiquement dans le module Gestion > Employés
- Les employés peuvent être modifiés ou supprimés depuis l'interface après l'import
- Les rôles déterminent les permissions dans l'application :
  - **ADMIN** : Accès complet à tous les modules
  - **MANAGER** : Accès à la gestion des équipes et projets
  - **USER** : Accès standard aux fonctionnalités

