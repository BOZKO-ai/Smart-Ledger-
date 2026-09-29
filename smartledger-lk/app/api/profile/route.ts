
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getAuthorizedProfile, unauthorizedResponse } from "@/lib/authHelpers";
import Business from "@/models/Business";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const profile = await getAuthorizedProfile(request);
    if (!profile) {
      return unauthorizedResponse();
    }

    const business = await Business.findById(profile.businessId);

    return NextResponse.json({
      role: profile.role,
      businessId: profile.businessId,
      fullName: profile.fullName,
      email: profile.email || profile.authUserId,
      businessName: business ? business.name : "Your Business",
      businessType: business ? business.businessType : "Bakery",
      languagePref: business ? business.languagePref : "en",
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();
    const profile = await getAuthorizedProfile(request);
    if (!profile) {
      return unauthorizedResponse();
    }

    if (profile.role !== "owner") {
      return NextResponse.json({ error: "Permission denied. Only business owners can change settings." }, { status: 403 });
    }

    const { businessName, businessType, languagePref, fullName } = await request.json();

    const business = await Business.findById(profile.businessId);
    if (business) {
      if (businessName) business.name = businessName;
      if (businessType) business.businessType = businessType;
      if (languagePref) business.languagePref = languagePref;
      await business.save();
    }

    if (fullName) {
      profile.fullName = fullName;
      await profile.save();
    }

    return NextResponse.json({ success: true, message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating profile settings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
