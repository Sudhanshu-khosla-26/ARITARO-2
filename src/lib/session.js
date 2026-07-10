import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getSession() {
	return getServerSession(authOptions);
}

export async function requireAdmin() {
	const session = await getSession();
	if (!session?.user || session.user.role !== "admin") {
		return { authorized: false, session: null };
	}
	return { authorized: true, session };
}
