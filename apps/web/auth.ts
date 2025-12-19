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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const nextAuth = NextAuth(authConfig);
export const { handlers } = nextAuth;
export const auth: (typeof nextAuth)['auth'] = nextAuth.auth;
export const signIn: (typeof nextAuth)['signIn'] = nextAuth.signIn;
export const signOut: (typeof nextAuth)['signOut'] = nextAuth.signOut;