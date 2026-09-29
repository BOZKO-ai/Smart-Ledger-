
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Profile from "@/models/Profile";
import { getAuthorizedProfile, unauthorizedResponse } from "@/lib/authHelpers";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const profile = await getAuthorizedProfile(req);
    if (!profile) {
      return unauthorizedResponse();
    }

    if (profile.role !== "owner") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    const staffMember = await Profile.findOneAndDelete({ _id: params.id, businessId: profile.businessId, role: "staff" });
    if (!staffMember) {
      return NextResponse.json({ error: "Staff member not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Staff member removed successfully" });
  } catch (error) {
    console.error("Error removing staff member:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
