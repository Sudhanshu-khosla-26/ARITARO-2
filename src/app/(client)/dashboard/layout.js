import DashboardSidebar from "@/components/DashboardSidebar";

export default async function layout({ children }) {
	return (
		<div className="dash-layout">
			{/* Mobile menu button */}
			<DashboardSidebar />

			{children}
		</div>
	);
}
