import { Suspense } from "react";
import AdminClient from "./AdminClient";

export const metadata = {
	title: "Admin Dashboard | Aritaro",
	description: "aritaro admin panel for platform management",
};

export default function AdminPage() {
	return (
		<Suspense fallback={
			<div
				style={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "#05050A",
				}}
			>
				<div
					style={{
						width: 36,
						height: 36,
						border: "3px solid rgba(124,58,237,0.2)",
						borderTopColor: "#7C3AED",
						borderRadius: "50%",
						animation: "spin 0.7s linear infinite",
					}}
				/>
				<style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
			</div>
		}>
			<AdminClient />
		</Suspense>
	);
}
