import { headers } from "next/headers";

/** In-memory rate limiter — swap for Redis in high-traffic production */
const rateLimitStore = new Map();

export function rateLimit(
	identifier,
	max = Number(process.env.RATE_LIMIT_MAX) || 100,
	windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
) {
	const now = Date.now();
	const entry = rateLimitStore.get(identifier);

	if (!entry || now > entry.resetAt) {
		rateLimitStore.set(identifier, { count: 1, resetAt: now + windowMs });
		return { success: true, remaining: max - 1 };
	}

	if (entry.count >= max) {
		return { success: false, remaining: 0 };
	}

	entry.count++;
	return { success: true, remaining: max - entry.count };
}

export async function getClientIp() {
	const headersList = await headers();
	return (
		headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
		headersList.get("x-real-ip") ||
		"unknown"
	);
}

/** Sanitize user input to mitigate XSS */
export function sanitizeInput(input) {
	return input
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#x27;");
}

export const securityHeaders = {
	"X-Content-Type-Options": "nosniff",
	"X-Frame-Options": "DENY",
	"X-XSS-Protection": "1; mode=block",
	"Referrer-Policy": "strict-origin-when-cross-origin",
	"Permissions-Policy": "camera=(), microphone=(), geolocation=()",
	"Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
};
