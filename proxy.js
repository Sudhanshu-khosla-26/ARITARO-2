import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { securityHeaders, rateLimit } from "@/lib/security.js";

const publicRoutes = [
	"/",
	"/about",
	"/services",
	"/case-studies",
	"/blog",
	"/careers",
	"/contact",
	"/request-assessment",
	"/legal",
	"/login",
	"/signup",
	"/register",
	"/forgot-password",
	"/reset-password",
	"/verify-email",
];

const authRoutes = ["/login", "/signup", "/register", "/forgot-password"];

export async function proxy(request) {
	const { pathname } = request.nextUrl;
	const ip =
		request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
		request.headers.get("x-real-ip") ||
		"127.0.0.1";

	// ─── 1. Login & Auth Rate Limiting (Brute-force mitigation) ────
	const isAuthEndpoint =
		pathname.startsWith("/api/auth/callback") ||
		pathname.startsWith("/api/auth/signin") ||
		pathname === "/api/auth/signup";

	if (isAuthEndpoint && request.method === "POST") {
		const limitResult = rateLimit(`auth_endpoint_${ip}`, 10, 60 * 1000);
		if (!limitResult.success) {
			const res = NextResponse.json(
				{
					error: "Too many authentication attempts. Please wait 60 seconds.",
				},
				{ status: 429 }
			);
			Object.entries(securityHeaders).forEach(([key, value]) => {
				res.headers.set(key, value);
			});
			res.headers.set("Retry-After", "60");
			return res;
		}
	}

	// ─── 2. API Route Security Headers ────────────────────────────
	const isApiRoute = pathname.startsWith("/api");
	if (isApiRoute) {
		const response = NextResponse.next();
		Object.entries(securityHeaders).forEach(([key, value]) => {
			response.headers.set(key, value);
		});
		return response;
	}

	const isPublicRoute = publicRoutes.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`)
	);
	const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
	const isAdminLoginRoute = pathname === "/admin/login";
	const isAdminRoute = pathname.startsWith("/admin");
	const isAdminProtectedRoute = isAdminRoute && !isAdminLoginRoute;
	const isDashboardRoute = pathname.startsWith("/dashboard");

	const token = await getToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET,
	});
	const isLoggedIn = !!token;
	const role = token?.role;

	// Already logged in — bounce away from auth pages
	if (isAuthRoute && isLoggedIn) {
		const redirectUrl = role === "admin" ? "/admin/dashboard" : "/dashboard";
		return NextResponse.redirect(new URL(redirectUrl, request.url));
	}

	// Already logged in — bounce away from admin login
	if (isAdminLoginRoute && isLoggedIn) {
		const redirectUrl = role === "admin" ? "/admin/dashboard" : "/dashboard";
		return NextResponse.redirect(new URL(redirectUrl, request.url));
	}

	// Admins shouldn't be in /dashboard
	if (isDashboardRoute && isLoggedIn && role === "admin") {
		return NextResponse.redirect(new URL("/admin/dashboard", request.url));
	}

	// Protect /admin/* routes
	if (isAdminProtectedRoute) {
		if (!isLoggedIn) {
			return NextResponse.redirect(new URL("/login?redirect=" + encodeURIComponent(pathname), request.url));
		}
		if (role !== "admin") {
			return NextResponse.redirect(new URL("/dashboard", request.url));
		}
	}

	// Protect /dashboard routes
	if (isDashboardRoute && !isLoggedIn) {
		return NextResponse.redirect(new URL("/login?redirect=" + encodeURIComponent(pathname), request.url));
	}

	const response = NextResponse.next();
	Object.entries(securityHeaders).forEach(([key, value]) => {
		response.headers.set(key, value);
	});
	return response;
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|aritaro-logo\\.png|icon0\\.svg|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
