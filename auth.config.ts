import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnPublicPage = ["/login", "/signup"].includes(nextUrl.pathname);

      if (isOnPublicPage) {
        // If logged in, kick them away from login/signup to the homepage
        if (isLoggedIn) return Response.redirect(new URL("/", nextUrl));
        return true;
      }

      // If they are on a protected page, return true only if they are logged in.
      // Next-Auth will automatically handle redirecting unauthenticated users to your signIn page (/login).
      return isLoggedIn;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
