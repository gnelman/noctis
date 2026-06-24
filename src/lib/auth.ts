import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        phone: { label: "Téléphone", type: "text" },
        code: { label: "Code OTP", type: "text" },
      },
      async authorize(credentials) {
        const { phone, code } = credentials as {
          phone: string;
          code: string;
        };

        const member = await prisma.member.findUnique({
          where: { phone },
        });

        if (!member) return null;
        if (member.isBanned) return null;

        return {
          id: member.id,
          phone: member.phone,
          pseudo: member.pseudo,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});