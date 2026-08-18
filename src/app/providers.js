"use client";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/components/CartContext";
import CartPanel from "@/components/CartPanel";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

export const Providers = ({ children }) => {
	return (
		<SessionProvider>
			<SmoothScrollProvider>
				<CartProvider>
					{children}
					<CartPanel />
				</CartProvider>
			</SmoothScrollProvider>
		</SessionProvider>
	);
};
