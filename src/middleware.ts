import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
	const pathname = req.nextUrl.pathname;

	const token = await getToken({ req });

	if (!pathname.startsWith("/api")) {
		if (token) { // has token
			// -- auth
			if (pathname.startsWith("/login") || pathname === "/") {
				return NextResponse.redirect(new URL("/dashboard", req.url));
			}
		}
		else { // has no token
			if (!pathname.startsWith("/login")) {
				return NextResponse.redirect(new URL("/login", req.url));
			}
		}
	}

	return NextResponse.next();
}

 export const config = {
	matcher: [
		/*
			* Match all request paths except for the ones starting with:
			* - _next/static (static assets)
			* - _next/image (image optimization files)
			* - favicon.ico
			* - any files in the public folder (e.g., images, robots.txt)
			* - service worker
			* - well-known config
		*/
		'/((?!_next/static|_next/image|favicon.ico|images|firebase-messaging-sw.js|.well-known).*)',
	],
};
