# Import des Employés par Manus

## Table de destination

Les employés doivent être importés dans la table **`employees`** (et non `users`).

## Structure de la table `employees`

| Colonne | Type | Nullable | Description |
|---------|------|----------|-------------|
| `id` | TEXT | NOT NULL | ID unique (CUID) |
| `email` | TEXT | NOT NULL | Email unique de l'employé |
| `name` | TEXT | NULL | Nom complet (pour compatibilité) |
| `firstName` | TEXT | NULL | Prénom |
| `lastName` | TEXT | NULL | Nom de famille |
| `linkedin` | TEXT | NULL | URL LinkedIn |
| `department` | TEXT | NULL | Département |
| `title` | TEXT | NULL | Titre/Poste |
| `birthday` | TIMESTAMP(3) | NULL | Date d'anniversaire |
| `hireDate` | TIMESTAMP(3) | NULL | Date d'embauche |
| `role` | Role | NOT NULL | Rôle (ADMIN, MANAGER, USER) - Default: USER |
| `image` | TEXT | NULL | URL de la photo |
| `createdAt` | TIMESTAMP(3) | NOT NULL | Date de création |
| `updatedAt` | TIMESTAMP(3) | NOT NULL | Date de mise à jour |

## Champs requis pour l'import

Les champs suivants sont requis pour l'import par Manus :

- **Prénom** (`firstName`)
- **Nom de famille** (`lastName`)
- **LinkedIn** (`linkedin`) - Optionnel
- **Département** (`department`) - Optionnel
- **Anniversaire** (`birthday`) - Optionnel
- **Anniversaire embauche** (`hireDate`) - Optionnel
- **Photo** (`image`) - Optionnel
- **Titre** (`title`) - Optionnel

## Exemple d'insertion SQL

```sql
INSERT INTO "employees" (
    "id",
    "email",
    "firstName",
    "lastName",
    "linkedin",
    "department",
    "title",
    "birthday",
    "hireDate",
    "role",
    "image",
    "createdAt",
    "updatedAt"
) VALUES (
    'clx1234567890',  -- ID généré (CUID)
    'john.doe@example.com',
    'John',
    'Doe',
    'https://linkedin.com/in/johndoe',
    'Commercial',
    'Développeur Senior',
    '1990-05-15T00:00:00.000Z',
    '2020-01-15T00:00:00.000Z',
    'USER',
    'https://example.com/photos/john-doe.jpg',
    NOW(),
    NOW()
);
```

## Notes importantes

1. **Table séparée** : Les employés sont maintenant dans la table `employees`, séparée de `users` (qui est utilisée pour l'authentification).

2. **Email unique** : L'email doit être unique dans la table `employees`.

3. **Génération d'ID** : Utilisez `cuid()` ou générez un ID unique pour chaque employé.

4. **Format des dates** : Les dates doivent être au format ISO 8601 (TIMESTAMP).

5. **Rôle par défaut** : Si non spécifié, le rôle sera `USER`.

6. **Nom complet** : Le champ `name` sera automatiquement rempli avec `${firstName} ${lastName}` si les deux sont fournis.

## Migration automatique

Une migration automatique a été créée pour migrer les données existantes de `users` vers `employees` lors du déploiement.

Les utilisateurs qui ont au moins un des champs suivants seront migrés :
- `firstName`
- `lastName`
- `title`
- `birthday`
- `hireDate`
