"use client";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/components/CartContext";
import CartPanel from "@/components/CartPanel";

export const Providers = ({ children }) => {
	return (
		<SessionProvider>
			<CartProvider>
				{children}
				<CartPanel />
			</CartProvider>
		</SessionProvider>
	);
};
