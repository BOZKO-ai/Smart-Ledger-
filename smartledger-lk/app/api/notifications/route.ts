
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Notification from "@/models/Notification";
import Profile from "@/models/Profile";
import { getAuthorizedProfile, unauthorizedResponse } from "@/lib/authHelpers";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const profile = await getAuthorizedProfile(req);
    if (!profile) {
      return unauthorizedResponse();
    }

    const notifications = await Notification.find({ businessId: profile.businessId })
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
