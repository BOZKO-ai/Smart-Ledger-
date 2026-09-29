
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Notification from "@/models/Notification";
import Profile from "@/models/Profile";
import { getAuthorizedProfile, unauthorizedResponse } from "@/lib/authHelpers";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const profile = await getAuthorizedProfile(req);
    if (!profile) {
      return unauthorizedResponse();
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: params.id, businessId: profile.businessId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    return NextResponse.json(notification);
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
