import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";

import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
		maxAge: 60 * 30,
  },
	providers: [
		Credentials({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials.password) return null;

				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				});
				if (!user) throw new Error("Email not found!");

				const isValid = await bcrypt.compare(credentials.password, user.password);
				if (!isValid) throw new Error("Invalid password!");

				return {
					id: user.id,
					name: user.name,
					email: user.email,
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id as number;
				token.email = user.email;
				token.name = user.name;
			}
			return token;
		},
		async session({ session, token }) {
			if (session && session.user) {
				session.user.id = token.id;
			}
			return session;
		},
	},
	pages: {
		signIn: "/login",
		error: "/login",
	},
	secret: process.env.NEXTAUTH_SECRET,
};
