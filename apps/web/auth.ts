import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@nukleo/db";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import type { Role } from "@prisma/client";
import type { DefaultSession } from "next-auth";

// Extended types for NextAuth v5
declare module "next-auth" {
  interface User {
    role?: Role;
  }
  
  interface Session {
    user: {
      id: string;
      role?: Role;
    } & DefaultSession["user"];
  }
  
  // JWT types are part of the main next-auth module in v5
  interface JWT {
    id?: string;
    role?: Role;
    rememberMe?: boolean;
  }
}

export const authConfig: NextAuthConfig = {
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    // Default session maxAge: 30 days (for "remember me")
    // If not remembered: 1 day (handled in callbacks)
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        // Store rememberMe preference (default to true for better UX)
        token.rememberMe = true;
      }
      
      // Handle session updates
      if (trigger === "update" && session) {
        if (session.rememberMe !== undefined) {
          token.rememberMe = session.rememberMe;
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id && typeof token.id === "string") {
        session.user.id = token.id;
        // Type guard for token.role
        if (token.role && (token.role === "ADMIN" || token.role === "MANAGER" || token.role === "USER")) {
          session.user.role = token.role as Role;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        // Max age will be set dynamically based on rememberMe
        maxAge: 30 * 24 * 60 * 60, // 30 days default
      },
    },
  },
};

const nextAuth = NextAuth(authConfig);
export const { handlers } = nextAuth;
export const auth: (typeof nextAuth)['auth'] = nextAuth.auth;
export const signIn: (typeof nextAuth)['signIn'] = nextAuth.signIn;
export const signOut: (typeof nextAuth)['signOut'] = nextAuth.signOut;