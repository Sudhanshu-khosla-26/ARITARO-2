const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://aritaro.in";

export default function robots() {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/admin/", "/dashboard/", "/login", "/register", "/api/"],
		},
		sitemap: `${BASE_URL}/sitemap.xml`,
	};
}
