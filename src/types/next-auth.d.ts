import NextAuth from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: number;
			name: string;
			email: string;
		};
	}
	interface User {
		id: number;
		name: string;
		email: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: number;
		name: string;
		email: string;
	}
}
