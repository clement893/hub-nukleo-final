# Instructions pour lier les photos S3 aux contacts - MANUS

## Structure de la base de données

Le modèle `Contact` a maintenant un champ `photoKey` qui doit contenir la **clé S3** (pas l'URL complète) de la photo stockée dans le bucket `nukleo-hub-photos`.

## Format du champ `photoKey`

Le `photoKey` doit correspondre exactement à la clé de l'objet dans S3. Par exemple :
- Si la photo est dans S3 avec la clé : `contacts/photo-1234567890-abc123.jpg`
- Alors `photoKey` doit être : `contacts/photo-1234567890-abc123.jpg`

## Mise à jour des contacts existants

### Option 1 : Mise à jour manuelle (recommandé pour quelques contacts)

```sql
-- Mettre à jour un contact avec sa photo
UPDATE contacts
SET "photoKey" = 'contacts/photo-jean-dupont-1234567890-abc123.jpg'
WHERE id = 'contact-id-ici';
```

### Option 2 : Mise à jour en masse depuis un mapping

Si vous avez un fichier CSV ou une table de correspondance entre contact et photo :

```sql
-- Créer une table temporaire avec les correspondances
CREATE TEMP TABLE contact_photos (
  contact_email TEXT,
  photo_key TEXT
);

-- Insérer les correspondances (exemple)
INSERT INTO contact_photos VALUES
  ('jean.dupont@example.com', 'contacts/photo-jean-dupont-1234567890-abc123.jpg'),
  ('marie.martin@example.com', 'contacts/photo-marie-martin-1234567890-def456.jpg');

-- Mettre à jour les contacts
UPDATE contacts c
SET "photoKey" = cp.photo_key
FROM contact_photos cp
WHERE c.email = cp.contact_email;
```

### Option 3 : Mise à jour par pattern de nom

Si les photos suivent un pattern basé sur le nom du contact :

```sql
-- Exemple : si les photos sont nommées "firstName-lastName-timestamp.jpg"
UPDATE contacts
SET "photoKey" = CONCAT('contacts/', LOWER("firstName"), '-', LOWER("lastName"), '-', EXTRACT(EPOCH FROM "createdAt")::text, '.jpg')
WHERE "photoKey" IS NULL;
```

## Vérification

```sql
-- Voir les contacts avec photos
SELECT 
  id,
  "firstName",
  "lastName",
  email,
  "photoKey"
FROM contacts
WHERE "photoKey" IS NOT NULL;

-- Voir les contacts sans photos
SELECT 
  id,
  "firstName",
  "lastName",
  email
FROM contacts
WHERE "photoKey" IS NULL;
```

## Format des clés S3 recommandé

Pour une meilleure organisation, utilisez un préfixe dans les clés S3 :

```
contacts/{firstName}-{lastName}-{timestamp}.{extension}
```

Exemples :
- `contacts/jean-dupont-1734656800.jpg`
- `contacts/marie-martin-1734656900.png`

## Important

1. **Le `photoKey` doit correspondre exactement** à la clé dans S3 (respecter la casse)
2. **Le champ est optionnel** : si `photoKey` est `NULL`, l'avatar affichera les initiales
3. **Les photos doivent être dans le bucket** `nukleo-hub-photos` configuré dans les variables d'environnement
4. **Les extensions de fichiers** doivent être incluses dans la clé (`.jpg`, `.png`, etc.)

## Test

Après la mise à jour, vérifiez que les photos s'affichent en :
1. Allant sur `/commercial/contacts`
2. Vérifiant que les avatars affichent les photos au lieu des initiales
3. Cliquant sur un contact pour voir la photo en grand format


