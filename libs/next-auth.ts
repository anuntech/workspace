import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import config from "@/config";
import connectMongo from "./mongo";
import { custom } from "openid-client";
import mongoose from "mongoose";

custom.setHttpOptionsDefaults({
  timeout: 20000,
});

interface NextAuthOptionsExtended extends NextAuthOptions {
  adapter: any;
}

export const authOptions: NextAuthOptionsExtended = {
  // Set any random key in .env.local
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      // Follow the "Login with Google" tutorial to get your credentials
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.given_name ? profile.given_name : profile.name,
          email: profile.email,
          image: profile.picture,
          createdAt: new Date(),
        };
      },
    }),
    // Follow the "Login with Email" tutorial to set up your email server
    // Requires a MongoDB database. Set MONOGODB_URI env variable.
    ...(connectMongo
      ? [
          EmailProvider({
            server: process.env.EMAIL_SERVER,
            from: config.mailgun.fromNoReply,
          }),
        ]
      : []),
  ],
  // New users will be saved in Database (MongoDB Atlas). Each user (model) has some fields like name, email, image, etc..
  // Requires a MongoDB database. Set MONOGODB_URI env variable.
  // Learn more about the model type: https://next-auth.js.org/v3/adapters/models
  ...(connectMongo && { adapter: MongoDBAdapter(connectMongo) }),

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      custom.setHttpOptionsDefaults({
        timeout: 20000,
      });
      const isEmailLogin = account.provider === "email";
      const isOAuthLogin = account.provider === "google";

      if (isOAuthLogin && user) {
        const existingUser = await mongoose.connection
          .collection("users")
          .findOne({ email: user.email });

        if (existingUser) {
          await mongoose.connection.collection("accounts").insertOne({
            userId: existingUser._id,
            provider: "google",
            providerAccountId: account.providerAccountId,
          });
          return true;
        }
      }

      return true;
    },

    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  session: {
    strategy: "jwt",
  },
  theme: {
    colorScheme: config.colors.theme as "light" | "dark" | "auto",
    // Add you own logo below. Recommended size is rectangle (i.e. 200x50px) and show your logo + name.
    // It will be used in the login flow to display your logo. If you don't add it, it will look faded.
    logo: `/anuntech-logo.svg`,
  },
  pages: {
    signIn: "/auth/sign-in",
    newUser: "/onboarding/name",
  },
};

export default NextAuth(authOptions);
