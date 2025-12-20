# Instructions pour appliquer les migrations Prisma

## Migration : Ajout de photoKey et logoKey

Cette migration ajoute deux nouveaux champs :
- `photoKey` dans la table `contacts` (pour les photos de contacts depuis S3)
- `logoKey` dans la table `companies` (pour les logos d'entreprises depuis S3)

## Option 1 : Via Railway (Recommandé)

Les migrations seront appliquées automatiquement lors du prochain déploiement via le script `run-migrations.sh` qui exécute `pnpm db:push`.

## Option 2 : Application manuelle via SQL

Si vous avez accès direct à la base de données PostgreSQL, vous pouvez exécuter directement le SQL suivant :

```sql
-- Ajouter photoKey à la table contacts
ALTER TABLE "contacts" ADD COLUMN IF NOT EXISTS "photoKey" TEXT;

-- Ajouter logoKey à la table companies
ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "logoKey" TEXT;
```

## Option 3 : Via Prisma CLI (en local)

Si vous avez accès à la base de données en local :

```bash
cd packages/db
pnpm db:push
```

Ou pour créer une migration formelle :

```bash
cd packages/db
pnpm db:migrate dev --name add_photoKey_logoKey
```

## Vérification

Après l'application de la migration, vérifiez que les colonnes existent :

```sql
-- Vérifier que photoKey existe dans contacts
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'contacts' AND column_name = 'photoKey';

-- Vérifier que logoKey existe dans companies
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'companies' AND column_name = 'logoKey';
```

Les deux requêtes doivent retourner une ligne chacune.


