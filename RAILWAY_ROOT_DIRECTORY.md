# Configuration Railway - Root Directory

## Problème

Le Dockerfile dans `apps/web/` ne peut pas accéder aux fichiers en dehors de `apps/web` car Railway utilise `apps/web` comme Root Directory.

## Solution

J'ai créé un `Dockerfile` à la **racine du monorepo** qui peut accéder à tous les fichiers.

## Configuration dans Railway

### IMPORTANT : Changer le Root Directory

1. Dans Railway Dashboard, allez dans votre **Service**
2. Allez dans **Settings** → **Service**
3. Trouvez **Root Directory**
4. **Changez de `apps/web` à `.` (racine)** ou laissez vide
5. Railway utilisera maintenant le `Dockerfile` à la racine

### Vérification

Après avoir changé le Root Directory :
- Railway détectera le `Dockerfile` à la racine
- Le contexte Docker aura accès à tous les fichiers du monorepo
- Le build devrait fonctionner correctement

## Structure

```
hub-nukleo-final/
├── Dockerfile          ← Nouveau Dockerfile à la racine
├── .dockerignore
├── package.json
├── packages/
├── apps/
│   └── web/
└── ...
```

Le Dockerfile à la racine peut maintenant copier tous les fichiers nécessaires.


