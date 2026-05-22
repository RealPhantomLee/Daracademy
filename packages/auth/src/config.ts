import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Discord from "next-auth/providers/discord";
import bcryptjs from "bcryptjs";
import { prisma } from "@daracademy/database";
import { credentialsSchema } from "./validators/password";
import type { NextAuthOptions } from "next-auth";

// Validate NEXTAUTH_SECRET at startup (strict in production)
const secret =
  process.env.NEXTAUTH_SECRET || "development-secret-key-change-in-production";
if (process.env.NODE_ENV === "production" && (!secret || secret.length < 32)) {
  throw new Error(
    "NEXTAUTH_SECRET must be at least 32 characters in production. Generate with: openssl rand -base64 32",
  );
}

// Warn in development if using default secret
if (
  process.env.NODE_ENV !== "production" &&
  secret === "development-secret-key-change-in-production"
) {
  console.warn(
    "⚠️  Using development default NEXTAUTH_SECRET. Set NEXTAUTH_SECRET in production.",
  );
}

// Warn if NEXTAUTH_URL is not HTTPS in production
if (
  process.env.NODE_ENV === "production" &&
  !process.env.NEXTAUTH_URL?.startsWith("https://")
) {
  console.warn("⚠️  NEXTAUTH_URL must use https:// in production");
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
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
        // Validate input against security schema
        const validation = credentialsSchema.safeParse(credentials);
        if (!validation.success) {
          return null;
        }
        const { email, password } = validation.data;

        // Rate limiting check (placeholder for future Redis implementation)
        // TODO: implement actual rate limiting with Redis

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user?.password) {
          return null;
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
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
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
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
    maxAge: 24 * 60 * 60, // 24 hours instead of 30 days
  },
  events: {
    async signIn({ user, isNewUser }: any) {
      if (isNewUser) {
        // Initialize new user profile
        if (
          (user as any).role === "STUDENT" ||
          (user as any).role === "TUTOR"
        ) {
          // Profile will be created on user setup flow
        }
      }
    },
  },
};
