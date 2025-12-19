# Configuration S3 sur Railway

## Variables d'environnement à configurer

Ajoutez ces variables dans votre projet Railway :

1. Allez sur votre projet Railway
2. Cliquez sur **Variables**
3. Ajoutez les variables suivantes :

```env
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="votre-access-key-id"
AWS_SECRET_ACCESS_KEY="votre-secret-access-key"
AWS_S3_BUCKET="nukleo-hub-photos"
```

**Note:** Remplacez `votre-access-key-id` et `votre-secret-access-key` par vos vraies valeurs AWS.

## Important : Sécurité

⚠️ **NE COMMITEZ JAMAIS ces valeurs dans Git !**

Ces credentials sont sensibles et doivent rester dans les variables d'environnement de Railway uniquement.

## Vérification de la région

Assurez-vous que `AWS_REGION` correspond à la région où se trouve votre bucket S3. Si votre bucket est dans une autre région (par exemple `eu-west-1`), mettez à jour la variable `AWS_REGION` en conséquence.

Pour vérifier la région de votre bucket :
1. Allez sur AWS Console > S3
2. Sélectionnez votre bucket `nukleo-hub-photos`
3. La région est affichée dans les propriétés du bucket

## Test de la configuration

Une fois les variables configurées, vous pouvez tester l'upload en utilisant le composant `FileUpload` ou l'API `/api/upload`.

## Permissions IAM requises

Assurez-vous que votre utilisateur IAM a les permissions suivantes sur le bucket `nukleo-hub-photos` :

- `s3:PutObject` - Pour uploader des fichiers
- `s3:GetObject` - Pour télécharger des fichiers
- `s3:DeleteObject` - Pour supprimer des fichiers
- `s3:HeadObject` - Pour vérifier l'existence des fichiers

