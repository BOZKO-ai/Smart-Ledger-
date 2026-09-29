
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Profile from "@/models/Profile";
import { getAuthorizedProfile, unauthorizedResponse } from "@/lib/authHelpers";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const profile = await getAuthorizedProfile(req);
    if (!profile) {
      return unauthorizedResponse();
    }

    if (profile.role !== "owner") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    const staffMembers = await Profile.find({ businessId: profile.businessId, role: "staff" });

    return NextResponse.json(staffMembers);
  } catch (error) {
    console.error("Error fetching staff members:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const profile = await getAuthorizedProfile(req);
    if (!profile) {
      return unauthorizedResponse();
    }

    if (profile.role !== "owner") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    const { email } = await req.json();

    const existingProfile = await Profile.findOne({ email, businessId: profile.businessId, role: "staff" });
    if (existingProfile) {
      return NextResponse.json({ error: "Staff member already exists" }, { status: 400 });
    }

    const newStaff = new Profile({
      businessId: profile.businessId,
      authUserId: email,
      fullName: email.split("@")[0],
      role: "staff",
      email,
    });

    await newStaff.save();

    return NextResponse.json(newStaff, { status: 201 });
  } catch (error) {
    console.error("Error inviting staff member:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
