import { cookies } from "next/headers";
import { prisma } from "@nukleo/db";

const SESSION_COOKIE_NAME = "nukleo-session";
const DEFAULT_USER_ID = "default-user-id"; // ID d'un utilisateur par défaut créé au seed

/**
 * Récupère l'ID de l'utilisateur actuellement connecté
 * Pour l'instant, utilise un système simple avec cookies
 * TODO: Intégrer NextAuth.js ou un autre système d'authentification complet
 */
export async function getCurrentUserId(): Promise<string> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionId) {
    // Vérifier si la session existe et récupérer l'utilisateur
    // Pour l'instant, on retourne l'ID par défaut
    // TODO: Implémenter la vérification de session dans la base de données
    return DEFAULT_USER_ID;
  }

  // Si pas de session, retourner l'ID par défaut
  // En production, cela devrait rediriger vers la page de connexion
  return DEFAULT_USER_ID;
}

/**
 * Crée une session pour un utilisateur
 */
export async function createSession(userId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  });
}

/**
 * Supprime la session actuelle
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Récupère l'utilisateur actuel depuis la base de données
 */
export async function getCurrentUser() {
  const userId = await getCurrentUserId();
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });
}


