import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getUser } from "@/app/services/users";

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const isGuest = credentials?.isGuestLogin === "true";

        let incomingCredentials = credentials;

        if (isGuest) {
          incomingCredentials = {
            username: process.env.GUEST_USERNAME ?? "",
            password: process.env.GUEST_PASSWORD ?? "",
          };
        }
        const parsedCredentials = z
          .object({
            username: z.string().trim().min(1, "Username is required"),
            password: z.string().trim().min(1, "Password is required"),
          })
          .safeParse(incomingCredentials);

        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data;
          const user = await getUser(username);
          if (!user) return null;
          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) {
            return {
              id: String(user.id),
              name: `${user.firstName} ${user.lastName}`,
              email: `${user.username}`,
            };
          }
        }
        console.error("Invalid Credentials!");
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        session.user = token.user as any;
      }
      return session;
    },
  },
});
