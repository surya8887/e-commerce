import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

import connectDB from "@/lib/db";
import User from "@/model/user.model";

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials ?? {};

        if (!email || !password) {
          throw new Error("Please provide both email and password");
        }

        await connectDB();
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        if (user.deletedAt) {
          throw new Error("Account is deactivated");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          username: user.username,
          image: user.avatar?.url || null,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async jwt({ token, user, account }) {
      await connectDB();

      if (account && user && account.provider === "google") {
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          const baseUsername = user.name?.replace(/\s+/g, "").toLowerCase() || "user";
          const uniqueUsername = `${baseUsername}_${uuidv4().slice(0, 6)}`;

          const newUser = await User.create({
            email: user.email,
            username: uniqueUsername,
            password: uuidv4(), // dummy
            avatar: {
              url: user.image || "",
              public_id: "",
            },
            isEmailVerified: true,
          });

          token.id = newUser._id.toString();
          token.username = newUser.username;
          token.role = newUser.role;
          token.picture = newUser.avatar?.url || null;
        } else {
          token.id = existingUser._id.toString();
          token.username = existingUser.username;
          token.role = existingUser.role;
          token.picture = existingUser.avatar?.url || null;
        }
      }

      if (user && account?.provider === "credentials") {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.picture = user.image;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET!,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
