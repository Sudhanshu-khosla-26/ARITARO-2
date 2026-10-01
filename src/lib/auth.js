import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/User";
import connectDB from "@/lib/db";
import { rateLimit } from "@/lib/security";

const isProd = process.env.NODE_ENV === "production";

export const authOptions = {
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},

	useSecureCookies: isProd,

	cookies: {
		sessionToken: {
			name: isProd ? "__Secure-next-auth.session-token" : "next-auth.session-token",
			options: {
				httpOnly: true,
				sameSite: "lax",
				path: "/",
				secure: isProd,
			},
		},
		callbackUrl: {
			name: isProd ? "__Secure-next-auth.callback-url" : "next-auth.callback-url",
			options: {
				httpOnly: true,
				sameSite: "lax",
				path: "/",
				secure: isProd,
			},
		},
		csrfToken: {
			name: isProd ? "__Host-next-auth.csrf-token" : "next-auth.csrf-token",
			options: {
				httpOnly: true,
				sameSite: "lax",
				path: "/",
				secure: isProd,
			},
		},
	},

	pages: {
		signIn: "/login",
		error: "/login",
	},

	providers: [
		// ─── Email + Password ──────────────────────────────────────────
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Email and password are required");
				}

				const normalizedEmail = String(credentials.email).trim().toLowerCase();

				// Brute-force rate limiting: 5 attempts per 15 minutes per email
				const limit = rateLimit(`auth_user_${normalizedEmail}`, 5, 15 * 60 * 1000);
				if (!limit.success) {
					throw new Error("Too many failed login attempts. Please try again after 15 minutes.");
				}

				try {
					await connectDB();

					const user = await User.findOne({
						email: normalizedEmail,
					}).select("+password");

					if (!user || !user.password) {
						// Generic error to prevent account enumeration
						throw new Error("Invalid email or password");
					}

					const isValid = await user.comparePassword(credentials.password);

					if (!isValid) {
						// Generic error to prevent account enumeration
						throw new Error("Invalid email or password");
					}

					if (user.isSuspended) {
						throw new Error("Your account has been suspended");
					}

					await User.updateOne(
						{ _id: user._id },
						{ $set: { lastLogin: new Date() } },
					);

					return {
						id: user._id.toString(),
						name: user.name,
						email: user.email,
						role: user.role,
						image: user.avatar,
					};
				} catch (e) {
					// Log technical error securely on server
					console.error("Authentication authorization error:", e.message);
					if (
						e.message === "Invalid email or password" ||
						e.message === "Your account has been suspended" ||
						e.message.startsWith("Too many")
					) {
						throw e;
					}
					// Generic message for unexpected DB/server errors
					throw new Error("Authentication failed. Please try again later.");
				}
			},
		}),

		// ─── Google OAuth ──────────────────────────────────────────────
		// GoogleProvider({
		// 	clientId: process.env.GOOGLE_CLIENT_ID!,
		// 	clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		// 	profile(profile) {
		// 		return {
		// 			id: profile.sub,
		// 			firstName: profile.given_name,
		// 			lastName: profile.family_name,
		// 			email: profile.email,
		// 			avatar: profile.picture,
		// 			name: profile.name,
		// 			emailVerified: profile.email_verified ? new Date() : undefined,
		// 		};
		// 	},
		// }),

		// // ─── GitHub OAuth ──────────────────────────────────────────────
		// GithubProvider({
		// 	clientId: process.env.GITHUB_CLIENT_ID!,
		// 	clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		// 	profile(profile) {
		// 		const [firstName, ...rest] = (profile.name ?? profile.login).split(" ");
		// 		return {
		// 			id: String(profile.id),
		// 			firstName,
		// 			lastName: rest.join(" ") || null,
		// 			email: profile.email,
		// 			avatar: profile.avatar_url,
		// 			name: profile.name ?? profile.login,
		// 			emailVerified: profile.verified ? new Date() : undefined,
		// 		};
		// 	},
		// }),
	],

	callbacks: {
		// Save user to database and attach data to JWT token
		async jwt({ token, user, account }) {
			if (user) {
				if (account?.provider === "credentials") {
					console.log("hello from credentials provider");
					token.id = user.id;
					token.name = user.name;
					token.image = user.image;
					token.role = user.role;
				} 
				// else {
				// 	await connectDB();

				// 	// Normalize avatar URL from Google/Github or custom props
				// 	const avatarUrl = user.image || user.avatar;
				// 	await User.updateOne(
				// 		{ email: user.email || "" },
				// 		{
				// 			$set: {
				// 				avatar: avatarUrl,
				// 			},
				// 		},
				// 		{ upsert: true },
				// 	);

				// 	const dbUser = await User.findOne({ email: user.email });

				// 	token.id = dbUser?._id?.toString() || user.id;
				// 	token.name = dbUser?.name || user.name;
				// 	token.image = dbUser?.avatar || avatarUrl;
				// 	token.role = dbUser?.role || user.role;
				// }
			} else {
				// 2. Subsequent requests: Fetch fresh avatar from DB
				try {
					await connectDB();
					const userId = token.id || token.sub;
					if (userId) {
						const dbUser = await User.findById(userId).select("avatar");
						if (dbUser && dbUser.avatar) {
							token.image = dbUser.avatar;
						}
					}
				} catch (error) {
					console.error("Failed to fetch fresh user data:", error);
				}
			}
			return token;
		},

		// Expose token data on the session object (accessible via useSession)
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id ?? token.sub;
				session.user.name = token.name;
				session.user.email = token.email;
				session.user.image = token.image;
				session.user.role = token.role;
			}
			return session;
		},
		
		async redirect({ url, baseUrl, token }) {
			// after login, redirect admins to /admin, others to /
			if (url.startsWith(baseUrl)) return url;
			return baseUrl;
		},
	},
};
