import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { securityHeaders } from "@/lib/security.js";

const publicRoutes = [
	"/",
	"/about",
	"/services",
	"/pricing",
	"/case-studies",
	"/blog",
	"/resources",
	"/contact",
	"/free-audit",
	"/login",
	"/register",
	"/forgot-password",
	"/reset-password",
	"/verify-email",
];

const authRoutes = ["/login", "/register", "/forgot-password"];

export async function proxy(request) {
	const { pathname } = request.nextUrl;

	const isPublicRoute = publicRoutes.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`),
	);
	const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
	const isApiRoute = pathname.startsWith("/api");
	const isAdminLoginRoute = pathname === "/admin/login";
	const isAdminRoute = pathname.startsWith("/admin");
	const isAdminProtectedRoute = isAdminRoute && !isAdminLoginRoute;
	const isDashboardRoute = pathname.startsWith("/dashboard");

	if (isApiRoute) {
		const response = NextResponse.next();
		Object.entries(securityHeaders).forEach(([key, value]) => {
			response.headers.set(key, value);
		});
		return response;
	}

	const token = await getToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET,
	});
	const isLoggedIn = !!token;
	const role = token?.role;

	// Already logged in — bounce away from auth pages
	if (isAuthRoute && isLoggedIn) {
		const redirectUrl = role === "admin" ? "/admin" : "/dashboard";
		return NextResponse.redirect(new URL(redirectUrl, request.url));
	}

	// Already logged in — bounce away from admin login
	if (isAdminLoginRoute && isLoggedIn) {
		const redirectUrl = role === "admin" ? "/admin" : "/dashboard";
		return NextResponse.redirect(new URL(redirectUrl, request.url));
	}

	// Admins shouldn't be in /dashboard
	if (isDashboardRoute && isLoggedIn && role === "admin") {
		return NextResponse.redirect(new URL("/admin", request.url));
	}

	// Protect /admin/* routes
	if (isAdminProtectedRoute) {
		if (!isLoggedIn) {
			return NextResponse.redirect(new URL("/admin/login", request.url));
		}
		if (role !== "admin") {
			return NextResponse.redirect(new URL("/dashboard", request.url));
		}
	}

	// Protect /dashboard routes
	if (isDashboardRoute && !isLoggedIn) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// Catch-all: non-public, non-admin, non-dashboard routes
	if (
		!isPublicRoute &&
		!isLoggedIn &&
		!isAdminProtectedRoute &&
		!isAdminLoginRoute &&
		!isDashboardRoute
	) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	const response = NextResponse.next();
	Object.entries(securityHeaders).forEach(([key, value]) => {
		response.headers.set(key, value);
	});
	return response;
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
