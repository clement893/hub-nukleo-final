# Guide de Configuration de la Base de Données

Ce guide vous explique comment organiser et configurer la base de données PostgreSQL pour le projet Hub Nukleo.

## 📋 Prérequis

- PostgreSQL (via Railway ou localement)
- URL de connexion à la base de données
- Node.js 20+ installé

## 🚀 Configuration Initiale

### 1. Configurer la Variable d'Environnement

#### Sur Railway

1. Allez dans votre projet Railway
2. Cliquez sur votre service (web)
3. Allez dans l'onglet **Variables**
4. Ajoutez une nouvelle variable :
   - **Nom** : `DATABASE_URL`
   - **Valeur** : `postgresql://postgres:jgQLrQahWKPtBryEKFSMuonagOOSHGiN@turntable.proxy.rlwy.net:49842/railway`
5. Sauvegardez

#### Localement

Créez un fichier `.env` à la racine du projet :

```env
DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/nukleo"
```

### 2. Créer la Migration Initiale

```bash
cd packages/db
pnpm db:migrate --name init
```

Cela va :
- Créer le dossier `prisma/migrations/`
- Générer la migration initiale avec tous les modèles
- Appliquer la migration à la base de données

### 3. Générer le Client Prisma

```bash
cd packages/db
pnpm db:generate
```

### 4. Seed la Base de Données (Optionnel)

Pour remplir la base avec des données de test :

```bash
cd packages/db
pnpm db:seed
```

Cela crée :
- 3 utilisateurs (admin@nukleo.com, manager@nukleo.com, user@nukleo.com)
- 2 entreprises
- 2 contacts
- 3 opportunités
- 1 projet
- 2 tâches

## 🔄 Workflow de Développement

### Modifier le Schéma

1. Modifiez `packages/db/prisma/schema.prisma`
2. Créez une migration :
   ```bash
   cd packages/db
   pnpm db:migrate --name description_des_changements
   ```
3. Le client Prisma sera régénéré automatiquement

### Visualiser les Données

```bash
cd packages/db
pnpm db:studio
```

Ouvre Prisma Studio dans votre navigateur à `http://localhost:5555`

### Reset la Base de Données

⚠️ **Attention** : Cela supprime toutes les données !

```bash
cd packages/db
pnpm db:reset
```

## 🚢 Déploiement en Production

### Sur Railway

Les migrations sont appliquées automatiquement lors du build si vous configurez un script de postinstall ou dans le Dockerfile.

Pour appliquer manuellement les migrations :

1. Via Railway CLI :
   ```bash
   railway run pnpm db:migrate:deploy
   ```

2. Via Railway Dashboard :
   - Ouvrez le terminal de votre service
   - Exécutez :
     ```bash
     cd packages/db
     pnpm db:migrate:deploy
     ```

### Script de Migration Automatique

Vous pouvez ajouter ce script dans votre Dockerfile ou dans Railway :

```bash
cd packages/db && pnpm db:migrate:deploy && cd ../..
```

## 📊 Structure de la Base de Données

### Tables Principales

- `users` - Utilisateurs de l'application
- `companies` - Entreprises clientes
- `contacts` - Contacts commerciaux
- `opportunities` - Opportunités commerciales
- `projects` - Projets
- `tasks` - Tâches de projet

### Relations Clés

- Un User peut avoir plusieurs Opportunities, Contacts, Companies, Projects, Tasks
- Une Opportunity appartient à un User (owner), peut avoir une Company et un Contact
- Un Contact appartient à un User (owner) et peut avoir une Company
- Une Company appartient à un User (owner) et peut avoir plusieurs Contacts, Opportunities, Projects
- Un Project appartient à un User (manager) et peut avoir une Company et plusieurs Tasks
- Une Task appartient à un Project et peut avoir un User (assignee)

## 🔍 Vérification

Pour vérifier que tout fonctionne :

```bash
cd packages/db
pnpm db:studio
```

Vous devriez voir toutes les tables avec leurs données.

## 🛠️ Commandes Utiles

| Commande | Description |
|----------|-------------|
| `pnpm db:generate` | Génère le client Prisma |
| `pnpm db:push` | Pousse le schéma (dev uniquement) |
| `pnpm db:migrate` | Crée et applique une migration |
| `pnpm db:migrate:deploy` | Applique les migrations (production) |
| `pnpm db:studio` | Ouvre Prisma Studio |
| `pnpm db:seed` | Remplit la base avec des données de test |
| `pnpm db:reset` | Reset complet de la base |

## ⚠️ Notes Importantes

- **Ne jamais modifier les migrations existantes** - Créez toujours une nouvelle migration
- **Toujours tester localement** avant de déployer en production
- **Sauvegardez votre base** avant d'exécuter `db:reset`
- **En production**, utilisez toujours `db:migrate:deploy` et jamais `db:migrate`

## 🆘 Dépannage

### Erreur : "Can't reach database server"

Vérifiez que :
- La variable `DATABASE_URL` est correctement configurée
- La base de données est accessible depuis votre réseau
- Les credentials sont corrects

### Erreur : "Migration failed"

1. Vérifiez les logs d'erreur
2. Assurez-vous que le schéma est valide : `pnpm db:validate`
3. Si nécessaire, réinitialisez : `pnpm db:reset`

### Erreur : "Prisma Client not generated"

Exécutez :
```bash
cd packages/db
pnpm db:generate
```

