import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Discord from "next-auth/providers/discord";
import bcryptjs from "bcryptjs";
import { prisma } from "@daracademy/database";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
    /**
     * Apple Sign-In Configuration
     *
     * To implement Apple Sign-In, add the following to your NextAuth configuration:
     *
     * ```typescript
     * Apple({
     *   clientId: process.env.APPLE_CLIENT_ID,
     *   clientSecret: process.env.APPLE_CLIENT_SECRET,
     * }),
     * ```
     *
     * Required environment variables:
     * - APPLE_CLIENT_ID: The Apple Team ID (e.g., "XXXXXXXXXX")
     * - APPLE_CLIENT_SECRET: Generated from Apple Developer Console (private key)
     *
     * Steps to set up:
     * 1. Go to https://developer.apple.com/account/resources/identifiers/list
     * 2. Create a Service ID (e.g., com.daracademy.id)
     * 3. Configure Sign-In with Apple for this Service ID
     * 4. Create a private key in Certificates section
     * 5. Download the .p8 file and use its contents as APPLE_CLIENT_SECRET
     *
     * Note: Apple requires a web redirect URI. Configure it as:
     * https://<YOUR_DOMAIN>/api/auth/callback/apple
     */
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcryptjs.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  events: {
    async signIn({ user, isNewUser }) {
      if (isNewUser) {
        // Initialize new user profile
        if (user.role === "STUDENT" || user.role === "TUTOR") {
          // Profile will be created on user setup flow
        }
      }
    },
  },
} satisfies NextAuthConfig;
