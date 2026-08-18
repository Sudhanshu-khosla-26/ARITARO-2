import "./globals.css";
import NavigationWrapper from "@/components/NavigationWrapper";
import FooterWrapper from "@/components/FooterWrapper";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";

// Standard system font variables for offline compatibility
const inter = { variable: "font-sans" };
const jetbrainsMono = { variable: "font-mono" };

const defaultBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://aritaro.in";

export const metadata = {
	metadataBase: new URL(defaultBaseUrl),
	title: {
		default: "Aritaro Pvt Limited | Enterprise Cybersecurity & AI Automation",
		template: "%s | Aritaro Cybersecurity",
	},
	description:
		"Military-grade threat detection, zero-trust architecture, and AI-driven automation — built for India's most critical businesses.",
	keywords:
		"cybersecurity, AI automation, penetration testing, SOC, MDR, cloud security, compliance, aritaro, India",
	authors: [{ name: "Aritaro Security Team" }],
	creator: "Aritaro",
	publisher: "Aritaro Pvt Limited",
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	alternates: {
		canonical: defaultBaseUrl,
	},
	icons: {
		icon: [
			{ url: "/aritaro-logo.png", type: "image/png", sizes: "any" },
		],
		apple: [
			{ url: "/aritaro-logo.png" },
		],
		shortcut: "/aritaro-logo.png",
	},
	openGraph: {
		title: "Aritaro Pvt Limited | Enterprise Cybersecurity & AI Automation",
		description:
			"Military-grade threat detection, zero-trust architecture, and AI-driven automation built for enterprise security.",
		url: defaultBaseUrl,
		siteName: "Aritaro",
		locale: "en_US",
		type: "website",
	},
};

export default function RootLayout({ children }) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			data-theme="dark"
			className={`dark ${inter.variable} ${jetbrainsMono.variable}`}
		>
			<head>
				<link rel="icon" href="/aritaro-logo.png" type="image/png" />
				<link rel="shortcut icon" href="/aritaro-logo.png" type="image/png" />
			</head>
			<body
				suppressHydrationWarning
				className="min-h-screen antialiased overflow-x-hidden"
				style={{
					fontFamily: "var(--font-sans)",
					background: "var(--bg-base)",
					color: "var(--text-primary)",
					transition: "background 0.3s ease, color 0.3s ease",
				}}
			>
				<Providers>
					{/* <GlobalBackground /> */}
					<NavigationWrapper />
					{children}
					<FooterWrapper />
					<Toaster position="top-right" richColors closeButton />
				</Providers>
			</body>
		</html>
	);
}
