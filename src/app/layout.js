import "./globals.css";
import NavigationWrapper from "@/components/NavigationWrapper";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";

// Standard system font variables for offline compatibility
const inter = { variable: "font-sans" };
const jetbrainsMono = { variable: "font-mono" };

export const metadata = {
	title: "Aritaro Pvt Limited | Enterprise Cybersecurity & AI Automation",
	description:
		"Military-grade threat detection, zero-trust architecture, and AI-driven automation — built for India's most critical businesses.",
	keywords:
		"cybersecurity, AI automation, penetration testing, SOC, MDR, cloud security, compliance, aritaro, India",
};

export default function RootLayout({ children }) {
	return (
		<html
			lang="en"
			data-theme="dark"
			className={`${inter.variable} ${jetbrainsMono.variable}`}
		>
			<body
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
					<Toaster position="top-right" richColors closeButton />
				</Providers>
			</body>
		</html>
	);
}
