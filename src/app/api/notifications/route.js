import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Notification from "@/models/Notification";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const notifications = await Notification.find({ user: session.user.id })
      .sort({ createdAt: -1 })
      .limit(10);

    return Response.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
