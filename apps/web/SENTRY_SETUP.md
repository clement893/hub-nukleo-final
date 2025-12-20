# Sentry Setup Guide

Ce guide explique comment configurer Sentry pour le tracking d'erreurs en production.

## 📋 Prérequis

1. Un compte Sentry (gratuit sur [sentry.io](https://sentry.io))
2. Un projet Sentry créé pour cette application

## 🚀 Configuration

### 1. Installer les dépendances

```bash
cd apps/web
pnpm install
```

### 2. Obtenir votre DSN Sentry

1. Connectez-vous à [sentry.io](https://sentry.io)
2. Allez dans **Settings** > **Projects** > **[Votre Projet]**
3. Allez dans **Client Keys (DSN)**
4. Copiez votre DSN (format: `https://xxx@xxx.ingest.sentry.io/xxx`)

### 3. Configurer les variables d'environnement

Ajoutez ces variables dans votre fichier `.env` ou dans Railway :

```env
# Sentry Error Tracking
SENTRY_DSN="https://xxx@xxx.ingest.sentry.io/xxx"
NEXT_PUBLIC_SENTRY_DSN="https://xxx@xxx.ingest.sentry.io/xxx"

# Sentry Configuration (optionnel)
SENTRY_ORG="your-org-name"
SENTRY_PROJECT="your-project-name"

# Activer Sentry en développement (optionnel, par défaut: désactivé)
# SENTRY_ENABLE_DEV=false
```

**Note:** Utilisez le même DSN pour `SENTRY_DSN` et `NEXT_PUBLIC_SENTRY_DSN`.

### 4. Build et déploiement

Sentry sera automatiquement configuré lors du build :

```bash
pnpm build
```

## 🔧 Fonctionnalités

### Tracking automatique des erreurs

Toutes les erreurs loggées avec `logger.error()` sont automatiquement envoyées à Sentry en production :

```typescript
import { logger } from "@/lib/logger";

try {
  // Votre code
} catch (error) {
  logger.error("Failed to fetch user", error, { userId: "123" });
  // L'erreur est automatiquement envoyée à Sentry en production
}
```

### Session Replay

Sentry enregistre automatiquement les sessions utilisateur pour faciliter le débogage.

### Source Maps

Les source maps sont automatiquement uploadées lors du build pour un meilleur débogage.

## 🧪 Tests

Les tests pour les helpers d'authentification sont disponibles :

```bash
pnpm test lib/__tests__/auth-helpers.test.ts
```

## 📚 Documentation

- [Documentation Sentry Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Logger Documentation](./lib/logger.ts) - Documentation complète du logger

## ⚠️ Notes importantes

1. **Développement** : Par défaut, Sentry n'envoie pas d'erreurs en développement. Pour l'activer, définissez `SENTRY_ENABLE_DEV=true`.

2. **Données sensibles** : Le logger filtre automatiquement les données sensibles (cookies, headers) avant d'envoyer à Sentry.

3. **Performance** : Le taux d'échantillonnage est configuré à 10% en production pour éviter d'impacter les performances.


