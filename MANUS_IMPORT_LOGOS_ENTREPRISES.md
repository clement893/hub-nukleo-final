# Guide d'Importation des Logos d'Entreprises dans la Base de Données PostgreSQL

Ce document fournit des instructions détaillées pour l'importation directe des logos d'entreprises dans la base de données PostgreSQL de Hub Nukleo, en associant les logos stockés dans S3 aux entreprises existantes.

**ATTENTION :** L'accès direct à la base de données doit être géré avec prudence. Assurez-vous d'avoir les permissions nécessaires et de bien comprendre l'impact de vos opérations.

---

## 1. Structure de la Table `companies`

La table `companies` a maintenant un champ `logoKey` qui doit contenir la **clé S3** (pas l'URL complète) du logo stocké dans le bucket `nukleo-hub-photos`.

**Champs importants :**

-   `id`: `String` - Clé primaire unique
-   `name`: `String` - **Obligatoire**. Nom de l'entreprise
-   `logoKey`: `String?` - **Optionnel**. Clé S3 du logo (ex: `companies/acme-corp-logo-1234567890.png`)

---

## 2. Format du champ `logoKey`

Le `logoKey` doit correspondre exactement à la clé de l'objet dans S3. Par exemple :
- Si le logo est dans S3 avec la clé : `companies/acme-corp-logo-1234567890.png`
- Alors `logoKey` doit être : `companies/acme-corp-logo-1234567890.png`

**Format recommandé pour les clés S3 :**
```
companies/{nom-entreprise}-logo-{timestamp}.{extension}
```

Exemples :
- `companies/acme-corp-logo-1734656800.png`
- `companies/microsoft-logo-1734656900.jpg`
- `companies/google-logo-1734657000.svg`

---

## 3. Méthodes d'Importation

### Méthode 1 : Mise à jour manuelle (pour quelques entreprises)

```sql
-- Mettre à jour une entreprise avec son logo
UPDATE companies
SET "logoKey" = 'companies/acme-corp-logo-1234567890.png'
WHERE name = 'Acme Corp';
```

### Méthode 2 : Mise à jour en masse depuis un mapping CSV

Si vous avez un fichier CSV ou une table de correspondance entre entreprise et logo :

```sql
-- Créer une table temporaire avec les correspondances
CREATE TEMP TABLE company_logos (
  company_name TEXT,
  logo_key TEXT
);

-- Insérer les correspondances (exemple)
INSERT INTO company_logos VALUES
  ('Acme Corp', 'companies/acme-corp-logo-1234567890.png'),
  ('Microsoft', 'companies/microsoft-logo-1234567890.jpg'),
  ('Google', 'companies/google-logo-1234567890.svg');

-- Mettre à jour les entreprises
UPDATE companies c
SET "logoKey" = cl.logo_key
FROM company_logos cl
WHERE c.name = cl.company_name;
```

### Méthode 3 : Script SQL avancé avec pattern de nom

Si les logos suivent un pattern basé sur le nom de l'entreprise :

```sql
-- Exemple : si les logos sont nommés "nom-entreprise-logo-timestamp.jpg"
UPDATE companies
SET "logoKey" = CONCAT('companies/', LOWER(REPLACE(name, ' ', '-')), '-logo-', EXTRACT(EPOCH FROM "createdAt")::text, '.png')
WHERE "logoKey" IS NULL;
```

---

## 4. Vérification

```sql
-- Voir les entreprises avec logos
SELECT 
  id,
  name,
  "logoKey"
FROM companies
WHERE "logoKey" IS NOT NULL
ORDER BY name;

-- Voir les entreprises sans logos
SELECT 
  id,
  name
FROM companies
WHERE "logoKey" IS NULL
ORDER BY name;

-- Compter les entreprises avec/sans logos
SELECT 
  COUNT(*) FILTER (WHERE "logoKey" IS NOT NULL) AS avec_logo,
  COUNT(*) FILTER (WHERE "logoKey" IS NULL) AS sans_logo,
  COUNT(*) AS total
FROM companies;
```

---

## 5. Gestion des Erreurs Courantes

-   **Nom d'entreprise non trouvé** : Assurez-vous que le nom dans votre mapping correspond exactement au nom dans la base de données (respecter la casse et les espaces).
-   **Clé S3 incorrecte** : Vérifiez que la clé correspond exactement à celle dans S3, y compris le préfixe `companies/` si vous l'utilisez.
-   **Logo non accessible** : Assurez-vous que le fichier existe bien dans S3 avec la clé spécifiée.

---

## 6. Exemple Complet d'Importation

```sql
-- 1. Créer une table temporaire avec vos données
CREATE TEMP TABLE temp_company_logos (
  company_name TEXT NOT NULL,
  logo_key TEXT NOT NULL
);

-- 2. Insérer vos données (remplacez par vos vraies valeurs)
INSERT INTO temp_company_logos (company_name, logo_key) VALUES
  ('Acme Corporation', 'companies/acme-corporation-logo-1734656800.png'),
  ('Tech Solutions Inc', 'companies/tech-solutions-inc-logo-1734656900.jpg'),
  ('Global Industries', 'companies/global-industries-logo-1734657000.png');

-- 3. Mettre à jour les entreprises
UPDATE companies c
SET "logoKey" = tcl.logo_key
FROM temp_company_logos tcl
WHERE c.name = tcl.company_name;

-- 4. Vérifier les résultats
SELECT 
  c.name,
  c."logoKey",
  CASE 
    WHEN c."logoKey" IS NOT NULL THEN '✅ Logo assigné'
    ELSE '❌ Pas de logo'
  END AS status
FROM companies c
LEFT JOIN temp_company_logos tcl ON c.name = tcl.company_name
ORDER BY c.name;

-- 5. Nettoyer (les tables TEMP sont supprimées automatiquement à la fin de la session)
-- DROP TABLE temp_company_logos;
```

---

## 7. Format des Logos Recommandés

Pour une meilleure qualité d'affichage :

-   **Format** : PNG (avec transparence) ou JPG
-   **Taille** : 200x200px minimum (recommandé : 400x400px)
-   **Ratio** : 1:1 (carré) pour un affichage optimal
-   **Taille du fichier** : < 500KB pour de meilleures performances

---

## 8. Test

Après la mise à jour, vérifiez que les logos s'affichent en :
1. Allant sur `/commercial/companies`
2. Vérifiant que les logos apparaissent à côté des noms d'entreprises
3. Cliquant sur une entreprise pour voir le logo en grand format sur la page de détail

---

## Notes Importantes

1. **Le `logoKey` doit correspondre exactement** à la clé dans S3 (respecter la casse)
2. **Le champ est optionnel** : si `logoKey` est `NULL`, un logo par défaut avec les initiales sera affiché
3. **Les logos doivent être dans le bucket** `nukleo-hub-photos` configuré dans les variables d'environnement
4. **Les extensions de fichiers** doivent être incluses dans la clé (`.png`, `.jpg`, `.svg`, etc.)
5. **Préfixe recommandé** : Utilisez `companies/` comme préfixe pour organiser vos logos dans S3

Ce guide devrait permettre à MANUS d'importer les logos d'entreprises directement dans la base de données avec succès.


