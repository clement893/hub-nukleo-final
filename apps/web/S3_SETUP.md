# Configuration AWS S3

Ce guide explique comment configurer Amazon S3 pour le stockage de fichiers dans l'application.

## Prérequis

1. Un compte AWS avec accès à S3
2. Un bucket S3 créé
3. Des credentials AWS (Access Key ID et Secret Access Key)

## Configuration

### 1. Créer un bucket S3

1. Connectez-vous à la [Console AWS](https://console.aws.amazon.com/)
2. Allez dans **S3** > **Buckets**
3. Cliquez sur **Create bucket**
4. Configurez votre bucket :
   - **Bucket name** : Choisissez un nom unique (ex: `hub-nukleo-files`)
   - **Region** : Choisissez une région proche de vos utilisateurs
   - **Block Public Access** : Configurez selon vos besoins (recommandé: activer pour la sécurité)
5. Cliquez sur **Create bucket**

### 2. Créer un utilisateur IAM avec accès S3

1. Allez dans **IAM** > **Users**
2. Cliquez sur **Create user**
3. Nommez l'utilisateur (ex: `hub-nukleo-s3-user`)
4. Sélectionnez **Attach policies directly**
5. Attachez la politique `AmazonS3FullAccess` (ou créez une politique plus restrictive)
6. Cliquez sur **Create user**

### 3. Générer des credentials

1. Cliquez sur l'utilisateur créé
2. Allez dans l'onglet **Security credentials**
3. Cliquez sur **Create access key**
4. Sélectionnez **Application running outside AWS**
5. Cliquez sur **Create access key**
6. **IMPORTANT** : Copiez l'**Access Key ID** et le **Secret Access Key** (vous ne pourrez plus voir le secret après)

### 4. Configurer les variables d'environnement

Ajoutez ces variables dans votre fichier `.env` ou dans Railway :

```env
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="votre-access-key-id"
AWS_SECRET_ACCESS_KEY="votre-secret-access-key"
AWS_S3_BUCKET_NAME="votre-bucket-name"
```

### 5. Configuration CORS (si nécessaire)

Si vous avez besoin d'accéder aux fichiers depuis le navigateur, configurez CORS sur votre bucket :

1. Allez dans votre bucket S3
2. Allez dans l'onglet **Permissions**
3. Faites défiler jusqu'à **Cross-origin resource sharing (CORS)**
4. Cliquez sur **Edit** et ajoutez :

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["https://votre-domaine.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

## Utilisation

### Upload de fichier

```typescript
import { uploadToS3, generateS3Key } from "@/lib/s3";

const file = // File object from form
const key = generateS3Key(file.name, "uploads");
await uploadToS3(buffer, key, file.type);
```

### Obtenir une URL de téléchargement

```typescript
import { getPresignedDownloadUrl } from "@/lib/s3";

const url = await getPresignedDownloadUrl("path/to/file.jpg", 3600); // Valid for 1 hour
```

### Supprimer un fichier

```typescript
import { deleteFromS3 } from "@/lib/s3";

await deleteFromS3("path/to/file.jpg");
```

## API Routes

L'application expose plusieurs routes API pour gérer les fichiers :

- `POST /api/upload` - Upload un fichier
- `GET /api/files/[key]` - Télécharge un fichier (redirection vers URL présignée)
- `GET /api/files/[key]/presigned` - Obtient une URL présignée pour upload/download

## Sécurité

- Les credentials AWS ne doivent **jamais** être commités dans Git
- Utilisez des variables d'environnement pour stocker les credentials
- Configurez des politiques IAM restrictives (principe du moindre privilège)
- Activez le logging S3 pour surveiller les accès
- Utilisez des URLs présignées avec une expiration courte pour les téléchargements

## Coûts

S3 facture selon :
- Stockage utilisé (GB/mois)
- Requêtes (GET, PUT, etc.)
- Transfert de données sortantes

Consultez la [page de tarification AWS S3](https://aws.amazon.com/s3/pricing/) pour plus d'informations.

