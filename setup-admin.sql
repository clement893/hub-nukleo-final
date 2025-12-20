-- Script pour donner le rôle ADMIN à clement@nukleo.com et créer un compte test

-- 1. Mettre à jour clement@nukleo.com en ADMIN
UPDATE "User"
SET role = 'ADMIN', "isActive" = true
WHERE email = 'clement@nukleo.com';

-- 2. Créer un compte test pour Manus (si n'existe pas déjà)
INSERT INTO "User" (id, email, name, role, "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'test@manus.ai',
  'Manus Test',
  'ADMIN',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE
SET role = 'ADMIN', "isActive" = true;

-- 3. Afficher les utilisateurs admin
SELECT id, email, name, role, "isActive" 
FROM "User" 
WHERE role = 'ADMIN' OR email IN ('clement@nukleo.com', 'test@manus.ai');
